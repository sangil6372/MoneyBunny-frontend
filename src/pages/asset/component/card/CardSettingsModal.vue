<template>
  <!-- 모달 배경 -->
  <div v-if="visible" class="modal-overlay" @click="closeModal">
    <!-- 모달 내용 -->
    <div class="modal-content" @click.stop>
      <!-- 모달 핸들 -->
      <div class="modal-handle"></div>

      <!-- 카드 정보 헤더 -->
      <div class="card-header">
        <img
          :src="card.cardImage"
          :alt="`${card.cardName} 이미지`"
          class="card-logo"
        />
        <div class="card-info">
          <h3 class="card-title">
            {{ getCardIssuer(card.issuerCode) }} {{ card.cardName }}
          </h3>
          <p class="card-number">{{ card.cardMaskedNumber }}</p>
        </div>
      </div>

      <!-- 설정 옵션들 -->
      <div class="settings-options">
        <div class="section-group">
          <!-- 금액 숨기기 토글 -->
          <div class="setting-item toggle-item">
            <span class="setting-text">금액 숨기기</span>
            <label class="toggle-switch">
              <input
                type="checkbox"
                v-model="hideAmount"
                @change="handleToggleAmount"
              />
              <span class="toggle-slider"></span>
            </label>
          </div>

          <!-- 대표 카드 설정 -->
          <button
            class="setting-item"
            @click="handleSetMain"
            :disabled="card.isRepresentative"
          >
            <div class="setting-content">
              <span class="setting-text">대표 카드 설정</span>
              <span v-if="card.isRepresentative" class="current-status"
                >현재 대표 카드입니다</span
              >
            </div>
            <!-- 대표 카드 여부에 따라 빈 별/색칠된 별 이미지 -->
            <div class="action-icon">
              <img
                :src="card.isRepresentative ? fillStarIcon : emptyStarIcon"
                :alt="card.isRepresentative ? '대표 카드' : '대표 카드 설정'"
                class="star-icon"
              />
            </div>
          </button>
        </div>
      </div>

      <!-- 닫기 버튼 -->
      <button class="close-button" @click="closeModal">닫기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue';
import cardCodeMap from '@/assets/utils/cardCodeMap.js';
import emptyStarIcon from '@/assets/images/icons/common/empty_star.png';
import fillStarIcon from '@/assets/images/icons/common/fill_star.png';

const props = defineProps({
  visible: { type: Boolean, default: false },
  card: { type: Object, required: true },
});

const emit = defineEmits(['close', 'set-main', 'toggle-amount']);

const hideAmount = ref(false);

// 카드 props 변경을 감지하여 모달 상태 유지
watch(
  () => props.card,
  (newCard) => {
    // 카드 데이터가 변경되어도 모달 내부 상태는 유지
    // Vue의 반응형 시스템이 자동으로 UI 업데이트
  },
  { deep: true }
);

/* 카드 정보 변경 감지 */
watch(
  () => props.card.hideAmount,
  (newVal) => {
    hideAmount.value = newVal || false;
  },
  { immediate: true }
);

/* 모달이 열릴 때 body 스크롤 방지 */
watch(
  () => props.visible,
  (open) => {
    document.body.classList.toggle('modal-open', !!open);
  }
);

onUnmounted(() => {
  document.body.classList.remove('modal-open');
});

const closeModal = () => emit('close');

// 금액 숨기기 토글 처리 함수
const handleToggleAmount = () => {
  emit('toggle-amount');
  // 모달은 닫지 않음
};

// 대표 카드 설정 처리 함수
const handleSetMain = () => {
  if (!props.card.isRepresentative) {
    emit('set-main');
    // 모달은 유지하고 UI만 업데이트됨
  }
};

const getCardIssuer = (issuerCode) => cardCodeMap[issuerCode] || '알 수 없음';
</script>

<style scoped>
/* ===== 오버레이 & 애니메이션 ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

/* ===== 바텀시트 컨테이너 ===== */
.modal-content {
  width: 100%;
  max-width: 474px;
  background: #fff;
  border-radius: 1.25rem 1.25rem 0 0;
  padding: 1.25rem;
  animation: slideUp 0.3s ease-out;
  max-height: 70vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

@supports (padding: max(0px)) {
  .modal-content {
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }
}

/* 핸들 */
.modal-handle {
  width: 2.5rem;
  height: 0.25rem;
  background: var(--input-disabled-1);
  border-radius: 0.125rem;
  margin: 0 auto 1rem;
}

/* ===== 카드 정보 헤더 ===== */
.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--input-outline);
}

.card-logo {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  object-fit: contain;
}

.card-info {
  flex: 1;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--base-blue-dark);
  margin: 0 0 0.25rem;
}

.card-number {
  font-size: 0.875rem;
  color: var(--text-lightgray);
  margin: 0;
}

/* ===== 설정 옵션 섹션 ===== */
.settings-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-group {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: var(--input-bg-1);
  border-radius: 0.75rem;
  overflow: hidden;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  background: none;
  border: none;
  border-bottom: 1px solid var(--input-outline);
  text-align: left;
  width: 100%;
  min-height: 3.25rem;
  -webkit-tap-highlight-color: transparent;
}

.section-group .setting-item:last-child {
  border-bottom: none;
}

.setting-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.setting-text {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--base-blue-dark);
  line-height: 1.4;
}

/* 현재 상태 텍스트 */
.current-status {
  font-size: 0.8125rem;
  color: var(--text-green);
  line-height: 1.3;
}

/* 액션 아이콘 컨테이너 */
.action-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.star-icon {
  width: 18px;
  height: 18px;
  transition: all 0.3s ease;
  object-fit: contain;
}

/* 호버/활성화 시 별 아이콘 확대 효과 */
.setting-item:not(:disabled):active .star-icon {
  transform: scale(1.1);
}

/* 대표 카드인 경우 비활성화 스타일 */
.setting-item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.setting-item:disabled .setting-text {
  color: var(--text-lightgray);
}

.setting-item:disabled .current-status {
  color: var(--text-lightgray);
}

/* ===== 토글 스위치 ===== */
.toggle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 51px;
  height: 31px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  inset: 0;
  background-color: var(--input-disabled-1);
  transition: 0.3s;
  border-radius: 31px;
}

.toggle-slider:before {
  content: '';
  position: absolute;
  height: 27px;
  width: 27px;
  left: 2px;
  bottom: 2px;
  background-color: #fff;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--base-blue-dark);
}

input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

/* ===== 닫기 버튼 ===== */
.close-button {
  width: 100%;
  padding: 0.875rem;
  margin-top: 1rem;
  background: var(--base-blue-dark);
  border: none;
  border-radius: 0.75rem;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'NanumSquareNeo', sans-serif;
  transition: transform 0.2s ease, background 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.close-button:active {
  background: var(--base-lavender);
  transform: scale(0.98);
}
</style>
