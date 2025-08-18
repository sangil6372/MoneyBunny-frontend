import { defineStore } from "pinia";
import { ref, computed, reactive } from "vue";
import { notificationAPI, subscriptionAPI } from "@/api/notification";

export const useNotificationStore = defineStore("notification", () => {
  // 알림 관련 상태 관리
  const notifications = ref([]);
  const unreadCount = ref(0);
  const shouldShakeIcon = ref(false);
  const subscriptionStatus = reactive({
    subscribed: false,
    isActiveBookmark: false,
    isActiveTop3: false,
    isActiveNewPolicy: false,
    isActiveFeedback: false,
    status: "INACTIVE",
    message: "",
  });
  const loading = ref(false);
  const error = ref(null);

  // 계산된 속성들
  const hasUnread = computed(() => unreadCount.value > 0);

  const policyNotifications = computed(() =>
    notifications.value.filter((n) =>
      ["BOOKMARK", "TOP3", "NEW_POLICY"].includes(n.type)
    )
  );

  const feedbackNotifications = computed(() =>
    notifications.value.filter((n) => n.type === "FEEDBACK")
  );

  // 날짜 변환 유틸리티 함수들
  const transformDate = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray)) return null;
    // 배열 형태를 Date 객체로 변환
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
    return new Date(year, month - 1, day, hour, minute, second);
  };

  const formatDateToString = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray)) return "";
    const [year, month, day] = dateArray;
    return `${month}월 ${day}일`;
  };

  // 알림 목록 조회
  const fetchNotifications = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await notificationAPI.getNotifications();

      // API 응답을 컴포넌트가 기대하는 형태로 변환
      const transformedData = response.data.map((notification) => ({
        id: notification.id,
        type: notification.type,
        title: notification.title,
        description: notification.message,
        message: notification.message,
        target_url: notification.targetUrl,
        targetUrl: notification.targetUrl,
        created_at: transformDate(notification.createdAt),
        createdAt: notification.createdAt,
        read: notification.read,
        typeName: notification.typeName,
        benefit: null,
        dday: null,
        date: formatDateToString(notification.createdAt),
      }));

      notifications.value = transformedData;
    } catch (err) {
      error.value = err.message;
      console.error("알림 조회 실패:", err);
    } finally {
      loading.value = false;
    }
  };

  // 미읽은 알림 개수 조회
  const fetchUnreadCount = async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      unreadCount.value = response.data;
    } catch (err) {
      console.error("미읽은 알림 개수 조회 실패:", err);
    }
  };

  // 알림 읽음 처리
  const markAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      const notification = notifications.value.find(
        (n) => n.id === notificationId
      );
      if (notification) {
        notification.isRead = true;
        unreadCount.value = Math.max(0, unreadCount.value - 1);
      }
    } catch (err) {
      console.error("알림 읽음 처리 실패:", err);
    }
  };

  // 알림 삭제 처리
  const deleteNotification = async (notificationId) => {
    try {
      await notificationAPI.deleteNotification(notificationId);
      const notificationIndex = notifications.value.findIndex(
        (n) => n.id === notificationId
      );
      if (notificationIndex !== -1) {
        const notification = notifications.value[notificationIndex];
        if (!notification.read) {
          unreadCount.value = Math.max(0, unreadCount.value - 1);
        }
        notifications.value.splice(notificationIndex, 1);
      }
      return true;
    } catch (err) {
      console.error("알림 삭제 실패:", err);
      throw err;
    }
  };

  // 구독 상태 조회
  const fetchSubscriptionStatus = async () => {
    try {
      const { fcmTokenManager } = await import("@/firebase/FCMTokenManager");
      const token = await fcmTokenManager.getValidToken();

      const response = await subscriptionAPI.getStatus(token);

      if (response.data) {
        const data = response.data;

        subscriptionStatus.subscribed = data.subscribed ?? false;
        subscriptionStatus.status = data.status || "INACTIVE";
        subscriptionStatus.message = data.message || "";
        subscriptionStatus.isActiveBookmark = data.activeBookmark ?? false;
        subscriptionStatus.isActiveTop3 = data.activeTop3 ?? false;
        subscriptionStatus.isActiveNewPolicy = data.activeNewPolicy ?? false;
        subscriptionStatus.isActiveFeedback = data.activeFeedback ?? false;
      }
    } catch (err) {
      console.error("구독 상태 조회 실패:", err);

      // 토큰 관련 오류 처리
      if (err.response?.status === 404 || err.response?.status === 400) {
        await createInitialSubscription();
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        const { fcmTokenManager } = await import("@/firebase/FCMTokenManager");
        await fcmTokenManager.refresh();
        
        try {
          const newToken = await fcmTokenManager.getValidToken();
          const response = await subscriptionAPI.getStatus(newToken);
          
          if (response.data) {
            const data = response.data;
            subscriptionStatus.subscribed = data.subscribed ?? false;
            subscriptionStatus.status = data.status || "INACTIVE";
            subscriptionStatus.message = data.message || "";
            subscriptionStatus.isActiveBookmark = data.activeBookmark ?? false;
            subscriptionStatus.isActiveTop3 = data.activeTop3 ?? false;
            subscriptionStatus.isActiveNewPolicy = data.activeNewPolicy ?? false;
            subscriptionStatus.isActiveFeedback = data.activeFeedback ?? false;
          }
        } catch (retryErr) {
          console.error("토큰 갱신 후 재시도 실패:", retryErr);
          // 재시도도 실패하면 초기 구독 설정
          await createInitialSubscription();
        }
      }
    }
  };

  // 구독 설정 업데이트
  const updateSubscription = async (data) => {
    try {
      await subscriptionAPI.subscribe(data);
      await fetchSubscriptionStatus();
    } catch (err) {
      console.error("구독 설정 업데이트 실패:", err);
      throw err;
    }
  };

  // 초기 구독 설정 생성 - FCMTokenManager 사용
  const createInitialSubscription = async () => {
    try {
      const { fcmTokenManager } = await import("@/firebase/FCMTokenManager");
      const token = await fcmTokenManager.getValidToken();

      const initialData = {
        token,
        isActiveBookmark: false,
        isActiveTop3: false,
        isActiveNewPolicy: false,
        isActiveFeedback: false,
      };

      await subscriptionAPI.subscribe(initialData);

      // 상태 재조회
      await fetchSubscriptionStatus();
    } catch (err) {
      console.error("초기 구독 설정 실패:", err);
    }
  };

  // 알림 아이콘 흔들기 트리거
  const triggerIconShake = () => {
    shouldShakeIcon.value = true;
    // 애니메이션 시간 후 자동으로 false로 리셋
    setTimeout(() => {
      shouldShakeIcon.value = false;
    }, 600); // 0.6초 후 리셋
  };

  // 스토어 수동 초기화 (로그아웃 시 사용)
  const resetStore = () => {
    loading.value = true; // 초기화 중임을 표시
    
    notifications.value = [];
    unreadCount.value = 0;
    shouldShakeIcon.value = false;
    
    // reactive 객체 초기화
    subscriptionStatus.subscribed = false;
    subscriptionStatus.isActiveBookmark = false;
    subscriptionStatus.isActiveTop3 = false;
    subscriptionStatus.isActiveNewPolicy = false;
    subscriptionStatus.isActiveFeedback = false;
    subscriptionStatus.status = "INACTIVE";
    subscriptionStatus.message = "";
    
    error.value = null;
    
    // 다음 렌더링 사이클에서 loading 해제
    setTimeout(() => {
      loading.value = false;
    }, 0);
    
  };

  // 개별 알림 타입 토글
  const toggleNotificationType = async (type, enabled) => {
    const { fcmTokenManager } = await import("@/firebase/FCMTokenManager");
    const token = await fcmTokenManager.getValidToken();

    const data = { token, enabled };

    try {
      // 즉시 UI 업데이트
      switch (type) {
        case "bookmark":
          subscriptionStatus.isActiveBookmark = enabled;
          break;
        case "top3":
          subscriptionStatus.isActiveTop3 = enabled;
          break;
        case "newPolicy":
          subscriptionStatus.isActiveNewPolicy = enabled;
          break;
        case "feedback":
          subscriptionStatus.isActiveFeedback = enabled;
          break;
      }

      switch (type) {
        case "bookmark":
          await subscriptionAPI.toggleBookmark(data);
          break;
        case "top3":
          await subscriptionAPI.toggleTop3(data);
          break;
        case "newPolicy":
          await subscriptionAPI.toggleNewPolicy(data);
          break;
        case "feedback":
          await subscriptionAPI.toggleFeedback(data);
          break;
      }
    } catch (err) {
      console.error(`${type} 알림 토글 실패:`, err);

      // 구독 데이터가 없는 경우 초기 설정 후 재시도
      if (err.response?.status === 404 || err.response?.status === 400) {
        await createInitialSubscription();
        await toggleNotificationType(type, enabled);
        return;
      }

      // API 실패 시 로컬 상태를 이전으로 롤백
      switch (type) {
        case "bookmark":
          subscriptionStatus.isActiveBookmark = !enabled;
          break;
        case "top3":
          subscriptionStatus.isActiveTop3 = !enabled;
          break;
        case "newPolicy":
          subscriptionStatus.isActiveNewPolicy = !enabled;
          break;
        case "feedback":
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
    shouldShakeIcon,
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
    deleteNotification,
    fetchSubscriptionStatus,
    updateSubscription,
    toggleNotificationType,
    createInitialSubscription,
    triggerIconShake,
    resetStore,
  };
});
