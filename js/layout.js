const links=[['Features','index.html#features'],['Solutions','index.html#solutions'],['Plans','plans.html'],['Learning','learning.html']];
const here=location.pathname.split('/').pop()||'index.html';
const cur=h=>h===here?' aria-current="page"':'';
const nav=document.getElementById('site-nav');
if(nav)nav.outerHTML=`<nav class="nav"><a class="brand" href="index.html"><span class="brand-mark">▲</span>Ascend</a>
<div class="nav-links">${links.map(([t,h])=>`<a href="${h}"${cur(h)}>${t}</a>`).join('')}</div>
<div class="nav-actions"><a class="btn btn-ghost" href="account.html#signup">Sign Up</a><button class="nav-toggle" type="button" aria-label="Menu" aria-expanded="false"><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button></div></nav>`;
const ft=document.getElementById('site-footer');
if(ft)ft.innerHTML=`<footer class="footer"><div class="footer-brand"><a class="brand" href="index.html"><span class="brand-mark">▲</span>Ascend</a><p>The revenue command center for ambitious teams.</p></div>
<div class="footer-cols">
<div><h4>Product</h4><a href="index.html#features">Features</a><a href="index.html#solutions">Solutions</a><a href="plans.html">Plans</a></div>
<div><h4>Company</h4><a href="learning.html">Learning</a><a href="contact.html">Contact</a><a href="account.html#signup">Sign up</a></div>
<div><h4>Legal</h4><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="privacy.html#security">Security</a></div></div></footer>
<div class="copyright">© ${new Date().getFullYear()} Ascend, Inc. — Built among the stars.</div>`;
if(document.body.classList.contains('inner')){
  const bg=document.createElement('div');bg.className='space-bg';const c=document.createElement('canvas');bg.append(c);document.body.prepend(bg);
  const x=c.getContext('2d'),S=Array.from({length:140},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.2+.3,p:Math.random()*6}));
  const fit=()=>{c.width=innerWidth;c.height=innerHeight};fit();addEventListener('resize',fit);
  const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
  (function f(t){x.clearRect(0,0,c.width,c.height);x.fillStyle='#cfe0ff';S.forEach(s=>{x.globalAlpha=.3+.5*Math.sin(t/900+s.p)**2;x.beginPath();x.arc(s.x*c.width,s.y*c.height,s.r,0,7);x.fill()});if(!still)requestAnimationFrame(f)})(0);
}