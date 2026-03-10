use std::{
  fs,
  io,
  path::{Path, PathBuf},
  process::{Child, Command},
  sync::Mutex,
  thread,
  time::Duration,
};

#[cfg(windows)]
use std::os::windows::process::CommandExt;

use tauri::{Manager, WindowEvent};
use zip::ZipArchive;

struct BackendState {
  child: Mutex<Option<Child>>,
}

fn safe_join(base: &Path, rel: &Path) -> Option<PathBuf> {
  let mut out = base.to_path_buf();
  for c in rel.components() {
    use std::path::Component::*;
    match c {
      Prefix(_) | RootDir | ParentDir => return None,
      CurDir => {}
      Normal(p) => out.push(p),
    }
  }
  Some(out)
}

fn extract_backend_if_needed(zip_path: &Path, out_dir: &Path) -> Result<(), Box<dyn std::error::Error>> {
  let marker = out_dir.join(".backend_zip_marker");
  let zip_meta = fs::metadata(zip_path)?;
  let zip_len = zip_meta.len();
  let zip_mtime = zip_meta
    .modified()
    .ok()
    .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
    .map(|d| d.as_secs())
    .unwrap_or(0);
  let expected = format!("{zip_len}:{zip_mtime}");

  if let Ok(existing) = fs::read_to_string(&marker) {
    if existing.trim() == expected && out_dir.join("server.js").exists() {
      return Ok(());
    }
  }

  if out_dir.exists() {
    let _ = fs::remove_dir_all(out_dir);
  }
  fs::create_dir_all(out_dir)?;

  let f = fs::File::open(zip_path)?;
  let mut zip = ZipArchive::new(f)?;

  for i in 0..zip.len() {
    let mut file = zip.by_index(i)?;
    let name = file.name().to_string();
    let rel = Path::new(&name);
    let out_path = safe_join(out_dir, rel).ok_or_else(|| io::Error::new(io::ErrorKind::Other, "zip path traversal"))?;

    if file.name().ends_with('/') {
      fs::create_dir_all(&out_path)?;
      continue;
    }

    if let Some(parent) = out_path.parent() {
      fs::create_dir_all(parent)?;
    }
    let mut out = fs::File::create(&out_path)?;
    io::copy(&mut file, &mut out)?;
  }

  fs::write(marker, expected)?;
  Ok(())
}

pub fn run() {
  tauri::Builder::default()
    .manage(BackendState {
      child: Mutex::new(None),
    })
    .setup(|app| {
      // Plugin de log solo en debug (plantilla original)
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      // Extraer el backend empaquetado (resources/backend.zip) a appData y ejecutar node server.js desde ahí
      let zip_path = match app
        .path()
        .resolve("resources/backend.zip", tauri::path::BaseDirectory::Resource)
      {
        Ok(p) => p,
        Err(e) => {
          eprintln!("No se pudo resolver backend.zip en recursos: {e}");
          return Ok(());
        }
      };

      let app_data = match app.path().app_data_dir() {
        Ok(p) => p,
        Err(e) => {
          eprintln!("No se pudo obtener app_data_dir: {e}");
          return Ok(());
        }
      };
      let backend_dir = app_data.join("backend");

      if let Err(e) = extract_backend_if_needed(&zip_path, &backend_dir) {
        eprintln!("No se pudo extraer backend.zip: {e}");
        return Ok(());
      }

      // Log del backend a un archivo para diagnóstico (la app no tiene consola en release)
      let log_path = backend_dir.join("backend.log");
      let log_file = fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(&log_path);

      let mut cmd = Command::new("node");
      cmd.current_dir(&backend_dir).arg("server.js");
      // En Windows, evitar que se abra una consola aparte para Node
      #[cfg(windows)]
      {
        const CREATE_NO_WINDOW: u32 = 0x08000000;
        cmd.creation_flags(CREATE_NO_WINDOW);
      }
      if let Ok(f) = log_file {
        let f_err = f.try_clone().ok();
        cmd.stdout(f);
        if let Some(fe) = f_err {
          cmd.stderr(fe);
        }
      }

      match cmd.spawn() {
        Ok(child) => {
          let state = app.state::<BackendState>();
          *state.child.lock().unwrap() = Some(child);
          // Esperar a que Express escuche y WhatsApp pueda emitir el QR antes de abrir la ventana
          thread::sleep(Duration::from_secs(3));
        }
        Err(e) => {
          eprintln!("No se pudo iniciar el backend Node (server.js): {e}");
        }
      }

      Ok(())
    })
    .on_window_event(|window, event| {
      if let WindowEvent::CloseRequested { .. } = event {
        let state = window.state::<BackendState>();
        let child_opt = {
          let mut guard = state.child.lock().unwrap();
          guard.take()
        };
        if let Some(mut child) = child_opt {
          if let Err(e) = child.kill() {
            eprintln!("No se pudo terminar el proceso Node (server.js): {e}");
          }
        }
      }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
