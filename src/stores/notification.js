import { defineStore } from 'pinia';
import { ref, computed, reactive } from 'vue';
import { notificationAPI, subscriptionAPI } from '@/api/notification';

export const useNotificationStore = defineStore('notification', () => {
  // 💪(상일) 알림 관련 상태 관리
  const notifications = ref([]);
  const unreadCount = ref(0);
  // 💪(상일) reactive로 변경하여 반응성 보장
  const subscriptionStatus = reactive({
    subscribed: false,
    isActiveBookmark: false,
    isActiveTop3: false,
    isActiveNewPolicy: false,
    isActiveFeedback: false,
    status: 'INACTIVE',
    message: ''
  });
  const loading = ref(false);
  const error = ref(null);

  // 💪(상일) 계산된 속성들
  const hasUnread = computed(() => unreadCount.value > 0);
  
  const policyNotifications = computed(() => 
    notifications.value.filter(n => ['BOOKMARK', 'TOP3', 'NEW_POLICY'].includes(n.type))
  );
  
  const feedbackNotifications = computed(() => 
    notifications.value.filter(n => n.type === 'FEEDBACK')
  );

  // 💪(상일) 날짜 변환 유틸리티 함수들
  const transformDate = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray)) return null;
    // [2025, 8, 4, 12, 0, 2] 형태를 Date 객체로 변환
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
    return new Date(year, month - 1, day, hour, minute, second); // month는 0부터 시작
  };

  const formatDateToString = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray)) return '';
    const [year, month, day] = dateArray;
    return `${month}월 ${day}일`;
  };

  // 💪(상일) 알림 목록 조회
  const fetchNotifications = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await notificationAPI.getNotifications();
      
      // 💪(상일) API 응답을 컴포넌트가 기대하는 형태로 변환
      const transformedData = response.data.map(notification => ({
        id: notification.id,
        type: notification.type, // BOOKMARK, TOP3, NEW_POLICY, FEEDBACK
        title: notification.title,
        description: notification.message, // message → description 매핑
        message: notification.message, // 기존 필드도 유지
        target_url: notification.targetUrl, // targetUrl → target_url 매핑
        targetUrl: notification.targetUrl, // 기존 필드도 유지
        created_at: transformDate(notification.createdAt), // 배열을 Date로 변환
        createdAt: notification.createdAt, // 원본도 유지
        read: notification.read,
        typeName: notification.typeName,
        // 누락된 필드들 기본값 설정
        benefit: null,
        dday: null,
        date: formatDateToString(notification.createdAt)
      }));
      
      notifications.value = transformedData;
    } catch (err) {
      error.value = err.message;
      console.error('알림 조회 실패:', err);
    } finally {
      loading.value = false;
    }
  };

  // 💪(상일) 미읽은 알림 개수 조회
  const fetchUnreadCount = async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      unreadCount.value = response.data;
    } catch (err) {
      console.error('미읽은 알림 개수 조회 실패:', err);
    }
  };

  // 💪(상일) 알림 읽음 처리
  const markAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      // 로컬 상태 업데이트
      const notification = notifications.value.find(n => n.id === notificationId);
      if (notification) {
        notification.isRead = true;
        unreadCount.value = Math.max(0, unreadCount.value - 1);
      }
    } catch (err) {
      console.error('알림 읽음 처리 실패:', err);
    }
  };

  // 💪(상일) 구독 상태 조회
  const fetchSubscriptionStatus = async () => {
    try {
      const token = localStorage.getItem('fcm_token');
      if (!token) {
        console.error('구독 상태 조회 실패: FCM 토큰 없음');
        return;
      }
      
      const response = await subscriptionAPI.getStatus(token);
      
      if (response.data) {
        const data = response.data;
        
        // 💪(상일) API 응답 구조에 맞게 정확한 필드명 사용
        subscriptionStatus.subscribed = data.subscribed ?? false;
        subscriptionStatus.status = data.status || 'INACTIVE';
        subscriptionStatus.message = data.message || '';
        subscriptionStatus.isActiveBookmark = data.activeBookmark ?? false;
        subscriptionStatus.isActiveTop3 = data.activeTop3 ?? false;
        subscriptionStatus.isActiveNewPolicy = data.activeNewPolicy ?? false;
        subscriptionStatus.isActiveFeedback = data.activeFeedback ?? false;
      }
    } catch (err) {
      console.error('구독 상태 조회 실패:', err);
      
      // 💪(상일) 404나 구독 데이터가 없는 경우 초기 구독 설정 필요
      if (err.response?.status === 404 || err.response?.status === 400) {
        await createInitialSubscription();
      }
    }
  };

  // 💪(상일) 구독 설정 업데이트
  const updateSubscription = async (data) => {
    try {
      await subscriptionAPI.subscribe(data);
      await fetchSubscriptionStatus();
    } catch (err) {
      console.error('구독 설정 업데이트 실패:', err);
      throw err;
    }
  };

  // 💪(상일) 초기 구독 설정 생성
  const createInitialSubscription = async () => {
    const token = localStorage.getItem('fcm_token');
    if (!token) {
      console.error('초기 구독 설정 실패: FCM 토큰 없음');
      return;
    }

    try {
      const initialData = {
        token,
        isActiveBookmark: false,
        isActiveTop3: false,
        isActiveNewPolicy: false,
        isActiveFeedback: false
      };
      
      await subscriptionAPI.subscribe(initialData);
      
      // 상태 재조회
      await fetchSubscriptionStatus();
    } catch (err) {
      console.error('초기 구독 설정 실패:', err);
    }
  };

  // 💪(상일) 개별 알림 타입 토글
  const toggleNotificationType = async (type, enabled) => {
    const token = localStorage.getItem('fcm_token');
    if (!token) {
      throw new Error('FCM 토큰이 없습니다');
    }

    const data = { token, enabled };
    
    try {
      // 💪(상일) 즉시 UI 업데이트 (낙관적 업데이트)
      switch(type) {
        case 'bookmark':
          subscriptionStatus.isActiveBookmark = enabled;
          break;
        case 'top3':
          subscriptionStatus.isActiveTop3 = enabled;
          break;
        case 'newPolicy':
          subscriptionStatus.isActiveNewPolicy = enabled;
          break;
        case 'feedback':
          subscriptionStatus.isActiveFeedback = enabled;
          break;
      }
      
      // API 호출
      switch(type) {
        case 'bookmark':
          await subscriptionAPI.toggleBookmark(data);
          break;
        case 'top3':
          await subscriptionAPI.toggleTop3(data);
          break;
        case 'newPolicy':
          await subscriptionAPI.toggleNewPolicy(data);
          break;
        case 'feedback':
          await subscriptionAPI.toggleFeedback(data);
          break;
      }
      
    } catch (err) {
      console.error(`${type} 알림 토글 실패:`, err);
      
      // 💪(상일) 구독 데이터가 없는 경우 초기 설정 후 재시도
      if (err.response?.status === 404 || err.response?.status === 400) {
        await createInitialSubscription();
        await toggleNotificationType(type, enabled);
        return;
      }
      
      // 💪(상일) API 실패 시 로컬 상태를 이전으로 롤백
      switch(type) {
        case 'bookmark':
          subscriptionStatus.isActiveBookmark = !enabled;
          break;
        case 'top3':
          subscriptionStatus.isActiveTop3 = !enabled;
          break;
        case 'newPolicy':
          subscriptionStatus.isActiveNewPolicy = !enabled;
          break;
        case 'feedback':
          subscriptionStatus.isActiveFeedback = !enabled;
          break;
      }
      throw err;
    }
  };

  return {
    // 상태
    notifications,
    unreadCount,
    subscriptionStatus,
    loading,
    error,
    
    // 계산된 속성
    hasUnread,
    policyNotifications,
    feedbackNotifications,
    
    // 액션
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    fetchSubscriptionStatus,
    updateSubscription,
    toggleNotificationType,
    createInitialSubscription,
  };
});