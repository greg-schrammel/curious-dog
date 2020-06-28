import "./lib/firebase/sw";

self.addEventListener("activate", (event) => {
  event.waitUntil(this.clients.claim());
});
