// ═══ UI Utilities ═══

// Toast notifications
export function showToast(message, type = 'success', duration = 4000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:20px;height:20px;stroke:#0d9488"><polyline points="20 6 9 17 4 12"/></svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:20px;height:20px;stroke:#f43f5e"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:20px;height:20px;stroke:#f59e0b"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:20px;height:20px;stroke:#3b82f6"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `${icons[type] || ''}<span class="toast-msg">${message}</span><button class="toast-dismiss" onclick="this.parentElement.remove()">✕</button>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}


// Sidebar toggle
export function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const toggle = document.getElementById('menu-toggle');
  if (!sidebar) return;
  toggle?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay?.classList.toggle('active');
  });
  overlay?.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  });
}

// Notification panel
export function initNotifPanel() {
  const btn = document.getElementById('notif-btn');
  const panel = document.getElementById('notif-panel');
  if (!btn || !panel) return;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.toggle('active');
  });
  document.addEventListener('click', (e) => {
    // If clicking outside panel AND not clicking a toggle button
    const isToggle = e.target.closest('#notif-btn') || e.target.closest('#notif-nav');
    if (!panel.contains(e.target) && !isToggle) {
      panel.classList.remove('active');
    }
  });
}

// Reveal on scroll
export function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

// Format date nicely
export function fmtDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('si-LK', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Format time as mm:ss
export function fmtTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Compute next 14th expiry date
export function nextFourteenth() {
  const now = new Date();
  let d = new Date(now.getFullYear(), now.getMonth(), 14, 23, 59, 59);
  if (now.getDate() >= 14) d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}

// Compute 3-day temp expiry
export function threeDayExpiry() {
  return new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
}

// Skeleton loader
export function showSkeleton(containerId, count = 3, height = '80px') {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = Array(count).fill(`<div class="skeleton" style="height:${height};margin-bottom:1rem;border-radius:1rem;"></div>`).join('');
}

// Badge HTML helper
export function statusBadge(status) {
  const labels = { active: 'Active', temp: 'Temp', pending: 'Pending', expired: 'Expired', approved: 'Approved', rejected: 'Rejected' };
  const si = { active: 'සකිය', temp: 'තාවකාලික', pending: 'අනුමතය', expired: 'කල් ඉකුත්', approved: 'අනුමත', rejected: 'ප්‍රතික්ෂේප' };
  return `<span class="badge badge-${status}"><span class="badge-dot"></span>${si[status] || labels[status] || status}</span>`;
}

// Set active nav item
export function setActiveNav(page) {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });
}

// Modal control
export function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

export function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}
