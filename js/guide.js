import './page.js';
import {guides} from './guides.js';
const i=guides.findIndex(g=>g.id===new URLSearchParams(location.search).get('id')),el=document.getElementById('guide');
if(i<0)el.innerHTML='<h1>Guide not found</h1><p>That guide doesn’t exist. <a href="learning.html">Browse all guides</a></p>';
else{const g=guides[i],n=guides[(i+1)%guides.length];document.title=g.t+' — Ascend';
el.innerHTML=`<a class="back" href="learning.html">← All guides</a><small class="tag">${g.cat} · ${g.min} min read</small><h1>${g.t}</h1><p class="lead">${g.d}</p><h2>Key takeaways</h2><ul>${g.take.map(t=>`<li>${t}</li>`).join('')}</ul><a class="card g-card next" href="guide.html?id=${n.id}"><small>Next guide</small><h3>${n.t}</h3></a>`}
