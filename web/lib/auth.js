import app, { firebase } from "lib/firebase/client";
import "firebase/auth";
import "firebase/firestore";

const auth = app.auth();
const usersCollection = app.firestore().collection("users");

function registerSessionSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js", { scope: "/" });
  }
}

export function login(provider) {
  registerSessionSW();
  return auth.signInWithPopup(provider);
}

export function logout() {
  return auth.signOut();
}

export function onAuthStateChanged(cb) {
  return auth.onAuthStateChanged(cb);
}

export function loginWithTwitter() {
  const twitterProvider = new firebase.auth.TwitterAuthProvider();
  twitterProvider.setCustomParameters({ allow_signup: "true" });
  return login(twitterProvider).then((u) => {
    const { secret, accessToken: token } = u.credential;

    // if (u.additionalUserInfo.isNewUser) {
    const userRef = usersCollection.doc(u.user.uid);
    userRef.set({ userName: u.additionalUserInfo.username }, { merge: true }); // twitter @ handle, can't get on trigger
    userRef.collection("credentials").doc("twitter").set({ token, secret });
    // }
  });
}
