const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const path = require('path');
const fs = require('fs');
const { execSync, exec } = require('child_process');
const os = require('os');
const sharp = require('sharp');
const { print: printPdf } = require('pdf-to-printer');
const { PDFDocument } = require('pdf-lib');
const { createCanvas } = require('canvas');

const app = express();
const PORT = 3000;

// Directorios para archivos, thumbnails y sesión de WhatsApp
const PRINT_FILES_DIR = path.join(__dirname, 'print', 'files');
const PRINT_THUMBNAILS_DIR = path.join(__dirname, 'print', 'thumbnails');
// Guardar la sesión fuera de la carpeta del proyecto (más estable en Windows + evita locks en Downloads)
const WHATSAPP_SESSION_DIR = path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'DroidPrint', 'wwebjs_auth');

function sanitizeFileIdForFs(fileId) {
    return String(fileId).replace(/[^a-zA-Z0-9_-]/g, '_');
}

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// Estado global para evitar múltiples inicializaciones simultáneas
let waInitInProgress = false;
let waInitQueued = false;

async function destroyWhatsAppClient() {
    if (!client) return;
    try {
        // Intentar cerrar browser/page si existen
        try { await client.pupPage?.close?.(); } catch { /* ignore */ }
        try { await client.pupBrowser?.close?.(); } catch { /* ignore */ }
        try { await client.destroy(); } catch { /* ignore */ }
    } finally {
        client = null;
        clientInfo = null;
        qrCodeData = null;
    }
}

// Borra la sesión local de WhatsApp (para forzar nuevo QR al reiniciar)
async function clearWhatsAppSession() {
    try {
        // Asegurar que el cliente esté destruido antes de borrar (evita EPERM/locks)
        await destroyWhatsAppClient();
        if (fs.existsSync(WHATSAPP_SESSION_DIR)) {
            // rm con retries para Windows
            await fs.promises.rm(WHATSAPP_SESSION_DIR, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
            console.log('WhatsApp local session cleared');
        }
    } catch (err) {
        console.error('Error clearing WhatsApp session:', err.message);
    }
}

/** Ruta a LibreOffice (opcional, para preview de Word/Excel/PowerPoint). Windows/macOS/Linux. */
function getSofficePath() {
    if (os.platform() === 'win32') {
        const candidates = [
            path.join(process.env.PROGRAMFILES || 'C:\\Program Files', 'LibreOffice', 'program', 'soffice.exe'),
            path.join(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'LibreOffice', 'program', 'soffice.exe')
        ];
        for (const p of candidates) {
            if (fs.existsSync(p)) return p;
        }
        return 'soffice.exe';
    }
    if (os.platform() === 'darwin') {
        const p = '/Applications/LibreOffice.app/Contents/MacOS/soffice';
        if (fs.existsSync(p)) return p;
    }
    return 'soffice';
}

/** Convierte un archivo Office a PDF para impresión (solo si es doc/x/docx/xls/xlsx/ppt/pptx). Devuelve ruta del PDF o null. */
function convertOfficeToPdfForPrint(sourcePath) {
    const ext = path.extname(sourcePath).toLowerCase();
    const officeExts = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
    if (!officeExts.includes(ext)) return null;

    try {
        const soffice = getSofficePath();
        if (!soffice) {
            console.error('Office print: LibreOffice no encontrado');
            return null;
        }

        const outDir = path.join(PRINT_FILES_DIR, '_office_print');
        ensureDir(outDir);
        const baseName = path.basename(sourcePath, ext);
        const pdfPath = path.join(outDir, `${baseName}.pdf`);

        // Borrar PDF previo si existe
        if (fs.existsSync(pdfPath)) {
            try { fs.unlinkSync(pdfPath); } catch { /* ignore */ }
        }

        const cmd = `"${soffice}" --headless --nologo --nodefault --nofirststartwizard --nolockcheck --nocrashreport --convert-to pdf --outdir "${outDir}" "${sourcePath}"`;
        execSync(cmd, { timeout: 60000, stdio: ['ignore', 'ignore', 'pipe'] });

        if (fs.existsSync(pdfPath)) {
            console.info('Office print: convertido a PDF para impresión:', pdfPath);
            return pdfPath;
        }

        console.error('Office print: LibreOffice no generó PDF esperado:', pdfPath);
        return null;
    } catch (e) {
        console.error('Office print conversion error:', e.message);
        return null;
    }
}

/** Genera thumbnail de la primera página de un PDF con Node (pdfjs-dist + canvas). Multiplataforma, sin pdftoppm/mutool. */
async function renderPdfFirstPageToPng(pdfPath, thumbPath, maxWidth = 400) {
    try {
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
        const data = new Uint8Array(fs.readFileSync(pdfPath));
        const loadingTask = pdfjsLib.getDocument({ data, useSystemFonts: true, verbosity: 0 });
        const pdfDocument = await loadingTask.promise;
        const page = await pdfDocument.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        const scale = Math.min(maxWidth / viewport.width, 2);
        const scaledViewport = page.getViewport({ scale });
        const canvas = createCanvas(Math.min(scaledViewport.width, 800), Math.min(scaledViewport.height, 800));
        const context = canvas.getContext('2d');
        await page.render({ canvasContext: context, viewport: scaledViewport }).promise;
        const buf = canvas.toBuffer('image/png');
        fs.writeFileSync(thumbPath, buf);
        return true;
    } catch (e) {
        console.error('PDF thumbnail (Node):', e.message);
        return false;
    }
}

/** Devuelve la ruta del archivo en disco si existe (phone + fileId). Acepta phone con o sin +. */
function getFilePath(phone, fileId) {
    const normalized = String(phone).replace(/[^0-9]/g, '');
    const candidates = normalized ? [path.join(PRINT_FILES_DIR, normalized), path.join(PRINT_FILES_DIR, String(phone))] : [path.join(PRINT_FILES_DIR, String(phone))];
    const safeId = sanitizeFileIdForFs(fileId);
    for (const dir of candidates) {
        if (!fs.existsSync(dir)) continue;
        const files = fs.readdirSync(dir);
        const found = files.find(f => f.startsWith(safeId + '.') || f === safeId);
        if (found) return path.join(dir, found);
    }
    return null;
}

/** Genera thumbnail y lo guarda en print/thumbnails/<phone>/<fileId>.png. Devuelve ruta del PNG o null. */
async function generateThumbnail(phone, fileId) {
    const sourcePath = getFilePath(phone, fileId);
    if (!sourcePath || !fs.existsSync(sourcePath)) return null;

    const thumbDir = path.join(PRINT_THUMBNAILS_DIR, String(phone));
    ensureDir(thumbDir);
    const safeId = sanitizeFileIdForFs(fileId);
    const thumbPath = path.join(thumbDir, `${safeId}.png`);
    if (fs.existsSync(thumbPath)) return thumbPath;

    const ext = path.extname(sourcePath).toLowerCase();
    try {
        if (/\.(jpg|jpeg|png|webp|gif)$/i.test(sourcePath)) {
            await sharp(sourcePath)
                .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
                .png()
                .toFile(thumbPath);
            return thumbPath;
        }
        if (['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'].includes(ext)) {
            try {
                const outDir = path.join(thumbDir, 'conv');
                ensureDir(outDir);
                const baseName = path.basename(sourcePath, ext);
                const soffice = getSofficePath();
                if (!soffice) throw new Error('LibreOffice no encontrado');
                execSync(`"${soffice}" --headless --convert-to pdf --outdir "${outDir}" "${sourcePath}"`, { timeout: 15000, stdio: ['pipe', 'pipe', 'pipe'] });
                const pdfPath = path.join(outDir, `${baseName}.pdf`);
                if (fs.existsSync(pdfPath) && await renderPdfFirstPageToPng(pdfPath, thumbPath)) return thumbPath;
            } catch (e) { /* LibreOffice no instalado o fallo (opcional: en Windows instalar desde https://www.libreoffice.org o winget install TheDocumentFoundation.LibreOffice) */ }
            return null;
        }
        if (ext === '.pdf') {
            if (await renderPdfFirstPageToPng(sourcePath, thumbPath)) return thumbPath;
            return null;
        }
    } catch (err) {
        console.error('Thumbnail generation error:', err.message);
    }
    return null;
}

// Middleware
app.use(express.json());
app.use(express.static('public'));

// WhatsApp Client
let client = null;
let qrCodeData = null;
let clientInfo = null;

// Messages storage: { phone: [{ id, type, text/fileName, time, incoming, ... }] }
const messagesStore = {};

// Persistence file paths
const STORAGE_FILE = path.join(__dirname, 'messages-store.json');
const PRINTERS_FILE = path.join(__dirname, 'printers.json');

// Load messages from file
function loadMessagesStore() {
    try {
        if (fs.existsSync(STORAGE_FILE)) {
            const data = fs.readFileSync(STORAGE_FILE, 'utf8');
            const parsed = JSON.parse(data);
            // Convert date strings back to Date objects
            Object.keys(parsed).forEach(phone => {
                parsed[phone] = parsed[phone].map(msg => ({
                    ...msg,
                    time: new Date(msg.time)
                }));
            });
            Object.assign(messagesStore, parsed);
            console.log(`Loaded ${Object.keys(messagesStore).length} clients from storage`);
        }
    } catch (err) {
        console.error('Error loading messages store:', err);
    }
}

// Save messages to file
function saveMessagesStore() {
    try {
        fs.writeFileSync(STORAGE_FILE, JSON.stringify(messagesStore, null, 2), 'utf8');
    } catch (err) {
        console.error('Error saving messages store:', err);
    }
}

// Load on startup
loadMessagesStore();

// Impresoras: lista guardada + IDs que el usuario quitó (para no volver a mostrarlas al refrescar)
let printersData = { printers: [], removed: [] };
function loadPrintersData() {
    try {
        if (fs.existsSync(PRINTERS_FILE)) {
            printersData = JSON.parse(fs.readFileSync(PRINTERS_FILE, 'utf8'));
            if (!Array.isArray(printersData.printers)) printersData.printers = [];
            if (!Array.isArray(printersData.removed)) printersData.removed = [];
        }
    } catch (e) {
        printersData = { printers: [], removed: [] };
    }
}
function savePrintersData() {
    try {
        fs.writeFileSync(PRINTERS_FILE, JSON.stringify(printersData, null, 2), 'utf8');
    } catch (e) {
        console.error('Error saving printers:', e);
    }
}
loadPrintersData();

// Obtener impresoras reales del sistema (macOS, Linux, Windows)
function getSystemPrinters() {
    const list = [];
    const platform = os.platform();
    try {
        if (platform === 'darwin' || platform === 'linux') {
            let out = '';
            try {
                out = execSync('lpstat -p 2>/dev/null', { encoding: 'utf8', timeout: 8000, stdio: ['pipe', 'pipe', 'pipe'], shell: true });
            } catch (e) {
                try {
                    out = execSync('lpstat -p', { encoding: 'utf8', timeout: 8000, stdio: ['pipe', 'pipe', 'pipe'] });
                } catch (e2) {
                    console.log('lpstat command failed, no printers detected');
                    return list;
                }
            }
            const lines = out.split('\n').filter(Boolean);
            for (const line of lines) {
                // Formato inglés: "printer NAME is idle..."
                // Formato español: "la impresora NAME está inactiva..."
                let name = null;
                const matchEnglish = line.match(/^\s*printer\s+(.+?)\s+is\s+/i);
                const matchSpanish = line.match(/^\s*la\s+impresora\s+(.+?)\s+está\s+/i);
                
                if (matchEnglish && matchEnglish[1]) {
                    name = matchEnglish[1].trim();
                } else if (matchSpanish && matchSpanish[1]) {
                    name = matchSpanish[1].trim();
                } else {
                    // Fallback: buscar cualquier línea que contenga "printer" o "impresora"
                    const fallbackMatch = line.match(/(?:printer|impresora)\s+(.+?)(?:\s+is|\s+está|$)/i);
                    if (fallbackMatch && fallbackMatch[1]) {
                        name = fallbackMatch[1].trim();
                    }
                }
                
                if (name && !list.some(p => p.name === name)) {
                    list.push({ id: name, name });
                }
            }
            if (list.length > 0) {
                console.log(`Detected ${list.length} printer(s): ${list.map(p => p.name).join(', ')}`);
            }
        } else if (platform === 'win32') {
            let out = '';
            try {
                out = execSync('wmic printer get name', { encoding: 'utf8', timeout: 8000, stdio: ['pipe', 'pipe', 'pipe'] });
            } catch (e) {
                return list;
            }
            const lines = out.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            for (let i = 0; i < lines.length; i++) {
                const name = lines[i];
                if (name && name.toLowerCase() !== 'name' && !list.some(p => p.name === name)) {
                    list.push({ id: name, name });
                }
            }
        }
    } catch (err) {
        console.error('Error getting printers:', err.message);
    }
    return list;
}

// Auto-save every 5 seconds
setInterval(() => {
    if (Object.keys(messagesStore).length > 0) {
        saveMessagesStore();
    }
}, 5000);

// Initialize WhatsApp Client
function initWhatsApp() {
    if (waInitInProgress) {
        waInitQueued = true;
        return;
    }
    waInitInProgress = true;

    // Si hay un cliente anterior colgado, destruirlo primero
    destroyWhatsAppClient().catch(() => {});

    client = new Client({
        authStrategy: new LocalAuth({ dataPath: WHATSAPP_SESSION_DIR, rmMaxRetries: 10 }),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-software-rasterizer',
                '--disable-extensions',
                '--no-first-run',
                '--disable-background-networking',
                '--disable-default-apps',
                '--disable-sync'
            ]
        }
    });

    client.on('qr', async (qr) => {
        console.log('QR Code received');
        try {
            qrCodeData = await qrcode.toDataURL(qr);
        } catch (err) {
            console.error('Error generating QR:', err);
        }
    });

    client.on('ready', () => {
        console.log('WhatsApp client is ready!');
        qrCodeData = null;
        try {
            client.getState().then(state => {
                if (state === 'CONNECTED') {
                    try {
                        clientInfo = {
                            name: client.info?.pushname || 'Usuario',
                            phone: client.info?.wid?.user || null
                        };
                    } catch (infoErr) {
                        console.error('Error getting client info:', infoErr);
                        clientInfo = {
                            name: 'Usuario',
                            phone: null
                        };
                    }
                }
            }).catch(err => {
                console.error('Error getting state in ready event:', err);
            });
        } catch (err) {
            console.error('Error in ready handler:', err);
        }
    });

    client.on('authenticated', () => {
        console.log('WhatsApp authenticated');
    });

    client.on('auth_failure', (msg) => {
        console.error('Authentication failure:', msg);
        qrCodeData = null;
    });

    client.on('disconnected', (reason) => {
        console.log('WhatsApp disconnected:', reason);
        qrCodeData = null;
        clientInfo = null;
    });

    // Listen for incoming messages
    client.on('message', async (msg) => {
        try {
            // Skip messages from status broadcast or groups for now
            if (msg.from === 'status@broadcast' || msg.from.includes('@g.us')) {
                return;
            }

            // Get phone number
            let phoneFormatted;
            let contactName = 'Usuario';
            let isIncoming = true;

            if (msg.fromMe) {
                // Outgoing message - get the recipient
                const chat = await msg.getChat();
                phoneFormatted = chat.id.user || chat.id.split('@')[0];
                contactName = chat.name || chat.pushname || phoneFormatted;
                isIncoming = false;
            } else {
                // Incoming message
                const contact = await msg.getContact();
                const phone = contact.id.user || msg.from;
                phoneFormatted = phone.includes('@') ? phone.split('@')[0] : phone;
                contactName = contact.pushname || contact.name || phoneFormatted;
                isIncoming = true;
            }
            
            // Initialize messages array for this contact if needed
            if (!messagesStore[phoneFormatted]) {
                messagesStore[phoneFormatted] = [];
            }

            // Check if message already exists (avoid duplicates)
            const messageId = msg.id._serialized || `${phoneFormatted}-${msg.timestamp}`;
            const exists = messagesStore[phoneFormatted].some(m => m.id === messageId);
            if (exists) {
                return;
            }

            // Check if message has media
            const hasMedia = msg.hasMedia;
            let messageData = {
                id: messageId,
                type: hasMedia ? 'file' : 'text',
                time: new Date(msg.timestamp * 1000),
                incoming: isIncoming,
                phone: phoneFormatted,
                contactName: contactName
            };

            if (hasMedia) {
                try {
                    const media = await msg.downloadMedia();
                    const mediaType = media.mimetype || '';
                    
                    // Determine file type + extensión real
                    let fileType = 'FILE';
                    let fileName = msg.body || `archivo_${Date.now()}`;
                    let fileSize = media.data?.length ? `${(media.data.length / 1024 / 1024).toFixed(2)} MB` : '0 MB';
                    let preview = null;
                    let ext = 'bin';

                    if (mediaType.startsWith('image/')) {
                        fileType = 'IMG';
                        ext = mediaType.split('/')[1] || 'jpg';
                        fileName = msg.body || `imagen_${Date.now()}.${ext}`;
                        preview = `data:${mediaType};base64,${media.data}`;
                    } else if (mediaType === 'application/pdf') {
                        fileType = 'PDF';
                        ext = 'pdf';
                        fileName = msg.body || `documento_${Date.now()}.pdf`;
                    } else if (mediaType === 'application/msword') {
                        fileType = 'DOC';
                        ext = 'doc';
                    } else if (mediaType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                        fileType = 'DOCX';
                        ext = 'docx';
                    } else if (mediaType === 'application/vnd.ms-excel') {
                        fileType = 'XLS';
                        ext = 'xls';
                    } else if (mediaType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                        fileType = 'XLSX';
                        ext = 'xlsx';
                    } else if (mediaType === 'application/vnd.ms-powerpoint') {
                        fileType = 'PPT';
                        ext = 'ppt';
                    } else if (mediaType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
                        fileType = 'PPTX';
                        ext = 'pptx';
                    } else if (mediaType.startsWith('video/')) {
                        fileType = 'VIDEO';
                        fileName = msg.body || `video_${Date.now()}`;
                    } else if (mediaType.includes('pdf')) {
                        fileType = 'PDF';
                        ext = 'pdf';
                    }

                    messageData.fileName = fileName;
                    messageData.fileType = fileType;
                    messageData.fileSize = fileSize;
                    messageData.preview = preview;
                    messageData.fileId = `file-${phoneFormatted}-${messageId}`;

                    // Guardar archivo en disco para preview/thumbnails (solo si tenemos buffer)
                    if (media.data) {
                        try {
                            const safeId = sanitizeFileIdForFs(messageData.fileId);
                            const dir = path.join(PRINT_FILES_DIR, phoneFormatted);
                            ensureDir(dir);
                            const filePath = path.join(dir, `${safeId}.${ext}`);
                            fs.writeFileSync(filePath, Buffer.from(media.data, 'base64'));
                            messageData.fileExt = ext;
                            if (preview) messageData.preview = null; // evitar duplicar en JSON; el front usará API
                        } catch (saveErr) {
                            console.error('Error saving file to disk:', saveErr.message);
                        }
                    }
                } catch (mediaErr) {
                    console.error('Error downloading media:', mediaErr);
                    // Fallback to text message
                    messageData.type = 'text';
                    messageData.text = msg.body || 'Archivo no disponible';
                }
            } else {
                messageData.text = msg.body || '';
            }

            // Marcar archivos entrantes como no vistos (para pendingFiles)
            if (messageData.type === 'file' && isIncoming) {
                messageData.seen = false;
            }

            // Add message to store
            messagesStore[phoneFormatted].push(messageData);

            // Keep only last 100 messages per contact to avoid memory issues
            if (messagesStore[phoneFormatted].length > 100) {
                messagesStore[phoneFormatted] = messagesStore[phoneFormatted].slice(-100);
            }

            // Save to disk
            saveMessagesStore();

            const direction = isIncoming ? 'from' : 'to';
            console.log(`Message ${direction} ${contactName} (${phoneFormatted}):`, messageData.type === 'text' ? messageData.text : messageData.fileName);
        } catch (err) {
            console.error('Error processing message:', err);
        }
    });

    // Inicializar sin tumbar el servidor: capturar errores de puppeteer/wa-web
    client.initialize()
        .catch(async (err) => {
            console.error('WhatsApp init failed:', err?.message || String(err));
            // Si el navegador se cerró, liberar para permitir reintento manual (o por restart)
            // No borramos qrCodeData aquí porque a veces ya se generó.
            await destroyWhatsAppClient();
        })
        .finally(() => {
            waInitInProgress = false;
            if (waInitQueued) {
                waInitQueued = false;
                setTimeout(() => initWhatsApp(), 1500);
            }
        });
}

// API Routes
app.get('/api/status', async (req, res) => {
    try {
        if (!client) {
            return res.json({ state: 'disconnected' });
        }

        // If we have QR code, return QR state
        if (qrCodeData) {
            return res.json({ state: 'qr' });
        }

        // If we have clientInfo, assume connected (client was ready)
        if (clientInfo) {
            return res.json({
                state: 'connected',
                clientName: clientInfo.name,
                phone: clientInfo.phone
            });
        }

        // Try to get state, but handle errors gracefully
        let state;
        try {
            state = await client.getState();
        } catch (stateErr) {
            // If getState fails, client might not be initialized yet
            // Return disconnected state
            return res.json({ state: 'disconnected' });
        }
        
        if (state === 'CONNECTED') {
            if (!clientInfo) {
                try {
                    clientInfo = {
                        name: client.info?.pushname || 'Usuario',
                        phone: client.info?.wid?.user || null
                    };
                } catch (infoErr) {
                    clientInfo = {
                        name: 'Usuario',
                        phone: null
                    };
                }
            }
            return res.json({
                state: 'connected',
                clientName: clientInfo.name,
                phone: clientInfo.phone
            });
        } else if (state === 'QR_SCAN' || qrCodeData) {
            return res.json({ state: 'qr' });
        } else {
            return res.json({ state: 'disconnected' });
        }
    } catch (err) {
        // Don't log every error to avoid spam, only log unexpected errors
        if (!err.message || !err.message.includes('evaluate')) {
            console.error('Error getting status:', err);
        }
        // Return disconnected but don't crash
        return res.json({ state: 'disconnected' });
    }
});

app.get('/api/qr', (req, res) => {
    if (qrCodeData) {
        return res.json({ qr: qrCodeData });
    }
    return res.json({ qr: null });
});

app.get('/api/messages/:phone', (req, res) => {
    try {
        const phone = req.params.phone.replace(/[^0-9]/g, ''); // Remove non-digits
        const messages = messagesStore[phone] || [];
        return res.json({ messages });
    } catch (err) {
        console.error('Error getting messages:', err);
        return res.json({ messages: [] });
    }
});

// Marcar como vistos todos los archivos entrantes de un cliente (limpiar pendingFiles)
app.post('/api/clients/:phone/clear-pending', (req, res) => {
    try {
        const phone = req.params.phone.replace(/[^0-9]/g, '');
        const messages = messagesStore[phone];
        if (!messages || !Array.isArray(messages)) {
            return res.json({ phone, pendingFiles: 0 });
        }

        let changed = false;
        messages.forEach(m => {
            if (m.type === 'file' && m.incoming && !m.seen) {
                m.seen = true;
                changed = true;
            }
        });
        if (changed) {
            saveMessagesStore();
        }

        return res.json({ phone, pendingFiles: 0 });
    } catch (err) {
        console.error('Error clearing pending files:', err);
        return res.status(500).json({ phone: req.params.phone, pendingFiles: 0, error: err.message });
    }
});

// id = encodeURIComponent(phone + '::' + fileId)
function parseFileIdParam(id) {
    if (!id) return null;
    try {
        const decoded = decodeURIComponent(id);
        const idx = decoded.indexOf('::');
        if (idx === -1) return null;
        return { phone: decoded.slice(0, idx), fileId: decoded.slice(idx + 2) };
    } catch (e) {
        return null;
    }
}

app.get('/api/files/:id/preview', async (req, res) => {
    const parsed = parseFileIdParam(req.params.id);
    if (!parsed) return res.status(400).send('Bad request');

    const phone = String(parsed.phone).replace(/[^0-9]/g, '') || parsed.phone;
    const { fileId } = parsed;
    const thumbDir = path.join(PRINT_THUMBNAILS_DIR, phone);
    const safeId = sanitizeFileIdForFs(fileId);
    const thumbPath = path.join(thumbDir, `${safeId}.png`);

    try {
        if (fs.existsSync(thumbPath)) {
            res.setHeader('Content-Type', 'image/png');
            return res.sendFile(path.resolve(thumbPath));
        }
        const generated = await generateThumbnail(phone, fileId);
        if (generated && fs.existsSync(generated)) {
            res.setHeader('Content-Type', 'image/png');
            return res.sendFile(path.resolve(generated));
        }
        // Fallback: servir la imagen original para que siempre se previsualice
        const sourcePath = getFilePath(phone, fileId);
        if (sourcePath && fs.existsSync(sourcePath)) {
            const ext = path.extname(sourcePath).toLowerCase();
            if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
                const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/gif';
                res.setHeader('Content-Type', mime);
                return res.sendFile(path.resolve(sourcePath));
            }
        }
    } catch (err) {
        console.error('Preview error:', err.message);
    }
    res.status(404).send('Preview not available');
});

app.get('/api/files/:id', (req, res) => {
    const parsed = parseFileIdParam(req.params.id);
    if (!parsed) return res.status(400).send('Bad request');

    const phone = String(parsed.phone).replace(/[^0-9]/g, '') || parsed.phone;
    const filePath = getFilePath(phone, parsed.fileId);
    if (!filePath || !fs.existsSync(filePath)) return res.status(404).send('File not found');

    res.sendFile(path.resolve(filePath));
});

// Foto de perfil de un contacto (proxy desde WhatsApp; fallback 404 → front muestra iniciales)
app.get('/api/contacts/:phone/profile-pic', async (req, res) => {
    const phone = String(req.params.phone || '').replace(/[^0-9]/g, '');
    if (!phone || !client) {
        return res.status(404).end();
    }
    try {
        const contactId = `${phone}@c.us`;
        const base64 = await client.pupPage.evaluate(async (contactId) => {
            try {
                const chatWid = window.Store.WidFactory.createWid(contactId);
                return await window.WWebJS.getProfilePicThumbToBase64(chatWid);
            } catch (e) {
                return undefined;
            }
        }, contactId);
        if (!base64) {
            return res.status(404).end();
        }
        const buf = Buffer.from(base64, 'base64');
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Cache-Control', 'private, max-age=3600');
        return res.send(buf);
    } catch (err) {
        console.error('Profile pic error:', err.message);
        return res.status(404).end();
    }
});

app.get('/api/clients', (req, res) => {
    try {
        // Get all clients from messages store
        const clients = Object.keys(messagesStore).map(phone => {
            const messages = messagesStore[phone] || [];
            const lastMessage = messages[messages.length - 1];
            
            // Get the most common contact name from messages
            const contactNames = messages
                .map(m => m.contactName)
                .filter(name => name && name !== phone);
            const mostCommonName = contactNames.length > 0 
                ? contactNames[contactNames.length - 1] // Use last one (most recent)
                : phone;
            
            return {
                phone: phone,
                name: mostCommonName,
                lastMessage: lastMessage?.type === 'text' 
                    ? (lastMessage.text || 'Mensaje') 
                    : (lastMessage?.fileName || 'Archivo'),
                lastMessageTime: lastMessage?.time || new Date(),
                pendingFiles: messages.filter(m => m.type === 'file' && m.incoming && !m.seen).length
            };
        });

        // Sort by last message time (most recent first)
        clients.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

        return res.json({ clients });
    } catch (err) {
        console.error('Error getting clients:', err);
        return res.json({ clients: [] });
    }
});

app.get('/api/printers', (req, res) => {
    try {
        // Si no hay impresoras guardadas, intentar detectar del sistema
        if (printersData.printers.length === 0 || printersData.printers.some(p => p.id === 'default')) {
            const system = getSystemPrinters();
            if (system.length > 0) {
                // Limpiar removed que ya no existen en el sistema
                printersData.removed = printersData.removed.filter(id => system.some(p => p.id === id));
                // Filtrar impresoras removidas
                printersData.printers = system.filter(p => !printersData.removed.includes(p.id));
                savePrintersData();
            }
        }
        const list = printersData.printers.length > 0 ? printersData.printers : [{ id: 'default', name: 'Impresora por defecto' }];
        return res.json({ printers: list });
    } catch (err) {
        console.error('Error getting printers:', err);
        return res.json({ printers: [{ id: 'default', name: 'Impresora por defecto' }] });
    }
});

app.post('/api/printers/refresh', (req, res) => {
    try {
        const system = getSystemPrinters();
        printersData.removed = printersData.removed.filter(id => system.some(p => p.id === id));
        printersData.printers = system.filter(p => !printersData.removed.includes(p.id));
        savePrintersData();
        const list = printersData.printers.length > 0 ? printersData.printers : [{ id: 'default', name: 'Impresora por defecto' }];
        return res.json({ printers: list });
    } catch (err) {
        console.error('Error refreshing printers:', err);
        return res.json({ printers: printersData.printers.length > 0 ? printersData.printers : [{ id: 'default', name: 'Impresora por defecto' }] });
    }
});

app.delete('/api/printers/:id', (req, res) => {
    try {
        const id = decodeURIComponent(req.params.id);
        if (!id || id === 'default') {
            return res.status(400).json({ error: 'No se puede eliminar la impresora por defecto' });
        }
        if (!printersData.removed.includes(id)) printersData.removed.push(id);
        printersData.printers = printersData.printers.filter(p => p.id !== id);
        if (printersData.printers.length === 0) {
            printersData.printers = [{ id: 'default', name: 'Impresora por defecto' }];
        }
        savePrintersData();
        return res.json({ printers: printersData.printers });
    } catch (err) {
        console.error('Error removing printer:', err);
        return res.status(500).json({ printers: printersData.printers });
    }
});

// Imprimir archivos seleccionados
app.post('/api/print', async (req, res) => {
    try {
        const { printer, phone, fileIds, copies, doubleSided, paperSize, mode, pagesMode, pagesRange } = req.body || {};
        const phoneDigits = String(phone || '').replace(/[^0-9]/g, '');
        const ids = Array.isArray(fileIds) ? fileIds : [];

        if (!phoneDigits || ids.length === 0) {
            return res.status(400).json({ success: false, error: 'Faltan archivos o teléfono' });
        }

        const available = [];
        const missing = [];
        ids.forEach(id => {
            const p = getFilePath(phoneDigits, id);
            if (p && fs.existsSync(p)) available.push({ id, path: p });
            else missing.push(id);
        });

        if (available.length === 0) {
            return res.status(404).json({ success: false, error: 'No se encontraron archivos para imprimir', missing });
        }

        const copiesNum = Math.max(1, parseInt(copies || 1, 10) || 1);
        const platform = os.platform();

        // Normalizar modo de páginas
        const pagesModeNorm = (pagesMode || 'all').toLowerCase();
        const pagesRangeStr = typeof pagesRange === 'string' ? pagesRange : '';

        async function buildPageLimitedPdfIfNeeded(filePath) {
            const ext = path.extname(filePath).toLowerCase();
            if (ext !== '.pdf') return filePath;
            if (pagesModeNorm === 'all') return filePath;

            try {
                const srcBytes = fs.readFileSync(filePath);
                const srcDoc = await PDFDocument.load(srcBytes);
                const totalPages = srcDoc.getPageCount();
                if (!totalPages || totalPages <= 1 && pagesModeNorm !== 'first') {
                    return filePath;
                }

                let pageIndexes = [];
                if (pagesModeNorm === 'first') {
                    pageIndexes = [0];
                } else if (pagesModeNorm === 'odd') {
                    for (let i = 0; i < totalPages; i++) {
                        if ((i + 1) % 2 === 1) pageIndexes.push(i);
                    }
                } else if (pagesModeNorm === 'even') {
                    for (let i = 0; i < totalPages; i++) {
                        if ((i + 1) % 2 === 0) pageIndexes.push(i);
                    }
                } else if (pagesModeNorm === 'range' && pagesRangeStr.trim()) {
                    const parts = pagesRangeStr.split(',');
                    const seen = new Set();
                    parts.forEach(part => {
                        const trimmed = part.trim();
                        if (!trimmed) return;
                        if (trimmed.includes('-')) {
                            const [startStr, endStr] = trimmed.split('-');
                            let start = parseInt(startStr, 10);
                            let end = parseInt(endStr, 10);
                            if (Number.isNaN(start) || Number.isNaN(end)) return;
                            if (start > end) [start, end] = [end, start];
                            for (let p = start; p <= end; p++) {
                                if (p >= 1 && p <= totalPages) seen.add(p - 1);
                            }
                        } else {
                            const p = parseInt(trimmed, 10);
                            if (!Number.isNaN(p) && p >= 1 && p <= totalPages) {
                                seen.add(p - 1);
                            }
                        }
                    });
                    pageIndexes = Array.from(seen).sort((a, b) => a - b);
                }

                if (!pageIndexes.length) return filePath;

                const outDoc = await PDFDocument.create();
                const srcPages = await outDoc.copyPages(srcDoc, pageIndexes);
                srcPages.forEach(p => outDoc.addPage(p));
                const outBytes = await outDoc.save();

                const tmpDir = path.join(PRINT_FILES_DIR, '_tmp_print');
                ensureDir(tmpDir);
                const tmpPath = path.join(tmpDir, `${Date.now()}_${Math.random().toString(36).slice(2)}.pdf`);
                fs.writeFileSync(tmpPath, outBytes);
                return tmpPath;
            } catch (e) {
                console.error('Error building page-limited PDF:', e.message);
                return filePath;
            }
        }

        const tasks = available.map(({ id, path: filePath }) => {
            const ext = path.extname(filePath).toLowerCase();
            if (platform === 'win32') {
                // Windows: PDFs y Office → pdf-to-printer; otros → PowerShell PrintTo
                return new Promise((resolve) => {
                    const officeExts = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];

                    const tryPdfPrint = async () => {
                        try {
                            let pdfPath = filePath;

                            if (officeExts.includes(ext)) {
                                const converted = convertOfficeToPdfForPrint(filePath);
                                if (!converted) {
                                    throw new Error('No se pudo convertir Office a PDF para impresión');
                                }
                                pdfPath = converted;
                            } else if (ext !== '.pdf') {
                                // No es PDF ni Office → usar directamente PrintTo abajo
                                throw new Error('Formato no soportado para pdf-to-printer');
                            }

                            const finalPdf = await buildPageLimitedPdfIfNeeded(pdfPath);
                            await printPdf(finalPdf, { printer: printer || undefined, copies: copiesNum });
                            return resolve({ id, ok: true });
                        } catch (err) {
                            console.error('pdf-to-printer/Office error:', err?.message || String(err));

                            // Fallback con PowerShell PrintTo usando el archivo original
                            const safeFile = filePath.replace(/'/g, "''");
                            const safePrinter = (printer || '').replace(/'/g, "''");
                            const psCmd = safePrinter
                                ? `Start-Process -FilePath '${safeFile}' -Verb PrintTo -ArgumentList '"${safePrinter}"'`
                                : `Start-Process -FilePath '${safeFile}' -Verb Print`;
                            const full = `powershell -Command "${psCmd}"`;
                            exec(full, { timeout: 15000, windowsHide: true }, (e) => {
                                if (e) {
                                    console.error('PowerShell print error:', e.message);
                                    return resolve({ id, ok: false, error: e.message });
                                }
                                resolve({ id, ok: true });
                            });
                        }
                    };

                    tryPdfPrint();
                });
            }

            // macOS / Linux: usar lp
            return new Promise((resolve) => {
                buildPageLimitedPdfIfNeeded(filePath).then(finalPath => {
                    const args = [];
                    if (printer && printer !== 'default') {
                        args.push(`-d "${printer.replace(/"/g, '\\"')}"`);
                    }
                    if (copiesNum > 1) {
                        args.push(`-n ${copiesNum}`);
                    }
                    if (doubleSided) {
                        args.push(`-o sides=two-sided-long-edge`);
                    }
                    if (paperSize === 'a4') {
                        args.push(`-o media=a4`);
                    } else if (paperSize === 'legal') {
                        args.push(`-o media=legal`);
                    } else if (paperSize === 'letter') {
                        args.push(`-o media=letter`);
                    }
                    if (mode === 'bw') {
                        args.push(`-o ColorModel=KGray`);
                    }

                    const cmd = `lp ${args.join(' ')} "${finalPath.replace(/"/g, '\\"')}"`;
                    exec(cmd, { timeout: 15000 }, (e) => {
                        if (e) {
                            console.error('lp print error:', e.message);
                            return resolve({ id, ok: false, error: e.message });
                        }
                        resolve({ id, ok: true });
                    });
                }).catch((e) => {
                    console.error('Error preparing file for lp:', e.message);
                    resolve({ id, ok: false, error: e.message });
                });
            });
        });

        const results = await Promise.all(tasks);
        const printed = results.filter(r => r.ok).map(r => r.id);
        const failed = results.filter(r => !r.ok);

        return res.json({
            success: printed.length > 0,
            printed,
            missing,
            failed
        });
    } catch (err) {
        console.error('Print error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

// Desvincular el WhatsApp: cerrar cliente, borrar sesión local y reiniciar para mostrar nuevo QR
app.post('/api/logout', async (req, res) => {
    try {
        await clearWhatsAppSession();

        // Re‑inicializar tras un pequeño delay para que el front reciba un nuevo QR
        setTimeout(() => {
            try {
                initWhatsApp();
            } catch (initErr) {
                console.error('Error reinitializing WhatsApp after logout:', initErr.message);
            }
        }, 1000);

        return res.json({ success: true });
    } catch (err) {
        console.error('Error logging out:', err);
        return res.json({ success: false, error: err.message });
    }
});

app.post('/api/restart', async (req, res) => {
    try {
        await destroyWhatsAppClient();

        // Wait a bit before reinitializing with same LocalAuth session
        setTimeout(() => {
            initWhatsApp();
        }, 1000);

        return res.json({ success: true });
    } catch (err) {
        console.error('Error restarting:', err);
        return res.json({ success: false, error: err.message });
    }
});

// Serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    initWhatsApp();
});
