import firebase from "./app";
import "firebase/auth";

const getCurrentUser = () =>
  new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      unsubscribe();
      if (user) resolve(user);
      else resolve(null);
    });
  });

const isHttpsOrLocal =
  self.location.protocol == "https:" || self.location.hostname == "localhost";

self.addEventListener("fetch", event => {
  const isSameOrigin =
    self.location.origin == new URL(event.request.url).origin;

  if (isSameOrigin && isHttpsOrLocal)
    return event.respondWith(fetch(event.request));

  (async () => {
    const user = await getCurrentUser();
    const tokenId = await user.getTokenId();

    const headers = new Headers(event.request.headers);
    headers.append("Authorization", "Bearer " + tokenId);

    const requestWithFirebaseInfo = new Request(event.request.url, {
      ...event.request,
      headers: headers,
      mode: "same-origin"
    });

    event.respondWith(fetch(requestWithFirebaseInfo));
  })();
});
