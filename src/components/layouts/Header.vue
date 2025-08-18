<template>
  <header class="top-header">
    <div class="header-inner">
      <!-- 숨겨진 관리자 접근 영역 -->
      <div class="admin-access-area" @click="handleAdminAccess"></div>

      <RouterLink to="/home" class="logo-link">
        <div class="logo-text font-28 font-extrabold">MoneyBunny</div>
      </RouterLink>
      <!--알림 이동 (미읽은 개수 배지 포함)-->
      <RouterLink
        to="/notification"
        class="notification-link"
        :class="{ shake: shouldShakeIcon }"
      >
        <div class="notification-wrapper">
          <img
            src="@/assets/images/icons/bunny/notification_bunny_background.png"
            alt="MoneyBunny Logo"
            class="logo-img"
          />
          <div v-if="unreadCount > 0" class="notification-badge">
            {{ unreadCount > 9 ? '9+' : unreadCount }}
          </div>
        </div>
      </RouterLink>
    </div>
  </header>
</template>

<script setup>
import { onMounted, computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotificationStore } from '@/stores/notification';
import { useAuthStore } from '@/stores/auth';

// 알림 스토어 및 라우트 사용
const route = useRoute();
const router = useRouter();
const notificationStore = useNotificationStore();
const authStore = useAuthStore();
const unreadCount = computed(() => notificationStore.unreadCount);
const shouldShakeIcon = computed(() => notificationStore.shouldShakeIcon);

// 로그인 여부 확인
const auth = useAuthStore();
const isLoggedIn = computed(() => auth.isLogin);

// 관리자 페이지 접근을 위한 클릭 카운터
const clickCount = ref(0);
const clickTimeout = ref(null);

// 컴포넌트 마운트 시 미읽은 알림 개수 조회 - 특정 라우트에서만
onMounted(async () => {
  // 로그인 및 라우트 상태 확인
  // 비로그인: 알림 API 호출 X
  if (!isLoggedIn.value) return;

  // 미읽은 알림 개수가 필요한 페이지만 체크 (policy 메인만 포함)
  const targetRoutes = ['/home', '/asset', '/mypage'];
  const exactRoutes = ['/policy', '/policy/main'];
  if (
    targetRoutes.some((routePath) => route.path.startsWith(routePath)) ||
    exactRoutes.includes(route.path)
  ) {
    try {
      await notificationStore.fetchUnreadCount();
    } catch (error) {
      console.error('Header: 미읽은 알림 개수 조회 실패', error);
    }
  }
});

// 숨겨진 관리자 접근 영역 클릭 핸들러
const handleAdminAccess = async () => {
  clickCount.value++;

  // 기존 타임아웃 클리어
  if (clickTimeout.value) {
    clearTimeout(clickTimeout.value);
  }

  // 5번 클릭 달성 시 관리자 페이지로 이동 (라우터 가드에서 권한 검증)
  if (clickCount.value >= 5) {
    clickCount.value = 0;

    // 로그인 상태 확인
    if (!authStore.isLogin) {
      console.warn('로그인이 필요합니다.');
      return;
    }

    // API로 현재 사용자 정보 가져와서 이메일 확인
    try {
      const response = await fetch('/api/member/information', {
        headers: {
          Authorization: `Bearer ${authStore.getToken()}`,
        },
      });

      if (!response.ok) {
        console.warn('사용자 정보를 가져올 수 없습니다.');
        return;
      }

      const userData = await response.json();
      if (userData.email !== 'sangil6372@naver.com') {
        console.warn('관리자 페이지 접근 권한이 없습니다.');
        return;
      }

      router.push('/admin');
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      return;
    }

    return;
  }

  // 2초 후 클릭 카운터 리셋
  clickTimeout.value = setTimeout(() => {
    clickCount.value = 0;
  }, 2000);
};
</script>

<style scoped>
/* 헤더 화면 고정 + 상태바 영역 처리 */
.top-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  height: calc(60px + env(safe-area-inset-top));
  padding-top: env(safe-area-inset-top);
  border-bottom: 1px solid var(--base-lavender);
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 내부 정렬 구조*/
.header-inner {
  width: 100%;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}

/* 로고 링크 및 텍스트 가운데 정렬 */
.logo-link {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-decoration: none;
  cursor: pointer;
}

.logo-text {
  font-size: 28px;
  line-height: 1.2;
  color: var(--base-blue-dark);

  letter-spacing: -0.03em;
  transform: scaleX(0.98);
  display: inline-block;

  /* 선명도/커닝 튜닝 */
  font-kerning: normal;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.logo-link:hover .logo-text {
  opacity: 0.7;
}

/* 알림 링크 및 이미지 스타일 */
.notification-link {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  text-decoration: none;
}

.notification-wrapper {
  position: relative;
  display: inline-block;
}

.logo-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  display: block;
}

/* 미읽은 알림 개수 배지 */
.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 18px;
  height: 18px;
  background-color: #f86814;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  padding: 2px;
  box-sizing: border-box;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* 알림 아이콘 흔들기 애니메이션 */
@keyframes shake {
  0%,
  100% {
    transform: translateY(-50%) rotate(0deg);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateY(-50%) rotate(-8deg) scale(1.1);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateY(-50%) rotate(8deg) scale(1.1);
  }
}

.notification-link.shake {
  animation: shake 0.5s ease-in-out;
}

/* 숨겨진 관리자 접근 영역 */
.admin-access-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 60px;
  height: 60px;
  background: transparent;
  cursor: pointer;
  z-index: 1001;
  /* 개발 시에만 보이게 하려면 아래 주석 해제 */
  /* background: rgba(255, 0, 0, 0.1); */
}
</style>
