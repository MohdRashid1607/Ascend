// Firebase for Ascend. Web config keys are public by design; never put an OAuth Client Secret in this repo.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  onAuthStateChanged as _onAuth, signOut as _signOut, updateProfile
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const firebaseConfig = {
  apiKey:            "AIzaSyDK8coudBLQePNF4f-3OUYTxZ01d_cz6Ik",
  authDomain:        "ascend-3dc74.firebaseapp.com",
  projectId:         "ascend-3dc74",
  storageBucket:     "ascend-3dc74.firebasestorage.app",
  messagingSenderId: "909347281320",
  appId:             "1:909347281320:web:f43dd0e2581f9f0c2f659d",
  measurementId:     "G-61WLLB19X4"
};

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
const githubProvider = new GithubAuthProvider();
githubProvider.addScope('read:user');

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithGitHub = () => signInWithPopup(auth, githubProvider);
export const registerWithEmail = (email, password, name) =>
  createUserWithEmailAndPassword(auth, email, password)
    .then(({ user }) => updateProfile(user, { displayName: name }));
export const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const signOutUser = () => _signOut(auth);
export const onAuthStateChanged = (cb) => _onAuth(auth, cb);
export { updateProfile };
