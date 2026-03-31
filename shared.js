// ═══════════════════════════════════════════════
//  PID EXTRACTOR — Estado compartido
//  Todos los módulos importan este archivo
// ═══════════════════════════════════════════════

const SHARED = {

  // ── Sesión ───────────────────────────────────
  getSession() {
    try { return JSON.parse(localStorage.getItem(CONFIG.sessionKey) || 'null'); } catch { return null; }
  },
  setSession(user) {
    const session = { ...user, loginAt: Date.now(), expiresAt: Date.now() + CONFIG.sessionHours * 3600000 };
    localStorage.setItem(CONFIG.sessionKey, JSON.stringify(session));
  },
  clearSession() {
    localStorage.removeItem(CONFIG.sessionKey);
  },
  isSessionValid() {
    const s = this.getSession();
    return s && s.expiresAt > Date.now();
  },
  requireAuth() {
    if (!this.isSessionValid()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },
  currentUser() {
    return this.getSession();
  },
  isAdmin() {
    const s = this.getSession();
    return s && s.role === 'admin';
  },

  // ── TAGs confirmados ─────────────────────────
  saveTags(tags) {
    localStorage.setItem('pid_tags', JSON.stringify(tags));
  },
  getTags() {
    try { return JSON.parse(localStorage.getItem('pid_tags') || '[]'); } catch { return []; }
  },

  // ── Equipos ──────────────────────────────────
  saveEquipment(equipment) {
    localStorage.setItem('pid_equipment', JSON.stringify(equipment));
  },
  getEquipment() {
    try { return JSON.parse(localStorage.getItem('pid_equipment') || '[]'); } catch { return []; }
  },

  // ── Plantillas ───────────────────────────────
  saveTemplates(templates) {
    localStorage.setItem('pid_templates', JSON.stringify(templates));
  },
  getTemplates() {
    try { return JSON.parse(localStorage.getItem('pid_templates') || '[]'); } catch { return []; }
  },

  // ── Historial de planos ──────────────────────
  addToHistory(item) {
    const h = this.getHistory();
    h.unshift({ ...item, id: Date.now(), date: new Date().toISOString() });
    localStorage.setItem('pid_history', JSON.stringify(h.slice(0, 50)));
  },
  getHistory() {
    try { return JSON.parse(localStorage.getItem('pid_history') || '[]'); } catch { return []; }
  },

  // ── TAG → plantilla ──────────────────────────
  getTemplateForTag(tag) {
    const prefix = tag.split('-')[0].toUpperCase();
    // Busca primero coincidencia exacta, luego por inicio
    const map = CONFIG.tagMapping;
    return (
      map.find(m => m.prefix.toUpperCase() === prefix) ||
      map.find(m => prefix.startsWith(m.prefix.toUpperCase())) ||
      null
    );
  },

  // ── Utilidades ───────────────────────────────
  toast(msg, type = 'info', duration = 3000) {
    const colors = {
      info:    '#00c9a7',
      success: '#22c55e',
      error:   '#ff4d6d',
      warning: '#f0a500',
    };
    const t = document.createElement('div');
    t.style.cssText = `
      position:fixed; bottom:24px; right:24px; z-index:9999;
      background:${colors[type]}; color:#0c0e14;
      padding:12px 20px; border-radius:10px;
      font-family:'Syne',sans-serif; font-size:14px; font-weight:600;
      box-shadow:0 4px 24px rgba(0,0,0,.3);
      animation: slideIn .2s ease;
    `;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), duration);
  },

  formatDate(iso) {
    return new Date(iso).toLocaleDateString('es-MX', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  },

  esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  },
};
