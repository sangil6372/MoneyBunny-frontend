<template>
  <div class="settingMain">
    <!-- 알림 설정 (settingItem으로 통일) -->
    <div class="settingItem">
      <span class="text font-18 font-regular">알림 설정</span>
      <button
        class="toggleBtn font-14 font-bold"
        :class="{ on: notificationEnabled, off: !notificationEnabled }"
        @click="toggleNotification"
      >
        {{ notificationEnabled ? "ON" : "OFF" }}
      </button>
    </div>

    <!-- 설정 리스트 -->
    <div class="settingList">
      <div class="settingItem">
        <span class="text font-18 font-regular">비밀번호 변경</span>
        <img
          src="@/assets/images/icons/mypage/right_arrow.png"
          alt="arrow"
          class="arrowIcon"
          @click="goToChangePassword"
        />
      </div>
      <div class="settingItem">
        <span class="text font-18 font-regular">개인정보 처리 방침</span>
        <img
          src="@/assets/images/icons/mypage/right_arrow.png"
          class="arrowIcon"
        />
      </div>
      <div class="settingItem">
        <span class="text font-18 font-regular">서비스 이용약관</span>
        <img
          src="@/assets/images/icons/mypage/right_arrow.png"
          class="arrowIcon"
        />
      </div>
      <div class="settingItem">
        <span class="text font-18 font-regular">버전 정보</span>
        <span class="version font-15 font-regular">v1.2.3</span>
      </div>
      <!-- ✅ 로그아웃 항목 (리스트처럼 보이게) -->
      <div class="settingItem logoutItem" @click="handleLogout">
        <span class="text font-18 font-regular logout">로그아웃</span>
      </div>
    </div>

    <!-- 로그아웃 모달 -->
    <LogoutConfirmModal
      v-if="showLogoutModal"
      @close="showLogoutModal = false"
      @logout="confirmLogout"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  subscribeToPush,
  unsubscribeFromPush,
} from "@/firebase/notificationPermission";
import LogoutConfirmModal from "./LogoutConfirmModal.vue";

const router = useRouter();
const notificationEnabled = ref(false);
const showLogoutModal = ref(false);

// 현재 FCM 구독 상태를 확인
const checkSubscription = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  notificationEnabled.value = !!subscription;
};

// 토글 시 FCM 구독/해제
const toggleNotification = async () => {
  try {
    if (notificationEnabled.value) {
      await unsubscribeFromPush();
    } else {
      await subscribeToPush();
    }
    notificationEnabled.value = !notificationEnabled.value;
  } catch (err) {
    console.error("알림 토글 중 오류 발생:", err.message);
  }
};

const handleLogout = () => {
  showLogoutModal.value = true;
};

const confirmLogout = () => {
  // 로그아웃 처리 로직 (예: localStorage 제거, router 이동 등)
  localStorage.removeItem("currentUser");
  router.push("/login");
};

const goToChangePassword = () => {
  router.push({ name: "changePassword" });
};

const logout = () => {
  alert("로그아웃 되었습니다.");
};

onMounted(() => {
  checkSubscription();
});
</script>

<style scoped>
.settingMain {
  padding: 6px 20px 20px 20px;
  background-color: white;
  border-radius: 16px;
}

.toggleRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.label {
  color: var(--text-login);
}

.toggleBtn {
  width: 56px;
  height: 30px;
  border-radius: 20px;
  border: none;
  color: white;
  cursor: pointer;
}

.toggleBtn.on {
  background-color: var(--text-green);
}

.toggleBtn.off {
  background-color: var(--text-lightgray);
}

.settingList {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.settingItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--input-bg-1);
}

.settingItem:last-child {
  border-bottom: none;
}

.text {
  color: var(--text-login);
}

.arrowIcon {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.version {
  color: var(--text-lightgray);
}
.logout {
  color: red;
}
</style>
