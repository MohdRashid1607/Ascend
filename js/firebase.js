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

// ── PASTE YOUR FIREBASE CONFIG HERE ──────────────────────────
const firebaseConfig = {
  apiKey:            "PASTE_YOUR_API_KEY",
  authDomain:        "PASTE_YOUR_AUTH_DOMAIN",
  projectId:         "PASTE_YOUR_PROJECT_ID",
  storageBucket:     "PASTE_YOUR_STORAGE_BUCKET",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID",
  appId:             "PASTE_YOUR_APP_ID"
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
