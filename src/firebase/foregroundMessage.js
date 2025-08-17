// src/firebase/foregroundMessage.js

import { onMessage } from "firebase/messaging";
import { messaging } from "./initFirebase";
import { useNotificationStore } from '@/stores/notification';

// 💪(상일) 포그라운드 메시지 수신 (앱이 포커스된 상태일 때만)
export const setupForegroundMessageListener = () => {
  // 💪(상일) 알림 스토어 가져오기
  const notificationStore = useNotificationStore();
  
  onMessage(messaging, (payload) => {
    console.log("🔥 foreground 수신", payload);
    
    // 💪(상일) 안전한 카운트 증가 (동시성 이슈 방지)
    notificationStore.unreadCount = notificationStore.unreadCount + 1;

    // 💪(상일) 알림 아이콘 흔들기 트리거
    notificationStore.triggerIconShake();
    
    console.log(`🔔 알림 수신 완료 (현재 카운트: ${notificationStore.unreadCount})`);
    
    // 💪(상일) 서버에서 실제 카운트 동기화 (약간의 딜레이 후)
    setTimeout(() => {
      notificationStore.fetchUnreadCount();
    }, 1000);
  });
};
