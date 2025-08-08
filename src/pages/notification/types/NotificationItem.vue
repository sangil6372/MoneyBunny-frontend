<template>
  <div
    class="notification-card"
    :class="[
      { unread: !isRead, read: isRead, swiping: isSwiping },
      `type-${notificationType?.toLowerCase()}`,
    ]"
    :style="{
      transform: `translateX(${translateX}px)`,
      opacity: opacity,
    }"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
  >
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
import { ref } from "vue";

// 💪(상일) props 추가
const props = defineProps({
  isRead: {
    type: Boolean,
    default: false,
  },
  notificationType: {
    type: String,
    default: "",
  },
});

// 💪(상일) 삭제 이벤트 정의
const emit = defineEmits(["delete"]);

// 💪(상일) 스와이프 관련 상태
const startX = ref(0);
const currentX = ref(0);
const translateX = ref(0);
const opacity = ref(1);
const isSwiping = ref(false);
const isDragging = ref(false);

// 💪(상일) 터치 시작
const handleTouchStart = (e) => {
  startX.value = e.touches[0].clientX;
  isDragging.value = true;
};

// 💪(상일) 터치 이동
const handleTouchMove = (e) => {
  if (!isDragging.value) return;

  currentX.value = e.touches[0].clientX;
  const diff = currentX.value - startX.value;

  // 왼쪽으로만 스와이프 가능 (삭제)
  if (diff < 0) {
    translateX.value = diff;
    isSwiping.value = true;

    // 투명도 계산 (멀리 갈수록 투명해짐)
    // 300px 이동 시 완전 투명, 최소 투명도 0.2 유지
    opacity.value = Math.max(0.2, 1 + diff / 300);
  }
};

// 💪(상일) 터치 종료
const handleTouchEnd = () => {
  if (!isDragging.value) return;

  // 화면 너비의 40% 또는 150px 중 큰 값 이상 스와이프하면 삭제
  const threshold = Math.max(150, window.innerWidth * 0.4);

  if (translateX.value < -threshold) {
    // 완전히 사라지는 애니메이션
    translateX.value = -window.innerWidth;
    opacity.value = 0;

    // 애니메이션 후 삭제
    setTimeout(() => {
      emit("delete");
    }, 300);
  } else {
    // 원위치로 복귀
    translateX.value = 0;
    opacity.value = 1;
  }

  isDragging.value = false;
  isSwiping.value = false;
};

// 💪(상일) 마우스 이벤트 (데스크톱 지원)
const handleMouseDown = (e) => {
  startX.value = e.clientX;
  isDragging.value = true;
};

const handleMouseMove = (e) => {
  if (!isDragging.value) return;

  currentX.value = e.clientX;
  const diff = currentX.value - startX.value;

  if (diff < 0) {
    translateX.value = diff;
    isSwiping.value = true;
    // 300px 이동 시 완전 투명, 최소 투명도 0.2 유지
    opacity.value = Math.max(0.2, 1 + diff / 300);
  }
};

const handleMouseUp = () => {
  if (!isDragging.value) return;

  // 화면 너비의 40% 또는 150px 중 큰 값 이상 스와이프하면 삭제
  const threshold = Math.max(150, window.innerWidth * 0.4);

  if (translateX.value < -threshold) {
    translateX.value = -window.innerWidth;
    opacity.value = 0;

    setTimeout(() => {
      emit("delete");
    }, 300);
  } else {
    translateX.value = 0;
    opacity.value = 1;
  }

  isDragging.value = false;
  isSwiping.value = false;
};
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
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
  cursor: grab;
}

/* 💪(상일) 스와이프 중일 때 커서 변경 */
.notification-card.swiping {
  cursor: grabbing;
  transition: none; /* 드래그 중에는 트랜지션 제거 */
}

/* 💪(상일) 미읽음 표시 */
.unread-indicator {
  width: 4px;
  background-color: var(--base-blue-dark);
  flex-shrink: 0;
}

/* 💪(상일) 알림 타입별 색상 적용 */
.type-top3 .unread-indicator {
  background-color: var(--top-rank-1); /* TOP3: 진한 네이비 */
}

.type-bookmark .unread-indicator {
  background-color: var(--top-rank-2); /* 북마크: 중간 블루 */
}

.type-new_policy .unread-indicator {
  background-color: var(--top-rank-3); /* 새 정책: 연한 블루 */
}

.type-feedback .unread-indicator {
  background-color: var(--sub-mint); /* 피드백: 민트색 */
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

/* 💪(상일) 피드백 알림은 글자 제한 없음 + 줄바꿈 표기 */
.type-feedback ::v-deep(.message) {
  display: block;
  -webkit-line-clamp: unset;
  -webkit-box-orient: unset;
  overflow: visible;
  white-space: pre-line; /* \n을 줄바꿈으로 표시 */
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
