import './ui.js';
import { onAuthStateChanged, signOutUser } from './firebase.js';
import { guides } from './guides.js';

// ── Auth guard ────────────────────────────────────────────────
onAuthStateChanged(user => {
  if (!user) { location.href = 'account.html'; return; }
  hydrate(user);
});

// ── Hydrate UI with user data ─────────────────────────────────
function hydrate(user) {
  const name  = user.displayName || user.email.split('@')[0];
  const email = user.email;
  const photo = user.photoURL;
  const first = name.split(' ')[0];

  // Avatar
  const av = document.getElementById('dbAvatar');
  if (photo) {
    av.style.cssText = `background-image:url(${photo});background-size:cover;background-position:center`;
  } else {
    av.textContent = first[0].toUpperCase();
  }

  document.getElementById('dbName').textContent  = name;
  document.getElementById('dbEmail').textContent = email;

  // Greeting — no emoji
  const hr = new Date().getHours();
  const greet = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
  document.getElementById('dbGreeting').textContent = `${greet}, ${first}`;

  // Settings panel — pre-fill name/email
  const sn = document.getElementById('settingsName');
  const se = document.getElementById('settingsEmail');
  if (sn) sn.value = name;
  if (se) se.value = email;

  // Analytics bars
  const bars = [62, 88, 47, 95, 71, 80, 58];
  const barWrap = document.getElementById('dbAnalyticsBars');
  if (barWrap) {
    barWrap.innerHTML = bars.map((h, i) =>
      `<div class="db-analytics-bar" style="height:${h}%;animation-delay:${i * 80}ms" title="${h} leads"></div>`
    ).join('');
  }

  // Guides
  const grid = document.getElementById('dbGuides');
  if (grid) {
    grid.innerHTML = guides.slice(0, 3).map(g =>
      `<a class="card g-card" href="guide.html?id=${g.id}">
        <small>${g.cat}</small>
        <h3>${g.t}</h3>
        <p>${g.d}</p>
        <span class="meta">${g.min} min read</span>
      </a>`
    ).join('');
  }
}

// ── Panel navigation ──────────────────────────────────────────
const panelLabels = {
  overview:  'Overview',
  workflows: 'Workflows',
  analytics: 'Analytics',
  leads:     'Leads',
  settings:  'Settings'
};

document.getElementById('dbNav').addEventListener('click', e => {
  const li = e.target.closest('li[data-panel]');
  if (!li) return;
  const panel = li.dataset.panel;

  // Update nav
  document.querySelectorAll('.db-nav li').forEach(el =>
    el.classList.toggle('active', el === li)
  );

  // Update panel label
  document.getElementById('dbPanelLabel').textContent = panelLabels[panel];

  // Show correct panel
  document.querySelectorAll('.db-panel').forEach(el =>
    el.hidden = el.id !== `panel-${panel}`
  );
});

// ── Sign out (sidebar + settings) ────────────────────────────
async function doSignOut() {
  await signOutUser();
  location.href = 'index.html';
}
document.getElementById('signOutBtn').addEventListener('click', doSignOut);
const settingsSignOut = document.getElementById('settingsSignOut');
if (settingsSignOut) settingsSignOut.addEventListener('click', doSignOut);

// ── Save profile (settings) ───────────────────────────────────
const saveBtn = document.getElementById('saveProfileBtn');
if (saveBtn) {
  saveBtn.addEventListener('click', () => {
    const msg = document.getElementById('saveMsg');
    msg.hidden = false;
    setTimeout(() => { msg.hidden = true; }, 2500);
  });
}

// ── Delete account (danger zone — just shows confirmation) ────
document.querySelector('.db-btn-danger')?.addEventListener('click', () => {
  if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
    signOutUser().then(() => { location.href = 'index.html'; });
  }
});
