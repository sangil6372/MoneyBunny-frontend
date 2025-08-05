// src/firebase/foregroundMessage.js

import { onMessage } from "firebase/messaging";
import { messaging } from "./initFirebase";

// 💪(상일) 포그라운드 메시지 수신 (앱이 포커스된 상태일 때만)
export const setupForegroundMessageListener = () => {
  onMessage(messaging, (payload) => {
    console.log("🔥 foreground 수신", payload);

    // 💪(상일) 권한 확인 및 포그라운드 상태일 때만 알림 표시
    if (Notification.permission === "granted") {
      // 💪(상일) 페이지가 보이는 상태이고 포커스된 상태일 때만
      if (document.visibilityState === "visible" && document.hasFocus()) {
        const title = payload.notification?.title || "머니버니 알림";
        const notificationOptions = {
          body: payload.notification?.body || "새 알림이 도착했습니다.",
          icon: "/icons/icon-192x192.png",
          badge: "/icons/icon-192x192.png",
          tag: "moneybunny-foreground-" + Date.now(), // 💪(상일) 고유 태그로 중복 방지
          requireInteraction: false,
          silent: false,
          data: payload.data || {}
        };
        
        const notification = new Notification(title, notificationOptions);
        
        // 💪(상일) 4초 후 자동으로 알림 닫기
        setTimeout(() => {
          notification.close();
        }, 4000);
        
        // 💪(상일) 클릭 이벤트 처리
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }
    }
  });
};
