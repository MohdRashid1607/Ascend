// ============================================================
// js/firebase.js — Firebase Auth for Ascend
// ============================================================
//
// SETUP (one-time, ~5 minutes):
// 1. Go to https://console.firebase.google.com → "Add project" → name it "Ascend"
// 2. Click </> (Web) → register app → copy the firebaseConfig object below
// 3. In Firebase console → Authentication → Get started → Sign-in method:
//    a. Enable "Google"
//    b. Enable "GitHub" — you'll need a GitHub OAuth App:
//       • Go to https://github.com/settings/developers → "New OAuth App"
//       • Homepage URL: your GitHub Pages URL (or http://localhost if testing)
//       • Callback URL: copy from Firebase (shown when you enable GitHub)
//       • Paste the Client ID and Secret into Firebase
// 4. Replace the placeholder values below with your actual config
// ============================================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged as _onAuth,
  signOut as _signOut,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

// ── YOUR FIREBASE CONFIG ──────────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyDK8coudBLQePNF4f-3OUYTxZ01d_cz6Ik",
  authDomain:        "ascend-3dc74.firebaseapp.com",
  projectId:         "ascend-3dc74",
  storageBucket:     "ascend-3dc74.firebasestorage.app",
  messagingSenderId: "909347281320",
  appId:             "1:909347281320:web:f43dd0e2581f9f0c2f659d",
  measurementId:     "G-61WLLB19X4"
};
// ─────────────────────────────────────────────────────────────

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Social providers
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const githubProvider = new GithubAuthProvider();
githubProvider.addScope('read:user');

// ── Exported helpers ─────────────────────────────────────────

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithGitHub = () => signInWithPopup(auth, githubProvider);

export const registerWithEmail = (email, password, name) =>
  createUserWithEmailAndPassword(auth, email, password)
    .then(({ user }) => updateProfile(user, { displayName: name }));

export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const signOutUser = () => _signOut(auth);

export const onAuthStateChanged = (cb) => _onAuth(auth, cb);
