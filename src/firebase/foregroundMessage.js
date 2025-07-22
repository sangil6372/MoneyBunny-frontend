// src/firebase/foregroundMessage.js

import { onMessage } from "firebase/messaging";
import { messaging } from "./initFirebase";

// 💬 포그라운드 메시지 수신 (앱 켜져 있을 때)
export const setupForegroundMessageListener = () => {
  onMessage(messaging, (payload) => {
    console.log("🔥 foreground 수신", payload);

    const title = payload.notification?.title || "머니버니 알림";
    const body = payload.notification?.body || "새 알림이 도착했습니다.";
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }
  });
};
