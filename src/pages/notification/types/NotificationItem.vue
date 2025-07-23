<template>
  <div class="notification-card">
    <slot />
  </div>
</template>

<script setup>
// 레이아웃 전용 wrapper
</script>

<style scoped>
.notification-card {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* ✅ slot 내부 스타일도 적용되게 ::v-deep 사용 */
::v-deep(.title) {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-login);
  margin: 0;
}

::v-deep(.message) {
  font-size: 13.5px;
  color: var(--text-bluegray);
  margin: 0;
}

::v-deep(.date) {
  font-size: 12px;
  color: #9ca3af;
}
</style>
