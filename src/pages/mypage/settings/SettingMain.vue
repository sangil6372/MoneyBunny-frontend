<template>
  <div class="settingMain">
    <!-- 💪(상일) 알림 설정 항목 수정 -->
    <div class="settingItem" @click="goToNotificationSettings">
      <span class="text font-16">알림 설정</span>
      <img
        src="@/assets/images/icons/mypage/right_arrow.png"
        alt="arrow"
        class="arrowIcon"
      />
    </div>

    <!-- 설정 리스트 -->
    <div class="settingList">
      <div class="settingItem">
        <span class="text font-16">비밀번호 변경</span>
        <img
          src="@/assets/images/icons/mypage/right_arrow.png"
          alt="arrow"
          class="arrowIcon"
          @click="goToChangePassword"
        />
      </div>
      <div class="settingItem">
        <span class="text font-16">정책유형 재설정</span>
        <img
          src="@/assets/images/icons/mypage/right_arrow.png"
          class="arrowIcon"
          @click="goToPolicyRetest"
        />
      </div>

      <div class="settingItem">
        <span class="text font-16">개인정보 처리 방침</span>
        <img
          src="@/assets/images/icons/mypage/right_arrow.png"
          class="arrowIcon"
        />
      </div>
      <div class="settingItem">
        <span class="text font-16">서비스 이용약관</span>
        <img
          src="@/assets/images/icons/mypage/right_arrow.png"
          class="arrowIcon"
        />
      </div>
      <div class="settingItem">
        <span class="text font-16">버전 정보</span>
        <span class="version font-14">v1.2.3</span>
      </div>
      <!-- ✅ 로그아웃 항목 (리스트처럼 보이게) -->
      <div class="settingItem logoutItem" @click="handleLogout">
        <span class="text font-16 logout">로그아웃</span>
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import LogoutConfirmModal from "./LogoutConfirmModal.vue";

const router = useRouter();
const authStore = useAuthStore();
const showLogoutModal = ref(false);

// 💪(상일) 알림 설정 페이지로 이동
const goToNotificationSettings = () => {
  router.push({ name: "notificationSettings" });
};

const handleLogout = () => {
  showLogoutModal.value = true;
};

// 💪(상일) auth store를 통한 실제 로그아웃 처리
// 🎵(유정) router 변경
const confirmLogout = async () => {
  showLogoutModal.value = false;
  await authStore.logout();

  // Vue next tick 사용하여 상태 반영 이후 이동
  await new Promise((resolve) => setTimeout(resolve)); // 상태 반영 기다림

  // 로그 확인
  console.log("[Logout] isLogin 상태:", authStore.isLogin); // false 나와야 정상

  if (!authStore.isLogin) {
    router.replace({ path: "/" }); // 로그인 페이지로 이동
  } else {
    console.warn("[Logout] 상태 반영이 아직 안 됨");
  }
};

const goToChangePassword = () => {
  router.push({ name: "changePassword" });
};

const goToPolicyRetest = () => {
  router.push({ name: "myPageSettingsPolicy" });
};
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
  width: 50px;
  height: 28px;
  border-radius: 10px;
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
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.version {
  color: var(--text-lightgray);
}
.logout {
  color: red;
}
</style>
