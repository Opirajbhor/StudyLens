(function () {
'use strict';

if (typeof pdfjsLib === 'undefined') { alert('Failed to load PDF.js'); return; }
if (typeof Dexie === 'undefined') { alert('Failed to load Dexie'); return; }

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

// ============ ICONS ============
const ICON_PATHS = {
  'arrow-left': '<path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>',
  'pencil':     '<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>',
  'eraser':     '<path d="M20 20H7L3 16a2 2 0 0 1 0-3l9-9a2 2 0 0 1 3 0l6 6a2 2 0 0 1 0 3L13 21"/><path d="M18 13l-5-5"/>',
  'undo':       '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>',
  'redo':       '<path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/>',
  'zoom-in':    '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6M8 11h6"/>',
  'zoom-out':   '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M8 11h6"/>',
  'upload':     '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/>',
  'download':   '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
  'save':       '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
  'help':       '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  'menu':       '<path d="M3 12h18M3 6h18M3 18h18"/>',
  'moon':       '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  'sun':        '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  'plus':       '<path d="M12 5v14M5 12h14"/>',
  'trash':      '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
  'message-square': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  'x':          '<path d="M18 6L6 18M6 6l12 12"/>',
  'book-open':  '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  'panel-left': '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>',
  'sparkles':   '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/><path d="M19 15l.9 2.6L22 18.5l-2.1.9L19 22l-.9-2.6L16 18.5l2.1-.9L19 15z"/>',
  'arrow-up':   '<path d="M12 19V5"/><path d="M5 12l7-7 7 7"/>',
  'chevron-down': '<path d="M6 9l6 6 6-6"/>',
  'bug':        '<path d="M14 12h.01M10 12h.01M12 20v-8M6 8l2 2M18 8l-2 2M4 14h2M18 14h2M8 4l1.5 1.5M16 4l-1.5 1.5M9 20h6"/>',
  'check':      '<path d="M20 6L9 17l-5-5"/>',
  'settings':   '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>'
};

function makeIcon(name, cls) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('class', 'ic' + (cls ? ' ' + cls : ''));
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.75');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.innerHTML = ICON_PATHS[name] || '';
  return svg;
}
document.querySelectorAll('[data-icon]').forEach(el => {
  const name = el.dataset.icon;
  if (el.textContent.trim() !== '') el.insertBefore(makeIcon(name), el.firstChild);
  else el.appendChild(makeIcon(name));
});

// ============ UTIL ============
const uuid = () => {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
const $ = (id) => document.getElementById(id);
let currentSessionId = null;
function newSession() {
  currentSessionId = uuid();
}
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, c => (
  {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]
));

let toastTimer;
function toast(msg, action) {
  const el = $('toast');
  el.innerHTML = '';
  el.appendChild(document.createTextNode(msg));
  if (action) {
    const btn = document.createElement('button');
    btn.textContent = action.label;
    btn.onclick = () => { action.onClick(); el.classList.remove('show'); };
    el.appendChild(btn);
  }
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), action ? 5000 : 1800);
}

function formatDate(ts) {
  const diff = Date.now() - ts;
  if (diff < 60_000) return 'just now';
  if (diff < 3600_000) return Math.floor(diff/60_000) + 'm ago';
  if (diff < 86400_000) return Math.floor(diff/3600_000) + 'h ago';
  if (diff < 7 * 86400_000) return Math.floor(diff/86400_000) + 'd ago';
  return new Date(ts).toLocaleDateString();
}
function formatBytes(b) {
  if (!b) return '0 B';
  if (b < 1024) return b + ' B';
  if (b < 1024*1024) return (b/1024).toFixed(1) + ' KB';
  if (b < 1024**3) return (b/1024/1024).toFixed(1) + ' MB';
  return (b/1024**3).toFixed(2) + ' GB';
}
async function hashBlob(blob) {
  const buf = await blob.arrayBuffer();
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// ============ DB ============
const db = new Dexie('pdfannotator');
db.version(1).stores({
  pdfs: 'id, name, lastOpened, createdAt',
  annotations: 'id, pdfId, page, createdAt, updatedAt'
});

// AI cache — separate DB, doesn't touch existing schema
const aiDb = new Dexie('pdfannotator-ai');
aiDb.version(1).stores({ cache: '&key, pdfId, page, kind' });
aiDb.version(3).stores({
  cache: '&key, pdfId, page, kind',
  chats: '++id, pdfId, page, role, createdAt, sessionId'
});

// ============ CONSTANTS ============
const HIGHLIGHT_COLORS = ['#a8e6cf', '#ffb3ba', '#bae1ff', '#d8b4fe', '#fdba74'];
const COMMENT_COLOR = '#fbbf24';
const DRAW_COLORS = ['#ff3b30', '#000000', '#0a84ff', '#34c759', '#ff9500', '#af52de'];
const DRAW_SIZES = [{ px: 1.5 }, { px: 3 }, { px: 5 }, { px: 9 }];

const READING_MODES = [
  { id: 'normal', label: 'Normal', swatch: '#ffffff' },
  { id: 'sepia',  label: 'Sepia',  swatch: '#e8d6b3' },
  { id: 'night',  label: 'Night',  swatch: '#1a1a1a' },
  { id: 'dark',   label: 'Dim',    swatch: '#444444' }
];

// ============ STATE ============
const state = {
  pdfDoc: null, pdfId: null, pdfMeta: null,
  annotations: [],
  scale: 1.25,
  renderedPages: new Map(),
  observer: null,
  filter: 'all',
  mode: 'select',
  drawColor: DRAW_COLORS[0],
  drawWidth: DRAW_SIZES[1].px,
  undoStack: [],
  redoStack: [],
  search: '',
  sort: 'lastOpened',
  erasing: false,
  erasedInStroke: new Set(),
  spread: false,
  reading: 'normal',
  thumbnailsFor: null,
  pagePanelOpen: false,
  readingMenuOpen: false
};

try {
  state.reading = localStorage.getItem('reading') || 'normal';
  state.spread = localStorage.getItem('spread') === '1';
} catch (e) {}

// ============ DRAW BAR ============
function buildDrawBar() {
  const colorWrap = $('drawColors');
  colorWrap.innerHTML = '';
  for (const c of DRAW_COLORS) {
    const el = document.createElement('div');
    el.className = 'draw-color' + (c === state.drawColor ? ' selected' : '');
    el.style.background = c;
    el.title = c;
    el.addEventListener('mousedown', e => e.preventDefault());
    el.onclick = () => { state.drawColor = c; buildDrawBar(); };
    colorWrap.appendChild(el);
  }
  const sizeWrap = $('sizeButtons');
  sizeWrap.innerHTML = '';
  for (const s of DRAW_SIZES) {
    const btn = document.createElement('button');
    btn.className = 'size-btn' + (s.px === state.drawWidth ? ' selected' : '');
    btn.title = s.px + 'px';
    const dot = document.createElement('i');
    const size = Math.min(18, Math.max(4, s.px * 2));
    dot.style.width = size + 'px';
    dot.style.height = size + 'px';
    btn.appendChild(dot);
    btn.addEventListener('mousedown', e => e.preventDefault());
    btn.onclick = () => { state.drawWidth = s.px; buildDrawBar(); };
    sizeWrap.appendChild(btn);
  }
}
buildDrawBar();

// ============ THEME ============
document.documentElement.dataset.theme = localStorage.getItem('theme') || 'light';
function updateThemeIcon() {
  const btn = $('themeToggle');
  const isDark = document.documentElement.dataset.theme === 'dark';
  btn.innerHTML = '';
  btn.appendChild(makeIcon(isDark ? 'sun' : 'moon'));
}
updateThemeIcon();
$('themeToggle').onclick = () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
  updateThemeIcon();
};

// ============ USAGE ============
async function updateUsage() {
  try {
    if (!navigator.storage || !navigator.storage.estimate) return;
    const est = await navigator.storage.estimate();
    $('usageMeter').textContent = formatBytes(est.usage || 0) + ' / ' + formatBytes(est.quota || 0);
  } catch (e) {}
}
updateUsage();

// ============ LIBRARY ============
async function refreshLibrary() {
  let pdfs = await db.pdfs.toArray();
  const q = state.search.trim().toLowerCase();
  if (q) pdfs = pdfs.filter(p => p.name.toLowerCase().includes(q));
  const sorters = {
    lastOpened: (a, b) => b.lastOpened - a.lastOpened,
    createdAt: (a, b) => b.createdAt - a.createdAt,
    name: (a, b) => a.name.localeCompare(b.name),
    size: (a, b) => b.size - a.size
  };
  pdfs.sort(sorters[state.sort] || sorters.lastOpened);

  const counts = new Map();
  for (const a of await db.annotations.toArray()) {
    counts.set(a.pdfId, (counts.get(a.pdfId) || 0) + 1);
  }

  const list = $('libraryList');
  list.innerHTML = '';
  $('libraryEmpty').hidden = pdfs.length > 0;

  for (const p of pdfs) {
    const row = document.createElement('div');
    row.className = 'flex items-center gap-3 px-3 py-3 rounded-md hover:bg-[var(--surface)] cursor-pointer';
    const annCount = counts.get(p.id) || 0;
    row.innerHTML =
      '<div class="w-[60px] h-[80px] rounded-[4px] bg-bg shrink-0 overflow-hidden flex items-center justify-center border border-bd">' +
        (p.thumbnail ? '<img src="' + p.thumbnail + '" class="w-full h-full object-cover block">' : '') +
      '</div>' +
      '<div class="flex-1 min-w-0">' +
        '<div class="text-[13px] font-medium truncate mb-1">' + escapeHtml(p.name) + '</div>' +
        '<div class="pdf-row-sub text-[12px] text-[var(--muted)] flex flex-wrap">' +
          '<span>' + formatDate(p.lastOpened) + '</span>' +
          '<span class="before:content-[\'·\'] before:mx-2 before:opacity-60">' + p.pageCount + ' pages</span>' +
          '<span class="before:content-[\'·\'] before:mx-2 before:opacity-60">' + formatBytes(p.size) + '</span>' +
          '<span class="before:content-[\'·\'] before:mx-2 before:opacity-60">' + annCount + ' annotations</span>' +
        '</div>' +
      '</div>' +
      '<div class="flex gap-1.5 shrink-0 opacity-0 transition-opacity pdf-row-actions" style="opacity:0">' +
        '<button class="row-btn" title="Export annotations" data-act="export"></button>' +
        '<button class="row-btn danger" title="Delete" data-act="delete"></button>' +
      '</div>';
    const actions = row.querySelector('.pdf-row-actions');
    row.addEventListener('mouseenter', () => actions.style.opacity = '1');
    row.addEventListener('mouseleave', () => actions.style.opacity = '0');
    row.querySelector('[data-act="export"]').appendChild(makeIcon('upload', 'ic-sm'));
    row.querySelector('[data-act="delete"]').appendChild(makeIcon('trash', 'ic-sm'));
    row.onclick = (e) => {
      const btn = e.target.closest('[data-act]');
      if (btn) {
        if (btn.dataset.act === 'export') return exportAnnotations(p.id);
        if (btn.dataset.act === 'delete') return deletePDF(p);
      }
      openPDF(p.id);
    };
    list.appendChild(row);
  }
}
$('searchInput').oninput = e => { state.search = e.target.value; refreshLibrary(); };
$('sortSelect').onchange = e => { state.sort = e.target.value; refreshLibrary(); };

async function deletePDF(p) {
  toast('Delete "' + p.name + '"?', {
    label: 'Confirm',
    onClick: async () => {
      await db.pdfs.delete(p.id);
      await db.annotations.where('pdfId').equals(p.id).delete();
      refreshLibrary();
      updateUsage();
      toast('Deleted');
    }
  });
}

// ============ IMPORT ============
$('addPdfBtn').onclick = () => $('fileInput').click();
$('fileInput').onchange = async (e) => {
  const files = [...e.target.files];
  e.target.value = '';
  for (const file of files) {
    try { await importPDF(file); }
    catch (err) { console.error(err); toast('Failed: ' + file.name); }
  }
  refreshLibrary();
  updateUsage();
};

async function importPDF(file) {
  const id = await hashBlob(file);
  if (await db.pdfs.get(id)) { toast('Already in library'); return; }
  if (navigator.storage && navigator.storage.persist) {
    try { await navigator.storage.persist(); } catch (e) {}
  }
  const buf = await file.arrayBuffer();
  const pdfDoc = await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise;
  const thumbnail = await makeThumbnail(pdfDoc);
  await db.pdfs.put({
    id, name: file.name, size: file.size,
    pageCount: pdfDoc.numPages, blob: file, thumbnail,
    createdAt: Date.now(), lastOpened: Date.now()
  });
  toast('Added: ' + file.name);
}

async function makeThumbnail(pdfDoc) {
  try {
    const page = await pdfDoc.getPage(1);
    const vp = page.getViewport({ scale: 0.35 });
    const canvas = document.createElement('canvas');
    canvas.width = vp.width; canvas.height = vp.height;
    await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
    return canvas.toDataURL('image/jpeg', 0.7);
  } catch (e) { return null; }
}

// ============ OPEN / CLOSE ============
async function openPDF(id) {
  const meta = await db.pdfs.get(id);
  if (!meta) { toast('PDF not found'); return; }
  const buf = await meta.blob.arrayBuffer();
  state.pdfDoc = await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise;
  state.pdfId = id;
  state.pdfMeta = meta;
  state.annotations = await db.annotations.where('pdfId').equals(id).toArray();
  state.renderedPages.clear();
  state.undoStack = []; state.redoStack = [];
  state.thumbnailsFor = null;
  setMode('select', false);
  newSession();
  $('readerTitle').textContent = meta.name;
  $('library').hidden = true;
  $('reader').hidden = false;
  $('pages').dataset.reading = state.reading;
  $('spreadToggle').classList.toggle('active', state.spread);
  await renderReader();
  renderSidebar();
  if (state.pagePanelOpen) {
    $('pagePanel').hidden = false;
    renderThumbnails();
  }
  await db.pdfs.update(id, { lastOpened: Date.now() });
}

$('backBtn').onclick = () => {
  $('reader').hidden = true;
  $('library').hidden = false;
  if (state.pdfDoc && state.pdfDoc.destroy) state.pdfDoc.destroy();
  state.pdfDoc = null; state.pdfId = null; state.annotations = [];
  state.thumbnailsFor = null;
  hideSelToolbar();
  hidePopover();
  closeReadingMenu();
  closeAIPanel();
  refreshLibrary();
  updateUsage();
};

// ============ RENDER ============
async function renderReader() {
  const pagesEl = $('pages');
  pagesEl.innerHTML = '';
  state.renderedPages.clear();
  if (state.observer) state.observer.disconnect();
  state.observer = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) renderPage(+e.target.dataset.page, e.target).catch(console.error);
    }
  }, { root: $('pagesScroll'), rootMargin: '400px 0px' });

  const total = state.pdfDoc.numPages;

  if (state.spread) {
    for (let i = 1; i <= total; i += 2) {
      const row = document.createElement('div');
      row.className = 'flex gap-4 justify-center items-start';
      const left = await buildPageWrap(i);
      row.appendChild(left);
      if (i + 1 <= total) {
        const right = await buildPageWrap(i + 1);
        row.appendChild(right);
      }
      pagesEl.appendChild(row);
      state.observer.observe(left);
      if (i + 1 <= total) state.observer.observe(row.lastElementChild);
    }
  } else {
    for (let i = 1; i <= total; i++) {
      const wrap = await buildPageWrap(i);
      pagesEl.appendChild(wrap);
      state.observer.observe(wrap);
    }
  }
  updatePageIndicator();
}

async function buildPageWrap(i) {
  const page = await state.pdfDoc.getPage(i);
  const vp = page.getViewport({ scale: state.scale });
  const wrap = document.createElement('div');
  wrap.className = 'page-wrap';
  wrap.dataset.page = i;
  wrap.style.width = vp.width + 'px';
  wrap.style.height = vp.height + 'px';
  return wrap;
}

async function renderPage(num, wrap) {
  if (state.renderedPages.has(num)) return;
  state.renderedPages.set(num, true);

  const page = await state.pdfDoc.getPage(num);
  const viewport = page.getViewport({ scale: state.scale });
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const canvas = document.createElement('canvas');
  canvas.className = 'pdf-canvas';
  canvas.width = viewport.width * dpr;
  canvas.height = viewport.height * dpr;
  canvas.style.width = viewport.width + 'px';
  canvas.style.height = viewport.height + 'px';
  wrap.appendChild(canvas);
  await page.render({
    canvasContext: canvas.getContext('2d'),
    viewport: viewport,
    transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined
  }).promise;

  const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  overlay.classList.add('overlay');
  overlay.setAttribute('viewBox', '0 0 ' + viewport.width + ' ' + viewport.height);
  overlay.setAttribute('preserveAspectRatio', 'none');
  overlay.style.width = viewport.width + 'px';
  overlay.style.height = viewport.height + 'px';
  wrap.appendChild(overlay);
  drawOverlayAnnotations(num, overlay, viewport);

  const textDiv = document.createElement('div');
  textDiv.className = 'textLayer';
  textDiv.style.width = viewport.width + 'px';
  textDiv.style.height = viewport.height + 'px';
  textDiv.style.setProperty('--scale-factor', String(state.scale));
  wrap.appendChild(textDiv);
  try {
    const textContent = await page.getTextContent();
    const t = pdfjsLib.renderTextLayer({
      textContentSource: textContent,
      container: textDiv,
      viewport: viewport,
      textDivs: []
    });
    await t.promise;
  } catch (e) { console.warn('text layer failed page ' + num, e); }

  const drawSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  drawSvg.classList.add('draw-overlay');
  drawSvg.setAttribute('viewBox', '0 0 ' + viewport.width + ' ' + viewport.height);
  drawSvg.setAttribute('preserveAspectRatio', 'none');
  drawSvg.style.width = viewport.width + 'px';
  drawSvg.style.height = viewport.height + 'px';
  wrap.appendChild(drawSvg);
  attachDrawHandlers(drawSvg, num, viewport);
  attachEraseHandlers(drawSvg);
  drawStrokes(num, drawSvg, viewport);
  applyModeToSvg(drawSvg);
}

function drawOverlayAnnotations(pageNum, svg, viewport) {
  svg.innerHTML = '';
  const anns = state.annotations.filter(a => a.page === pageNum && (a.type === 'highlight' || a.type === 'comment'));
  for (const ann of anns) {
    for (const r of ann.rects) {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', r.x * viewport.width);
      rect.setAttribute('y', r.y * viewport.height);
      rect.setAttribute('width', r.w * viewport.width);
      rect.setAttribute('height', r.h * viewport.height);
      rect.setAttribute('rx', '2');
      rect.setAttribute('fill', ann.color);
      rect.setAttribute('opacity', '0.55');
      rect.classList.add('hit');
      rect.addEventListener('mousedown', e => e.stopPropagation());
      rect.addEventListener('click', e => { e.stopPropagation(); openPopover(ann, e); });
      svg.appendChild(rect);
    }
  }
}

function refreshPageAnnotations(pageNum) {
  const wrap = document.querySelector('.page-wrap[data-page="' + pageNum + '"]');
  if (!wrap || !state.pdfDoc) return;
  state.pdfDoc.getPage(pageNum).then(p => {
    const vp = p.getViewport({ scale: state.scale });
    const svg = wrap.querySelector('.overlay');
    if (svg) drawOverlayAnnotations(pageNum, svg, vp);
    const dsvg = wrap.querySelector('.draw-overlay');
    if (dsvg) drawStrokes(pageNum, dsvg, vp);
  });
}

function drawStrokes(pageNum, svg, viewport) {
  svg.innerHTML = '';
  const anns = state.annotations.filter(a => a.page === pageNum && a.type === 'draw');
  for (const ann of anns) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const d = ann.points.map((p, i) =>
      (i === 0 ? 'M ' : 'L ') + (p.x * viewport.width) + ' ' + (p.y * viewport.height)
    ).join(' ');
    path.setAttribute('d', d);
    path.setAttribute('stroke', ann.color);
    path.setAttribute('stroke-width', ann.width);
    path.dataset.id = ann.id;
    path.addEventListener('click', e => {
      if (state.mode === 'select') { e.stopPropagation(); openPopover(ann, e); }
    });
    svg.appendChild(path);
  }
}

// ============ DRAW HANDLERS ============
function attachDrawHandlers(svg, pageNum, viewport) {
  let current = null;
  const toNorm = (evt) => {
    const r = svg.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (evt.clientX - r.left) / r.width)),
      y: Math.min(1, Math.max(0, (evt.clientY - r.top) / r.height))
    };
  };

  svg.addEventListener('pointerdown', e => {
    if (state.mode !== 'draw') return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    svg.setPointerCapture(e.pointerId);
    const p = toNorm(e);
    current = { points: [p] };
    const preview = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    preview.setAttribute('stroke', state.drawColor);
    preview.setAttribute('stroke-width', state.drawWidth);
    preview.setAttribute('fill', 'none');
    preview.setAttribute('stroke-linecap', 'round');
    preview.setAttribute('stroke-linejoin', 'round');
    preview.setAttribute('d', 'M ' + (p.x * viewport.width) + ' ' + (p.y * viewport.height));
    svg.appendChild(preview);
    current._preview = preview;
  });
  svg.addEventListener('pointermove', e => {
    if (!current) return;
    const p = toNorm(e);
    const last = current.points[current.points.length - 1];
    if (Math.hypot(p.x - last.x, p.y - last.y) < 0.001) return;
    current.points.push(p);
    const d = current.points.map((pt, i) =>
      (i === 0 ? 'M ' : 'L ') + (pt.x * viewport.width) + ' ' + (pt.y * viewport.height)
    ).join(' ');
    current._preview.setAttribute('d', d);
  });
  const finish = async () => {
    if (!current) return;
    const stroke = current; current = null;
    if (stroke.points.length < 2) { stroke._preview.remove(); return; }
    stroke._preview.remove();
    const ann = {
      id: uuid(), pdfId: state.pdfId, page: pageNum, type: 'draw',
      color: state.drawColor, width: state.drawWidth,
      points: stroke.points.map(p => ({ x: +p.x.toFixed(5), y: +p.y.toFixed(5) })),
      text: '', comment: '',
      createdAt: Date.now(), updatedAt: Date.now()
    };
    await db.annotations.add(ann);
    state.annotations.push(ann);
    pushUndo({ kind: 'add', ann });
    refreshPageAnnotations(pageNum);
    renderSidebar();
  };
  svg.addEventListener('pointerup', finish);
  svg.addEventListener('pointercancel', finish);
}

// ============ ERASER ============
function attachEraseHandlers(svg) {
  const eraseAt = async (clientX, clientY) => {
    const els = document.elementsFromPoint(clientX, clientY);
    for (const el of els) {
      if (el.tagName && el.tagName.toLowerCase() === 'path' && el.dataset.id) {
        const id = el.dataset.id;
        if (state.erasedInStroke.has(id)) return;
        state.erasedInStroke.add(id);
        const ann = state.annotations.find(a => a.id === id);
        if (ann) await deleteAnnotation(ann, true);
        return;
      }
    }
  };
  svg.addEventListener('pointerdown', async e => {
    if (state.mode !== 'erase') return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    svg.setPointerCapture(e.pointerId);
    state.erasing = true;
    state.erasedInStroke.clear();
    await eraseAt(e.clientX, e.clientY);
  });
  svg.addEventListener('pointermove', async e => {
    if (!state.erasing || state.mode !== 'erase') return;
    await eraseAt(e.clientX, e.clientY);
  });
  const stop = () => { state.erasing = false; state.erasedInStroke.clear(); };
  svg.addEventListener('pointerup', stop);
  svg.addEventListener('pointercancel', stop);
  svg.addEventListener('pointerleave', stop);
}

// ============ SELECTION → TOOLBAR ============
function selectionIsReal() {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount || sel.isCollapsed) return null;
  const text = sel.toString();
  if (!text || !text.trim()) return null;
  const range = sel.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  if (rect.width < 3 || rect.height < 3) return null;
  const node = range.commonAncestorContainer;
  const el = node.nodeType === 1 ? node : node.parentElement;
  if (!el || !el.closest) return null;
  const textLayer = el.closest('.textLayer');
  if (!textLayer) return null;
  const pageWrap = textLayer.closest('.page-wrap');
  if (!pageWrap) return null;
  return { sel, range, pageWrap, rect };
}

function handleSelection() {
  if (state.mode !== 'select') return hideSelToolbar();
  const info = selectionIsReal();
  if (!info) return hideSelToolbar();
  showSelToolbar(info.rect, info.pageWrap);
}

document.addEventListener('selectionchange', () => {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !sel.toString().trim()) hideSelToolbar();
});

document.addEventListener('mouseup', e => {
  if (e.button !== 0) return;
  if (e.target.closest && e.target.closest('.sel-toolbar, .popover, .app-header, .sidebar, .draw-bar, .hint-bar, .page-panel, .reading-menu, #aiPanel')) return;
  setTimeout(handleSelection, 0);
});

function showSelToolbar(selRect, pageWrap) {
  const tb = $('selToolbar');
  tb.innerHTML = '';
  for (const c of HIGHLIGHT_COLORS) {
    const sw = document.createElement('div');
    sw.className = 'color-swatch';
    sw.style.background = c;
    sw.title = 'Highlight';
    sw.addEventListener('mouseup', e => e.stopPropagation());
    sw.onclick = e => { e.stopPropagation(); createHighlight(pageWrap, c, false); };
    tb.appendChild(sw);
  }
  const sep = document.createElement('div');
  sep.className = 'sel-sep';
  tb.appendChild(sep);

  const btn = document.createElement('button');
  btn.className = 'comment-btn';
  btn.style.background = 'var(--accent)';
  btn.style.color = 'var(--accent-fg)';
  btn.title = 'Add comment';
  btn.appendChild(makeIcon('message-square'));
  const label = document.createElement('span');
  label.textContent = 'Comment';
  btn.appendChild(label);
  btn.addEventListener('mousedown', e => { e.preventDefault(); e.stopPropagation(); });
  btn.addEventListener('mouseup', e => e.stopPropagation());
  btn.onclick = e => { e.stopPropagation(); createHighlight(pageWrap, COMMENT_COLOR, true); };
  tb.appendChild(btn);

  const aiSep = document.createElement('div');
  aiSep.className = 'sel-sep';
  tb.appendChild(aiSep);

  const explainBtn = document.createElement('button');
  explainBtn.className = 'comment-btn';
  explainBtn.style.background = 'var(--accent)';
  explainBtn.style.color = 'var(--accent-fg)';
  explainBtn.title = 'Explain with AI';
  explainBtn.appendChild(makeIcon('sparkles'));
  const explainLabel = document.createElement('span');
  explainLabel.textContent = 'Explain';
  explainBtn.appendChild(explainLabel);
  explainBtn.addEventListener('mousedown', e => { e.preventDefault(); e.stopPropagation(); });
  explainBtn.addEventListener('mouseup', e => e.stopPropagation());
  explainBtn.onclick = e => {
    e.stopPropagation();
    hideSelToolbar();
    window.__explainSelection();
  };
  tb.appendChild(explainBtn);

  tb.style.left = (selRect.left + selRect.width / 2) + 'px';
  tb.style.top = (selRect.top - 8) + 'px';
  tb.hidden = false;
}
function hideSelToolbar() { $('selToolbar').hidden = true; }

async function createHighlight(pageWrap, color, withComment) {
  const info = selectionIsReal();
  if (!info) { hideSelToolbar(); return; }
  const range = info.range;
  const selRect = info.rect;
  const text = info.sel.toString().trim();
  const pageRect = pageWrap.getBoundingClientRect();
  const rects = [];
  const clientRects = range.getClientRects();
  for (let i = 0; i < clientRects.length; i++) {
    const r = clientRects[i];
    if (r.width < 1 || r.height < 1) continue;
    const x = (r.left - pageRect.left) / pageRect.width;
    const y = (r.top - pageRect.top) / pageRect.height;
    const w = r.width / pageRect.width;
    const h = r.height / pageRect.height;
    if (x < -0.02 || x > 1.02 || y < -0.02 || y > 1.02) continue;
    rects.push({ x: Math.max(0, x), y: Math.max(0, y), w, h });
  }
  hideSelToolbar();
  info.sel.removeAllRanges();
  if (!rects.length) return;

  const ann = {
    id: uuid(), pdfId: state.pdfId, page: +pageWrap.dataset.page,
    type: withComment ? 'comment' : 'highlight',
    color, rects, text, comment: '',
    createdAt: Date.now(), updatedAt: Date.now()
  };
  await db.annotations.add(ann);
  state.annotations.push(ann);
  pushUndo({ kind: 'add', ann });
  refreshPageAnnotations(ann.page);
  renderSidebar();
  if (withComment) {
    openPopover(ann, {
      clientX: selRect.left + selRect.width / 2,
      clientY: selRect.top + selRect.height / 2
    });
  }
}

// ============ MODE ============
function applyModeToSvg(svg) {
  svg.classList.toggle('active', state.mode === 'draw' || state.mode === 'erase');
  svg.classList.toggle('erase', state.mode === 'erase');
}
function setMode(mode, announce) {
  if (announce === undefined) announce = true;
  const prev = state.mode;
  state.mode = mode;
  $('toolDraw').classList.toggle('active', state.mode === 'draw');
  $('toolErase').classList.toggle('active', state.mode === 'erase');
  document.querySelectorAll('.draw-overlay').forEach(applyModeToSvg);
  $('drawBar').hidden = state.mode !== 'draw';
  $('eraseHint').hidden = state.mode !== 'erase';
  document.body.style.cursor = state.mode === 'select' ? '' :
                                state.mode === 'draw' ? 'crosshair' : 'cell';
  if (state.mode !== 'select') hideSelToolbar();
  if (announce && prev !== state.mode) toast('Mode: ' + state.mode);
}
$('toolDraw').onclick = () => setMode(state.mode === 'draw' ? 'select' : 'draw');
$('toolErase').onclick = () => setMode(state.mode === 'erase' ? 'select' : 'erase');

// ============ SPREAD ============
$('spreadToggle').onclick = async () => {
  state.spread = !state.spread;
  try { localStorage.setItem('spread', state.spread ? '1' : '0'); } catch (e) {}
  $('spreadToggle').classList.toggle('active', state.spread);
  const topPage = findTopPage();
  await renderReader();
  if (topPage) {
    const wrap = document.querySelector('.page-wrap[data-page="' + topPage + '"]');
    if (wrap) wrap.scrollIntoView({ block: 'start' });
  }
  toast(state.spread ? 'Two-page view' : 'Single-page view');
};

// ============ READING MODES ============
function applyReading(mode) {
  state.reading = mode;
  $('pages').dataset.reading = mode;
  try { localStorage.setItem('reading', mode); } catch (e) {}
}

$('readingBtn').onclick = (e) => {
  e.stopPropagation();
  if (state.readingMenuOpen) return closeReadingMenu();
  openReadingMenu();
};

function openReadingMenu() {
  const menu = $('readingMenu');
  menu.innerHTML = '';
  for (const m of READING_MODES) {
    const btn = document.createElement('button');
    if (m.id === state.reading) btn.classList.add('active');
    const sw = document.createElement('span');
    sw.className = 'reading-swatch';
    sw.style.background = m.swatch;
    btn.appendChild(sw);
    const label = document.createElement('span');
    label.textContent = m.label;
    btn.appendChild(label);
    btn.onclick = () => {
      applyReading(m.id);
      closeReadingMenu();
      toast('Reading: ' + m.label);
    };
    menu.appendChild(btn);
  }
  const r = $('readingBtn').getBoundingClientRect();
  menu.style.top = (r.bottom + 6) + 'px';
  menu.style.left = Math.max(10, r.right - 160) + 'px';
  menu.hidden = false;
  state.readingMenuOpen = true;
}

function closeReadingMenu() {
  $('readingMenu').hidden = true;
  state.readingMenuOpen = false;
}

document.addEventListener('mousedown', e => {
  if (!state.readingMenuOpen) return;
  if (e.target.closest('.reading-menu') || e.target.closest('#readingBtn')) return;
  closeReadingMenu();
});

// ============ PAGE PANEL ============
$('pagesPanelToggle').onclick = async () => {
  state.pagePanelOpen = !state.pagePanelOpen;
  const panel = $('pagePanel');
  $('pagesPanelToggle').classList.toggle('active', state.pagePanelOpen);
  panel.hidden = !state.pagePanelOpen;
  if (state.pagePanelOpen) {
    await renderThumbnails();
  }
};

let thumbnailRenderToken = 0;

async function renderThumbnails() {
  if (!state.pdfDoc) return;
  const list = $('pagePanelList');

  if (state.thumbnailsFor === state.pdfId && list.children.length > 0) {
    updateActiveThumb();
    return;
  }
  state.thumbnailsFor = state.pdfId;
  list.innerHTML = '';

  const token = ++thumbnailRenderToken;
  const total = state.pdfDoc.numPages;
  const scale = 0.22;

  for (let i = 1; i <= total; i++) {
    if (token !== thumbnailRenderToken) return;
    try {
      const page = await state.pdfDoc.getPage(i);
      const vp = page.getViewport({ scale });

      const item = document.createElement('div');
      item.className = 'thumb-item';
      item.dataset.page = i;

      const canvas = document.createElement('canvas');
      canvas.width = vp.width;
      canvas.height = vp.height;
      await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;

      const label = document.createElement('div');
      label.className = 'thumb-label text-[11px] text-[var(--muted)] font-medium';
      label.textContent = i;

      item.appendChild(canvas);
      item.appendChild(label);
      item.onclick = () => {
        const wrap = document.querySelector('.page-wrap[data-page="' + i + '"]');
        if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      list.appendChild(item);
    } catch (err) {
      console.warn('thumbnail render failed page ' + i, err);
    }
  }
  updateActiveThumb();
}

function updateActiveThumb() {
  if (!state.pagePanelOpen) return;
  const p = findTopPage();
  if (!p) return;
  document.querySelectorAll('.thumb-item').forEach(el => {
    el.classList.toggle('active', +el.dataset.page === p);
  });
  const active = document.querySelector('.thumb-item.active');
  if (active && active.scrollIntoView) {
    const list = $('pagePanelList');
    const itemRect = active.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    if (itemRect.top < listRect.top || itemRect.bottom > listRect.bottom) {
      active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }
}

// ============ UNDO / REDO ============
function pushUndo(action) {
  state.undoStack.push(action);
  state.redoStack = [];
}
async function undo() {
  const action = state.undoStack.pop();
  if (!action) return;
  if (action.kind === 'add') {
    await db.annotations.delete(action.ann.id);
    state.annotations = state.annotations.filter(a => a.id !== action.ann.id);
    refreshPageAnnotations(action.ann.page);
    renderSidebar();
    state.redoStack.push(action);
  }
}
async function redo() {
  const action = state.redoStack.pop();
  if (!action) return;
  if (action.kind === 'add') {
    await db.annotations.add(action.ann);
    state.annotations.push(action.ann);
    refreshPageAnnotations(action.ann.page);
    renderSidebar();
    state.undoStack.push(action);
  }
}
$('undoBtn').onclick = undo;
$('redoBtn').onclick = redo;

// ============ SAVE PDF ============
async function downloadPDF() {
  if (!state.pdfId) return;
  const meta = await db.pdfs.get(state.pdfId);
  if (!meta) return;
  const url = URL.createObjectURL(meta.blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = meta.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  toast('Saved: ' + meta.name);
}
$('savePdfBtn').onclick = downloadPDF;

// ============ KEYBOARD ============
document.addEventListener('keydown', e => {
  const mod = e.metaKey || e.ctrlKey;
  if (mod && e.key.toLowerCase() === 's') {
    e.preventDefault();
    e.stopPropagation();
    if (state.pdfId) downloadPDF();
    return;
  }
}, true);

document.addEventListener('keydown', e => {
  if (!state.pdfId) return;
  if (e.target.matches && e.target.matches('input,textarea')) return;
  const mod = e.metaKey || e.ctrlKey;
  if (mod && e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
  else if (mod && e.key.toLowerCase() === 'z' && e.shiftKey) { e.preventDefault(); redo(); }
  else if (mod && (e.key === '=' || e.key === '+')) { e.preventDefault(); setScale(state.scale + 0.25); }
  else if (mod && e.key === '-') { e.preventDefault(); setScale(state.scale - 0.25); }
  else if (mod && e.key === '0') { e.preventDefault(); setScale(1); }
  else if (e.key.toLowerCase() === 'd') setMode(state.mode === 'draw' ? 'select' : 'draw');
  else if (e.key.toLowerCase() === 'e') setMode(state.mode === 'erase' ? 'select' : 'erase');
  else if (e.key.toLowerCase() === 't') $('spreadToggle').click();
  else if (e.key.toLowerCase() === 'p') $('pagesPanelToggle').click();
  else if (e.key.toLowerCase() === 'r') $('readingBtn').click();
  else if (e.key.toLowerCase() === 'a') $('aiBtn').click();
  else if (e.key === 'Escape') { hideSelToolbar(); hidePopover(); closeReadingMenu(); setMode('select', false); }
});

$('pagesScroll').addEventListener('wheel', e => {
  if (!state.pdfDoc) return;
  if (!(e.ctrlKey || e.metaKey)) return;
  e.preventDefault();
  const delta = -Math.sign(e.deltaY) * 0.15;
  zoomAtPoint(state.scale + delta, e.clientX, e.clientY);
}, { passive: false });

// ============ POPOVER ============
let popoverTarget = null;

function openPopover(ann, evt) {
  hideSelToolbar();
  popoverTarget = ann;
  const pop = $('popover');

  const titleEl = $('popoverTitle');
  titleEl.innerHTML = '';
  const badge = document.createElement('span');
  badge.className = 'badge ' + ann.type;
  badge.textContent = ann.type;
  titleEl.appendChild(badge);
  const titleText = document.createElement('span');
  titleText.textContent = ann.type === 'comment' ? 'Comment' :
                          ann.type === 'draw' ? 'Drawing' : 'Highlight';
  titleEl.appendChild(titleText);

  const colorRow = $('popoverColors');
  colorRow.innerHTML = '';
  if (ann.type === 'comment') {
    colorRow.hidden = true;
  } else if (ann.type === 'draw') {
    colorRow.hidden = false;
    for (const c of DRAW_COLORS) {
      const sw = document.createElement('div');
      sw.className = 'color-swatch' + (c === ann.color ? ' selected' : '');
      sw.style.background = c;
      sw.onclick = async (e) => {
        ann.color = c; ann.updatedAt = Date.now();
        await db.annotations.put(ann);
        refreshPageAnnotations(ann.page);
        renderSidebar();
        openPopover(ann, e);
      };
      colorRow.appendChild(sw);
    }
  } else {
    colorRow.hidden = false;
    for (const c of HIGHLIGHT_COLORS) {
      const sw = document.createElement('div');
      sw.className = 'color-swatch' + (c === ann.color ? ' selected' : '');
      sw.style.background = c;
      sw.onclick = async (e) => {
        ann.color = c; ann.updatedAt = Date.now();
        await db.annotations.put(ann);
        refreshPageAnnotations(ann.page);
        renderSidebar();
        openPopover(ann, e);
      };
      colorRow.appendChild(sw);
    }
  }

  $('popoverComment').value = ann.comment || '';
  $('popoverComment').placeholder = ann.type === 'comment' ? 'Write your comment…' : 'Add a comment…';

  const x = Math.min(window.innerWidth - 310, Math.max(10, evt.clientX));
  const y = Math.min(window.innerHeight - 260, evt.clientY + 12);
  pop.style.left = x + 'px';
  pop.style.top = y + 'px';
  pop.hidden = false;
  setTimeout(() => $('popoverComment').focus(), 30);
}

function hidePopover() { $('popover').hidden = true; popoverTarget = null; }

$('popoverSave').onclick = async () => {
  if (!popoverTarget) return;
  popoverTarget.comment = $('popoverComment').value.trim();
  popoverTarget.updatedAt = Date.now();
  await db.annotations.put(popoverTarget);
  renderSidebar();
  $('popover').hidden = true;
  popoverTarget = null;
  toast('Saved');
};
$('popoverClose').onclick = () => hidePopover();
$('popoverDelete').onclick = async () => {
  if (!popoverTarget) return;
  const t = popoverTarget;
  popoverTarget = null;
  await deleteAnnotation(t, false);
  $('popover').hidden = true;
};

async function deleteAnnotation(ann, silent) {
  await db.annotations.delete(ann.id);
  state.annotations = state.annotations.filter(a => a.id !== ann.id);
  refreshPageAnnotations(ann.page);
  renderSidebar();
  if (!silent) toast('Deleted');
}

document.addEventListener('mousedown', e => {
  const pop = $('popover');
  if (!pop.hidden && !pop.contains(e.target) && !(e.target.closest && e.target.closest('.overlay'))) {
    hidePopover();
  }
  const tb = $('selToolbar');
  if (!tb.hidden && !tb.contains(e.target)) hideSelToolbar();
});

// ============ SIDEBAR ============
$('filterSelect').onchange = e => { state.filter = e.target.value; renderSidebar(); };
$('sidebarToggle').onclick = () => $('sidebar').classList.toggle('open');

function renderSidebar() {
  const list = $('annList');
  list.innerHTML = '';
  let items = state.annotations.slice().sort((a, b) => a.page - b.page || a.createdAt - b.createdAt);
  if (state.filter === 'withComment') items = items.filter(a => a.comment);
  if (state.filter === 'noComment') items = items.filter(a => !a.comment);

  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'px-4 py-10 text-center text-[var(--muted)] text-[13px] leading-relaxed';
    empty.textContent = state.annotations.length
      ? 'No annotations match the filter'
      : 'Select text to highlight or comment. Press D to draw, E to erase.';
    list.appendChild(empty);
    return;
  }

  for (const ann of items) {
    const el = document.createElement('div');
    el.className = 'ann-item px-3 py-2 rounded-md text-[13px] mb-1';

    let label, typeLabel;
    if (ann.type === 'draw') { label = 'Drawing'; typeLabel = 'draw'; }
    else if (ann.type === 'comment') { label = ann.text || 'Comment'; typeLabel = 'comment'; }
    else { label = ann.text || ''; typeLabel = 'highlight'; }

    const meta = document.createElement('div');
    meta.className = 'text-xs text-[var(--muted)] mb-1.5 flex gap-2 items-center';
    meta.innerHTML =
      '<span class="w-1.5 h-1.5 rounded-full shrink-0" style="background:' + ann.color + '"></span>' +
      '<span>Page ' + ann.page + '</span>' +
      '<span class="type-tag ' + typeLabel + '">' + typeLabel + '</span>';
    el.appendChild(meta);

    const textEl = document.createElement('div');
    textEl.className = 'text-[13px] leading-snug pr-6';
    textEl.style.cssText = 'display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden';
    textEl.textContent = label.slice(0, 140);
    el.appendChild(textEl);

    if (ann.comment) {
      const c = document.createElement('div');
      c.className = 'text-[13px] text-[var(--muted)] mt-2 italic';
      c.style.cssText += ';display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden';
      c.textContent = ann.comment;
      el.appendChild(c);
    }

    const delBtn = document.createElement('button');
    delBtn.className = 'ann-item-del absolute top-2 right-2 w-6 h-6 rounded-md items-center justify-center text-[var(--muted)]';
    delBtn.title = 'Delete';
    delBtn.appendChild(makeIcon('x', 'ic-sm'));
    delBtn.addEventListener('click', async e => {
      e.stopPropagation();
      await deleteAnnotation(ann, false);
    });
    el.appendChild(delBtn);

    el.onclick = () => {
      const wrap = document.querySelector('.page-wrap[data-page="' + ann.page + '"]');
      if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const svg = wrap && wrap.querySelector('.overlay');
      if (svg && svg.animate) {
        svg.animate([{ opacity: 1 }, { opacity: 0.3 }, { opacity: 1 }], { duration: 600, iterations: 2 });
      }
      if (window.innerWidth < 640) $('sidebar').classList.remove('open');
    };
    list.appendChild(el);
  }
}

// ============ ZOOM ============
$('zoomIn').onclick = () => setScale(state.scale + 0.25);
$('zoomOut').onclick = () => setScale(state.scale - 0.25);

async function setScale(newScale) { await zoomAtPoint(newScale, null, null); }

async function zoomAtPoint(newScale, clientX, clientY) {
  newScale = Math.max(0.4, Math.min(4, +newScale.toFixed(3)));
  if (Math.abs(newScale - state.scale) < 0.001) return;
  const scroll = $('pagesScroll');
  const scrollRect = scroll.getBoundingClientRect();
  if (clientX == null) clientX = scrollRect.left + scrollRect.width / 2;
  if (clientY == null) clientY = scrollRect.top + scrollRect.height / 2;
  const anchorX = scroll.scrollLeft + (clientX - scrollRect.left);
  const anchorY = scroll.scrollTop + (clientY - scrollRect.top);
  const oldScale = state.scale;
  state.scale = newScale;
  state.renderedPages.clear();
  await renderReader();
  const ratio = newScale / oldScale;
  scroll.scrollLeft = anchorX * ratio - (clientX - scrollRect.left);
  scroll.scrollTop = anchorY * ratio - (clientY - scrollRect.top);
}

function findTopPage() {
  const scroll = $('pagesScroll');
  const rect = scroll.getBoundingClientRect();
  let best = null, bestDist = Infinity;
  for (const el of scroll.querySelectorAll('.page-wrap')) {
    const d = Math.abs(el.getBoundingClientRect().top - rect.top);
    if (d < bestDist) { bestDist = d; best = +el.dataset.page; }
  }
  return best;
}
function updatePageIndicator() {
  const scroll = $('pagesScroll');
  const update = () => {
    const p = findTopPage();
    if (p) $('pageIndicator').textContent = 'Page ' + p + ' of ' + state.pdfDoc.numPages;
    updateActiveThumb();
  };
  scroll.onscroll = update;
  update();
}

// ============ EXPORT / IMPORT ============
$('exportBtn').onclick = () => exportAnnotations(state.pdfId);
$('importJsonBtn').onclick = () => $('jsonInput').click();
$('jsonInput').onchange = async e => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!data.pdf || !data.annotations) throw new Error('Invalid');
    if (!await db.pdfs.get(data.pdf.id)) { toast('PDF not in library — import it first'); return; }
    let added = 0;
    for (const a of data.annotations) {
      if (!await db.annotations.get(a.id)) {
        await db.annotations.add(Object.assign({}, a, { pdfId: data.pdf.id }));
        added++;
      }
    }
    toast('Imported ' + added + ' annotations');
    refreshLibrary();
  } catch (err) { console.error(err); toast('Import failed'); }
};

async function exportAnnotations(pdfId) {
  const pdf = await db.pdfs.get(pdfId);
  const annotations = await db.annotations.where('pdfId').equals(pdfId).toArray();
  const payload = {
    version: 1, exportedAt: new Date().toISOString(),
    pdf: { id: pdf.id, name: pdf.name, pageCount: pdf.pageCount },
    annotations
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = pdf.name.replace(/\.pdf$/i, '') + '.annotations.json';
  a.click();
  URL.revokeObjectURL(url);
  toast('Exported');
}

// ============ HELP ============
$('helpBtn').onclick = () => {
  const el = $('helpOverlay');
  el.className = 'help';
  el.innerHTML =
    '<div style="background:var(--panel);border-radius:16px;padding:26px;max-width:480px;width:100%;box-shadow:var(--shadow);max-height:90vh;overflow:auto">' +
      '<h3 style="margin:0 0 16px;font-size:17px;font-weight:600">Keyboard Shortcuts</h3>' +
      '<table style="width:100%;border-collapse:collapse;font-size:14px">' +
        '<tr><td style="padding:8px 0;color:var(--muted);width:170px">Save PDF</td><td><kbd>Ctrl</kbd>+<kbd>S</kbd></td></tr>' +
        '<tr><td style="padding:8px 0;color:var(--muted)">Highlight</td><td>Select text → click a color</td></tr>' +
        '<tr><td style="padding:8px 0;color:var(--muted)">Comment</td><td>Select text → click <strong>Comment</strong></td></tr>' +
        '<tr><td style="padding:8px 0;color:var(--muted)">Explain (AI)</td><td>Select text → click <strong>Explain</strong></td></tr>' +
        '<tr><td style="padding:8px 0;color:var(--muted)">Draw</td><td><kbd>D</kbd></td></tr>' +
        '<tr><td style="padding:8px 0;color:var(--muted)">Erase</td><td><kbd>E</kbd> — hold &amp; drag over a stroke</td></tr>' +
        '<tr><td style="padding:8px 0;color:var(--muted)">Two-page view</td><td><kbd>T</kbd></td></tr>' +
        '<tr><td style="padding:8px 0;color:var(--muted)">Page thumbnails</td><td><kbd>P</kbd></td></tr>' +
        '<tr><td style="padding:8px 0;color:var(--muted)">Reading mode</td><td><kbd>R</kbd></td></tr>' +
        '<tr><td style="padding:8px 0;color:var(--muted)">AI panel</td><td><kbd>A</kbd></td></tr>' +
        '<tr><td style="padding:8px 0;color:var(--muted)">Offline AI model</td><td>AI panel &rarr; Download &amp; Load</td></tr>' +
        '<tr><td style="padding:8px 0;color:var(--muted)">Undo / Redo</td><td><kbd>Ctrl</kbd>+<kbd>Z</kbd> / <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd></td></tr>' +
        '<tr><td style="padding:8px 0;color:var(--muted)">Zoom</td><td><kbd>Ctrl</kbd> + mouse wheel</td></tr>' +
        '<tr><td style="padding:8px 0;color:var(--muted)">Zoom in / out</td><td><kbd>Ctrl</kbd>+<kbd>+</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd></td></tr>' +
        '<tr><td style="padding:8px 0;color:var(--muted)">Reset zoom</td><td><kbd>Ctrl</kbd>+<kbd>0</kbd></td></tr>' +
        '<tr><td style="padding:8px 0;color:var(--muted)">Cancel</td><td><kbd>Esc</kbd></td></tr>' +
      '</table>' +
      '<div style="margin-top:18px;text-align:right">' +
        '<button class="primary-btn" id="helpClose">Got it</button>' +
      '</div>' +
    '</div>';
  el.hidden = false;
  el.querySelector('#helpClose').onclick = () => { el.hidden = true; el.innerHTML = ''; };
  el.onclick = e => { if (e.target === el) { el.hidden = true; el.innerHTML = ''; } };
};

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !$('helpOverlay').hidden) {
    const el = $('helpOverlay');
    el.hidden = true;
    el.innerHTML = '';
  }
});

// ============ AI (offline WebLLM) ============
async function getPageText(n) {
  if (!state.pdfDoc) return '';
  try {
    const p = await state.pdfDoc.getPage(n);
    const tc = await p.getTextContent();
    return tc.items.map(it => it.str).join(' ').replace(/\s+/g, ' ').trim();
  } catch (e) { return ''; }
}
async function getDocText(maxPages) {
  if (!state.pdfDoc) return '';
  const total = Math.min(state.pdfDoc.numPages, maxPages || 20);
  let out = '';
  for (let i = 1; i <= total; i++) {
    const t = await getPageText(i);
    if (t) out += '--- Page ' + i + ' ---\n' + t + '\n\n';
  }
  return out.slice(0, 8000);
}

function textHash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h.toString(36);
}
function cacheKey(kind, page, text) {
  const cfg = getApiConfig();
  const id = (cfg && cfg.model) ? cfg.model : (aiEngineModel || 'no-model');
  return state.pdfId + ':' + id + ':' + kind + ':' + page + ':' + textHash(text);
}

// ---- Custom OpenAI-compatible API ----
// Keys live in localStorage only ('api-key'): never logged, never written to IndexedDB.
function redactSecrets(s) {
  return String(s == null ? '' : s)
    .replace(/sk-[A-Za-z0-9_-]+/g, '[redacted]')
    .replace(/Bearer \S+/g, '[redacted]');
}
function safeError(e) {
  const msg = (e && e.message) || String(e);
  console.error('[AI]', redactSecrets(msg));
  return redactSecrets(msg);
}

// ---- Debug logger + panel progress bar ----
const AI_LOG_COLORS = { info: 'var(--muted)', success: '#16a34a', warn: '#f59e0b', error: 'var(--danger)' };
const aiSessionStart = Date.now();
function aiLog(level, msg) {
  const body = $('aiLoggerBody');
  if (!body) return;
  const s = Math.max(0, Math.floor((Date.now() - aiSessionStart) / 1000));
  const line = document.createElement('div');
  line.className = 'ai-log-line-' + (AI_LOG_COLORS[level] ? level : 'info');
  line.style.color = AI_LOG_COLORS[level] || AI_LOG_COLORS.info;
  line.textContent = '[' + String(Math.floor(s / 60)).padStart(2, '0') + ':' +
    String(s % 60).padStart(2, '0') + '] ' + msg;
  body.appendChild(line);
  while (body.children.length > 200) body.removeChild(body.firstChild);
  body.scrollTop = body.scrollHeight;
}
function setAiProgress(mode, percent) {
  const bar = $('aiProgressBar');
  if (!bar) return;
  const fill = bar.querySelector('.ai-progress-fill');
  bar.hidden = mode === 'hide';
  if (mode === 'hide') return;
  if (mode === 'indeterminate') {
    fill.classList.add('indeterminate');
    fill.style.width = '';
    return;
  }
  fill.classList.remove('indeterminate');
  fill.style.width = (Number(percent) || 0) + '%';
}
$('aiBugBtn').onclick = () => {
  const log = $('aiLogger');
  log.hidden = !log.hidden;
  $('aiBugBtn').classList.toggle('active', !log.hidden);
  if (!log.hidden) $('aiLoggerBody').scrollTop = $('aiLoggerBody').scrollHeight;
};
$('aiLoggerClear').onclick = () => { $('aiLoggerBody').innerHTML = ''; };
function getApiConfig() {
  let raw = null;
  try { raw = localStorage.getItem('api-config'); } catch (e) { return null; }
  if (!raw) return null;
  try {
    const cfg = JSON.parse(raw);
    return (cfg && typeof cfg === 'object') ? cfg : null;
  } catch (e) { return null; }
}

// Single entry point for every AI feature. The composer's agent picker decides the route;
// a custom provider that is configured but not picked by name still wins over WebLLM so
// setups from before the picker existed keep working.
async function aiCall(prompt, opts) {
  opts = opts || {};
  const agent = AI_AGENTS.find(a => a.id === activeModelId) || AI_AGENTS[2];
  aiLog('info', 'Routing → ' + (agent ? agent.label : activeModelId));
  if (agent.kind === 'custom') {
    // River agent endpoints come from the preset (it includes the CORS proxy in front of
    // api.river.ai); the saved config may still point at OpenAI or another provider.
    return callCustomAPI(prompt, withRiverTransport({ ...API_PRESETS.river, ...(getApiConfig() || {}), model: agent.model }));
  }
  if (agent.kind === 'webllm') return callAI(prompt);
  const cfg = getApiConfig();
  if (cfg && cfg.baseURL && cfg.model) return callCustomAPI(prompt, withRiverTransport(cfg));
  if (aiEngineModel) return callAI(prompt);
  throw new Error('No AI provider configured. Open the AI panel settings and add a provider, or load an offline model.');
}

// proxy.js relays POSTs to api.river.ai, so it is reached as <origin>/v1 with no key. It only
// helps when the page is served by the proxy (http://localhost:3001); on any other origin —
// a GitHub Pages deploy, say — that URL is a different machine and every request fails with
// "Failed to fetch".
function isRiverProxyBase(baseURL) {
  return /^https?:\/\/localhost:3001\/v1\/?$/.test(String(baseURL || ''));
}

function riverTransport() {
  const here = location.protocol + '//' + location.host;
  if (!/^https?:$/.test(location.protocol) || isRiverProxyBase(here + '/v1')) return 'proxy';
  const key = getApiKey();
  return key ? 'direct' : 'unavailable';
}

// River is a private endpoint, so the proxy is preferred; without it, only a user-supplied key
// can reach the provider. Returns the config unchanged for every other provider.
function withRiverTransport(cfg) {
  if (!isRiverProxyBase(cfg.baseURL)) return cfg;
  const transport = riverTransport();
  if (transport === 'proxy') return cfg;
  if (transport === 'direct') return { ...cfg, baseURL: 'https://api.river.ai/v1' };
  throw new Error('River.ai needs the local proxy (run node proxy.js and open http://localhost:3001) or a River API key — add one in AI settings, or pick another provider');
}

async function callPuter(prompt) {
  const agent = AI_AGENTS.find(a => a.id === 'puter-gemini');
  aiLog('info', 'Puter → ' + (agent ? agent.model : 'puter-gemini'));
  setAiProgress('indeterminate');
  // Puter.js is not loaded by this app, so there is no keyless cloud transport yet.
  const err = new Error('Puter Gemini is not available — add a River API key in Settings or pick a Local model');
  setAiProgress('hide');
  aiLog('error', err.message.slice(0, 200));
  throw err;
}

async function callCustomAPI(prompt, cfg) {
  let key = '';
  try { key = localStorage.getItem('api-key') || ''; } catch (e) {}
  const headers = { 'Content-Type': 'application/json' };
  if (key) headers['Authorization'] = 'Bearer ' + key;
  const baseURL = cfg.baseURL.replace(/\/$/, '');
  aiLog('info', 'POST ' + baseURL + ' · model=' + cfg.model);
  setAiProgress('indeterminate');
  const started = Date.now();
  let resp;
  try {
    // baseURL is absolute, so this is a cross-origin request. targetAddressSpace lets Chrome's
    // Local Network Access check treat the local proxy as a local destination instead of
    // blocking a public-origin page from reaching loopback (which surfaces as "Failed to fetch").
    const request = {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: cfg.model || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: cfg.temperature != null ? cfg.temperature : 0.3,
        max_tokens: cfg.maxTokens != null ? cfg.maxTokens : 1024
      })
    };
    try {
      resp = await fetch(baseURL + '/chat/completions', { ...request, targetAddressSpace: 'local' });
    } catch (localErr) {
      // Only browsers that reject the option at all (older Safari/Firefox) land here.
      if (!/targetAddressSpace|Unknown option|dictionary/i.test(String(localErr && localErr.message))) throw localErr;
      resp = await fetch(baseURL + '/chat/completions', request);
    }
  } catch (netErr) {
    setAiProgress('hide');
    aiLog('error', String(netErr.message).slice(0, 200));
    throw new Error('Network error: ' + netErr.message + ' (check base URL and CORS)');
  }
  aiLog(resp.ok ? 'success' : 'error', 'HTTP ' + resp.status + ' in ' + (Date.now() - started) + 'ms');
  if (!resp.ok) {
    setAiProgress('hide');
    const body = await resp.text().catch(() => '');
    throw new Error('HTTP ' + resp.status + ': ' + redactSecrets(body).slice(0, 200));
  }
  let data;
  try {
    data = await resp.json();
  } catch (parseErr) {
    setAiProgress('hide');
    aiLog('error', String(parseErr.message).slice(0, 200));
    throw parseErr;
  }
  const text = data && data.choices && data.choices[0] && data.choices[0].message
    ? data.choices[0].message.content : null;
  if (!text) { setAiProgress('hide'); throw new Error('Empty response from provider'); }
  aiLog('success', 'Received ' + text.length + ' chars');
  setAiProgress('hide');
  return text;
}

// Wrapper for the non-streaming features: keeps their onStart/onDone/onError shape.
async function aiCallWith(prompt, out, label, done) {
  out.textContent = label;
  const result = await aiCall(prompt).catch(e => {
    aiLog('error', String((e && e.message) || e).slice(0, 200));
    out.textContent = 'Error: ' + safeError(e);
    return null;
  });
  if (result) (done || (t => out.textContent = t))(result);
  return result;
}
async function getCached(key) {
  const row = await aiDb.cache.get(key);
  return row ? row.output : null;
}
async function setCached(key, kind, page, output) {
  await aiDb.cache.put({ key, pdfId: state.pdfId, kind, page, createdAt: Date.now(), output });
}

// Offline, in-browser inference via WebLLM (WebGPU). Weights are downloaded once
// from the model CDN, cached by the browser, and afterwards run fully offline.
const WEBLLM_CDN = 'https://esm.run/@mlc-ai/web-llm@0.2.86';
const MODEL_LIB_PREFIX = 'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_86/base/';

// Only these two models are offered, and both are registered explicitly so the app does
// not depend on WebLLM's built-in list (which still leaves the DeepSeek 1.5B entry out).
// Both wasm runtimes below were verified to exist (HTTP 200) in the v0_2_86 base folder.
const AI_MODELS = [
  {
    id: 'SmolLM2-360M-Instruct-q4f16_1-MLC',
    label: 'SmolLM2 360M Instruct - ~200 MB, fastest',
    note: 'Smallest option, best on low-end machines.',
    record: {
      model: 'https://huggingface.co/mlc-ai/SmolLM2-360M-Instruct-q4f16_1-MLC',
      model_id: 'SmolLM2-360M-Instruct-q4f16_1-MLC',
      model_lib: MODEL_LIB_PREFIX + 'SmolLM2-360M-Instruct-q4f16_1_cs1k-webgpu.wasm',
      vram_required_MB: 376.06,
      low_resource_required: true,
      required_features: ['shader-f16'],
      overrides: { context_window_size: 4096 }
    }
  },
  {
    id: 'DeepSeek-R1-Distill-Qwen-1.5B-q4f16_1-MLC',
    label: 'DeepSeek-R1 Distill Qwen 1.5B - ~1 GB, best answers',
    note: 'Reasoning model with step-by-step thinking (may be slow). Upstream marks this build experimental.',
    record: {
      model: 'https://huggingface.co/mlc-ai/DeepSeek-R1-Distill-Qwen-1.5B-q4f16_1-MLC',
      model_id: 'DeepSeek-R1-Distill-Qwen-1.5B-q4f16_1-MLC',
      model_lib: MODEL_LIB_PREFIX + 'Qwen2-1.5B-Instruct-q4f16_1_cs1k-webgpu.wasm',
      vram_required_MB: 1629.75,
      low_resource_required: true,
      overrides: { context_window_size: 4096 }
    }
  }
];

let webllm = null;            // lazily-imported ESM module namespace
let aiEngine = null;          // MLCEngine instance
let aiEngineModel = null;     // id of the model currently loaded and usable
let aiModelId = null;         // id of the model the user has downloaded (survives device loss)
let aiLoadState = 'idle';     // idle | loading | paused | ready
let aiLoadToken = 0;          // bumped on Stop to invalidate the in-flight load
let aiPaused = false;         // true while the user has paused the download
let aiPendingLoad = null;     // settles when the in-flight engine.reload() finishes
let aiProgressSink = null;    // progress callback of the current download
let aiLastReport = null;      // most recent InitProgressReport
let aiDownloadDone = false;   // true once the weights are on disk (GPU init follows)
let aiLogPct = -1;            // last whole-10% milestone written to the debug log

function webgpuSupported() {
  return typeof navigator !== 'undefined' && !!navigator.gpu;
}

async function loadWebLLM() {
  if (!webllm) webllm = await import(WEBLLM_CDN);
  return webllm;
}

// Merge our two explicit model records with WebLLM's built-in list (ours win, so our
// versions of the two records always match the wasm libs this app pins).
function buildAppConfig(mod) {
  const mine = AI_MODELS.map(m => m.record.model_id);
  const base = (mod.prebuiltAppConfig.model_list || []).filter(r => mine.indexOf(r.model_id) === -1);
  return {
    model_list: AI_MODELS.map(m => m.record).concat(base),
    cacheBackend: mod.prebuiltAppConfig.cacheBackend || 'cache'
  };
}

// DeepSeek-R1 style models emit chain-of-thought inside  thinking...</think> and then the
// actual answer. Keep only the part after the last </think> tag.
function stripThink(text) {
  if (!text) return '';
  const i = text.lastIndexOf('</think>');
  if (i >= 0) return text.slice(i + 8).replace(/^[\s:]+/, '');
  return text.replace(/<\/?think>/g, '');
}

// ---- Real pause / stop for model downloads ----
// WebLLM's reload() runs inside an AbortController kept on `engine.reloadController`,
// passes its signal to every artifact fetch, and then swallows the resulting AbortError
// (it logs "Reload() is aborted." and returns). So aborting that controller stops the
// transfer without throwing. Its artifact cache only commits a file after the whole
// response has arrived, so an aborted download never leaves a truncated file behind -
// resuming re-fetches just the unfinished files.
function abortActiveDownload() {
  const ctrl = aiEngine && aiEngine.reloadController;
  if (ctrl && typeof ctrl.abort === 'function') { try { ctrl.abort(); } catch (e) {} }
}
// Throw the engine away completely. WebLLM's unload() clears its loaded-pipeline/chatConfig/
// modelType/lock maps and disposes the GPU device, and reload() will not unload a previous
// model for us, so an engine left over from an aborted load or a lost device can never be
// reused. The next load must build a fresh engine (which is what gets a fresh device).
async function unloadEngine() {
  const eng = aiEngine;
  aiEngine = null;
  aiEngineModel = null;
  if (!eng) return;
  try { await eng.unload(); } catch (e) {}
}
// Pause: cancel the transfer now, keep every finished file, and offer Resume.
function pauseDownload() {
  if (aiLoadState !== 'loading') return;
  aiPaused = true;                 // set first, so late progress reports are ignored
  aiLoadState = 'paused';
  abortActiveDownload();
  updateModelStatus();
  toast('Download paused');
}
// Stop: cancel and forget the attempt. Cached files are intentionally kept.
function stopDownload() {
  if (aiLoadState === 'idle') return;
  aiPaused = false;
  aiLoadState = 'idle';
  aiLoadToken++;                   // makes the in-flight load() collapse quietly
  aiEngineModel = null;
  aiProgressSink = null;
  aiLastReport = null;
  abortActiveDownload();
  $('aiModelProgress').hidden = true;
  $('aiModelBarFill').style.width = '0%';
  updateModelStatus();
  setModelStatus('Stopped. Files already downloaded stay cached, so restarting is faster.');
  toast('Download stopped');
}

function requireModel() {
  if (!webgpuSupported()) {
    toast('WebGPU is not available in this browser. Use Chrome/Edge 113+, Safari 18+ or another WebGPU browser.');
    return false;
  }
  if (!aiEngineModel && !aiModelId) {
    openAIPanel();
    toast(aiLoadState === 'paused'
      ? 'Model download is paused - click Resume to continue'
      : 'Load an offline model first (AI panel, "Download & Load")');
    return false;
  }
  return true;
}

// Build a fresh engine. A new engine also means a new WebGPU device, which is what is needed
// after a device loss: unload() disposes the device and an existing engine never gets it back.
function createEngine(mod, token) {
  return new mod.MLCEngine({
    appConfig: buildAppConfig(mod),
    initProgressCallback: (p) => {
      if (p && p.progress >= 1) aiDownloadDone = true;
      if (aiPaused || token !== aiLoadToken) return;
      aiLastReport = p;
      const pct = Math.round(((p && p.progress) || 0) * 100);
      if (pct % 10 === 0 && pct !== aiLogPct) {
        aiLogPct = pct;
        aiLog('info', 'Model load ' + pct + '%');
        setAiProgress('determinate', pct);
      }
      if (aiProgressSink) aiProgressSink(p);
    }
  });
}

// Kick off (or resume) loading a model. Resolves to true once the model is usable.
async function loadModel(modelId, cb) {
  cb = cb || {};
  if (!webgpuSupported()) {
    cb.onError && cb.onError('WebGPU is not available in this browser.');
    return false;
  }
  // Already loaded? Confirm a real pipeline still exists (getMessage throws ModelNotLoadedError
  // when the loaded-pipeline map is empty, e.g. after a GPU device loss), otherwise reload.
  if (aiEngine && aiEngineModel === modelId) {
    try { await aiEngine.getMessage(modelId); return true; } catch (e) { /* fall through and reload */ }
  }
  // Never run two loads at once: wait out any load we detached from earlier.
  if (aiPendingLoad) { try { await aiPendingLoad; } catch (e) {} }
  const token = ++aiLoadToken;
  const loadStart = Date.now();
  aiLogPct = -1;
  aiPaused = false;
  aiDownloadDone = false;
  aiEngineModel = null;                            // reload() unloads whatever was there
  aiProgressSink = cb.onProgress || null;
  try {
    const mod = await loadWebLLM();
    if (token !== aiLoadToken) return false;   // Stop pressed while importing
    // Always start from a fresh engine (new device); never reuse the previous one.
    await unloadEngine();
    aiEngine = createEngine(mod, token);
    const load = aiEngine.reload(modelId);
    aiPendingLoad = load.catch(() => {});
    await load;
    aiPendingLoad = null;
  } catch (err) {
    aiPendingLoad = null;
    // Stop bumps the token; pause sets aiPaused. Either way, collapse quietly so a
    // deliberate cancel never surfaces a scary error (reload() may reject with AbortError).
    if (aiPaused || token !== aiLoadToken) return false;
    console.error('[WebLLM]', err);
    setAiProgress('hide');
    aiLog('error', String((err && err.message) || err).slice(0, 200));
    await unloadEngine();       // drop the dead engine so the next load builds a fresh one
    aiProgressSink = null;
    const m = (err && err.message) || 'Failed to load model';
    cb.onError && cb.onError(/DEVICE_REMOVED|requestDevice|command queue|device lost/i.test(m)
      ? 'The GPU device was lost (likely out of GPU memory), so the download could not start. Reload the tab, then load one model and keep it loaded. Details: ' + m
      : m);
    return false;
  }
  aiProgressSink = null;
  // reload() swallows AbortError, so a pause/stop lands here rather than in catch().
  if (aiPaused || token !== aiLoadToken) {
    setAiProgress('hide');
    // Off an aborted reload() the engine's id->chatConfig/modelType maps stay populated
    // while the pipeline/lock maps do not, so discard the engine before the next attempt.
    await unloadEngine();
    return false;
  }
  // reload() also resolves when it aborted itself, so confirm a pipeline really exists before
  // declaring the model usable (getModelStates throws ModelNotLoadedError if it does not).
  // A poisoned engine (aborted load, or a lost WebGPU device) silently no-ops reload(), so on
  // failure the engine is thrown away and the load retried once on a brand-new engine/device.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      await aiEngine.getMessage(modelId);
      aiEngineModel = modelId;
      aiModelId = modelId;      // remember it so a later device loss can be healed from cache
      setAiProgress('hide');
      aiLog('success', 'Model ready in ' + (Date.now() - loadStart) + 'ms');
      return true;
    } catch (err) {
      console.warn('[WebLLM] no pipeline registered after reload()', err);
      await unloadEngine();
      if (attempt === 0) {
        try {
          const mod = await loadWebLLM();
          aiLogPct = -1;
          aiEngine = createEngine(mod, token);
          await aiEngine.reload(modelId);
          continue;
        } catch (e2) {
          console.error('[WebLLM]', e2);
          setAiProgress('hide');
          aiLog('error', String((e2 && e2.message) || e2).slice(0, 200));
          aiEngine = null;
          cb.onError && cb.onError((e2 && e2.message) || 'Model did not finish loading');
          return false;
        }
      }
      setAiProgress('hide');
      aiLog('error', String((err && err.message) || err).slice(0, 200));
      cb.onError && cb.onError('Model did not finish loading: ' + ((err && err.message) || err));
      return false;
    }
  }
  return false;
}

async function callAI(prompt, cb) {
  cb = cb || {};
  if (!webgpuSupported()) { cb.onError && cb.onError('WebGPU not available in this browser'); return null; }
  // The engine's loaded-pipeline map can go empty after a GPU device loss (WebLLM auto-unloads),
  // which makes chat throw ModelNotLoadedError. Probe the real pipeline and reload from cache if
  // it is gone, instead of trusting the aiEngineModel flag.
  let ready = false;
  try { if (aiEngine && aiEngineModel) { await aiEngine.getMessage(aiEngineModel); ready = true; } }
  catch (e) { ready = false; }
  if (!ready) {
    // After a device loss WebLLM auto-unloads and empties its pipeline map, so the whole
    // engine must be discarded (a new engine gets a new device) and the model reloaded
    // from the browser cache before we can chat with it.
    await unloadEngine();
    if (!aiModelId) { cb.onError && cb.onError('No offline model loaded'); return null; }
    if (!(await loadModel(aiModelId, { onError: cb.onError }))) return null;
  }
  if (!aiEngine) { cb.onError && cb.onError('Model is still loading - please wait'); return null; }
  cb.onStart && cb.onStart();
  aiLog('info', 'WebLLM → engine.chat');
  setAiProgress('indeterminate');
  let full = '';
  try {
    const chunks = await aiEngine.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: aiEngineModel,
      temperature: 0.6,
      max_tokens: 768,
      stream: true
    });
    for await (const chunk of chunks) {
      const delta = (chunk.choices && chunk.choices[0] &&
                     chunk.choices[0].delta && chunk.choices[0].delta.content) || '';
      if (!delta) continue;
      full += delta;
      cb.onChunk && cb.onChunk(stripThink(full));
    }
    const text = stripThink(full) || full || '(no answer)';
    setAiProgress('hide');
    aiLog('success', 'WebLLM replied (' + text.length + ' chars)');
    cb.onDone && cb.onDone(text);
    return text;
  } catch (err) {
    setAiProgress('hide');
    aiLog('error', String((err && err.message) || err).slice(0, 200));
    console.error('[AI]', err);
    cb.onError && cb.onError((err && err.message) || 'AI request failed');
    return null;
  }
}

const AI_PROMPTS = {
  explain: (t) =>
    'You are a patient tutor helping a student prepare for government competitive exams. ' +
    'Explain the following text in simple, plain language. Add one short example if helpful. ' +
    'Keep it under 150 words. No headings.\n\nText:\n' + t,
  summarizePage: (t) =>
    'Summarize this page for a student preparing for competitive government exams. ' +
    'Give 5-8 bullet points of the most exam-relevant facts. Skip filler, avoid repeating the page title. ' +
    'Start each bullet with "- ".\n\nPage text:\n' + t,
  summarizeDoc: (t) =>
    'Summarize this document for a student preparing for competitive government exams. ' +
    'Give a 1-paragraph overview, then 8-12 bullet points of the most exam-relevant facts. ' +
    'Skip filler. Focus on facts, definitions, dates, and frameworks.\n\nDocument:\n' + t,
  flashcards: (t) =>
    'Create exactly 5 flashcards from this text for spaced-repetition study. ' +
    'One pair per line, in the form:\nQ: <short question>\nA: <short answer under 20 words>\n' +
    'Focus on facts, definitions, dates, formulas, and cause-effect. No numbering, no intro text.\n\nText:\n' + t,
  mcq: (t) =>
    'Create exactly 3 multiple-choice questions from this text for a government job exam. Format:\n\n' +
    'Q1. <question>\nA) <option>\nB) <option>\nC) <option>\nD) <option>\nAnswer: <A/B/C/D>\nWhy: <one-line explanation>\n\n' +
    'Separate questions with a blank line. No intro text.\n\nText:\n' + t
};

function openAIPanel(tab) {
  $('aiPanel').hidden = false;
  $('aiBtn').classList.add('active');
  switchAITab(tab || 'chat');
}
function closeAIPanel() {
  $('aiPanel').hidden = true;
  $('aiBtn').classList.remove('active');
}
function toggleAIPanel() {
  if ($('aiPanel').hidden) openAIPanel();
  else closeAIPanel();
}
function switchAITab(tab) {
  document.querySelectorAll('.ai-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  $('aiChatBody').hidden = tab !== 'chat';
  $('aiSummaryBody').hidden = tab !== 'summary';
  $('aiCardsBody').hidden = tab !== 'cards';
  if (tab === 'chat') setTimeout(() => $('aiInput').focus(), 50);
}
$('aiBtn').onclick = toggleAIPanel;
$('aiCloseBtn').onclick = closeAIPanel;
document.querySelectorAll('.ai-tab').forEach(t => t.onclick = () => switchAITab(t.dataset.tab));

// ---- Offline model picker (download / pause / resume / stop) ----
function setModelStatus(msg, cls) {
  const el = $('aiModelStatus');
  el.textContent = msg;
  el.className = 'ai-model-status' + (cls ? ' ' + cls : '');
}
function pctOf(p) {
  const v = p && typeof p.progress === 'number' ? p.progress : 0;
  return Math.max(0, Math.min(100, Math.round(v * 100)));
}
function renderProgress(p) {
  const pct = pctOf(p);
  $('aiModelProgress').hidden = false;
  $('aiModelBarFill').style.width = pct + '%';
  setModelStatus(((p && p.text) ? p.text + ' - ' : '') + pct + '%');
}
// state: 'idle' | 'loading' | 'paused'
function showDownloadButtons(state) {
  $('aiModelControls').hidden = state === 'idle';
  $('aiModelBtn').hidden = state !== 'idle';
  $('aiModelPauseBtn').hidden = state !== 'loading';
  $('aiModelResumeBtn').hidden = state !== 'paused';
  $('aiModelSelect').disabled = state !== 'idle';
}
function updateModelStatus() {
  const sel = $('aiModelSelect');
  if (!webgpuSupported()) {
    setModelStatus('WebGPU is unavailable in this browser, so offline AI is disabled.', 'error');
    showDownloadButtons('idle');
  } else if (aiEngineModel && aiEngineModel === sel.value) {
    setModelStatus('Model loaded - running fully offline.', 'ready');
    showDownloadButtons('idle');
  } else if (aiEngineModel) {
    setModelStatus('Loaded: ' + aiEngineModel + '. Pick another model and click Download & Load to switch.');
    showDownloadButtons('idle');
  } else if (aiLoadState === 'paused') {
    setModelStatus('Paused' + (aiLastReport ? ' at ' + pctOf(aiLastReport) + '%' : '') +
      '. Files that finished downloading are kept - click Resume to continue.');
    showDownloadButtons('paused');
  } else if (aiLoadState === 'loading') {
    showDownloadButtons('loading');
  } else {
    const m = AI_MODELS.filter(x => x.id === sel.value)[0];
    setModelStatus((m && m.note ? m.note + ' ' : '') +
      'Click Download & Load. Weights download once (needs internet); afterwards it runs offline.');
    showDownloadButtons('idle');
  }
}
function initModelPicker() {
  const sel = $('aiModelSelect');
  sel.innerHTML = '';
  for (const m of AI_MODELS) {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = m.label;
    sel.appendChild(opt);
  }
  let saved = null;
  try { saved = localStorage.getItem('aiModel'); } catch (e) {}
  if (saved && AI_MODELS.some(m => m.id === saved)) sel.value = saved;
  updateModelStatus();
}
$('aiModelSelect').onchange = () => {
  try { localStorage.setItem('aiModel', $('aiModelSelect').value); } catch (e) {}
  updateModelStatus();
};

async function startDownload() {
  const modelId = $('aiModelSelect').value;
  if (!webgpuSupported()) { toast('WebGPU not available in this browser'); updateModelStatus(); return; }
  aiPaused = false;
  aiLoadState = 'loading';
  showDownloadButtons('loading');
  $('aiModelProgress').hidden = false;
  $('aiModelBarFill').style.width = '0%';
  setModelStatus('Preparing model runtime...');
  const ok = await loadModel(modelId, {
    onProgress: (p) => { if (p) renderProgress(p); },
    onError: (m) => {
      aiLoadState = 'idle';
      showDownloadButtons('idle');
      setModelStatus('Error: ' + m, 'error');
    }
  });
  if (ok) {
    aiLoadState = 'ready';
    $('aiModelBarFill').style.width = '100%';
    try { localStorage.setItem('aiModel', modelId); } catch (e) {}
    showDownloadButtons('idle');
    setModelStatus('Model loaded - running fully offline.', 'ready');
    setTimeout(() => { $('aiModelProgress').hidden = true; $('aiModelBarFill').style.width = '0%'; }, 700);
    toast('Model ready: ' + modelId);
  } else if (aiLoadState === 'paused') {
    updateModelStatus();
  }
}
$('aiModelBtn').onclick = startDownload;

$('aiModelPauseBtn').onclick = pauseDownload;

$('aiModelResumeBtn').onclick = () => startDownload();

$('aiModelStopBtn').onclick = stopDownload;

// ---- Custom API settings modal ----
const API_PRESETS = {
  river:      { baseURL: 'http://localhost:3001/v1',                      model: 'deepseek-ai/DeepSeek-V4-Flash-0731',        needsKey: true },
  openai:     { baseURL: 'https://api.openai.com/v1',                      model: 'gpt-4o-mini',                              needsKey: true },
  groq:       { baseURL: 'https://api.groq.com/openai/v1',                 model: 'llama-3.3-70b-versatile',                   needsKey: true },
  openrouter: { baseURL: 'https://openrouter.ai/api/v1',                   model: 'google/gemini-2.0-flash-exp:free',          needsKey: true },
  together:   { baseURL: 'https://api.together.xyz/v1',                    model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',   needsKey: true },
  mistral:    { baseURL: 'https://api.mistral.ai/v1',                      model: 'mistral-small-latest',                      needsKey: true },
  ollama:     { baseURL: 'http://localhost:11434/v1',                      model: 'llama3.2',                                  needsKey: false },
  lmstudio:   { baseURL: 'http://localhost:1234/v1',                       model: '',                                          needsKey: false },
  custom:     { baseURL: '',                                               model: '',                                          needsKey: true }
};

function getApiKey() {
  try { return localStorage.getItem('api-key') || ''; } catch (e) { return ''; }
}

function applyPreset(id) {
  const p = API_PRESETS[id] || API_PRESETS.custom;
  $('apiBaseURL').value = p.baseURL;
  $('apiModel').value = p.model;
  $('apiKeyField').hidden = !p.needsKey;
  $('apiKeyNote').hidden = p.needsKey;
}

function showApiTest(msg, ok) {
  const el = $('apiTestResult');
  el.hidden = false;
  el.textContent = msg;
  el.className = 'api-test ' + (ok ? 'ok' : 'err');
}

function openApiModal() {
  let cfg = getApiConfig() || {};
  // First run: default to the Groq preset; afterwards we cannot tell which preset the
  // user saved, so show the stored values under Custom instead of guessing.
  let preset = 'custom';
  if (!cfg.baseURL && !cfg.model) {
    preset = 'groq';
    cfg = API_PRESETS.groq;
  } else {
    const match = Object.keys(API_PRESETS).find(k => API_PRESETS[k].baseURL && API_PRESETS[k].baseURL === cfg.baseURL);
    if (match) preset = match;
  }
  const p = API_PRESETS[preset];
  $('apiPreset').value = preset;
  $('apiBaseURL').value = cfg.baseURL || p.baseURL;
  $('apiModel').value = cfg.model || p.model;
  $('apiTemperature').value = cfg.temperature != null ? cfg.temperature : 0.3;
  $('apiMaxTokens').value = cfg.maxTokens != null ? cfg.maxTokens : 1024;
  $('apiKey').value = getApiKey();
  $('apiKey').type = 'password';
  $('apiKeyToggle').textContent = 'Show';
  $('apiKeyField').hidden = preset !== 'custom' && !p.needsKey;
  $('apiKeyNote').hidden = !$('apiKeyField').hidden;
  $('apiTestResult').hidden = true;
  $('apiModal').hidden = false;
  $('apiBaseURL').focus();
}

function closeApiModal() { $('apiModal').hidden = true; }

function readApiForm() {
  const temperature = parseFloat($('apiTemperature').value);
  const maxTokens = parseInt($('apiMaxTokens').value, 10);
  return {
    baseURL: $('apiBaseURL').value.trim().replace(/\/+$/, ''),
    model: $('apiModel').value.trim(),
    temperature: isNaN(temperature) ? 0.3 : Math.min(2, Math.max(0, temperature)),
    maxTokens: isNaN(maxTokens) ? 1024 : Math.min(8192, Math.max(64, maxTokens))
  };
}

async function testApiConnection() {
  const cfg = readApiForm();
  const btn = $('apiTestBtn');
  if (!cfg.baseURL || !cfg.model) return showApiTest('Enter a base URL and a model first.', false);
  if (!/^https?:\/\//.test(cfg.baseURL)) {
    return showApiTest('Base URL must start with http:// or https:// (e.g. http://localhost:3001/v1)', false);
  }
  btn.disabled = true;
  showApiTest('Testing…', true);
  let target;
  try {
    target = withRiverTransport(cfg);
  } catch (e) {
    btn.disabled = false;
    return showApiTest(e.message, false);
  }
  const key = $('apiKey').value.trim();
  const headers = { 'Content-Type': 'application/json' };
  if (key) headers['Authorization'] = 'Bearer ' + key;
  try {
    const resp = await fetch(target.baseURL + '/chat/completions', {
      method: 'POST',
      headers,
      targetAddressSpace: 'local',
      body: JSON.stringify({
        model: cfg.model,
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 5,
        temperature: 0
      })
    });
    if (resp.ok) showApiTest('✓ Connected', true);
    else {
      const body = await resp.text().catch(() => '');
      showApiTest('HTTP ' + resp.status + ': ' + (redactSecrets(body).slice(0, 200) || resp.statusText), false);
    }
  } catch (e) {
    const local = /localhost|127\.0\.0\.1/.test(cfg.baseURL);
    showApiTest(redactSecrets('Network error: ' + e.message +
      (local ? ' (is proxy.js running? open the app via http://localhost:3001)' : ' (check base URL and CORS)')), false);
  } finally {
    btn.disabled = false;
  }
}

function saveApiConfig() {
  const cfg = readApiForm();
  if (!cfg.baseURL || !cfg.model) return showApiTest('Enter a base URL and a model first.', false);
  try {
    localStorage.setItem('api-config', JSON.stringify(cfg));
    const key = $('apiKey').value.trim();
    if (key) localStorage.setItem('api-key', key);
    else if ($('apiKeyField').hidden) localStorage.removeItem('api-key');
  } catch (e) {
    toast('Could not save settings');
    return;
  }
  closeApiModal();
  toast('Saved');
}

function clearApiKey() {
  try { localStorage.removeItem('api-key'); } catch (e) {}
  $('apiKey').value = '';
  toast('Key cleared');
}

$('aiSettingsBtn').onclick = openApiModal;
$('apiPreset').onchange = (e) => applyPreset(e.target.value);
$('apiKeyToggle').onclick = () => {
  const input = $('apiKey');
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  $('apiKeyToggle').textContent = show ? 'Hide' : 'Show';
};
$('apiTestBtn').onclick = testApiConnection;
$('apiSaveBtn').onclick = saveApiConfig;
$('apiClearKey').onclick = clearApiKey;
$('apiModal').onclick = (e) => { if (e.target === $('apiModal')) closeApiModal(); };
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('apiModal').hidden) closeApiModal();
});

// ---- Model picker (composer) ----
const AI_AGENTS = [
  { group: 'Cloud', id: 'river-deepseek', label: 'River DeepSeek V4', sub: 'River.ai', kind: 'custom', model: 'deepseek-ai/DeepSeek-V4-Flash-0731' },
  { group: 'Cloud', id: 'river-glm', label: 'River GLM 5.3', sub: 'River.ai', kind: 'custom', model: 'zai-org/GLM-5.3-Flash' },
  { group: 'Cloud', id: 'puter-gemini', label: 'Puter Gemini', sub: 'Free, keyless', kind: 'puter', model: 'google/gemini-2.0-flash' }
];
for (const m of AI_MODELS) {
  AI_AGENTS.push({ group: 'Local', id: m.id, label: m.label.split(' - ')[0], sub: 'WebLLM', kind: 'webllm', model: null });
}

let activeModelId = 'puter-gemini';
try { activeModelId = localStorage.getItem('ai-active-model') || 'puter-gemini'; } catch (e) {}

// Step the WebLLM select through the normal Download & Load flow rather than loading here.
function setActiveModel(id) {
  const agent = AI_AGENTS.find(a => a.id === id);
  if (!agent) return;
  activeModelId = id;
  try { localStorage.setItem('ai-active-model', id); } catch (e) {}
  renderAgentLabel();
  renderAgentPopover();
  if (agent.kind === 'webllm' && aiEngineModel !== agent.model && typeof startDownload === 'function') {
    $('aiModelSelect').value = agent.model;
    startDownload();
  }
}

function renderAgentLabel() {
  const agent = AI_AGENTS.find(a => a.id === activeModelId) || AI_AGENTS[2];
  const text = agent.label.length > 16 ? agent.label.slice(0, 16) : agent.label;
  $('aiAgentLabel').textContent = text;
}

function renderAgentPopover() {
  const pop = $('aiModelPopover');
  pop.innerHTML = '';
  const groups = [];
  for (const agent of AI_AGENTS) {
    let g = groups.find(x => x.name === agent.group);
    if (!g) { g = { name: agent.group, items: [] }; groups.push(g); }
    g.items.push(agent);
  }
  for (const g of groups) {
    const head = document.createElement('div');
    head.className = 'ai-agent-group';
    head.textContent = g.name;
    pop.appendChild(head);
    for (const agent of g.items) {
      const row = document.createElement('div');
      row.className = 'ai-agent-row' + (agent.id === activeModelId ? ' active' : '');
      const txt = document.createElement('div');
      txt.className = 'ai-agent-text';
      const l1 = document.createElement('div');
      l1.className = 'ai-agent-label';
      l1.textContent = agent.label;
      const l2 = document.createElement('div');
      l2.className = 'ai-agent-sub';
      l2.textContent = agent.sub;
      txt.appendChild(l1);
      txt.appendChild(l2);
      const check = document.createElement('span');
      check.className = 'ai-agent-check';
      check.appendChild(makeIcon('check'));
      row.appendChild(txt);
      row.appendChild(check);
      row.onclick = () => { setActiveModel(agent.id); closeAgentPopover(); };
      pop.appendChild(row);
    }
  }
}

function closeAgentPopover() { $('aiModelPopover').hidden = true; }
$('aiAgentBtn').onclick = (e) => {
  e.stopPropagation();
  const pop = $('aiModelPopover');
  if (!pop.hidden) return closeAgentPopover();
  renderAgentPopover();
  pop.hidden = false;
};
document.addEventListener('click', (e) => {
  if (!$('aiModelPopover').hidden && !(e.target.closest && e.target.closest('.ai-model-pick'))) closeAgentPopover();
});
renderAgentLabel();

// ---- Per-PDF chat history ----
function renderWelcome() {
  const wrap = document.createElement('div');
  wrap.className = 'ai-msg-wrap';
  wrap.innerHTML =
    '<div class="ai-welcome">' +
      '<span class="ai-welcome-icon" data-icon="sparkles"></span>' +
      '<div class="ai-welcome-title">How can I help with this document?</div>' +
      '<div class="ai-welcome-sub">Ask about the current page, summarize, or generate study cards.</div>' +
    '</div>';
  $('aiMessages').innerHTML = '';
  $('aiMessages').appendChild(wrap);
}

async function saveChatRow(role, text) {
  if (!state.pdfId) return;
  if (!currentSessionId) newSession();
  try {
    await aiDb.chats.add({
      pdfId: state.pdfId,
      page: findTopPage() || 1,
      role, text,
      createdAt: Date.now(),
      sessionId: currentSessionId,
      model: activeModelId || 'puter-gemini'
    });
  } catch (e) {
    aiLog('error', 'Chat save failed: ' + String((e && e.message) || e).slice(0, 150));
  }
  refreshHistoryList();
}

async function refreshHistoryList() {
  const list = $('aiHistoryList');
  if (!list) return;
  list.innerHTML = '';
  if (!state.pdfId) { list.innerHTML = '<div class="ai-history-empty">No chats yet</div>'; return; }
  let rows = [];
  try { rows = await aiDb.chats.where('pdfId').equals(state.pdfId).toArray(); } catch (e) { rows = []; }
  const groups = [];
  for (const r of rows) {
    if (!r.sessionId) continue;
    let g = groups.find(x => x.sessionId === r.sessionId);
    if (!g) { g = { sessionId: r.sessionId, firstUserText: '', firstTimestamp: r.createdAt || 0 }; groups.push(g); }
    if (r.role === 'user' && !g.firstUserText) g.firstUserText = r.text || '';
    if (r.createdAt && r.createdAt < g.firstTimestamp) g.firstTimestamp = r.createdAt;
  }
  groups.sort((a, b) => b.firstTimestamp - a.firstTimestamp);
  if (!groups.length) { list.innerHTML = '<div class="ai-history-empty">No chats yet</div>'; return; }
  for (const g of groups.slice(0, 50)) {
    const row = document.createElement('div');
    row.className = 'ai-history-item' + (g.sessionId === currentSessionId ? ' active' : '');
    const title = g.firstUserText || '(empty)';
    const t = document.createElement('div');
    t.className = 'ai-history-title';
    t.textContent = title.length > 40 ? title.slice(0, 40) : title;
    const time = document.createElement('div');
    time.className = 'ai-history-time';
    time.textContent = formatDate(g.firstTimestamp || Date.now());
    row.appendChild(t);
    row.appendChild(time);
    row.onclick = () => loadSession(g.sessionId);
    list.appendChild(row);
  }
}

async function loadSession(sessionId) {
  let rows = [];
  try { rows = await aiDb.chats.where('sessionId').equals(sessionId).toArray(); } catch (e) { return; }
  rows.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  $('aiMessages').innerHTML = '';
  if (!rows.length) renderWelcome();
  for (const r of rows) {
    const role = r.role === 'assistant' ? 'bot' : r.role;
    appendChat(role === 'user' || role === 'bot' || role === 'error' ? role : 'bot', r.text || '');
  }
  currentSessionId = sessionId;
  refreshHistoryList();
  if (window.innerWidth < 640) closeHistoryDrawer();
}

function openHistoryDrawer() {
  $('aiHistoryDrawer').hidden = false;
  $('aiHistoryDrawer').classList.add('open');
  refreshHistoryList();
}
function closeHistoryDrawer() {
  const d = $('aiHistoryDrawer');
  d.classList.remove('open');
  setTimeout(() => { if (!d.classList.contains('open')) d.hidden = true; }, 200);
}

function startNewChat() {
  newSession();
  renderWelcome();
  closeHistoryDrawer();
  refreshHistoryList();
}

$('aiHistoryBtn').onclick = () => {
  if ($('aiHistoryDrawer').classList.contains('open')) closeHistoryDrawer();
  else openHistoryDrawer();
};
$('aiNewChatBtn').onclick = startNewChat;
$('aiHistoryNew').onclick = startNewChat;
$('aiHistoryClearAll').onclick = () => {
  if (!state.pdfId) return;
  toast('Delete all chats for this PDF?', {
    label: 'Delete',
    onClick: async () => {
      try { await aiDb.chats.where('pdfId').equals(state.pdfId).delete(); } catch (e) {}
      currentSessionId = null;
      renderWelcome();
      refreshHistoryList();
    }
  });
};

function appendChat(role, text) {
  const box = $('aiMessages');
  const welcome = box.querySelector('.ai-welcome');
  if (welcome) welcome.remove();
  const div = document.createElement('div');
  div.className = 'ai-msg ' + role;
  div.textContent = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}
function appendThinking() {
  const box = $('aiMessages');
  const welcome = box.querySelector('.ai-welcome');
  if (welcome) welcome.remove();
  const el = document.createElement('div');
  el.className = 'ai-msg bot ai-msg-assistant';
  const dots = document.createElement('div');
  dots.className = 'ai-thinking-dots';
  dots.innerHTML = '<span></span><span></span><span></span>';
  const status = document.createElement('div');
  status.className = 'ai-thinking-status';
  status.textContent = 'Sending request…';
  el.appendChild(dots);
  el.appendChild(status);
  box.appendChild(el);
  box.scrollTop = box.scrollHeight;
  return {
    el,
    setStatus(text) {
      status.textContent = text;
      box.scrollTop = box.scrollHeight;
    }
  };
}
function finalizeThinking(handle, text, isError) {
  const { el } = handle;
  el.textContent = isError ? 'Error: ' + text : text;
  el.classList.toggle('error', !!isError);
  el.classList.remove('ai-msg-assistant');
  if (isError) el.classList.add('ai-msg-error');
  $('aiMessages').scrollTop = $('aiMessages').scrollHeight;
}
async function sendChat() {
  const input = $('aiInput');
  const q = input.value.trim();
  if (!q) return;
  if (!state.pdfId) { toast('Open a PDF first'); return; }
  appendChat('user', q);
  aiLog('info', 'User message queued (' + q.length + ' chars)');
  await saveChatRow('user', q);
  input.value = '';
  const thinking = appendThinking();
  const currentModelLabel = 'AI';
  thinking.setStatus('Waiting for ' + currentModelLabel + '…');
  const watchdog = setTimeout(() => thinking.setStatus('Still waiting… (check the debug logger)'), 30000);
  const page = findTopPage() || 1;
  const pageText = await getPageText(page);
  let prior = [];
  try {
    prior = await aiDb.chats.where({ sessionId: currentSessionId }).reverse().limit(6).toArray();
    prior.reverse();
  } catch (e) { prior = []; }
  let historyBlock = prior.length
    ? 'Previous conversation:\n' +
      prior.map(m => (m.role === 'user' ? 'User: ' : 'Assistant: ') + String(m.text || '').slice(0, 300)).join('\n') +
      '\n\n'
    : '';
  if (historyBlock.length > 2000) historyBlock = historyBlock.slice(historyBlock.length - 2000);
  const prompt = historyBlock +
    'You are a study assistant helping a student prepare for competitive government exams. ' +
    'Answer using the document context below. If the answer isn\'t in the context, say so briefly. ' +
    'Keep answers under 200 words and factual.\n\n' +
    'Document: ' + (state.pdfMeta ? state.pdfMeta.name : '') + '\n' +
    'Current page: ' + page + '\n\n' +
    'Context:\n' + pageText.slice(0, 3500) + '\n\n' +
    'Question: ' + q;
  try {
    const result = await aiCall(prompt);
    clearTimeout(watchdog);
    finalizeThinking(thinking, result, false);
    await saveChatRow('assistant', result);
  } catch (e) {
    clearTimeout(watchdog);
    const msg = safeError(e);
    finalizeThinking(thinking, msg, true);
    await saveChatRow('error', msg);
  }
}
$('aiSendBtn').onclick = sendChat;
$('aiInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
});

async function aiSummarizePage() {
  if (!state.pdfId) return toast('Open a PDF first');
  const page = findTopPage() || 1;
  const text = await getPageText(page);
  if (!text) return toast('No text on this page');
  if (!requireModel()) return;
  const out = $('aiSummaryOut');
  const key = cacheKey('summarizePage', page, text);
  const cached = await getCached(key);
  if (cached) { aiLog('info', 'Cache hit — skipped API call'); out.textContent = cached; return; }
  const q = 'Summarize page ' + page;
  await saveChatRow('user', q);
  const result = await aiCallWith(AI_PROMPTS.summarizePage(text), out, 'Summarizing page ' + page + '…');
  if (result) {
    await setCached(key, 'summarizePage', page, result);
    await saveChatRow('assistant', result);
  } else await saveChatRow('error', String(out.textContent).replace(/^Error: /, ''));
}
async function aiSummarizeDoc() {
  if (!state.pdfId) return toast('Open a PDF first');
  const out = $('aiSummaryOut');
  out.textContent = 'Reading document…';
  const text = await getDocText(20);
  if (!text) return (out.textContent = 'No text found in this PDF.');
  const key = cacheKey('summarizeDoc', 0, text.slice(0, 300));
  const cached = await getCached(key);
  if (cached) { aiLog('info', 'Cache hit — skipped API call'); out.textContent = cached; return; }
  const q = 'Summarize the whole PDF';
  await saveChatRow('user', q);
  const result = await aiCallWith(AI_PROMPTS.summarizeDoc(text), out, 'Summarizing…');
  if (result) {
    await setCached(key, 'summarizeDoc', 0, result);
    await saveChatRow('assistant', result);
  } else await saveChatRow('error', String(out.textContent).replace(/^Error: /, ''));
}
$('aiSumPage').onclick = aiSummarizePage;
$('aiSumDoc').onclick = aiSummarizeDoc;

function renderCardList(out, text) {
  out.innerHTML = '';
  const lines = text.split(/\n+/);
  let cur = null;
  const cards = [];
  for (const ln of lines) {
    const qm = ln.match(/^\s*Q:\s*(.+)$/i);
    const am = ln.match(/^\s*A:\s*(.+)$/i);
    if (qm) { if (cur && cur.q) cards.push(cur); cur = { q: qm[1], a: '' }; }
    else if (am && cur) { cur.a = am[1]; cards.push(cur); cur = null; }
  }
  if (cur && cur.q) cards.push(cur);
  if (!cards.length) { out.textContent = text; return; }
  for (const c of cards) {
    const el = document.createElement('div');
    el.className = 'ai-card';
    el.innerHTML = '<q>' + escapeHtml(c.q) + '</q><a>' + escapeHtml(c.a || '—') + '</a>';
    out.appendChild(el);
  }
}
async function aiMakeCards() {
  if (!state.pdfId) return toast('Open a PDF first');
  const page = findTopPage() || 1;
  const text = await getPageText(page);
  if (!text) return toast('No text on this page');
  const out = $('aiCardsOut');
  const key = cacheKey('flashcards', page, text);
  const cached = await getCached(key);
  if (cached) { aiLog('info', 'Cache hit — skipped API call'); renderCardList(out, cached); return; }
  const q = 'Flashcards for page ' + page;
  await saveChatRow('user', q);
  const result = await aiCallWith(AI_PROMPTS.flashcards(text), out, 'Generating cards…',
    t => renderCardList(out, t));
  if (result) {
    await setCached(key, 'flashcards', page, result);
    await saveChatRow('assistant', result);
  } else await saveChatRow('error', String(out.textContent).replace(/^Error: /, ''));
}
async function aiMakeMCQs() {
  if (!state.pdfId) return toast('Open a PDF first');
  const page = findTopPage() || 1;
  const text = await getPageText(page);
  if (!text) return toast('No text on this page');
  const out = $('aiCardsOut');
  const key = cacheKey('mcq', page, text);
  const cached = await getCached(key);
  if (cached) { aiLog('info', 'Cache hit — skipped API call'); out.textContent = cached; return; }
  const q = 'MCQs for page ' + page;
  await saveChatRow('user', q);
  const result = await aiCallWith(AI_PROMPTS.mcq(text), out, 'Generating MCQs…');
  if (result) {
    await setCached(key, 'mcq', page, result);
    await saveChatRow('assistant', result);
  } else await saveChatRow('error', String(out.textContent).replace(/^Error: /, ''));
}
$('aiCardsPage').onclick = aiMakeCards;
$('aiMcqPage').onclick = aiMakeMCQs;

window.__explainSelection = async function () {
  const sel = window.getSelection();
  const text = sel ? sel.toString().trim() : '';
  if (!text) return;
  openAIPanel('chat');
  const q = 'Explain this:\n' + text;
  appendChat('user', q);
  await saveChatRow('user', q);
  const thinking = appendThinking();
  const currentModelLabel = 'AI';
  thinking.setStatus('Waiting for ' + currentModelLabel + '…');
  const watchdog = setTimeout(() => thinking.setStatus('Still waiting… (check the debug logger)'), 30000);
  try {
    const result = await aiCall(AI_PROMPTS.explain(text));
    clearTimeout(watchdog);
    finalizeThinking(thinking, result, false);
    await saveChatRow('assistant', result);
  } catch (e) {
    clearTimeout(watchdog);
    const msg = safeError(e);
    finalizeThinking(thinking, msg, true);
    await saveChatRow('error', msg);
  }
};

// ============ BOOT ============
console.log('PDF.js version:', pdfjsLib.version);
applyReading(state.reading);
$('spreadToggle').classList.toggle('active', state.spread);
refreshLibrary();
initModelPicker();
})();