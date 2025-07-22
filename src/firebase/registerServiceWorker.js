// src/firebase/registerServiceWorker.js
export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("✅ SW 등록됨:", registration.scope);
        })
        .catch((err) => {
          console.error("❌ SW 등록 실패:", err);
        });
    });
  }
}
