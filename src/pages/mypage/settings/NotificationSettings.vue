<template>
  <div class="notification-settings">
    <!-- 💪(상일) 헤더 -->
    <div class="header">
      <img
        src="@/assets/images/icons/common/arrow_left.png"
        alt="뒤로가기"
        class="back-icon"
        @click="goBack"
      />
      <h2 class="title font-20 font-bold">알림 설정</h2>
      <div class="empty"></div>
    </div>

    <!-- 💪(상일) 알림 권한 안내 -->
    <div v-if="showPermissionNotice" class="permission-notice">
      <p class="font-14">{{ permissionMessage }}</p>
    </div>

    <!-- 💪(상일) 알림 설정 리스트 -->
    <div class="settings-list">
      <div class="setting-item">
        <div class="setting-info">
          <h3 class="setting-title font-16 font-bold">북마크 정책 알림</h3>
          <p class="setting-desc font-13">
            북마크한 정책의 신청일 및 마감일을 알려드려요
          </p>
        </div>
        <button
          class="toggle-btn font-13 font-bold"
          :class="{
            on: subscriptionStatus.isActiveBookmark,
            off: !subscriptionStatus.isActiveBookmark,
          }"
          @click="toggleNotification('bookmark')"
          :disabled="!hasNotificationPermission || loading"
        >
          {{ subscriptionStatus.isActiveBookmark ? "ON" : "OFF" }}
        </button>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <h3 class="setting-title font-16 font-bold">TOP3 추천 알림</h3>
          <p class="setting-desc font-13">
            머니버니가 추천하는 맞춤 정책 TOP3를 알려드려요
          </p>
        </div>
        <button
          class="toggle-btn font-13 font-bold"
          :class="{
            on: subscriptionStatus.isActiveTop3,
            off: !subscriptionStatus.isActiveTop3,
          }"
          @click="toggleNotification('top3')"
          :disabled="!hasNotificationPermission || loading"
        >
          {{ subscriptionStatus.isActiveTop3 ? "ON" : "OFF" }}
        </button>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <h3 class="setting-title font-16 font-bold">신규 정책 알림</h3>
          <p class="setting-desc font-13">
            조건에 맞는 신규 정책이 등록되면 알려드려요
          </p>
        </div>
        <button
          class="toggle-btn font-13 font-bold"
          :class="{
            on: subscriptionStatus.isActiveNewPolicy,
            off: !subscriptionStatus.isActiveNewPolicy,
          }"
          @click="toggleNotification('newPolicy')"
          :disabled="!hasNotificationPermission || loading"
        >
          {{ subscriptionStatus.isActiveNewPolicy ? "ON" : "OFF" }}
        </button>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <h3 class="setting-title font-16 font-bold">소비 피드백 알림</h3>
          <p class="setting-desc font-13">
            주간 소비 패턴 분석 리포트를 알려드려요
          </p>
        </div>
        <button
          class="toggle-btn font-13 font-bold"
          :class="{
            on: subscriptionStatus.isActiveFeedback,
            off: !subscriptionStatus.isActiveFeedback,
          }"
          @click="toggleNotification('feedback')"
          :disabled="!hasNotificationPermission || loading"
        >
          {{ subscriptionStatus.isActiveFeedback ? "ON" : "OFF" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useNotificationStore } from "@/stores/notification";
import { subscribeToPush } from "@/firebase/notificationPermission";

const router = useRouter();

// 💪(상일) Pinia 스토어 사용 - reactive 객체는 직접 사용
const notificationStore = useNotificationStore();
const subscriptionStatus = notificationStore.subscriptionStatus; // reactive 객체 직접 사용
const { loading } = storeToRefs(notificationStore); // loading만 ref로 사용
const {
  fetchSubscriptionStatus,
  toggleNotificationType,
  updateSubscription,
  createInitialSubscription,
} = notificationStore;

const hasNotificationPermission = ref(false);
const showPermissionNotice = ref(false);
const permissionMessage = ref("");

// 💪(상일) 뒤로가기
const goBack = () => {
  router.back();
};

// 💪(상일) 알림 권한 확인
const checkNotificationPermission = async () => {
  if (!("Notification" in window)) {
    showPermissionNotice.value = true;
    permissionMessage.value = "이 브라우저는 알림을 지원하지 않습니다.";
    return;
  }

  const permission = Notification.permission;
  hasNotificationPermission.value = permission === "granted";

  if (permission === "default") {
    // 권한 요청 전인 경우 - 안내 문구 표시하지 않음
    showPermissionNotice.value = false;
  } else if (permission === "denied") {
    // 권한이 거부된 경우
    showPermissionNotice.value = true;
    permissionMessage.value = "브라우저 설정에서 알림 권한을 허용해주세요.";
  } else {
    // 권한이 있는 경우
    showPermissionNotice.value = false;
    // 💪(상일) 권한이 있지만 FCM 토큰이 없는 경우 발급 및 초기 구독
    const token = localStorage.getItem("fcm_token");
    if (!token) {
      try {
        await subscribeToPush();
        await createInitialSubscription();
      } catch (error) {
        console.error("FCM 토큰 발급 실패:", error);
      }
    }
  }
};

// 💪(상일) 알림 권한 요청 및 초기 구독 설정
const requestPermission = async () => {
  try {
    // 1. FCM 토큰 발급
    await subscribeToPush();
    hasNotificationPermission.value = true;
    showPermissionNotice.value = false;

    const token = localStorage.getItem("fcm_token");
    if (!token) {
      throw new Error("FCM 토큰 발급 실패");
    }

    // 2. 초기 구독 설정 (모든 알림 false로 시작)
    const initialSubscription = {
      token,
      isActiveBookmark: false,
      isActiveTop3: false,
      isActiveNewPolicy: false,
      isActiveFeedback: false,
    };

    await notificationStore.updateSubscription(initialSubscription);

    // 3. 구독 상태 재조회
    await fetchSubscriptionStatus();
  } catch (error) {
    console.error("알림 권한 요청 실패:", error);

    // 권한 상태 재확인
    await checkNotificationPermission();
  }
};

// 💪(상일) 알림 타입별 토글
const toggleNotification = async (type) => {
  if (!hasNotificationPermission.value) {
    alert("먼저 알림 권한을 허용해주세요.");
    return;
  }

  try {
    // 💪(상일) reactive 객체는 .value 없이 접근
    let currentStatus = false;
    switch (type) {
      case "bookmark":
        currentStatus = subscriptionStatus.isActiveBookmark;
        break;
      case "top3":
        currentStatus = subscriptionStatus.isActiveTop3;
        break;
      case "newPolicy":
        currentStatus = subscriptionStatus.isActiveNewPolicy;
        break;
      case "feedback":
        currentStatus = subscriptionStatus.isActiveFeedback;
        break;
    }

    await toggleNotificationType(type, !currentStatus);
  } catch (error) {
    console.error("알림 설정 변경 실패:", error);
    alert("알림 설정 변경에 실패했습니다. 다시 시도해주세요.");
  }
};

// 💪(상일) 컴포넌트 마운트 시 초기화 및 자동 권한 요청
onMounted(async () => {
  await checkNotificationPermission();

  // 💪(상일) 권한이 default 상태면 자동으로 권한 요청
  if (Notification.permission === "default") {
    console.log("🔔 설정 페이지 진입 - 자동 알림 권한 요청");
    try {
      await requestPermission();
    } catch (error) {
      console.log("⚠️ 자동 권한 요청 실패 또는 사용자 거부:", error.message);
      // 실패해도 페이지는 정상 로드
    }
  }

  if (hasNotificationPermission.value) {
    await fetchSubscriptionStatus();
  }
});
</script>

<style scoped>
.notification-settings {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* 헤더 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: white;
  border-bottom: 1px solid #e9ecef;
}

.back-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.title {
  color: var(--text-login);
}

.empty {
  width: 24px;
}

/* 권한 안내 */
.permission-notice {
  margin: 20px;
  padding: 20px;
  background-color: #fff3cd;
  border-radius: 12px;
  text-align: center;
}

.permission-notice p {
  color: #856404;
  margin: 0;
}

.permission-btn {
  padding: 10px 20px;
  background-color: var(--text-green);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

/* 설정 리스트 */
.settings-list {
  margin: 20px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  margin-bottom: 12px;
}

.setting-info {
  flex: 1;
  margin-right: 16px;
}

.setting-title {
  color: var(--text-login);
  margin-bottom: 6px;
}

.setting-desc {
  color: var(--text-lightgray);
  line-height: 1.4;
}

/* 토글 버튼 */
.toggle-btn {
  width: 50px;
  height: 28px;
  border-radius: 10px;
  border: none;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.toggle-btn.on {
  background-color: var(--text-green);
}

.toggle-btn.off {
  background-color: var(--text-lightgray);
}

.toggle-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
