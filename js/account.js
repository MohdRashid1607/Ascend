import {signInWithGoogle,signInWithGitHub,registerWithEmail,loginWithEmail} from './firebase.js';
import './ui.js';
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const tabs=$('.tabs'),form=$('#acctForm');let mode='login';
const COPY={login:['Welcome back','Log in to your command center.','Log in'],signup:['Create your account','Free forever on Launch. No credit card.','Create account']};
const rule={name:v=>mode==='signup'&&v.trim().length<2?'Tell us your name.':'',
  email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)?'':'Enter a valid email address.',
  pw:v=>mode==='login'?(v?'':'Enter your password.'):(v.length<8?'Use at least 8 characters.':'')};
const check=i=>{const m=rule[i.id](i.value),w=i.closest('.field');w.classList.toggle('bad',!!m);w.querySelector('.err').textContent=m;return !m};
function setMode(m,push){mode=m;document.body.dataset.mode=m;tabs.dataset.mode=m;
  $$('.tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.mode===m));
  [$('#title').textContent,$('#sub').textContent,$('#submitLabel').textContent]=COPY[m];
  $('#pw').autocomplete=m==='login'?'current-password':'new-password';
  document.title=(m==='login'?'Log in':'Sign up')+' — Ascend';
  $$('.field').forEach(f=>f.classList.remove('bad'));if(push)history.replaceState(null,'','#'+m)}
$$('.tabs button').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode,true)));
addEventListener('hashchange',()=>setMode(location.hash==='#signup'?'signup':'login'));
setMode(location.hash==='#signup'?'signup':'login');
$$('.field input').forEach(i=>{i.addEventListener('blur',()=>check(i));i.addEventListener('input',()=>{if(i.closest('.field').classList.contains('bad'))check(i)})});
$('.eye').addEventListener('click',e=>{const p=$('#pw'),s=p.type==='password';p.type=s?'text':'password';e.currentTarget.setAttribute('aria-label',s?'Hide password':'Show password')});
const L=['Too short','Weak','Okay','Good','Strong'],C=['#ff7b8a','#ff7b8a','#ffb86b','#c8e86b','#5df0a8'];
$('#pw').addEventListener('input',e=>{const v=e.target.value;
  const s=!v?0:[v.length>=8,/[a-z]/.test(v)&&/[A-Z]/.test(v),/\d/.test(v),/[^\w\s]/.test(v)].filter(Boolean).length;
  $$('#meter i').forEach((b,k)=>{b.style.background=k<s?C[s]:''});$('#hint').textContent=v?L[s]:''});
const done=(h,m)=>{$('#acctBody').hidden=true;$('#okTitle').textContent=h;$('#okMsg').textContent=m;$('#acctOk').hidden=false};
const MSG={'auth/invalid-credential':'Wrong email or password.','auth/email-already-in-use':'That email already has an account — try logging in.','auth/weak-password':'Choose a stronger password.','auth/popup-closed-by-user':'The sign-in window was closed.','auth/too-many-requests':'Too many attempts. Try again later.','auth/unauthorized-domain':'This domain isn’t authorized in Firebase yet.','auth/account-exists-with-different-credential':'This email is registered with another sign-in method.'};
const say=t=>{const n=$('#note');n.hidden=false;n.style.color='#ff9aa6';n.textContent=t};
const go=()=>{location.href='dashboard.html'};
form.addEventListener('submit',async e=>{e.preventDefault();
  const bad=[...$$('.field input')].filter(i=>i.offsetParent&&!check(i));if(bad.length){bad[0].focus();return}
  const b=$('#submit');b.disabled=true;b.classList.add('loading');
  try{mode==='login'?await loginWithEmail($('#email').value,$('#pw').value):await registerWithEmail($('#email').value,$('#pw').value,$('#name').value.trim());go()}
  catch(err){say(MSG[err.code]||'Something went wrong. Please try again.');b.disabled=false;b.classList.remove('loading')}});
$('#magic').addEventListener('click',()=>{if(check($('#email')))done('Check your inbox','We’d email a one-tap sign-in link to '+$('#email').value+'. (Demo — nothing was sent.)')});
$$('[data-social]').forEach(b=>b.addEventListener('click',async()=>{try{await(b.dataset.social==='Google'?signInWithGoogle():signInWithGitHub());go()}catch(err){say(MSG[err.code]||'Sign-in failed. Please try again.')}}));
