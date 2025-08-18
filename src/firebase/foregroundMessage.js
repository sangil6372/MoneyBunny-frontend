// src/firebase/foregroundMessage.js

import { onMessage } from "firebase/messaging";
import { messaging } from "./initFirebase";
import { useNotificationStore } from '@/stores/notification';

// 포그라운드 메시지 수신
export const setupForegroundMessageListener = () => {
  const notificationStore = useNotificationStore();
  
  onMessage(messaging, (payload) => {
    
    notificationStore.unreadCount = notificationStore.unreadCount + 1;

    notificationStore.triggerIconShake();
    
    
    // 서버에서 실제 카운트 동기화
    setTimeout(() => {
      notificationStore.fetchUnreadCount();
    }, 1000);
  });
};
