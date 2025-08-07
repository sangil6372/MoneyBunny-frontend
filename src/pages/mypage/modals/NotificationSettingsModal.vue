<template>
  <div class="notificationModalOverlay">
    <div class="notificationModal">
      <div class="notification-settings">
        <!-- 💪(상일) 헤더 -->
        <div class="header">
          <div class="headerSpacer"></div>
          <h2 class="title font-18 font-bold">알림 설정</h2>
          <img
            src="@/assets/images/icons/common/x.png"
            alt="닫기"
            class="closeIcon"
            @click="goBack"
          />
        </div>

        <!-- 💪(상일) 알림 권한 안내 -->
        <div v-if="showPermissionNotice" class="permission-notice">
          <p class="font-13">{{ permissionMessage }}</p>
        </div>

        <!-- 💪(상일) 알림 설정 리스트 -->
        <div class="settings-list" :class="{ 'loading-overlay': isTokenGenerating }">
          <!-- 💪(상일) 로딩 스피너 -->
          <div v-if="isTokenGenerating" class="settings-loading-spinner"></div>
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title font-15 font-bold">북마크 정책 알림</div>
              <p class="setting-desc font-12">
                북마크한 정책의 신청일 및 마감일을 알려드려요
              </p>
            </div>
            <button
              class="toggle-btn font-11 font-bold"
              :class="{
                on: subscriptionStatus.isActiveBookmark,
                off: !subscriptionStatus.isActiveBookmark,
              }"
              @click="toggleNotification('bookmark')"
              :disabled="!hasNotificationPermission || loading || isTokenGenerating"
            >
              {{ subscriptionStatus.isActiveBookmark ? 'ON' : 'OFF' }}
            </button>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title font-15 font-bold">TOP3 추천 알림</div>
              <p class="setting-desc font-12">
                머니버니가 추천하는 맞춤 정책 TOP3를 알려드려요
              </p>
            </div>
            <button
              class="toggle-btn font-11 font-bold"
              :class="{
                on: subscriptionStatus.isActiveTop3,
                off: !subscriptionStatus.isActiveTop3,
              }"
              @click="toggleNotification('top3')"
              :disabled="!hasNotificationPermission || loading || isTokenGenerating"
            >
              {{ subscriptionStatus.isActiveTop3 ? 'ON' : 'OFF' }}
            </button>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title font-15 font-bold">신규 정책 알림</div>
              <p class="setting-desc font-12">
                조건에 맞는 신규 정책이 등록되면 알려드려요
              </p>
            </div>
            <button
              class="toggle-btn font-11 font-bold"
              :class="{
                on: subscriptionStatus.isActiveNewPolicy,
                off: !subscriptionStatus.isActiveNewPolicy,
              }"
              @click="toggleNotification('newPolicy')"
              :disabled="!hasNotificationPermission || loading || isTokenGenerating"
            >
              {{ subscriptionStatus.isActiveNewPolicy ? 'ON' : 'OFF' }}
            </button>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-title font-15 font-bold">소비 피드백 알림</div>
              <p class="setting-desc font-12">
                주간 소비 패턴 분석 리포트를 알려드려요
              </p>
            </div>
            <button
              class="toggle-btn font-11 font-bold"
              :class="{
                on: subscriptionStatus.isActiveFeedback,
                off: !subscriptionStatus.isActiveFeedback,
              }"
              @click="toggleNotification('feedback')"
              :disabled="!hasNotificationPermission || loading || isTokenGenerating"
            >
              {{ subscriptionStatus.isActiveFeedback ? 'ON' : 'OFF' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineEmits } from "vue";
import { storeToRefs } from "pinia";
import { useNotificationStore } from "@/stores/notification";
import { fcmTokenManager, TOKEN_STATES } from "@/firebase/FCMTokenManager";

const emit = defineEmits(['close']);

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
const isTokenGenerating = ref(false); // 💪(상일) 토큰 발급 중 상태

// 💪(상일) 모달 닫기
const goBack = () => {
  emit('close');
};

// 💪(상일) 알림 권한 확인 - FCMTokenManager 사용으로 간소화
const checkNotificationPermission = async () => {
  if (!('Notification' in window)) {
    showPermissionNotice.value = true;
    permissionMessage.value = '이 브라우저는 알림을 지원하지 않습니다.';
    return;
  }

  try {
    loading.value = true;
    const tokenState = fcmTokenManager.getTokenState();

    switch (tokenState) {
      case TOKEN_STATES.ACTIVE:
        hasNotificationPermission.value = true;
        showPermissionNotice.value = false;
        break;

      case TOKEN_STATES.NEED_PERMISSION:
        hasNotificationPermission.value = false;
        if (Notification.permission === "default") {
          // default 상태: 자동으로 권한 요청 (메시지 없음)
          showPermissionNotice.value = false;
          try {
            await requestPermission();
          } catch (error) {
            console.log("사용자가 권한 거부:", error.message);
            // 거부 후에는 안내 메시지 표시
            showPermissionNotice.value = true;
            permissionMessage.value = "기기의 알림 권한을 허용해주세요.";
          }
        } else {
          // denied 상태: 안내 메시지 표시
          showPermissionNotice.value = true;
          permissionMessage.value = "기기의 알림 권한을 허용해주세요.";
        }
        break;

      case TOKEN_STATES.NEED_TOKEN:
        hasNotificationPermission.value = true;
        showPermissionNotice.value = false;
        // 토큰 자동 발급 및 초기 구독
        try {
          isTokenGenerating.value = true; // 로딩 시작
          await fcmTokenManager.getValidToken();
          await createInitialSubscription();
          console.log("✅ 토큰 발급 및 초기 구독 완룜");
        } catch (error) {
          console.error("토큰 발급 실패:", error);
          showPermissionNotice.value = true;
          permissionMessage.value = "알림 설정 초기화에 실패했습니다.";
        } finally {
          isTokenGenerating.value = false; // 로딩 종료
        }
        break;

      default:
        hasNotificationPermission.value = false;
        showPermissionNotice.value = false;
    }
  } catch (error) {
    console.error("권한 확인 실패:", error);
    hasNotificationPermission.value = false;
  } finally {
    loading.value = false;
  }
};

// 💪(상일) 알림 권한 요청 및 초기 구독 설정 - 간소화
const requestPermission = async () => {
  try {
    loading.value = true;
    isTokenGenerating.value = true; // 로딩 시작

    // FCM 토큰 발급 (권한 요청 포함)
    const token = await fcmTokenManager.getValidToken();

    hasNotificationPermission.value = true;
    showPermissionNotice.value = false;

    // 초기 구독 설정 (모든 알림 false로 시작)
    const initialSubscription = {
      token,
      isActiveBookmark: false,
      isActiveTop3: false,
      isActiveNewPolicy: false,
      isActiveFeedback: false,
    };

    await updateSubscription(initialSubscription);

    // 구독 상태 재조회
    await fetchSubscriptionStatus();
  } catch (error) {
    console.error("알림 권한 요청 실패:", error);
    showPermissionNotice.value = true;
    permissionMessage.value = "알림 권한 요청에 실패했습니다.";
  } finally {
    loading.value = false;
    isTokenGenerating.value = false; // 로딩 종료
  }
};

// 💪(상일) 알림 타입별 토글
const toggleNotification = async (type) => {
  if (!hasNotificationPermission.value) {
    // 권한 요청 시도
    try {
      await requestPermission();
      // 권한 허용 성공 시 해당 알림 설정 계속 진행
      if (!hasNotificationPermission.value) {
        return; // 여전히 권한 없으면 중단
      }
    } catch (error) {
      console.warn("권한 요청 실패:", error);
      return;
    }
  }

  // 💪(상일) FCM 토큰 확인 (FCMTokenManager 사용)
  try {
    await fcmTokenManager.getValidToken(); // 토큰이 없으면 자동 발급
  } catch (error) {
    console.error("FCM 토큰 획득 실패:", error);
    alert("알림 설정을 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
    return;
  }

  try {
    loading.value = true;

    // 💪(상일) reactive 객체는 .value 없이 접근
    let currentStatus = false;
    switch (type) {
      case 'bookmark':
        currentStatus = subscriptionStatus.isActiveBookmark;
        break;
      case 'top3':
        currentStatus = subscriptionStatus.isActiveTop3;
        break;
      case 'newPolicy':
        currentStatus = subscriptionStatus.isActiveNewPolicy;
        break;
      case 'feedback':
        currentStatus = subscriptionStatus.isActiveFeedback;
        break;
    }

    await toggleNotificationType(type, !currentStatus);
    console.log(`✅ ${type} 알림 설정 변경 완료: ${!currentStatus}`);
  } catch (error) {
    console.error("알림 설정 변경 실패:", error);
    alert("알림 설정 변경에 실패했습니다. 다시 시도해주세요.");
  } finally {
    loading.value = false;
  }
};

// 💪(상일) 권한 변경 감지 및 자동 새로고침
const setupPermissionWatcher = () => {
  let lastPermission = Notification.permission;
  
  const checkPermissionChange = () => {
    if (Notification.permission !== lastPermission) {
      console.log(`🔄 알림 권한 변경 감지: ${lastPermission} → ${Notification.permission}`);
      
      // 권한 변경 시 즉시 새로고침
      // granted → denied: 권한 해제
      // denied → granted: 권한 허용
      // default → granted/denied: 최초 권한 설정
      window.location.reload();
    }
  };
  
  // 페이지 포커스 시 권한 상태 체크
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setTimeout(checkPermissionChange, 100); // 잠시 대기 후 체크
    }
  });
  
  // 윈도우 포커스 시에도 체크
  window.addEventListener('focus', () => {
    setTimeout(checkPermissionChange, 100);
  });
};

// 💪(상일) 컴포넌트 마운트 시 초기화
onMounted(async () => {
  await checkNotificationPermission();
  
  // 💪(상일) 권한 변경 감지 설정
  setupPermissionWatcher();

  // 💪(상일) 알림 권한이 있을 때만 구독 상태 조회
  if (hasNotificationPermission.value) {
    try {
      await fetchSubscriptionStatus();
    } catch (error) {
      console.warn("구독 상태 조회 실패:", error);
    }
  }
});
</script>

<style scoped>
/* 💪(상일) 모달 컨테이너 (기존 유지) */
.notificationModalOverlay {
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: rgba(30, 40, 60, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
}

.notificationModal {
  max-width: 350px;
  width: 90vw;
  max-height: 100vh;
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 0;
  -webkit-overflow-scrolling: touch;
}

/* 💪(상일) NotificationSettings.vue 스타일 이전 */
.notification-settings {
  background-color: #f8f9fa;
  border-radius: 12px;
  min-height: unset !important;
}

/* 헤더 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background-color: white;
  justify-content: center;
  position: relative;
  border-bottom: 1px solid #e9ecef;
}

.title {
  flex: none;
  text-align: center;
  margin: 0 auto;
  color: var(--text-login);
}

.closeIcon {
  width: 22px;
  height: 22px;
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
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
  margin-top: 12px;
  padding: 10px 20px;
  background-color: var(--text-green);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.permission-btn:hover {
  background-color: #28a745;
}

.permission-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 설정 리스트 - 연결된 스타일 및 로딩 처리 */
.settings-list {
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.loading-overlay {
  opacity: 0.3;
  pointer-events: none;
}

.settings-loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--base-blue-dark);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  z-index: 10;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 14px;
  background-color: white;
  border-radius: 12px;
  margin-bottom: 10px;
}

.setting-info {
  flex: 1;
  margin-right: 5px;
}

.setting-title {
  color: var(--text-login);
  margin: 5px;
}

.setting-desc {
  color: var(--text-lightgray);
  line-height: 1.4;
  margin: 5px;
}

/* 토글 버튼 */
.toggle-btn {
  min-width: 52px;
  height: 32px;
  border-radius: 20px;
  border: none;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  letter-spacing: 0.04em;
  margin-left: 4px;
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
