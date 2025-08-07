<template>
  <div class="notification-card" :class="{ unread: !isRead, read: isRead }">
    <!-- 💪(상일) 미읽음 표시 -->
    <div v-if="!isRead" class="unread-indicator"></div>
    <div class="content">
      <slot />
    </div>
    <!-- 💪(상일) 삭제 버튼 -->
    <button class="delete-btn" @click="$emit('delete')" title="삭제">
      <img src="@/assets/images/icons/common/x.png" alt="삭제" />
    </button>
  </div>
</template>

<script setup>
// 💪(상일) props 추가
const props = defineProps({
  isRead: {
    type: Boolean,
    default: false,
  },
});

// 💪(상일) 삭제 이벤트 정의
defineEmits(["delete"]);
</script>

<style scoped>
.notification-card {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  display: flex;
  position: relative;
  overflow: hidden;
}

/* 💪(상일) 미읽음 표시 */
.unread-indicator {
  width: 4px;
  background-color: var(--base-blue-dark);
  flex-shrink: 0;
}

.content {
  flex: 1;
  padding: 16px 20px 16px 20px; /* 오른쪽 패딩 증가로 삭제 버튼 공간 확보 */
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* 💪(상일) 읽은 알림 전체 흐림 효과 */
.notification-card.read {
  opacity: 0.48;
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
  /* 💪(상일) 메시지 2줄 말줄임 처리 (북마크와 동일) */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

::v-deep(.date) {
  font-size: 12px;
  color: #9ca3af;
}

/* 💪(상일) 삭제 버튼 스타일 */
.delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.delete-btn:hover {
  opacity: 1;
}

.delete-btn img {
  width: 18px;
  height: 18px;
  object-fit: contain;
}
</style>