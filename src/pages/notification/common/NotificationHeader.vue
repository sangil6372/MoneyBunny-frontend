<template>
  <header class="notification-header">
    <button class="back-button" @click="router.back()">
      <img
        src="@/assets/images/icons/notification/arrow-left.png"
        alt="뒤로가기"
        class="back-icon"
      />
    </button>
    <div class="header-content">
      <img
        src="@/assets/images/icons/bunny/notification_bunny_background.png"
        class="logo-icon"
        alt="로고"
      />
      <div class="text">
        <div class="title">알림 센터</div>
        <div class="subtitle">나의 금융 알림을 확인하세요</div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<style scoped>
.notification-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  height: 60px;
  border-bottom: 1px solid var(--base-lavender);
  background: white;
  display: flex;
  z-index: 1000;
}

.back-button {
  background: none;
  border: none;
  padding-right: 12px;
  cursor: pointer;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-icon {
  width: 20px;
  height: 20px;
}

.logo-icon {
  width: 36px;
  height: 36px;
}

.text .title {
  font-size: 16px;
  font-weight: bold;
  color: #1c1c1e;
}

.text .subtitle {
  font-size: 12px;
  color: #888;
  margin-top: 2px;
}
</style>
