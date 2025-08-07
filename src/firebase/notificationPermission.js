// src/firebase/notificationPermission.js
import { fcmTokenManager } from './FCMTokenManager';

// 💪(상일) 리팩토링: 모든 로직을 FCMTokenManager로 위임

// 🔔 알림 구독 함수
export const subscribeToPush = async () => {
  return await fcmTokenManager.getValidToken();
};

// 🔕 알림 구독 해제 함수
export const unsubscribeFromPush = async () => {
  return await fcmTokenManager.cleanup();
};

// 💪(상일) FCM 토큰 갱신 함수 - 서비스워커 업데이트 시 사용
export const refreshFCMToken = async () => {
  return await fcmTokenManager.refresh();
};

// 💪(상일) 앱 실행 시 알림 권한 체크 및 토큰 정리
export const checkPermissionOnAppStart = async () => {
  return await fcmTokenManager.initialize();
};
