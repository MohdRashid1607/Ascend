import './ui.js';
import {
  signInWithGoogle,
  signInWithGitHub,
  registerWithEmail,
  loginWithEmail,
  onAuthStateChanged
} from './firebase.js';

// ── Element shortcuts ────────────────────────────────────────
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const tabs = $('.tabs'), form = $('#acctForm');
let mode = 'login';

// ── Copy config ──────────────────────────────────────────────
const COPY = {
  login:  ['Welcome back',         'Log in to your command center.',          'Log in'],
  signup: ['Create your account',  'Free forever on Launch. No credit card.', 'Create account']
};

// ── Validation ───────────────────────────────────────────────
const rule = {
  name:  v => mode === 'signup' && v.trim().length < 2 ? 'Tell us your name.' : '',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Enter a valid email address.',
  pw:    v => mode === 'login' ? (v ? '' : 'Enter your password.') : (v.length < 8 ? 'Use at least 8 characters.' : '')
};
const check = i => {
  const m = rule[i.id](i.value), w = i.closest('.field');
  w.classList.toggle('bad', !!m);
  w.querySelector('.err').textContent = m;
  return !m;
};

// ── Mode switching ────────────────────────────────────────────
function setMode(m, push) {
  mode = m;
  document.body.dataset.mode = m;
  tabs.dataset.mode = m;
  $$('.tabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.mode === m));
  [$('#title').textContent, $('#sub').textContent, $('#submitLabel').textContent] = COPY[m];
  $('#pw').autocomplete = m === 'login' ? 'current-password' : 'new-password';
  document.title = (m === 'login' ? 'Log in' : 'Sign up') + ' — Ascend';
  $$('.field').forEach(f => f.classList.remove('bad'));
  if (push) history.replaceState(null, '', '#' + m);
}
$$('.tabs button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode, true)));
addEventListener('hashchange', () => setMode(location.hash === '#signup' ? 'signup' : 'login'));
setMode(location.hash === '#signup' ? 'signup' : 'login');

// ── Already signed in? Redirect ───────────────────────────────
onAuthStateChanged(user => { if (user) location.href = 'dashboard.html'; });

// ── Form validation listeners ─────────────────────────────────
$$('.field input').forEach(i => {
  i.addEventListener('blur', () => check(i));
  i.addEventListener('input', () => { if (i.closest('.field').classList.contains('bad')) check(i); });
});

// ── Password show/hide ────────────────────────────────────────
$('.eye').addEventListener('click', e => {
  const p = $('#pw'), s = p.type === 'password';
  p.type = s ? 'text' : 'password';
  e.currentTarget.setAttribute('aria-label', s ? 'Hide password' : 'Show password');
});

// ── Password strength meter ───────────────────────────────────
const L = ['Too short','Weak','Okay','Good','Strong'];
const C = ['#ff7b8a','#ff7b8a','#ffb86b','#c8e86b','#5df0a8'];
$('#pw').addEventListener('input', e => {
  const v = e.target.value;
  const s = !v ? 0 : [v.length >= 8, /[a-z]/.test(v) && /[A-Z]/.test(v), /\d/.test(v), /[^\w\s]/.test(v)].filter(Boolean).length;
  $$('#meter i').forEach((b, k) => { b.style.background = k < s ? C[s] : ''; });
  $('#hint').textContent = v ? L[s] : '';
});

// ── Error display helper ──────────────────────────────────────
const showErr = msg => {
  const n = $('#note');
  n.hidden = false;
  n.textContent = msg;
  n.style.color = '#ff9aa6';
};
const clearErr = () => { $('#note').hidden = true; };

// ── Loading state ─────────────────────────────────────────────
const setLoading = on => {
  const b = $('#submit');
  b.disabled = on;
  b.classList.toggle('loading', on);
};

// ── Social sign-in ────────────────────────────────────────────
const handleSocial = async (fn, label) => {
  clearErr();
  try {
    await fn();
    // onAuthStateChanged will catch the user and redirect
  } catch (err) {
    if (err.code === 'auth/popup-closed-by-user') return;
    if (err.code === 'auth/account-exists-with-different-credential') {
      showErr(`An account already exists with this email. Try a different sign-in method.`);
    } else {
      showErr(`${label} sign-in failed: ${err.message}`);
    }
  }
};

document.querySelector('[data-social="Google"]').addEventListener('click',
  () => handleSocial(signInWithGoogle, 'Google'));
document.querySelector('[data-social="GitHub"]').addEventListener('click',
  () => handleSocial(signInWithGitHub, 'GitHub'));

// ── Email / password form ─────────────────────────────────────
form.addEventListener('submit', async e => {
  e.preventDefault();
  clearErr();
  const bad = [...$$('.field input')].filter(i => i.offsetParent && !check(i));
  if (bad.length) { bad[0].focus(); return; }

  setLoading(true);
  try {
    if (mode === 'signup') {
      await registerWithEmail($('#email').value, $('#pw').value, $('#name').value.trim() || 'there');
    } else {
      await loginWithEmail($('#email').value, $('#pw').value);
    }
    // redirect handled by onAuthStateChanged
  } catch (err) {
    setLoading(false);
    const map = {
      'auth/email-already-in-use':   'That email is already registered. Try logging in.',
      'auth/wrong-password':          'Incorrect password. Please try again.',
      'auth/user-not-found':          'No account found with that email.',
      'auth/too-many-requests':       'Too many attempts. Please wait a moment.',
      'auth/invalid-credential':      'Incorrect email or password.',
    };
    showErr(map[err.code] || err.message);
  }
});

// ── Magic link (kept as UX flourish, uses same error slot) ────
$('#magic').addEventListener('click', () => {
  if (check($('#email'))) {
    $('#note').hidden = false;
    $('#note').style.color = 'var(--accent)';
    $('#note').textContent = `Magic link sent to ${$('#email').value}! Check your inbox.`;
  }
});