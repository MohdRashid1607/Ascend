import './ui.js';
const els=document.querySelectorAll('[data-reveal]');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
els.forEach(e=>io.observe(e));
