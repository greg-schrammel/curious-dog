import "./auth";

self.addEventListener("activate", (event) => {
  event.waitUntil(this.clients.claim());
});
