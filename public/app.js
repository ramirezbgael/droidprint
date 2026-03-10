// Mock Data - Clientes y Mensajes
const mockClients = [
    {
        id: 1,
        name: 'Juan Pérez',
        phone: '+52 555 123 4567',
        avatar: 'JP',
        lastMessage: 'Aquí está el documento',
        lastMessageTime: new Date(Date.now() - 5 * 60000),
        pendingFiles: 2,
        messages: [
            {
                id: 1,
                type: 'text',
                text: 'Hola, necesito imprimir algunos archivos',
                time: new Date(Date.now() - 30 * 60000),
                incoming: true
            },
            {
                id: 2,
                type: 'text',
                text: 'Claro, envíamelos',
                time: new Date(Date.now() - 25 * 60000),
                incoming: false
            },
            {
                id: 3,
                type: 'file',
                fileName: 'documento_importante.pdf',
                fileType: 'PDF',
                fileSize: '2.3 MB',
                pages: 5,
                time: new Date(Date.now() - 20 * 60000),
                incoming: true,
                fileId: 'file-1-1'
            },
            {
                id: 4,
                type: 'file',
                fileName: 'contrato_firmado.pdf',
                fileType: 'PDF',
                fileSize: '1.8 MB',
                pages: 3,
                time: new Date(Date.now() - 15 * 60000),
                incoming: true,
                fileId: 'file-1-2'
            },
            {
                id: 5,
                type: 'text',
                text: 'Perfecto, los imprimo ahora',
                time: new Date(Date.now() - 10 * 60000),
                incoming: false
            }
        ]
    },
    {
        id: 2,
        name: 'María González',
        phone: '+52 555 987 6543',
        avatar: 'MG',
        lastMessage: 'Fotos del evento',
        lastMessageTime: new Date(Date.now() - 15 * 60000),
        pendingFiles: 3,
        messages: [
            {
                id: 1,
                type: 'text',
                text: 'Hola, aquí están las fotos',
                time: new Date(Date.now() - 45 * 60000),
                incoming: true
            },
            {
                id: 2,
                type: 'file',
                fileName: 'foto_evento_1.jpg',
                fileType: 'IMG',
                fileSize: '3.2 MB',
                time: new Date(Date.now() - 40 * 60000),
                incoming: true,
                fileId: 'file-2-1',
                preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzBkYTlmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Rm90bzwvdGV4dD48L3N2Zz4='
            },
            {
                id: 3,
                type: 'file',
                fileName: 'foto_evento_2.jpg',
                fileType: 'IMG',
                fileSize: '2.9 MB',
                time: new Date(Date.now() - 35 * 60000),
                incoming: true,
                fileId: 'file-2-2',
                preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzA2YjZkNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Rm90bzI8L3RleHQ+PC9zdmc+'
            },
            {
                id: 4,
                type: 'file',
                fileName: 'foto_evento_3.jpg',
                fileType: 'IMG',
                fileSize: '4.1 MB',
                time: new Date(Date.now() - 30 * 60000),
                incoming: true,
                fileId: 'file-2-3',
                preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzBkYTlmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Rm90bzM8L3RleHQ+PC9zdmc+'
            }
        ]
    },
    {
        id: 3,
        name: 'Carlos Rodríguez',
        phone: '+52 555 456 7890',
        avatar: 'CR',
        lastMessage: 'Reporte mensual',
        lastMessageTime: new Date(Date.now() - 30 * 60000),
        pendingFiles: 1,
        messages: [
            {
                id: 1,
                type: 'text',
                text: 'Buen día, aquí está el reporte',
                time: new Date(Date.now() - 60 * 60000),
                incoming: true
            },
            {
                id: 2,
                type: 'file',
                fileName: 'reporte_mensual.pdf',
                fileType: 'PDF',
                fileSize: '5.2 MB',
                pages: 12,
                time: new Date(Date.now() - 55 * 60000),
                incoming: true,
                fileId: 'file-3-1'
            },
            {
                id: 3,
                type: 'text',
                text: 'Gracias, lo reviso',
                time: new Date(Date.now() - 50 * 60000),
                incoming: false
            }
        ]
    },
    {
        id: 4,
        name: 'Ana Martínez',
        phone: '+52 555 321 0987',
        avatar: 'AM',
        lastMessage: 'Diseños finales',
        lastMessageTime: new Date(Date.now() - 45 * 60000),
        pendingFiles: 2,
        messages: [
            {
                id: 1,
                type: 'text',
                text: 'Aquí están los diseños finales',
                time: new Date(Date.now() - 90 * 60000),
                incoming: true
            },
            {
                id: 2,
                type: 'file',
                fileName: 'diseño_logo.png',
                fileType: 'IMG',
                fileSize: '1.5 MB',
                time: new Date(Date.now() - 85 * 60000),
                incoming: true,
                fileId: 'file-4-1',
                preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzA2YjZkNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9nbzwvdGV4dD48L3N2Zz4='
            },
            {
                id: 3,
                type: 'file',
                fileName: 'diseño_banner.png',
                fileType: 'IMG',
                fileSize: '2.1 MB',
                time: new Date(Date.now() - 80 * 60000),
                incoming: true,
                fileId: 'file-4-2',
                preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzBkYTlmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+QmFubmVyPC90ZXh0Pjwvc3ZnPg=='
            }
        ]
    },
    {
        id: 5,
        name: 'Luis Hernández',
        phone: '+52 555 654 3210',
        avatar: 'LH',
        lastMessage: 'Presentación completa',
        lastMessageTime: new Date(Date.now() - 60 * 60000),
        pendingFiles: 1,
        messages: [
            {
                id: 1,
                type: 'text',
                text: 'Hola, aquí está la presentación',
                time: new Date(Date.now() - 120 * 60000),
                incoming: true
            },
            {
                id: 2,
                type: 'file',
                fileName: 'presentacion_ventas.pdf',
                fileType: 'PDF',
                fileSize: '8.5 MB',
                pages: 25,
                time: new Date(Date.now() - 115 * 60000),
                incoming: true,
                fileId: 'file-5-1'
            },
            {
                id: 3,
                type: 'text',
                text: 'Perfecto, la reviso',
                time: new Date(Date.now() - 110 * 60000),
                incoming: false
            }
        ]
    },
    {
        id: 6,
        name: 'Sofía López',
        phone: '+52 555 789 0123',
        avatar: 'SL',
        lastMessage: 'Documentos legales',
        lastMessageTime: new Date(Date.now() - 90 * 60000),
        pendingFiles: 3,
        messages: [
            {
                id: 1,
                type: 'text',
                text: 'Necesito imprimir estos documentos',
                time: new Date(Date.now() - 150 * 60000),
                incoming: true
            },
            {
                id: 2,
                type: 'file',
                fileName: 'contrato_servicio.pdf',
                fileType: 'PDF',
                fileSize: '3.4 MB',
                pages: 8,
                time: new Date(Date.now() - 145 * 60000),
                incoming: true,
                fileId: 'file-6-1'
            },
            {
                id: 3,
                type: 'file',
                fileName: 'anexo_a.pdf',
                fileType: 'PDF',
                fileSize: '1.2 MB',
                pages: 2,
                time: new Date(Date.now() - 140 * 60000),
                incoming: true,
                fileId: 'file-6-2'
            },
            {
                id: 4,
                type: 'file',
                fileName: 'anexo_b.pdf',
                fileType: 'PDF',
                fileSize: '2.1 MB',
                pages: 4,
                time: new Date(Date.now() - 135 * 60000),
                incoming: true,
                fileId: 'file-6-3'
            }
        ]
    }
];

const fallbackPrinters = [
    { id: 'default', name: 'Impresora por defecto' }
];

const STORAGE_KEY_CLIENTS = 'droidprint_clients';

// Load clients from localStorage (backup so recarga muestra clientes reales al instante)
function loadClientsFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY_CLIENTS);
        if (!raw) return [];
        const arr = JSON.parse(raw);
        if (!Array.isArray(arr) || arr.length === 0) return [];
        return arr.map(c => ({
            ...c,
            lastMessageTime: c.lastMessageTime ? new Date(c.lastMessageTime) : new Date(),
            messages: Array.isArray(c.messages) ? c.messages : []
        }));
    } catch (e) {
        return [];
    }
}

// Save clients to localStorage
function saveClientsToStorage(clients) {
    try {
        if (!clients || clients.length === 0) return;
        const toSave = clients.map(c => ({
            id: c.id,
            name: c.name,
            phone: c.phone,
            avatar: c.avatar,
            lastMessage: c.lastMessage,
            lastMessageTime: c.lastMessageTime instanceof Date ? c.lastMessageTime.toISOString() : c.lastMessageTime,
            pendingFiles: c.pendingFiles,
            messages: []
        }));
        localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(toSave));
    } catch (e) {
        console.error('Error saving clients to localStorage', e);
    }
}

// State (inicializar con backup de localStorage para que no se vean mock al recargar)
const cachedClients = loadClientsFromStorage();
let state = {
    clients: cachedClients.length > 0 ? cachedClients : [],
    clientsLoading: cachedClients.length === 0, // mostrar "Cargando..." si no hay backup
    selectedClient: null,
    selectedFiles: new Set(),
    searchQuery: '',
    printers: fallbackPrinters,
    selectedPrinter: fallbackPrinters[0].id,
    copies: 1,
    doubleSided: false,
    paperSize: 'letter',
    printMode: null, // 'bw' or 'color'
    currentView: 'clients', // 'clients' or 'settings'
    whatsappStatus: {
        state: 'connected', // 'connected' | 'qr' | 'disconnected'
        clientName: null,
        phone: null
    },
    qrCode: null
};

// DOM Elements
const clientsList = document.getElementById('clients-list');
const clientsSearch = document.getElementById('clients-search');
const chatHeader = document.getElementById('chat-header');
const chatMessages = document.getElementById('chat-messages');
const selectedFilesList = document.getElementById('selected-files-list');
const filesSummary = document.getElementById('files-summary');
const previewArea = document.getElementById('preview-area');
const printerSelect = document.getElementById('printer-select');
const copiesInput = document.getElementById('copies-input');
const paperSizeSelect = document.getElementById('paper-size-select');
const doubleSidedToggle = document.getElementById('double-sided-toggle');
const pagesModeSelect = document.getElementById('pages-mode-select');
const pagesRangeGroup = document.getElementById('pages-range-group');
const pagesRangeInput = document.getElementById('pages-range-input');
const printBwBtn = document.getElementById('print-bw-btn');
const printColorBtn = document.getElementById('print-color-btn');
const printMainBtn = document.getElementById('print-main-btn');
// These will be set after DOM loads
let navItems, chatView, settingsView, filesView, statusView;
let statusDisplay, statusSubtitle, statusInfoValue, qrContainer;
let logoutBtn, forceQrBtn, restartBtn, whatsappStatusPill;

// Initialize
function init() {
    // Initialize DOM references
    navItems = document.querySelectorAll('.nav-item');
    chatView = document.getElementById('chat-view');
    settingsView = document.getElementById('settings-view');
    filesView = document.getElementById('files-view');
    statusView = document.getElementById('status-view');
    statusDisplay = document.getElementById('status-display');
    statusSubtitle = document.getElementById('status-subtitle');
    statusInfoValue = document.getElementById('status-info-value');
    qrContainer = document.getElementById('qr-container');
    logoutBtn = document.getElementById('logout-btn');
    forceQrBtn = document.getElementById('force-qr-btn');
    restartBtn = document.getElementById('restart-btn');
    whatsappStatusPill = document.querySelector('.whatsapp-status .status-pill');

    renderClients();
    fetchPrinters().then(() => renderPrinters());
    setupEventListeners();
    setupNavigation();
    updateFilesSummary();
    updatePrintButton();
    startStatusPolling();
    // Pedir clientes al inicio para quitar "Cargando..." aunque no esté conectado aún
    fetchClients();
}

// Event Listeners
function setupEventListeners() {
    // Search
    clientsSearch.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase();
        renderClients();
    });

    // Print controls
    printerSelect.addEventListener('change', (e) => {
        state.selectedPrinter = e.target.value;
    });

    copiesInput.addEventListener('change', (e) => {
        state.copies = parseInt(e.target.value) || 1;
    });

    paperSizeSelect.addEventListener('change', (e) => {
        state.paperSize = e.target.value;
    });

    doubleSidedToggle.addEventListener('click', () => {
        state.doubleSided = !state.doubleSided;
        doubleSidedToggle.classList.toggle('active');
    });

    if (pagesModeSelect && pagesRangeGroup && pagesRangeInput) {
        pagesModeSelect.addEventListener('change', (e) => {
            const value = e.target.value;
            pagesRangeGroup.style.display = value === 'range' ? 'block' : 'none';
        });
    }

    printBwBtn.addEventListener('click', () => {
        state.printMode = 'bw';
        printBwBtn.classList.add('active');
        printColorBtn.classList.remove('active');
        updatePrintButton();
    });

    printColorBtn.addEventListener('click', () => {
        state.printMode = 'color';
        printColorBtn.classList.add('active');
        printBwBtn.classList.remove('active');
        updatePrintButton();
    });

    printMainBtn.addEventListener('click', handlePrint);

    // Clic en archivos del chat (delegación: cuadrito, icono, título, etc.)
    if (chatMessages) {
        chatMessages.addEventListener('click', (e) => {
            const messageFile = e.target.closest('.message-file');
            if (!messageFile) return;
            const fileId = messageFile.dataset.fileId;
            if (fileId) toggleFileSelection(fileId);
        });
    }

    // Settings buttons
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (forceQrBtn) forceQrBtn.addEventListener('click', handleForceQr);
    if (restartBtn) restartBtn.addEventListener('click', handleRestart);

    const printersRefreshBtn = document.getElementById('printers-refresh-btn');
    if (printersRefreshBtn) printersRefreshBtn.addEventListener('click', handlePrintersRefresh);
    const printersRefreshInlineBtn = document.getElementById('printer-refresh-inline-btn');
    if (printersRefreshInlineBtn) printersRefreshInlineBtn.addEventListener('click', handlePrintersRefresh);

    const settingsPrintersList = document.getElementById('settings-printers-list');
    if (settingsPrintersList) {
        settingsPrintersList.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.printer-row-remove');
            if (!removeBtn || removeBtn.disabled) return;
            const row = removeBtn.closest('.printer-row');
            const id = row && row.dataset.printerId;
            if (id) handlePrinterRemove(id);
        });
    }
}

// Navigation
function setupNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            switchView(view);
        });
    });
}

function switchView(view) {
    state.currentView = view;
    
    // Update nav items
    if (navItems) {
        navItems.forEach(item => {
            if (item.dataset.view === view) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Show/hide views
    if (view === 'clients') {
        if (chatView) chatView.classList.remove('hidden');
        if (settingsView) settingsView.classList.add('hidden');
        if (filesView) filesView.classList.remove('hidden');
        if (statusView) statusView.classList.add('hidden');
        const clientsContent = document.getElementById('clients-content');
        if (clientsContent) clientsContent.style.display = 'flex';
        startMessagesPolling(); // Resume polling when viewing clients
        // Fetch clients immediately when switching to clients view
        if (state.whatsappStatus?.state === 'connected') {
            fetchClients();
        }
    } else if (view === 'settings') {
        if (chatView) chatView.classList.add('hidden');
        if (settingsView) settingsView.classList.remove('hidden');
        if (filesView) filesView.classList.add('hidden');
        if (statusView) statusView.classList.remove('hidden');
        const clientsContent = document.getElementById('clients-content');
        if (clientsContent) clientsContent.style.display = 'none';
        updateSettingsView();
        // Stop polling messages when in settings view
        if (messagesPollInterval) {
            clearInterval(messagesPollInterval);
            messagesPollInterval = null;
        }
    }
}

// Render Clients
function renderClients() {
    if (state.clientsLoading) {
        clientsList.innerHTML = `
            <div class="clients-loading" id="clients-loading">
                <div class="clients-loading-spinner"></div>
                <p>Cargando conversaciones...</p>
            </div>
        `;
        return;
    }

    const filteredClients = getFilteredClients();
    
    if (filteredClients.length === 0) {
        clientsList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.5);">
                <p>No se encontraron clientes</p>
            </div>
        `;
        return;
    }

    clientsList.innerHTML = filteredClients.map(client => {
        const isSelected = state.selectedClient && String(state.selectedClient.id) === String(client.id);
        const phoneDigits = (client.phone || String(client.id) || '').replace(/[^0-9]/g, '');
        const profilePicUrl = phoneDigits ? `/api/contacts/${encodeURIComponent(phoneDigits)}/profile-pic` : '';
        return `
        <div class="client-item ${isSelected ? 'selected' : ''}" 
             data-client-id="${client.id}">
            <div class="client-avatar">
                ${profilePicUrl ? `<img src="${profilePicUrl}" alt="" class="client-avatar-img" onerror="this.style.display='none';var s=this.nextElementSibling;if(s)s.style.display='flex';">
                <span class="client-avatar-initials">${client.avatar}</span>` : `<span class="client-avatar-initials">${client.avatar}</span>`}
            </div>
            <div class="client-info">
                <div class="client-name">${escapeHtml(client.name)}</div>
                <div class="client-last-message">${escapeHtml(client.lastMessage)}</div>
            </div>
            <div class="client-meta">
                <div class="client-time">${formatTime(client.lastMessageTime)}</div>
                ${client.pendingFiles > 0 ? `<div class="client-badge">${client.pendingFiles}</div>` : ''}
            </div>
        </div>
    `;
    }).join('');

    // Add click listeners
    document.querySelectorAll('.client-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const clientIdRaw = item.dataset.clientId;
            console.log('Client clicked, raw ID:', clientIdRaw, 'Type:', typeof clientIdRaw);
            
            // Try to match client by comparing as both string and number
            let foundClient = null;
            
            // First try exact string match
            foundClient = state.clients.find(c => String(c.id) === String(clientIdRaw));
            
            // If not found, try numeric match
            if (!foundClient && !isNaN(clientIdRaw)) {
                const numericId = Number(clientIdRaw);
                foundClient = state.clients.find(c => Number(c.id) === numericId || String(c.id) === String(numericId));
            }
            
            // If still not found, try partial match (for IDs like "real-123456")
            if (!foundClient) {
                foundClient = state.clients.find(c => {
                    const cIdStr = String(c.id);
                    const clickedIdStr = String(clientIdRaw);
                    return cIdStr.includes(clickedIdStr) || clickedIdStr.includes(cIdStr);
                });
            }
            
            if (foundClient) {
                console.log('Found client:', foundClient.name, 'with ID:', foundClient.id);
                selectClient(foundClient.id);
            } else {
                console.error('Client not found! Clicked ID:', clientIdRaw);
                console.log('Available clients:', state.clients.map(c => ({ id: c.id, name: c.name, idType: typeof c.id, idString: String(c.id) })));
            }
        });
    });
}

// Get Filtered Clients
function getFilteredClients() {
    let filtered = state.clients;

    if (state.searchQuery) {
        filtered = filtered.filter(client => 
            client.name.toLowerCase().includes(state.searchQuery) ||
            client.phone.includes(state.searchQuery)
        );
    }

    return filtered;
}

// Select Client
function selectClient(clientId) {
    console.log('selectClient called with ID:', clientId, 'Type:', typeof clientId);
    
    // Find client - try multiple matching strategies
    let foundClient = state.clients.find(c => String(c.id) === String(clientId));
    
    if (!foundClient && !isNaN(clientId)) {
        // Try numeric match
        const numericId = Number(clientId);
        foundClient = state.clients.find(c => Number(c.id) === numericId);
    }
    
    if (!foundClient) {
        console.error('Client not found with ID:', clientId);
        console.log('Available clients:', state.clients.map(c => ({ id: c.id, name: c.name, idType: typeof c.id, idString: String(c.id) })));
        return;
    }
    
    state.selectedClient = foundClient;
    console.log('Client selected:', state.selectedClient.name, 'ID:', state.selectedClient.id);
    
    state.selectedFiles.clear(); // Clear selected files when switching clients
    
    // Ensure messages array exists
    if (!state.selectedClient.messages) {
        state.selectedClient.messages = [];
    }

    // Al abrir la conversación, limpiar el contador de archivos pendientes para este cliente
    try {
        const phoneDigits = (state.selectedClient.phone || '').replace(/[^0-9]/g, '');
        if (phoneDigits) {
            fetch(`/api/clients/${phoneDigits}/clear-pending`, { method: 'POST' })
                .then(res => res.json())
                .then(() => {
                    state.selectedClient.pendingFiles = 0;
                    state.clients = state.clients.map(c => {
                        const cPhone = (c.phone || '').replace(/[^0-9]/g, '');
                        if (cPhone === phoneDigits) {
                            return { ...c, pendingFiles: 0 };
                        }
                        return c;
                    });
                    renderClients();
                    saveClientsToStorage(state.clients);
                })
                .catch(err => {
                    console.error('Error clearing pending files for client', phoneDigits, err);
                });
        }
    } catch (e) {
        console.error('Error starting clear-pending flow:', e);
    }
    
    renderClients();
    renderChat();
    renderSelectedFiles();
    updateFilesSummary();
    updatePreview();
    updatePrintButton();
    
    // Fetch messages for selected client immediately
    fetchMessages();
}

// Render Chat
function renderChat() {
    if (!state.selectedClient) {
        if (chatHeader) {
            chatHeader.innerHTML = `
                <div class="empty-chat-header">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <p>Selecciona un cliente para ver el chat</p>
                </div>
            `;
        }
        if (chatMessages) {
            chatMessages.innerHTML = `
                <div class="empty-chat">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <p>Selecciona un cliente para ver el chat</p>
                </div>
            `;
        }
        return;
    }

    const client = state.selectedClient;
    const headerPhoneDigits = (client.phone || String(client.id) || '').replace(/[^0-9]/g, '');
    const headerProfilePicUrl = headerPhoneDigits ? `/api/contacts/${encodeURIComponent(headerPhoneDigits)}/profile-pic` : '';

    // Render header
    if (chatHeader) {
        chatHeader.innerHTML = `
            <div class="chat-header active">
                <div class="chat-header-avatar">
                    ${headerProfilePicUrl ? `<img src="${headerProfilePicUrl}" alt="" class="chat-header-avatar-img" onerror="this.style.display='none';var s=this.nextElementSibling;if(s)s.style.display='flex';">
                    <span class="chat-header-avatar-initials">${client.avatar}</span>` : `<span class="chat-header-avatar-initials">${client.avatar}</span>`}
                </div>
                <div class="chat-header-info">
                    <div class="chat-header-name">${escapeHtml(client.name)}</div>
                    <div class="chat-header-status">${client.phone}</div>
                </div>
            </div>
        `;
    }

    // Ensure messages array exists
    if (!client.messages) {
        client.messages = [];
    }

    // Render messages
    if (chatMessages) {
        chatMessages.innerHTML = client.messages.map(message => {
        if (message.type === 'text') {
            return `
                <div class="message ${message.incoming ? 'incoming' : 'outgoing'}">
                    <div class="message-bubble">
                        <div class="message-text">${escapeHtml(message.text)}</div>
                        <div class="message-time">${formatTime(message.time)}</div>
                    </div>
                </div>
            `;
        } else {
            const isSelected = state.selectedFiles.has(message.fileId);
            const phoneDigits = (client.phone || '').replace(/[^0-9]/g, '');
            const previewId = phoneDigits && message.fileId
                ? encodeURIComponent(phoneDigits + '::' + message.fileId)
                : null;
            const apiPreviewUrl = previewId ? `/api/files/${previewId}/preview` : null;
            const fileUrl = previewId ? `/api/files/${previewId}` : null;
            // Para imágenes viejas, usar preview base64 si existe
            const thumbSrc = message.fileType === 'IMG' && message.preview
                ? message.preview
                : apiPreviewUrl;

            const typeLabel =
                message.fileType === 'PDF' ? 'PDF' :
                message.fileType === 'IMG' ? 'IMAGEN' :
                ['DOC', 'DOCX'].includes(message.fileType) ? 'WORD' :
                ['PPT', 'PPTX'].includes(message.fileType) ? 'PPT' :
                ['XLS', 'XLSX'].includes(message.fileType) ? 'EXCEL' :
                'ARCHIVO';

            const pagesText = message.fileType === 'PDF' && message.pages
                ? ` • ${message.pages} páginas`
                : '';

            return `
                <div class="message ${message.incoming ? 'incoming' : 'outgoing'}">
                    <div class="message-bubble">
                        <div class="message-file-header">
                            <div class="message-text">📎 Archivo</div>
                            ${fileUrl ? `
                            <div class="file-actions">
                                <a href="${fileUrl}" target="_blank" rel="noopener noreferrer"
                                   class="file-action-btn" title="Abrir">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" stroke-width="2">
                                        <polyline points="14 3 21 3 21 10" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                        <path d="M19 14v7H5a2 2 0 0 1-2-2V5h7" />
                                    </svg>
                                </a>
                                <a href="${fileUrl}" download="${escapeHtml(message.fileName)}"
                                   class="file-action-btn" title="Descargar">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" stroke-width="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                </a>
                            </div>
                            ` : ''}
                        </div>
                        <div class="message-file ${isSelected ? 'selected' : ''}" data-file-id="${message.fileId}">
                            <div class="file-checkbox ${isSelected ? 'checked' : ''}"></div>
                            <div class="file-icon">
                                ${thumbSrc ? `
                                    <img src="${thumbSrc}" alt="" class="file-thumb" onerror="this.style.display='none'; this.nextElementSibling && (this.nextElementSibling.style.display='flex');">
                                    <div class="file-icon-fallback" style="display:none;">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                            <polyline points="14 2 14 8 20 8"/>
                                        </svg>
                                    </div>
                                ` : `
                                    <div class="file-icon-fallback">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                            <circle cx="8.5" cy="8.5" r="1.5"/>
                                            <polyline points="21 15 16 10 5 21"/>
                                        </svg>
                                    </div>
                                `}
                            </div>
                            <div class="file-info">
                                <div class="file-name">${escapeHtml(message.fileName)}</div>
                                <div class="file-meta">
                                    ${typeLabel}${pagesText} • ${message.fileSize}
                                </div>
                            </div>
                        </div>
                        <div class="message-time">${formatTime(message.time)}</div>
                    </div>
                </div>
            `;
        }
        }).join('');

        // Listener directo en cada cuadrito para que el clic en el checkbox siempre funcione
        if (chatMessages) {
            chatMessages.querySelectorAll('.message-file .file-checkbox').forEach(checkbox => {
                checkbox.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const messageFile = checkbox.closest('.message-file');
                    if (messageFile && messageFile.dataset.fileId) {
                        toggleFileSelection(messageFile.dataset.fileId);
                    }
                });
            });
        }

        // Scroll to bottom
        setTimeout(() => {
            if (chatMessages) {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }, 100);
    }
}

// Toggle File Selection
function toggleFileSelection(fileId) {
    if (state.selectedFiles.has(fileId)) {
        state.selectedFiles.delete(fileId);
    } else {
        state.selectedFiles.add(fileId);
    }
    renderChat();
    renderSelectedFiles();
    updateFilesSummary();
    updatePreview();
    updatePrintButton();
    // Evitar que la columna derecha haga scroll hasta abajo al seleccionar
    keepFilesColumnScrollTop();
}

function keepFilesColumnScrollTop() {
    if (selectedFilesList && selectedFilesList.scrollTop !== undefined) {
        selectedFilesList.scrollTop = 0;
    }
    const filesView = document.getElementById('files-view');
    if (filesView && filesView.scrollTop !== undefined) {
        filesView.scrollTop = 0;
    }
    const sideColumn = document.getElementById('side-column');
    if (sideColumn && sideColumn.scrollTop !== undefined) {
        sideColumn.scrollTop = 0;
    }
}

// Render Selected Files
function renderSelectedFiles() {
    if (state.selectedFiles.size === 0) {
        selectedFilesList.innerHTML = `
            <div class="empty-files">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                </svg>
                <p>Selecciona archivos del chat</p>
            </div>
        `;
        return;
    }

    const files = [];
    if (state.selectedClient) {
        state.selectedClient.messages.forEach(msg => {
            if (msg.type === 'file' && state.selectedFiles.has(msg.fileId)) {
                files.push(msg);
            }
        });
    }

    const total = files.length;
    let extraInfo = '';
    if (total > 2) {
        const extra = total - 2;
        const label = extra === 1 ? 'archivo más seleccionado' : 'archivos más seleccionados';
        extraInfo = `
            <div class="selected-files-counter">
                <span class="selected-files-counter-pill">+${extra} ${label}</span>
            </div>
        `;
    }

    selectedFilesList.innerHTML = extraInfo + files.map(file => `
        <div class="selected-file-card">
            <div class="selected-file-icon">
                ${file.fileType === 'PDF' ? `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                    </svg>
                ` : `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                    </svg>
                `}
            </div>
            <div class="selected-file-info">
                <div class="selected-file-name">${escapeHtml(file.fileName)}</div>
                <div class="selected-file-meta">
                    ${file.pages ? `<span>${file.pages} págs</span>` : ''}
                    ${file.pages ? '<span>•</span>' : ''}
                    <span>${file.fileSize}</span>
                </div>
            </div>
            <button class="remove-file-btn" onclick="removeFile('${file.fileId}')" title="Quitar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
    `).join('');
}

// Remove File
function removeFile(fileId) {
    state.selectedFiles.delete(fileId);
    renderChat();
    renderSelectedFiles();
    updateFilesSummary();
    updatePreview();
    updatePrintButton();
}

// Update Files Summary
function updateFilesSummary() {
    const totalFiles = state.selectedFiles.size;
    let totalPages = 0;

    if (state.selectedClient) {
        state.selectedClient.messages.forEach(msg => {
            if (msg.type === 'file' && state.selectedFiles.has(msg.fileId) && msg.pages) {
                totalPages += msg.pages;
            }
        });
    }

    if (totalFiles === 0) {
        filesSummary.innerHTML = '';
        return;
    }

    filesSummary.innerHTML = `
        ${totalFiles > 0 ? `<span class="files-summary-chip">${totalFiles}</span>` : ''}
        ${totalPages > 0 ? `<span class="files-summary-chip">${totalPages} págs</span>` : ''}
    `;
}

// Update Preview (real thumbnail desde API; fallback placeholder)
function updatePreview() {
    if (!previewArea) return;

    if (state.selectedFiles.size === 0) {
        previewArea.innerHTML = '<div class="preview-empty"><p>Vista previa</p></div>';
        return;
    }

    const firstFileId = Array.from(state.selectedFiles)[0];
    if (!state.selectedClient) {
        previewArea.innerHTML = '<div class="preview-empty"><p>Vista previa</p></div>';
        return;
    }

    const file = state.selectedClient.messages.find(m => m.type === 'file' && m.fileId === firstFileId);
    if (!file) {
        previewArea.innerHTML = '<div class="preview-empty"><p>Vista previa</p></div>';
        return;
    }

    const phone = (state.selectedClient.phone || '').replace(/[^0-9]/g, '');
    const previewId = encodeURIComponent(phone + '::' + file.fileId);
    const previewUrl = `/api/files/${previewId}/preview`;

    // Si es imagen y aún tenemos preview base64 (mensajes viejos), úsalo como fallback
    const previewSrc = file.fileType === 'IMG' && file.preview
        ? file.preview
        : previewUrl;

    let chipType = 'DOC';
    if (file.fileType === 'PDF') chipType = 'PDF';
    else if (file.fileType === 'IMG') chipType = 'IMG';
    else if (['DOC','DOCX','XLS','XLSX','PPT','PPTX'].includes(file.fileType)) chipType = file.fileType;
    const pagesHtml = file.fileType === 'PDF' && file.pages ? `<span class="preview-pages">${file.pages} págs</span>` : '';

    const thumbContent = `
        <div class="preview-loader">
            <div class="preview-spinner"></div>
        </div>
        <img src="${previewSrc}" alt="" class="preview-image" onload="handlePreviewImageLoad(this);" onerror="handlePreviewImageError(this);">
        <div class="preview-placeholder" style="display:none;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
            </svg>
        </div>
    `;

    previewArea.innerHTML = `
        <div class="preview-real">
            <div class="preview-real-thumb loading">
                ${thumbContent}
            </div>
            <div class="preview-real-info">
                <div class="preview-real-name">${escapeHtml(file.fileName)}</div>
                ${pagesHtml ? `<div class="preview-meta">${pagesHtml}</div>` : ''}
                <div class="preview-chips">
                    <span class="preview-chip">${chipType}</span>
                </div>
            </div>
        </div>
    `;
}

// Loader handlers para la imagen de preview
function handlePreviewImageLoad(img) {
    try {
        const thumb = img.closest('.preview-real-thumb');
        if (thumb) {
            thumb.classList.remove('loading');
            const loader = thumb.querySelector('.preview-loader');
            if (loader) loader.style.display = 'none';
        }
        img.style.display = 'block';
        if (typeof keepFilesColumnScrollTop === 'function') {
            keepFilesColumnScrollTop();
        }
    } catch (e) {
        console.error('Error en handlePreviewImageLoad:', e);
    }
}

function handlePreviewImageError(img) {
    try {
        const thumb = img.closest('.preview-real-thumb');
        if (thumb) {
            thumb.classList.remove('loading');
            const loader = thumb.querySelector('.preview-loader');
            if (loader) loader.style.display = 'none';
            const placeholder = thumb.querySelector('.preview-placeholder');
            if (placeholder) placeholder.style.display = 'flex';
        }
        img.style.display = 'none';
    } catch (e) {
        console.error('Error en handlePreviewImageError:', e);
    }
}

// Update Print Button
function updatePrintButton() {
    const hasFiles = state.selectedFiles.size > 0;
    const hasMode = state.printMode !== null;
    
    printMainBtn.disabled = !hasFiles || !hasMode;
    
    if (hasFiles && hasMode) {
        printMainBtn.style.opacity = '1';
    } else {
        printMainBtn.style.opacity = '0.5';
    }
}

// Cargar impresoras reales del servidor
function fetchPrinters() {
    return fetch('/api/printers')
        .then(res => res.json())
        .then(data => {
            if (data.printers && data.printers.length > 0) {
                state.printers = data.printers;
                state.selectedPrinter = state.printers[0].id;
            }
        })
        .catch(err => {
            console.error('Error fetching printers:', err);
        });
}

// Render Printers
function renderPrinters() {
    if (!printerSelect) return;
    printerSelect.innerHTML = state.printers.map(p => `
        <option value="${escapeHtml(p.id)}" ${state.selectedPrinter === p.id ? 'selected' : ''}>${escapeHtml(p.name)}</option>
    `).join('');
}

// Handle Print (real, vía backend)
async function handlePrint() {
    if (state.selectedFiles.size === 0 || !state.printMode) {
        showToast('Selecciona archivos y modo de impresión', 'info');
        return;
    }
    if (!state.selectedClient) {
        showToast('Selecciona un cliente primero', 'info');
        return;
    }

    const phone = (state.selectedClient.phone || '').replace(/[^0-9]/g, '');
    const fileIds = Array.from(state.selectedFiles);

    const pagesMode = pagesModeSelect ? pagesModeSelect.value || 'all' : 'all';
    const pagesRange = pagesRangeInput && pagesMode === 'range'
        ? (pagesRangeInput.value || '').trim()
        : '';

    const payload = {
        printer: state.selectedPrinter,
        phone,
        fileIds,
        copies: state.copies,
        doubleSided: state.doubleSided,
        paperSize: state.paperSize,
        mode: state.printMode,
        pagesMode,
        pagesRange
    };

    const modeText = state.printMode === 'bw' ? 'blanco y negro' : 'color';
    showToast(`Enviando ${fileIds.length} archivo(s) a imprimir en ${modeText}...`, 'info');

    try {
        const res = await fetch('/api/print', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.success) {
            showToast(`Impresión enviada (${(data.printed || []).length} archivo(s))`, 'success');
            // Mantener selección si quieres reimprimir; por ahora la limpiamos como el mock
            state.selectedFiles.clear();
            renderChat();
            renderSelectedFiles();
            updateFilesSummary();
            updatePreview();
            updatePrintButton();
        } else {
            const msg = data.error || 'No se pudo imprimir';
            showToast(msg, 'error');
        }
    } catch (err) {
        console.error('Print request error:', err);
        showToast('Error al enviar a imprimir', 'error');
    }
}

// Toast Notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ'
    };

    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-message">${escapeHtml(message)}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            toast.remove();
        }, 200);
    }, 3000);
}

// Utility Functions
function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes}m`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours}h`;
    
    const days = Math.floor(hours / 24);
    return `Hace ${days}d`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// WhatsApp Status Polling
let statusPollInterval = null;
let messagesPollInterval = null;

function startStatusPolling() {
    fetchStatus();
    statusPollInterval = setInterval(fetchStatus, 1000);
    startMessagesPolling();
    startClientsPolling();
}

function startMessagesPolling() {
    if (messagesPollInterval) {
        clearInterval(messagesPollInterval);
    }
    messagesPollInterval = setInterval(() => {
        if (state.currentView === 'clients') {
            fetchMessages();
        }
    }, 2000); // Poll every 2 seconds
}

function startClientsPolling() {
    // Poll clients list every 3 seconds to catch new clients
    setInterval(() => {
        if (state.currentView === 'clients' && state.whatsappStatus?.state === 'connected') {
            fetchClients();
        }
    }, 3000);
}

function fetchStatus() {
    fetch('/api/status')
        .then(res => res.json())
        .then(data => {
            const wasConnected = state.whatsappStatus?.state === 'connected';
            state.whatsappStatus = data;
            updateWhatsAppStatus();
            if (data.state === 'qr') {
                fetchQR();
            } else {
                state.qrCode = null;
                updateQRDisplay();
            }
            
            // If connected, fetch clients list
            if (data.state === 'connected') {
                // Fetch immediately when first connecting
                if (!wasConnected) {
                    fetchClients();
                }
            }
        })
        .catch(err => {
            console.error('Error fetching status:', err);
        });
}

function fetchClients() {
    fetch('/api/clients')
        .then(res => res.json())
        .then(data => {
            // Always process clients, even if empty array
            const realClients = data.clients || [];
            
            // Create a map of real clients by phone (normalized)
            const realClientsMap = new Map();
            realClients.forEach(client => {
                const phoneDigits = client.phone.replace(/[^0-9]/g, '');
                realClientsMap.set(phoneDigits, client);
            });
            
            // Create a map of existing clients by phone (normalized)
            const existingClientsMap = new Map();
            state.clients.forEach(client => {
                const phoneDigits = client.phone.replace(/[^0-9]/g, '');
                existingClientsMap.set(phoneDigits, client);
            });
            
            const updatedClients = [];
            const processedPhones = new Set();
            
            // First, add/update clients from real data (prioritize real data)
            realClients.forEach(realClient => {
                const phoneDigits = realClient.phone.replace(/[^0-9]/g, '');
                const existingClient = existingClientsMap.get(phoneDigits);
                
                if (existingClient) {
                    // Update existing client with real data
                    updatedClients.push({
                        ...existingClient,
                        name: realClient.name,
                        lastMessage: realClient.lastMessage,
                        lastMessageTime: new Date(realClient.lastMessageTime),
                        pendingFiles: realClient.pendingFiles
                    });
                } else {
                    // New client from real data
                    const nameParts = realClient.name.split(' ');
                    const avatar = nameParts.length > 1 
                        ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
                        : realClient.name.substring(0, 2).toUpperCase();
                    
                    // Use phone as ID for real clients (more stable)
                    // Prefix with 'real-' to distinguish from mock IDs
                    // Use phone digits as numeric ID for consistency
                    // Phone numbers are typically 10-15 digits, which fit in JavaScript's safe integer range
                    const numericId = phoneDigits.length <= 15 && !isNaN(phoneDigits) ? parseInt(phoneDigits) : `real-${phoneDigits}`;
                    updatedClients.push({
                        id: numericId, // Use phone as stable ID
                        name: realClient.name,
                        phone: realClient.phone.startsWith('+') ? realClient.phone : `+${realClient.phone}`,
                        avatar: avatar,
                        lastMessage: realClient.lastMessage,
                        lastMessageTime: new Date(realClient.lastMessageTime),
                        pendingFiles: realClient.pendingFiles,
                        messages: []
                    });
                }
                processedPhones.add(phoneDigits);
            });
            
            // Don't add mock clients if we have real clients
            // Only show mock clients if there are NO real clients at all
            if (realClients.length === 0) {
                // Only show mocks if we truly have no real data
                // Check if current clients are all mock (IDs 1-6) or if we're starting fresh
                const hasRealClients = state.clients.some(c => {
                    const id = c.id;
                    // Real clients have IDs that are either:
                    // - Large numbers (phone numbers)
                    // - Strings starting with 'real-'
                    // Mock clients have IDs 1-6
                    return (typeof id === 'number' && id > 1000) || 
                           (typeof id === 'string' && id.startsWith('real-'));
                });
                
                if (!hasRealClients) {
                    // Only add mocks if we don't have any real clients yet
                    state.clients.forEach(mockClient => {
                        updatedClients.push(mockClient);
                    });
                }
            }
            // If we have real clients, don't show mocks at all
            
            // Sort by last message time (most recent first)
            updatedClients.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
            
            // Update state
            const previousSelectedId = state.selectedClient?.id;
            const previousSelectedPhone = state.selectedClient?.phone?.replace(/[^0-9]/g, '');
            
            // Replace clients array (mocks are already filtered out above)
            state.clients = updatedClients;
            state.clientsLoading = false;

            // Guardar en localStorage para que al recargar se carguen luego luego
            if (realClients.length > 0) {
                saveClientsToStorage(updatedClients);
            }
            
            // Restore selected client if it still exists (by ID or phone)
            if (previousSelectedId) {
                let stillExists = state.clients.find(c => String(c.id) === String(previousSelectedId));
                // If not found by ID, try by phone
                if (!stillExists && previousSelectedPhone) {
                    stillExists = state.clients.find(c => c.phone?.replace(/[^0-9]/g, '') === previousSelectedPhone);
                }
                if (stillExists) {
                    state.selectedClient = stillExists;
                } else {
                    state.selectedClient = null;
                }
            }
            
            renderClients();
            
                // If a client is selected, refresh their messages
                if (state.selectedClient) {
                    // Ensure selected client still exists in updated list
                    const selectedPhone = state.selectedClient.phone?.replace(/[^0-9]/g, '');
                    const updatedSelected = state.clients.find(c => 
                        String(c.id) === String(state.selectedClient.id) || 
                        c.phone?.replace(/[^0-9]/g, '') === selectedPhone
                    );
                    if (updatedSelected) {
                        state.selectedClient = updatedSelected;
                        fetchMessages();
                    } else {
                        state.selectedClient = null;
                        renderChat();
                    }
                }
        })
        .catch(err => {
            console.error('Error fetching clients:', err);
            state.clientsLoading = false;
            renderClients();
        });
}

function fetchMessages() {
    if (!state.selectedClient || state.currentView !== 'clients') {
        return;
    }

    // Normalize phone number (remove all non-digits)
    const phoneDigits = state.selectedClient.phone.replace(/[^0-9]/g, '');
    
    fetch(`/api/messages/${phoneDigits}`)
        .then(res => res.json())
        .then(data => {
            // Ensure messages array exists
            if (!state.selectedClient.messages) {
                state.selectedClient.messages = [];
            }

            if (data.messages && data.messages.length > 0) {
                // Convert API messages to app format
                const apiMessages = data.messages.map(msg => ({
                    id: msg.id,
                    type: msg.type,
                    text: msg.text,
                    fileName: msg.fileName,
                    fileType: msg.fileType,
                    fileSize: msg.fileSize,
                    pages: msg.pages,
                    time: new Date(msg.time),
                    incoming: msg.incoming !== undefined ? msg.incoming : true,
                    fileId: msg.fileId || `file-${phoneDigits}-${msg.id}`,
                    preview: msg.preview
                }));

                // Sort by time
                apiMessages.sort((a, b) => a.time - b.time);

                // Merge with existing messages, avoiding duplicates
                const existingIds = new Set((state.selectedClient.messages || []).map(m => m.id));
                const newMessages = apiMessages.filter(m => !existingIds.has(m.id));
                const hadMessages = state.selectedClient.messages && state.selectedClient.messages.length > 0;

                if (newMessages.length > 0 || !hadMessages) {
                    // Update messages
                    if (!hadMessages) {
                        // Initial load - replace all
                        state.selectedClient.messages = apiMessages;
                    } else {
                        // Add new messages
                        state.selectedClient.messages = [...state.selectedClient.messages, ...newMessages];
                        state.selectedClient.messages.sort((a, b) => a.time - b.time);
                    }
                    
                    // Update last message
                    const lastMsg = state.selectedClient.messages[state.selectedClient.messages.length - 1];
                    if (lastMsg) {
                        state.selectedClient.lastMessage = lastMsg.type === 'text' 
                            ? (lastMsg.text || 'Mensaje') 
                            : (lastMsg.fileName || 'Archivo');
                        state.selectedClient.lastMessageTime = lastMsg.time;
                    }
                    
                    // Update pending files count
                    state.selectedClient.pendingFiles = state.selectedClient.messages.filter(m => 
                        m.type === 'file' && m.incoming
                    ).length;

                    renderChat();
                    renderClients();
                    
                    // Show notification for new messages (only if not initial load)
                    if (hadMessages && newMessages.length > 0) {
                        showToast(`${newMessages.length} nuevo${newMessages.length > 1 ? 's' : ''} mensaje${newMessages.length > 1 ? 's' : ''}`, 'info');
                    }
                }
            } else {
                // No messages from API - ensure array exists
                if (!state.selectedClient.messages) {
                    state.selectedClient.messages = [];
                }
            }
        })
        .catch(err => {
            console.error('Error fetching messages:', err);
        });
}

function fetchQR() {
    fetch('/api/qr')
        .then(res => res.json())
        .then(data => {
            if (data.qr) {
                state.qrCode = data.qr;
                updateQRDisplay();
            }
        })
        .catch(err => {
            console.error('Error fetching QR:', err);
        });
}

function updateWhatsAppStatus() {
    if (!whatsappStatusPill) return;
    
    const status = state.whatsappStatus.state;
    const statusText = whatsappStatusPill.querySelector('span:last-child');

    // Remove all status classes
    whatsappStatusPill.classList.remove('connected', 'waiting', 'disconnected');

    if (status === 'connected') {
        whatsappStatusPill.classList.add('connected');
        if (statusText) {
            statusText.textContent = state.whatsappStatus.clientName 
                ? `WhatsApp: ${state.whatsappStatus.clientName}`
                : 'WhatsApp: Conectado';
        }
    } else if (status === 'qr') {
        whatsappStatusPill.classList.add('waiting');
        if (statusText) {
            statusText.textContent = 'WhatsApp: Esperando QR';
        }
    } else {
        whatsappStatusPill.classList.add('disconnected');
        if (statusText) {
            statusText.textContent = 'WhatsApp: Desconectado';
        }
    }
}

function renderSettingsPrinters() {
    const listEl = document.getElementById('settings-printers-list');
    if (!listEl) return;
    const printers = state.printers || [];
    listEl.innerHTML = printers.map(p => `
        <div class="printer-row ${p.id === 'default' ? 'default-printer' : ''}" data-printer-id="${escapeHtml(p.id)}">
            <span class="printer-row-name">${escapeHtml(p.name)}</span>
            <button type="button" class="printer-row-remove" title="Quitar de la lista" ${p.id === 'default' ? 'disabled' : ''}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
    `).join('');
}

function updateSettingsView() {
    renderSettingsPrinters();
    if (!statusDisplay) return;
    
    const status = state.whatsappStatus.state;
    const statusIcon = statusDisplay.querySelector('.status-icon');
    const statusTitle = statusDisplay.querySelector('.status-title');
    
    if (!statusIcon || !statusTitle) return;
    
    // Remove all classes
    statusIcon.classList.remove('connected', 'waiting', 'disconnected');
    
    if (status === 'connected') {
        statusIcon.classList.add('connected');
        statusIcon.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
        `;
        statusTitle.textContent = 'Conectado';
        if (statusSubtitle) {
            statusSubtitle.textContent = state.whatsappStatus.clientName || state.whatsappStatus.phone || 'Sincronizado';
        }
        if (statusInfoValue) {
            statusInfoValue.textContent = 'Conectado';
        }
    } else if (status === 'qr') {
        statusIcon.classList.add('waiting');
        statusIcon.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <path d="M9 9h6v6H9z"/>
            </svg>
        `;
        statusTitle.textContent = 'Esperando QR';
        if (statusSubtitle) {
            statusSubtitle.textContent = 'Escanea el código QR con WhatsApp';
        }
        if (statusInfoValue) {
            statusInfoValue.textContent = 'Esperando QR';
        }
    } else {
        statusIcon.classList.add('disconnected');
        statusIcon.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
        `;
        statusTitle.textContent = 'Desconectado';
        if (statusSubtitle) {
            statusSubtitle.textContent = 'No hay conexión activa';
        }
        if (statusInfoValue) {
            statusInfoValue.textContent = 'Desconectado';
        }
    }
    
    updateQRDisplay();
}

function updateQRDisplay() {
    if (!qrContainer) return;
    
    if (state.whatsappStatus.state === 'qr' && state.qrCode) {
        qrContainer.innerHTML = `<img src="${state.qrCode}" alt="QR Code">`;
    } else if (state.whatsappStatus.state === 'connected') {
        qrContainer.innerHTML = `
            <div class="qr-placeholder">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <p>WhatsApp conectado</p>
            </div>
        `;
    } else {
        qrContainer.innerHTML = `
            <div class="qr-placeholder">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <p>No conectado</p>
            </div>
        `;
    }
}

// Settings Actions
async function handleLogout() {
    try {
        const res = await fetch('/api/logout', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
            showToast('WhatsApp desvinculado', 'success');
            setTimeout(() => fetchStatus(), 500);
        } else {
            showToast('Error al desvincular', 'error');
        }
    } catch (err) {
        showToast('Error al desvincular', 'error');
    }
}

async function handleForceQr() {
    try {
        const res = await fetch('/api/logout', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
            showToast('QR forzado, espera unos segundos...', 'info');
            setTimeout(() => fetchStatus(), 1000);
        } else {
            showToast('Error al forzar QR', 'error');
        }
    } catch (err) {
        showToast('Error al forzar QR', 'error');
    }
}

async function handleRestart() {
    try {
        const res = await fetch('/api/restart', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
            showToast('Servicio reiniciado', 'success');
            setTimeout(() => fetchStatus(), 1000);
        } else {
            showToast('Error al reiniciar', 'error');
        }
    } catch (err) {
        showToast('Error al reiniciar', 'error');
    }
}

async function handlePrintersRefresh() {
    const mainBtn = document.getElementById('printers-refresh-btn');
    const inlineBtn = document.getElementById('printer-refresh-inline-btn');
    [mainBtn, inlineBtn].forEach(btn => {
        if (btn) {
            btn.disabled = true;
            btn.style.opacity = '0.6';
        }
    });
    try {
        const res = await fetch('/api/printers/refresh', { method: 'POST' });
        const data = await res.json();
        if (data.printers && data.printers.length > 0) {
            const hasRealPrinters = data.printers.some(p => p.id !== 'default');
            state.printers = data.printers;
            state.selectedPrinter = state.printers[0].id;
            renderPrinters();
            renderSettingsPrinters();
            if (hasRealPrinters) {
                showToast(`Se detectaron ${data.printers.length} impresora(s)`, 'success');
            } else {
                showToast('No se detectaron impresoras del sistema', 'info');
            }
        } else {
            showToast('No se detectaron impresoras', 'info');
        }
    } catch (err) {
        console.error('Error refreshing printers:', err);
        showToast('Error al detectar impresoras', 'error');
    }
    [mainBtn, inlineBtn].forEach(btn => {
        if (btn) {
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    });
}

async function handlePrinterRemove(printerId) {
    if (printerId === 'default') return;
    try {
        const res = await fetch(`/api/printers/${encodeURIComponent(printerId)}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.printers) {
            state.printers = data.printers;
            if (state.selectedPrinter === printerId) {
                state.selectedPrinter = state.printers[0] ? state.printers[0].id : 'default';
            }
            renderPrinters();
            renderSettingsPrinters();
            showToast('Impresora quitada de la lista', 'success');
        }
    } catch (err) {
        showToast('Error al quitar impresora', 'error');
    }
}

// Make functions globally available
window.removeFile = removeFile;
window.keepFilesColumnScrollTop = keepFilesColumnScrollTop;

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
