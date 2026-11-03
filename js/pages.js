document.documentElement.classList.add('js');
import './ui.js';
const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
const els = document.querySelectorAll('[data-reveal]');
if (reduce) {
  els.forEach(e => e.classList.add('in'));
} else {
  const io = new IntersectionObserver(
    es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
    { threshold: .12 }
  );
  els.forEach(e => io.observe(e));
}