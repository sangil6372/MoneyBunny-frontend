<template>
  <header class="top-header">
    <div class="header-inner">
      <RouterLink to="/home" class="logo-link">
        <h1 class="logo-text font-28 font-bold">MoneyBunny</h1>
      </RouterLink>
      <!--💪(상일) 알림 이동 (미읽은 개수 배지 포함)-->
      <RouterLink to="/notification" class="notification-link" :class="{ shake: shouldShakeIcon }">
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
import { onMounted, computed } from 'vue';
import { useNotificationStore } from '@/stores/notification';

// 💪(상일) 알림 스토어 사용
const notificationStore = useNotificationStore();
const unreadCount = computed(() => notificationStore.unreadCount);
const shouldShakeIcon = computed(() => notificationStore.shouldShakeIcon);

// 💪(상일) 컴포넌트 마운트 시 미읽은 알림 개수 조회
onMounted(async () => {
  try {
    await notificationStore.fetchUnreadCount();
    console.log('🔔 Header: 미읽은 알림 개수 조회 완료', notificationStore.unreadCount);
  } catch (error) {
    console.error('❌ Header: 미읽은 알림 개수 조회 실패', error);
  }
});
</script>

<style scoped>
/* NavBar의 bottom-nav와 동일하게 상단 고정 + 너비 제한 */
.top-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  height: 65px;
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
  color: var(--base-blue-dark);
  margin: 0;
  transition: opacity 0.2s ease;
}

.logo-link:hover .logo-text {
  opacity: 0.7;
}

/* 💪(상일) 알림 링크 및 이미지 스타일 */
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

/* 💪(상일) 미읽은 알림 개수 배지 */
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

/* 💪(상일) 알림 아이콘 흔들기 애니메이션 */
@keyframes shake {
  0%, 100% { 
    transform: translateY(-50%) rotate(0deg); 
  }
  10%, 30%, 50%, 70%, 90% { 
    transform: translateY(-50%) rotate(-8deg) scale(1.1); 
  }
  20%, 40%, 60%, 80% { 
    transform: translateY(-50%) rotate(8deg) scale(1.1); 
  }
}

.notification-link.shake {
  animation: shake 0.5s ease-in-out;
}
</style>
