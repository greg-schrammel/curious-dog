import client from "./client";
import "firebase/auth";

const getCurrentUser = () =>
  new Promise((resolve) => {
    const unsubscribe = client.auth().onAuthStateChanged((user) => {
      unsubscribe();
      if (user) resolve(user);
      else resolve(null);
    });
  });

const isHttpsOrLocal =
  self.location.protocol === "https:" || self.location.hostname === "localhost";

self.addEventListener("fetch", (event) => {
  const isSameOrigin =
    self.location.origin === new URL(event.request.url).origin;

  if (!isSameOrigin || !isHttpsOrLocal)
    return event.respondWith(fetch(event.request));

  (async () => {
    const user = await getCurrentUser();
    if (!user) return event.respondWith(fetch(event.request));
    const tokenId = await user.getIdToken();

    const headers = new Headers(event.request.headers);
    headers.append("Authorization", `Bearer ${tokenId}`);

    const requestWithFirebaseInfo = new Request(event.request.url, {
      ...event.request,
      headers,
      mode: "same-origin",
    });

    return event.respondWith(fetch(requestWithFirebaseInfo));
  })();
});
