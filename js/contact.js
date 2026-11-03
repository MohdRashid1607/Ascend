import './pages.js';
const f=document.getElementById('cform'),ok=document.getElementById('cok');
f.addEventListener('submit',e=>{e.preventDefault();let bad=false;
  f.querySelectorAll('[required]').forEach(i=>{const w=i.closest('.field'),v=i.type==='email'?/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(i.value):i.value.trim().length>1;w.classList.toggle('bad',!v);if(!v&&!bad){bad=true;i.focus()}});
  if(bad)return;const d=new FormData(f);
  document.getElementById('cmsg').textContent=`Thanks, ${d.get('name')}! We'll reply to ${d.get('email')} within one business day.`;
  f.hidden=true;ok.hidden=false});