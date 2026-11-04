import './page.js';
import {onAuthStateChanged,signOutUser,updateProfile} from './firebase.js';
import {guides} from './guides.js';
const $=id=>document.getElementById(id);
let me=null;
onAuthStateChanged(u=>{
  if(!u){location.replace('account.html#login');return}
  me=u;const name=u.displayName||u.email.split('@')[0];
  $('dbName').textContent=name;$('dbEmail').textContent=u.email;
  const av=$('dbAvatar');av.textContent='';
  if(u.photoURL){const i=new Image();i.src=u.photoURL;i.alt='';av.append(i)}else av.textContent=name[0].toUpperCase();
  const h=new Date().getHours();$('dbGreeting').textContent=`Good ${h<12?'morning':h<18?'afternoon':'evening'}, ${name.split(' ')[0]}`;
  $('settingsName').value=u.displayName||'';$('settingsEmail').value=u.email;
});
$('dbNav').addEventListener('click',e=>{const li=e.target.closest('li');if(!li)return;
  document.querySelectorAll('#dbNav li').forEach(x=>x.classList.toggle('active',x===li));
  document.querySelectorAll('.db-panel').forEach(p=>p.hidden=p.id!=='panel-'+li.dataset.panel);
  $('dbPanelLabel').textContent=li.textContent.trim()});
$('dbGuides').innerHTML=guides.slice(0,3).map(g=>`<a class="card g-card" href="guide.html?id=${g.id}"><small>${g.cat}</small><h3>${g.t}</h3><span class="meta">${g.min} min read</span></a>`).join('');
$('dbAnalyticsBars').innerHTML=[62,88,47,95,71,80,58].map((h,i)=>`<div class="db-bar" style="height:${h}%;animation-delay:${i*80}ms"></div>`).join('');
const out=()=>signOutUser().then(()=>{location.href='../index.html'});
$('signOutBtn').addEventListener('click',out);$('settingsSignOut').addEventListener('click',out);
$('saveProfileBtn').addEventListener('click',async()=>{if(!me)return;const n=$('settingsName').value.trim();
  try{await updateProfile(me,{displayName:n});$('dbName').textContent=n||me.email;$('saveMsg').textContent='Saved.'}catch{$('saveMsg').textContent='Could not save. Try again.'}
  $('saveMsg').hidden=false;setTimeout(()=>$('saveMsg').hidden=true,2500)});
