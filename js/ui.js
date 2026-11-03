import './layout.js';

const nav = document.querySelector('.nav');
const tog = document.querySelector('.nav-toggle');

// Wrap in guard — avoids top-level return (illegal in ES modules)
if (nav && tog) {
  const setMenu = o => {
    nav.classList.toggle('open', o);
    tog.setAttribute('aria-expanded', o);
  };
  tog.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.querySelector('.nav-links')?.addEventListener('click', () => setMenu(false));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  addEventListener('resize', () => { if (innerWidth > 720) setMenu(false); });
}

// Smooth anchor scroll — works from both root and pages/
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"],a[href*="index.html#"]');
  if (!a) return;
  const onHome = /(^|\\/)(index\.html)?$/.test(location.pathname);
  let h = a.getAttribute('href');
  if (h[0] !== '#') { if (!onHome) return; h = h.slice(h.indexOf('#')); }
  const t = h.length > 1 && document.querySelector(h);
  if (t) { e.preventDefault(); window.__lenis ? window.__lenis.scrollTo(t) : t.scrollIntoView({ behavior: 'smooth' }); }
});