// src/firebase/notificationPermission.js

import { getToken, deleteToken } from 'firebase/messaging';
import { messaging } from './initFirebase';

// 🔔 알림 구독 함수
export const subscribeToPush = async () => {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('알림 권한 거부됨');

  // 1. localStorage에서 기존 토큰 확인
  let token = localStorage.getItem('fcm_token');
  if (!token) {
    // 2. 없으면 새로 발급
    token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });
    // 3. 새 토큰 저장
    localStorage.setItem('fcm_token', token);
  }
  console.log('🪪 내 FCM 토큰: ', token);

  const res = await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  if (!res.ok) throw new Error('서버 응답 오류');
  return token;
};

// 🔕 알림 구독 해제 함수
export const unsubscribeFromPush = async () => {
  const token = localStorage.getItem('fcm_token');
  // token이 null이면 서버에 보내봤자 무의미
  if (!token) return false;
  await fetch('/api/push/unsubscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  return true;
};
