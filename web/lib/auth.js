import app, { firebase } from "lib/firebase/client";
import "firebase/auth";

const auth = app.auth();

export function logout() {
  return auth.signOut();
}

export function login(provider) {
  return auth.signInWithPopup(provider).then(() => {
    registerSessionSW();
  });
}

export function onAuthStateChanged(cb) {
  return auth.onAuthStateChanged(cb);
}

export function loginWithTwitter() {
  const twitterProvider = new firebase.auth.TwitterAuthProvider();
  twitterProvider.setCustomParameters({ allow_signup: "true" });
  return login(twitterProvider);
}

function registerSessionSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js", { scope: "/" });
  }
}
