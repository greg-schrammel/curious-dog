import firebase from '../firebase/app';
import 'firebase/auth';

const auth = firebase.auth();

export function logout() {
  return auth.signOut();
}

export function login(provider) {
  return auth.signInWithPopup(provider);
}

export function onAuthStateChanged(cb) {
  return auth.onAuthStateChanged(cb);
}

export function loginWithTwitter() {
  const twitterProvider = new firebase.auth.TwitterAuthProvider().setCustomParameters({
    allow_signup: 'true'
  });
  return login(twitterProvider);
}
