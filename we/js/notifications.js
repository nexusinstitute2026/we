// ═══ Notifications ═══
import supabase from './supabase.js';
import { showToast } from './ui.js';

// Fetch unread count
export async function getUnreadCount(userId) {
  const { count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);
  return count || 0;
}

// Fetch all notifications for user
export async function getNotifications(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data || [];
}

// Mark notification as read
export async function markRead(notifId) {
  await supabase.from('notifications').update({ is_read: true }).eq('id', notifId);
}

// Mark all as read
export async function markAllRead(userId) {
  await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false);
}

// Insert a notification
// Insert a notification (upsert to avoid duplicates)
export async function insertNotification(userId, message) {
  const { error } = await supabase.from('notifications').upsert({ user_id: userId, message }, { onConflict: 'user_id,message' });
  if (error) console.error('Notification error:', error);
}

// Render notification list in panel
export function renderNotifications(notifications, panelBodyId) {
  const el = document.getElementById(panelBodyId);
  if (!el) return;
  if (!notifications.length) {
    el.innerHTML = `<div class="empty-state" style="padding:2rem;text-align:center;color:var(--text-muted)">
      <svg viewBox="0 0 24 24" width="40" height="40" style="opacity:0.3;margin-bottom:1rem;stroke:currentColor;fill:none;stroke-width:2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      <p>දැනුම්දීම් නොමැත</p>
    </div>`;
    return;
  }
  el.innerHTML = notifications.map(n => {
    let msg = n.message;
    let url = '';
    const urlMatch = msg.match(/\|URL:(.*)$/);
    if (urlMatch) {
      url = urlMatch[1];
      msg = msg.replace(urlMatch[0], '').trim();
    }
    return `
    <div class="notif-item ${n.is_read ? '' : 'unread'}" data-notif-id="${n.id}" ${url ? `data-url="${url}" style="cursor:pointer"` : ''}>
      <div class="notif-icon ${n.is_read ? 'ni-teal' : 'ni-gold'}">
        <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      </div>
      <div class="notif-msg">
        <p>${msg}</p>
        <time>${new Date(n.created_at).toLocaleString('si-LK')}</time>
      </div>
    </div>`;
  }).join('');
}

// Global click handler to be initialized once per dashboard
export function initNotificationClicks(panelBodyId, onUpdate) {
  const el = document.getElementById(panelBodyId);
  if (!el) return;

  el.addEventListener('click', async (e) => {
    const item = e.target.closest('.notif-item');
    if (!item) return;
    const nid = item.dataset.notifId;
    if (!nid) return;
    
    const url = item.dataset.url;
    
    if (item.classList.contains('unread')) {
      try {
        // Mark as read in DB
        await markRead(nid);
        
        // Immediate UI feedback
        item.classList.remove('unread');
        const icon = item.querySelector('.notif-icon');
        if (icon) { icon.classList.remove('ni-gold'); icon.classList.add('ni-teal'); }
        
        // Update badge counts globally
        const unreadCount = await getUnreadCount(item.parentElement.dataset.userId || '');
        updateNotifBadge(unreadCount);
        
        const navBadge = document.getElementById('nav-notif-badge');
        if (navBadge) {
          if (unreadCount > 0) {
            navBadge.textContent = unreadCount;
            navBadge.classList.remove('hidden');
          } else {
            navBadge.classList.add('hidden');
          }
        }
        
        if (onUpdate) onUpdate();
      } catch (err) {
        console.error('Failed to mark read:', err);
      }
    }
    
    if (url) {
      window.location.href = url;
    }
  });
}

// Update badge count in topbar
export function updateNotifBadge(count) {
  const badge = document.getElementById('notif-count');
  if (!badge) return;
  if (count > 0) {
    badge.textContent = count > 99 ? '99+' : count;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

// Initialize real-time notifications for a user
export function subscribeNotifications(userId, onNew) {
  return supabase.channel(`notifications:${userId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`
    }, (payload) => {
      onNew?.(payload.new);
    })
    .subscribe();
}
