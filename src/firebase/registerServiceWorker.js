// src/firebase/registerServiceWorker.js
import { deleteToken } from "firebase/messaging";
import { messaging } from "./initFirebase";

export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("✅ SW 등록됨:", registration.scope);

          // 💪(상일) 서비스워커가 새로 설치되는 경우만 FCM 토큰 갱신
          if (registration.installing) {
            console.log("🔄 서비스워커 새로 설치 중 - FCM 토큰 갱신 필요");
            handleTokenRefresh();
          } else if (registration.active) {
            console.log("✅ 서비스워커 이미 활성화됨 - 토큰 유지");
          }

          // 💪(상일) 서비스워커 업데이트 감지
          registration.addEventListener("updatefound", () => {
            console.log("🔄 서비스워커 업데이트 감지 - FCM 토큰 갱신");
            const newWorker = registration.installing;

            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "activated") {
                handleTokenRefresh();
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

// 💪(상일) FCM 토큰 갱신 처리 함수
async function handleTokenRefresh() {
  try {
    // 기존 토큰 삭제
    const oldToken = localStorage.getItem("fcm_token");
    if (oldToken) {
      localStorage.removeItem("fcm_token");
      try {
        await deleteToken(messaging);
        console.log("✅ 기존 FCM 토큰 삭제 완료");
      } catch (error) {
        console.warn("FCM 토큰 삭제 실패:", error);
      }
    }
  } catch (error) {
    console.error("FCM 토큰 갱신 처리 중 오류:", error);
  }
}
