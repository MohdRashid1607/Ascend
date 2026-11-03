// ── Path helpers ──────────────────────────────────────────────
const inPages = location.pathname.includes('/pages/');
const toRoot  = inPages ? '../' : '';
const toPages = inPages ? ''   : 'pages/';

// ── Nav links ─────────────────────────────────────────────────
const links = [
  ['Features',  `${toRoot}index.html#features`],
  ['Solutions', `${toRoot}index.html#solutions`],
  ['Plans',     `${toPages}plans.html`],
  ['Learning',  `${toPages}learning.html`],
];
const here = location.pathname.split('/').pop() || 'index.html';
const cur  = h => h.split('#')[0].split('/').pop() === here ? ' aria-current="page"' : '';

// ── Inject nav immediately (synchronous, no CDN needed) ───────
const navEl = document.getElementById('site-nav');
if (navEl) navEl.outerHTML = `<nav class="nav">
<a class="brand" href="${toRoot}index.html"><span class="brand-mark">▲</span>Ascend</a>
<div class="nav-links">${links.map(([t,h]) => `<a href="${h}"${cur(h)}>${t}</a>`).join('')}</div>
<div class="nav-actions"><a class="btn btn-ghost nav-signup" id="navSignUp" href="${toPages}account.html#signup">Sign Up</a><button class="nav-toggle" type="button" aria-label="Menu" aria-expanded="false"><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button></div></nav>`;

// ── Auth-aware nav (dynamic Firebase import — won't crash nav if CDN fails) ──
import('./firebase.js').then(({ auth }) =>
  import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js').then(({ onAuthStateChanged }) => {
    onAuthStateChanged(auth, user => {
      const signUpBtn = document.getElementById('navSignUp');
      if (!signUpBtn) return;

      if (user) {
        const a = document.createElement('a');
        a.href      = `${toPages}dashboard.html`;
        a.className = 'nav-avatar-btn';
        a.title     = user.displayName || user.email;

        if (user.photoURL) {
          const img = document.createElement('img');
          img.src = user.photoURL;
          img.alt = user.displayName || 'Profile';
          img.referrerPolicy = 'no-referrer';
          a.appendChild(img);
        } else {
          a.textContent = (user.displayName || user.email)[0].toUpperCase();
        }
        const span = document.createElement('span');
        span.className   = 'nav-avatar-name';
        span.textContent = (user.displayName || user.email).split(' ')[0];
        a.appendChild(span);
        signUpBtn.replaceWith(a);

      } else {
        const existing = document.querySelector('.nav-avatar-btn');
        if (existing) {
          const a = document.createElement('a');
          a.className   = 'btn btn-ghost nav-signup';
          a.id          = 'navSignUp';
          a.href        = `${toPages}account.html#signup`;
          a.textContent = 'Sign Up';
          existing.replaceWith(a);
        }
      }
    });
  })
).catch(() => { /* Firebase unavailable — nav still shows with Sign Up button */ });

// ── Inject footer ─────────────────────────────────────────────
const ft = document.getElementById('site-footer');
if (ft) ft.innerHTML = `<footer class="footer">
<div class="footer-brand"><a class="brand" href="${toRoot}index.html"><span class="brand-mark">▲</span>Ascend</a><p>The revenue command center for ambitious teams.</p></div>
<div class="footer-cols">
<div><h4>Product</h4><a href="${toRoot}index.html#features">Features</a><a href="${toRoot}index.html#solutions">Solutions</a><a href="${toPages}plans.html">Plans</a></div>
<div><h4>Company</h4><a href="${toPages}learning.html">Learning</a><a href="${toPages}contact.html">Contact</a><a href="${toPages}account.html#signup">Sign up</a></div>
<div><h4>Legal</h4><a href="${toPages}privacy.html">Privacy</a><a href="${toPages}terms.html">Terms</a><a href="${toPages}privacy.html#security">Security</a></div>
</div></footer>
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