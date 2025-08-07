// src/firebase/registerServiceWorker.js
import { fcmTokenManager } from './FCMTokenManager';

export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("✅ SW 등록됨:", registration.scope);

          // 💪(상일) 서비스워커가 새로 설치되는 경우만 FCM 토큰 갱신
          if (registration.installing) {
            console.log("🔄 서비스워커 새로 설치 중 - FCM 토큰 갱신");
            fcmTokenManager.refresh();
          } else if (registration.active) {
            console.log("✅ 서비스워커 이미 활성화됨");
          }

          // 💪(상일) 서비스워커 업데이트 감지
          registration.addEventListener("updatefound", () => {
            console.log("🔄 서비스워커 업데이트 감지");
            const newWorker = registration.installing;

            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "activated") {
                fcmTokenManager.refresh();
              }
            });
          });
        })
        .catch((err) => {
          console.error("❌ SW 등록 실패:", err);
        });
    });
  }
}
