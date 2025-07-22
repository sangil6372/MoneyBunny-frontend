// src/firebase/notificationPermission.js

import { getToken, deleteToken } from "firebase/messaging";
import { messaging } from "./initFirebase";

// 🔔 알림 구독 함수
export const subscribeToPush = async () => {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("알림 권한 거부됨");

  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
  });
  console.log("🪪 내 FCM 토큰: ", token);

  const res = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) throw new Error("서버 응답 오류");
  return token;
};

// 🔕 알림 구독 해제 함수
export const unsubscribeFromPush = async () => {
  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
  });

  await deleteToken(messaging);

  await fetch("/api/push/unsubscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  return true;
};
