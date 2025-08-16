<template>
  <!-- 모달 배경 -->
  <div v-if="visible" class="modal-overlay" @click="closeModal">
    <!-- 모달 내용 -->
    <div class="modal-content" @click.stop>
      <!-- 모달 핸들 -->
      <div class="modal-handle"></div>

      <!-- 계좌 정보 헤더 -->
      <div class="account-header">
        <img
          :src="getBankLogoByCode(account.bankCode)"
          :alt="`${getBankName(account.bankCode)} 로고`"
          class="bank-logo"
        />
        <div class="account-info">
          <h3 class="account-title">
            {{ getBankName(account.bankCode) }} {{ account.accountName }}
          </h3>
          <p class="account-number">
            {{ formatAccountNumber(account.accountNumber) }}
          </p>
        </div>
      </div>

      <!-- 설정 옵션들 -->
      <div class="settings-options">
        <div class="section-group">
          <!-- 계좌번호 복사 -->
          <button class="setting-item" @click="handleCopyAccount">
            <div class="setting-content">
              <span class="setting-text">계좌번호 복사</span>
            </div>
            <img :src="copyIcon" alt="계좌번호 복사" class="setting-icon" />
          </button>

          <!-- 계좌 별명 설정 (인라인 편집 + 좌측 정렬) -->
          <div class="setting-item">
            <div class="setting-content">
              <span class="setting-text">계좌 별명 설정</span>

              <!-- 보기 모드 -->
              <div v-if="!isEditingNickname" class="inline-row">
                <span class="current-value">{{ account.accountName }}</span>
              </div>

              <!-- 편집 모드 -->
              <div v-else class="inline-row">
                <input
                  ref="nicknameInput"
                  v-model="editingNickname"
                  type="text"
                  class="nickname-inline-input"
                  placeholder="계좌 별명을 입력해주세요"
                  maxlength="20"
                  @keyup.enter="saveNickname"
                />
                <button class="chip-btn" @click="cancelEdit">취소</button>
                <button
                  class="chip-btn primary"
                  @click="saveNickname"
                  :disabled="!editingNickname.trim()"
                >
                  확인
                </button>
              </div>
            </div>

            <!-- 편집 시작 아이콘 (보기 모드에서만 노출) -->
            <button
              v-if="!isEditingNickname"
              class="icon-btn"
              @click="startEdit"
              aria-label="별명 편집"
            >
              <img :src="editIcon" alt="" class="setting-icon" />
            </button>
          </div>

          <!-- 잔액 숨김 토글 -->
          <div class="setting-item toggle-item">
            <div class="setting-left">
              <span class="setting-text">금액 숨기기</span>
              <!-- <small class="setting-hint">{{
                hideAmount ? '숨김 적용됨' : '현재 표시 중'
              }}</small> -->
            </div>

            <label class="toggle-switch ios" aria-label="금액 숨기기">
              <input
                type="checkbox"
                v-model="hideAmount"
                @change="handleToggleAmount"
              />
              <span class="toggle-slider"
                ><span class="toggle-knob"></span
              ></span>
            </label>
          </div>

          <!-- 대표 계좌 설정 -->
          <button
            class="setting-item"
            @click="handleSetMain"
            :disabled="account.isMain"
          >
            <div class="setting-content">
              <span class="setting-text">대표 계좌 설정</span>
              <span v-if="account.isMain" class="current-status"
                >현재 대표 계좌입니다</span
              >
            </div>
            <!-- 대표 계좌 여부에 따라 빈 별/색칠된 별 이미지 -->
            <div class="action-icon">
              <img
                :src="account.isMain ? fillStarIcon : emptyStarIcon"
                :alt="account.isMain ? '대표 계좌' : '대표 계좌 설정'"
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
import { ref, nextTick, onUnmounted, watch } from 'vue';
import { getBankLogoByCode } from '@/assets/utils/bankLogoMap.js';
import { getBankName } from '@/assets/utils/bankCodeMap.js';
import copyIcon from '@/assets/images/icons/signup/copy.png';
import editIcon from '@/assets/images/icons/mypage/edit.png';
import emptyStarIcon from '@/assets/images/icons/asset/star1.png';
import fillStarIcon from '@/assets/images/icons/asset/star.png';

const props = defineProps({
  visible: { type: Boolean, default: false },
  account: { type: Object, required: true },
});

const emit = defineEmits([
  'close',
  'copy-account',
  'set-nickname',
  'set-main',
  'toggle-balance',
]);

const isEditingNickname = ref(false);
const editingNickname = ref('');
const nicknameInput = ref(null);
const hideBalance = ref(false);

// 계좌 props 변경을 감지하여 모달 상태 유지
watch(
  () => props.account,
  (newAccount) => {
    // 계좌 데이터가 변경되어도 모달 내부 상태는 유지
    // Vue의 반응형 시스템이 자동으로 UI 업데이트
  },
  { deep: true }
);

/* 계좌 정보 변경 감지 */
watch(
  () => props.account.hideBalance,
  (newVal) => {
    hideBalance.value = newVal || false;
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

const formatAccountNumber = (number) => {
  if (!number) return '';
  return number.replace(/(\d{3})(\d{2,4})(\d{4,6})/, '$1-$2-$3');
};

const handleCopyAccount = () => emit('copy-account');

// 대표 계좌 설정 - 모달 유지
const handleSetMain = () => {
  if (!props.account.isMain) {
    emit('set-main');
    // 모달은 닫지 않음 - 현재 모달에서 별 색상만 변경
  }
};

// 잔액 숨기기 토글 - 모달 유지
const handleToggleBalance = () => {
  emit('toggle-balance');
  // 모달은 닫지 않음
};

const startEdit = async () => {
  isEditingNickname.value = true;
  editingNickname.value = props.account.accountName || '';
  await nextTick();
  nicknameInput.value?.focus();
};

const saveNickname = () => {
  const name = editingNickname.value.trim();
  if (!name) return;
  emit('set-nickname', name);
  isEditingNickname.value = false;
};

const cancelEdit = () => {
  isEditingNickname.value = false;
  editingNickname.value = '';
};
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
  max-width: 390px;
  background: #fff;
  border-radius: 1.25rem 1.25rem 0 0;
  padding: 16px;
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

/* ===== 헤더 ===== */
.account-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--input-outline);
}
.bank-logo {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: contain;
}
.account-info {
  flex: 1;
}
.account-title {
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--base-blue-dark);
  margin: 0 0 2px;
}
.account-number {
  font-size: 0.75rem;
  color: var(--text-lightgray);
  margin: 0;
}

/* ===== 설정 옵션 섹션 ===== */
.settings-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.section-group {
  display: flex;
  flex-direction: column;
  gap: 0;
  border-radius: 12px;
  overflow: hidden;
}
.section-group .setting-item + .setting-item {
  border-top: 1px solid var(--input-outline);
}
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: none;
  border: none;
  border-bottom: 1px solid var(--input-outline);
  text-align: left;
  width: 100%;
  -webkit-tap-highlight-color: transparent;
}
.section-group .setting-item:last-child {
  border-bottom: none;
}

.setting-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.setting-text {
  font-size: 0.85rem;
  color: var(--base-blue-dark);
  line-height: 1.4;
}

/* 현재 상태 텍스트 */
.current-status {
  font-size: 0.8rem;
  color: var(--text-green);
  line-height: 1.3;
}

.current-value {
  font-size: 0.75rem;
  color: var(--text-lightgray);
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
  object-fit: contain;
}

/* 호버/활성화 시 별 아이콘 확대 효과 */
.setting-item:not(:disabled):active .star-icon {
  /* transform: scale(1.1); */
}

/* 대표 계좌인 경우 비활성화 스타일 */
.setting-item:disabled {
  /* opacity: 0.5; */
  cursor: not-allowed;
}

.setting-item:disabled .setting-text {
  color: var(--text-lightgray);
}

.setting-item:disabled .current-status {
  color: var(--text-lightgray);
}

/* 우측 아이콘 버튼 + 이미지 크기 */
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
}

.setting-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  opacity: 0.92;
}

/* ===== 인라인 편집 ===== */
.inline-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.nickname-inline-input {
  margin-top: 3px;
  flex: 1;
  min-width: 0;
  padding: 0.4rem 0.6rem;
  border: 1px solid var(--input-outline);
  border-radius: 6px;
  font-size: 0.8rem;
}
.nickname-inline-input:focus {
  outline: none;
  border-color: var(--input-bg-3);
  background: #fff;
}
.chip-btn {
  padding: 0.4rem 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--input-outline);
  background: var(--input-bg-1);
  color: var(--text-darkgray);
  font-size: 0.75rem;
}
.chip-btn.primary {
  background: var(--base-blue-dark);
  border-color: var(--base-blue-dark);
  color: #fff;
}
.chip-btn:disabled {
  background: var(--input-disabled-1);
  border-color: var(--input-disabled-1);
  color: var(--text-lightgray);
}

/* ===== 토글 ===== */
/* 좌측 라벨+힌트 묶음 */
.setting-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.setting-hint {
  font-size: 0.72rem;
  color: var(--text-lightgray);
}

.toggle-switch.ios {
  position: relative;
  width: 40px;
  height: 24px;
}
.toggle-switch.ios input {
  display: none;
}
.toggle-switch.ios .toggle-slider {
  position: absolute;
  inset: 0;
  background: #d5d9e3;
  border-radius: 24px;
}
.toggle-switch.ios .toggle-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
}
.toggle-switch.ios input:checked + .toggle-slider {
  background: var(--base-blue-dark);
}
.toggle-switch.ios input:checked + .toggle-slider .toggle-knob {
  transform: translateX(16px);
}

/* ===== 닫기 버튼 ===== */
.close-button {
  width: 100%;
  padding: 0.8rem;
  margin-top: 1rem;
  background: var(--base-blue-dark);
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 0.9rem;
  -webkit-tap-highlight-color: transparent;
}
.close-button:active {
  background: var(--base-lavender);
}
</style>
