// src/firebase/registerServiceWorker.js
import { fcmTokenManager } from "./FCMTokenManager";

export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("✅ SW 등록됨:", registration.scope);

          // 💪(상일) 서비스워커 상태 확인 - 새로고침 시에는 갱신하지 않음
          if (registration.installing) {
            console.log("🔄 서비스워커 설치 중...");
            // 새로고침이 아닌 실제 새 설치인 경우만 토큰 갱신
            registration.installing.addEventListener(
              "statechange",
              function () {
                if (this.state === "activated" && !registration.active) {
                  console.log("🔄 서비스워커 최초 설치 완료 - FCM 토큰 갱신");
                  fcmTokenManager.refresh();
                }
              }
            );
          } else if (registration.active) {
            console.log("✅ 서비스워커 이미 활성화됨");
          }

          // 💪(상일) 서비스워커 업데이트 감지
          registration.addEventListener("updatefound", () => {
            console.log("🔄 서비스워커 업데이트 감지");
            const newWorker = registration.installing;

            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "activated") {
                console.log("⚠️ 서비스워커 업데이트로 인한 토큰 갱신");
                // 실제 업데이트인 경우에만 갱신
                // fcmTokenManager.refresh(); // 일단 비활성화
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
