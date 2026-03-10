$ErrorActionPreference = "Stop"

# Repo root = two levels up from src-tauri/scripts
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$outDir = Join-Path $repoRoot "src-tauri\resources"
$zipPath = Join-Path $outDir "backend.zip"

New-Item -ItemType Directory -Force -Path $outDir | Out-Null

if (Test-Path $zipPath) {
  Remove-Item -Force $zipPath
}

Write-Host "Creating backend.zip at: $zipPath"

# Include everything the Node backend needs
$items = @(
  "server.js",
  "package.json",
  "public",
  "node_modules",
  "print"
)

foreach ($item in $items) {
  $p = Join-Path $repoRoot $item
  if (-not (Test-Path $p)) {
    throw "Missing required path: $p"
  }
}

& tar -a -c -f $zipPath -C $repoRoot @items

if (-not (Test-Path $zipPath)) {
  throw "backend.zip was not created"
}

Write-Host "backend.zip created successfully."

