import './pages.js';
const b=document.querySelectorAll('.billing button');
b.forEach(x=>x.addEventListener('click',()=>{b.forEach(y=>y.classList.toggle('on',y===x));
  document.querySelectorAll('[data-m]').forEach(p=>p.textContent=x.dataset.b==='y'?p.dataset.y:p.dataset.m);
  document.querySelectorAll('.bill-note').forEach(n=>n.textContent=x.dataset.b==='y'?'billed yearly':'billed monthly')}));