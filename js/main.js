import Lenis from 'https://unpkg.com/lenis@1.3.23/dist/lenis.mjs';
import {features,bars,rows,stats,plans} from './data.js';
import {initScene} from './scene.js';
import './ui.js';
const $=id=>document.getElementById(id);
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
$('featureGrid').innerHTML=features.map((f,i)=>`<article class="card" data-reveal style="--rd:${i*90}ms"><div class="card-icon">${f.icon}</div><h3>${f.t}</h3><p>${f.d}</p></article>`).join('');
$('dashBars').innerHTML=bars.map((h,i)=>`<div class="dash-bar" style="height:${h}%;animation-delay:${i*90}ms"></div>`).join('');
$('dashRows').innerHTML=rows.map(([l,v])=>`<div class="dash-row"><span>${l}</span><div class="dash-track"><div class="dash-fill" style="--w:${v}%;width:${v}%"></div></div></div>`).join('');
$('stats').innerHTML=stats.map(([v,l],i)=>`<div class="stat" data-reveal style="--rd:${i*80}ms"><div class="stat-value">${v}</div><div class="stat-label">${l}</div></div>`).join('');
$('planGrid').innerHTML=plans.map((p,i)=>`<article class="plan${p.hot?' hot':''}" data-reveal style="--rd:${i*100}ms"><h3>${p.n}</h3><div class="price">${p.p}${p.p==='$49'?'<small> /seat/mo</small>':''}</div><p class="tag">${p.t}</p><ul>${p.f.map(x=>`<li>${x}</li>`).join('')}</ul><a class="btn ${p.hot?'btn-primary':'btn-outline'}" href="${p.c==='Talk to Sales'?'contact.html':'account.html#signup'}">${p.c}</a></article>`).join('');
const els=document.querySelectorAll('[data-reveal]');
if(reduce) els.forEach(e=>e.classList.add('in'));
else{
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.18,rootMargin:'0px 0px -8% 0px'});
  els.forEach(e=>io.observe(e));
  const lenis=window.__lenis=new Lenis({duration:1.15,smoothWheel:true,touchMultiplier:1.5});
  const raf=t=>{lenis.raf(t);requestAnimationFrame(raf)};requestAnimationFrame(raf);
}
addEventListener('scroll',()=>{const m=document.documentElement.scrollHeight-innerHeight;$('progress').style.transform=`scaleX(${m>0?scrollY/m:0})`},{passive:true});
initScene(document.querySelector('.planet-canvas'),reduce);