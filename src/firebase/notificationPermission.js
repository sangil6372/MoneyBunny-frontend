// src/firebase/notificationPermission.js

import { getToken, deleteToken } from 'firebase/messaging';
import { messaging } from './initFirebase';
import axios from '@/api'; // JWT 토큰 자동 추가를 위한 axios 인터셉터 사용

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

  try {
    // 💪(상일) 새로운 백엔드 엔드포인트에 맞춰 수정
    await axios.post('/api/push/subscriptions', { token });
  } catch (error) {
    console.warn('푸시 알림 구독 실패 (백엔드 서버 확인 필요):', error.message);
    // 푸시 알림 구독 실패해도 토큰은 반환 (로그인 진행 가능)
  }
  
  return token;
};

// 🔕 알림 구독 해제 함수
export const unsubscribeFromPush = async () => {
  const token = localStorage.getItem('fcm_token');
  // token이 null이면 서버에 보내봤자 무의미
  if (!token) return false;
  try {
    // 💪(상일) 새로운 백엔드 엔드포인트에 맞춰 수정 (DELETE 방식)
    await axios.delete(`/api/push/subscriptions/${token}`);
  } catch (error) {
    console.warn('푸시 알림 구독 해제 실패 (백엔드 서버 확인 필요):', error.message);
  }
  return true;
};
