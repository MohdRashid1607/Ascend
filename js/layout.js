import { auth } from './firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const links = [['Features','index.html#features'],['Solutions','index.html#solutions'],['Plans','plans.html'],['Learning','learning.html']];
const here  = location.pathname.split('/').pop() || 'index.html';
const cur   = h => h === here ? ' aria-current="page"' : '';

// ── Inject nav ────────────────────────────────────────────────
const nav = document.getElementById('site-nav');
if (nav) nav.outerHTML = `<nav class="nav"><a class="brand" href="index.html"><span class="brand-mark">▲</span>Ascend</a>
<div class="nav-links">${links.map(([t,h]) => `<a href="${h}"${cur(h)}>${t}</a>`).join('')}</div>
<div class="nav-actions"><a class="btn btn-ghost nav-signup" id="navSignUp" href="account.html#signup">Sign Up</a><button class="nav-toggle" type="button" aria-label="Menu" aria-expanded="false"><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button></div></nav>`;

// ── Auth-aware nav button ─────────────────────────────────────
onAuthStateChanged(auth, user => {
  const signUpBtn = document.getElementById('navSignUp');
  if (!signUpBtn) return;

  if (user) {
    // Build avatar element
    const a = document.createElement('a');
    a.href  = 'dashboard.html';
    a.className = 'nav-avatar-btn';
    a.title = user.displayName || user.email;

    if (user.photoURL) {
      const img = document.createElement('img');
      img.src   = user.photoURL;
      img.alt   = user.displayName || 'Profile';
      img.referrerPolicy = 'no-referrer';
      a.appendChild(img);
    } else {
      // Fallback initial
      a.textContent = (user.displayName || user.email)[0].toUpperCase();
    }

    // Add a tiny dropdown caret with name
    const span = document.createElement('span');
    span.className = 'nav-avatar-name';
    span.textContent = (user.displayName || user.email).split(' ')[0];
    a.appendChild(span);

    signUpBtn.replaceWith(a);
  } else {
    // Make sure Sign Up is showing (handles log-out on same page)
    const existing = document.querySelector('.nav-avatar-btn');
    if (existing) {
      const a = document.createElement('a');
      a.className = 'btn btn-ghost nav-signup';
      a.id = 'navSignUp';
      a.href = 'account.html#signup';
      a.textContent = 'Sign Up';
      existing.replaceWith(a);
    }
  }
});

// ── Inject footer ─────────────────────────────────────────────
const ft = document.getElementById('site-footer');
if (ft) ft.innerHTML = `<footer class="footer"><div class="footer-brand"><a class="brand" href="index.html"><span class="brand-mark">▲</span>Ascend</a><p>The revenue command center for ambitious teams.</p></div>
<div class="footer-cols">
<div><h4>Product</h4><a href="index.html#features">Features</a><a href="index.html#solutions">Solutions</a><a href="plans.html">Plans</a></div>
<div><h4>Company</h4><a href="learning.html">Learning</a><a href="contact.html">Contact</a><a href="account.html#signup">Sign up</a></div>
<div><h4>Legal</h4><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="privacy.html#security">Security</a></div></div></footer>
<div class="copyright">© ${new Date().getFullYear()} Ascend, Inc. — Built among the stars.</div>`;

// ── Starfield (inner pages only) ──────────────────────────────
if (document.body.classList.contains('inner')) {
  const bg = document.createElement('div'); bg.className = 'space-bg';
  const c  = document.createElement('canvas'); bg.append(c); document.body.prepend(bg);
  const x  = c.getContext('2d');
  const S  = Array.from({length:140}, () => ({x:Math.random(), y:Math.random(), r:Math.random()*1.2+.3, p:Math.random()*6}));
  const fit = () => { c.width = innerWidth; c.height = innerHeight; }; fit(); addEventListener('resize', fit);
  const still = matchMedia('(prefers-reduced-motion:reduce)').matches;
  (function f(t) {
    x.clearRect(0,0,c.width,c.height);
    x.fillStyle = '#cfe0ff';
    S.forEach(s => { x.globalAlpha = .3+.5*Math.sin(t/900+s.p)**2; x.beginPath(); x.arc(s.x*c.width, s.y*c.height, s.r, 0, 7); x.fill(); });
    if (!still) requestAnimationFrame(f);
  })(0);
}