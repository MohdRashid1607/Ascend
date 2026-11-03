import './ui.js';
import { onAuthStateChanged, signOutUser } from './firebase.js';
import { guides } from './guides.js';

// ── Auth guard — redirect if not signed in ────────────────────
onAuthStateChanged(user => {
  if (!user) {
    location.href = 'account.html';
    return;
  }
  hydrate(user);
});

// ── Populate the UI with user data ────────────────────────────
function hydrate(user) {
  const name  = user.displayName || user.email.split('@')[0];
  const email = user.email;
  const photo = user.photoURL;

  // Avatar
  const av = document.getElementById('dbAvatar');
  if (photo) {
    av.style.backgroundImage = `url(${photo})`;
    av.style.backgroundSize = 'cover';
  } else {
    av.textContent = name[0].toUpperCase();
  }

  // Name / email
  document.getElementById('dbName').textContent  = name;
  document.getElementById('dbEmail').textContent = email;

  // Greeting
  const hr = new Date().getHours();
  const greet = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
  document.getElementById('dbGreeting').textContent = `${greet}, ${name.split(' ')[0]} 👋`;

  // Quick guides (show first 3)
  const grid = document.getElementById('dbGuides');
  grid.innerHTML = guides.slice(0, 3).map(g =>
    `<a class="card g-card" href="guide.html?id=${g.id}">
      <small>${g.cat}</small>
      <h3>${g.t}</h3>
      <p>${g.d}</p>
      <span class="meta">${g.min} min read</span>
    </a>`
  ).join('');
}

// ── Sign out ──────────────────────────────────────────────────
document.getElementById('signOutBtn').addEventListener('click', async () => {
  await signOutUser();
  location.href = 'index.html';
});
