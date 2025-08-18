<template>
  <div class="settingMain">
    <!-- 알림 설정 항목 수정 -->
    <div class="settingMain">
      <!-- <div class="settingItem" @click="goToNotificationSettings"> -->
      <div class="settingItem" @click="showNotificationModal = true">
        <span class="text">알림 설정</span>
        <img
          src="@/assets/images/icons/mypage/right_arrow.png"
          class="arrowIcon"
        />
      </div>
      <div class="settingItem" @click="showChangePasswordModal = true">
        <span class="text">비밀번호 변경</span>
        <img
          src="@/assets/images/icons/mypage/right_arrow.png"
          class="arrowIcon"
        />
      </div>
      <div class="settingItem" @click="goToPolicyRetest">
        <span class="text">정책유형 재설정</span>
        <img
          src="@/assets/images/icons/mypage/right_arrow.png"
          class="arrowIcon"
        />
      </div>
      <div class="settingItem" @click="showPrivacyModal = true">
        <span class="text">개인정보 처리 방침</span>
        <img
          src="@/assets/images/icons/mypage/right_arrow.png"
          class="arrowIcon"
        />
      </div>
      <div class="settingItem" @click="showTermsModal = true">
        <span class="text">서비스 이용약관</span>
        <img
          src="@/assets/images/icons/mypage/right_arrow.png"
          class="arrowIcon"
        />
      </div>
      <div class="settingItem versionRow">
        <span class="text">버전 정보</span>
        <span class="version">v1.2.3</span>
      </div>
      <div class="settingItem logoutItem" @click="handleLogout">
        <span class="logout">로그아웃</span>
      </div>
    </div>

    <!-- 로그아웃 모달 -->
    <LogoutConfirmModal
      v-if="showLogoutModal"
      @close="showLogoutModal = false"
      @logout="confirmLogout"
    />
    <!-- 알림설정 모달 -->
    <!-- 부모에서 -->
    <NotificationSettingsModal
      v-if="showNotificationModal"
      @close="showNotificationModal = false"
    />

    <ChangePasswordModal
      v-if="showChangePasswordModal"
      @close="showChangePasswordModal = false"
    />
    <PrivacyPolicyModal
      v-if="showPrivacyModal"
      @close="showPrivacyModal = false"
    />
    <TermsModal v-if="showTermsModal" @close="showTermsModal = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useAssetStore } from '@/stores/asset';
import LogoutConfirmModal from './LogoutConfirmModal.vue';
// 알림 설정 모달창
import NotificationSettingsModal from '../modals/NotificationSettingsModal.vue';
import ChangePasswordModal from '../modals/ChangePasswordModal.vue';
// 정책 정보 조회 API import 추가
import { policyAPI } from '@/api/policy';

import TermsModal from '../modals/TermsModal.vue';
import PrivacyPolicyModal from '../modals/PrivacyPolicyModal.vue';

const router = useRouter();
const authStore = useAuthStore();
const assetStore = useAssetStore();

const showLogoutModal = ref(false);
const showPrivacyModal = ref(false);
const showTermsModal = ref(false);

// 알림 설정 페이지로 이동
const goToNotificationSettings = () => {
  router.push({ name: 'notificationSettings' });
};

// 알림 설정 모달창으로 이동
const showNotificationModal = ref(false);

const showChangePasswordModal = ref(false);

const handleLogout = () => {
  showLogoutModal.value = true;
};

// auth store를 통한 실제 로그아웃 처리
// router 변경
const confirmLogout = async () => {
  showLogoutModal.value = false;
  await authStore.logout();

  assetStore.clearSummary?.();

  // Vue next tick 사용하여 상태 반영 이후 이동
  await new Promise((resolve) => setTimeout(resolve)); // 상태 반영 기다림

  // 로그 확인
  // isLogin 상태 확인: false가 되어야 정상

  if (!authStore.isLogin) {
    router.replace({ path: '/' }); // 로그인 페이지로 이동
  } else {
    console.warn('[Logout] 상태 반영이 아직 안 됨');
  }
};

const goToChangePassword = () => {
  router.push({ name: 'changePassword' });
};

const goToPolicyRetest = async () => {
  try {
    const { data } = await policyAPI.getUserPolicy();
    
    // 정책 데이터가 있으면 재설정 페이지로, 없으면 새로 검사
    if (data && Object.keys(data).length > 0) {
      router.push({ name: 'myPageSettingsPolicy' });
    } else {
      router.push({ path: '/policy' });
    }
  } catch (e) {
    console.error('[정책재설정] API 호출 실패:', e);
    // 조회 실패 시에도 검사 페이지로 이동
    router.push({ path: '/policy' });
  }
};
</script>

<style scoped>
.settingMain {
  background-color: #fff;
  border-radius: 18px;
}

.toggleRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.label {
  color: var(--text-login);
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
  padding: 19px 24px 15px 24px;
  border-bottom: 1.5px solid var(--input-bg-1);
}
.settingItem:last-child {
  border-bottom: none;
}

.text {
  color: var(--base-blue-dark);
  font-size: 14px;
  letter-spacing: -0.01em;
}

.arrowIcon {
  width: 18px;
  height: 18px;
  margin-left: 5px;
  opacity: 0.8;
}

.settingItem.versionRow {
  cursor: default;
  border-radius: 10px;
  margin: 3px 0;
  border-bottom: none;
  padding: 13px 24px;
}
.version {
  color: var(--text-lightgray);
}

.logoutItem {
  justify-content: center;
  padding: 18px 0;
  border-bottom: none;
}
.logout {
  color: var(--alert-strong);
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.02em;
}
</style>
