<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <!-- 헤더 -->
      <div class="modal-header">
        <h2>{{ modalTitle }}</h2>
        <button class="close-btn" @click="closeModal">✕</button>
      </div>

      <!-- 은행/카드사 선택 -->
      <div class="icon-section">
        <p class="section-title">
          {{ type === 'account' ? '은행을 선택하세요' : '카드사를 선택하세요' }}
        </p>
        <div class="icon-grid">
          <div
            v-for="(name, code) in institutions"
            :key="code"
            class="icon-item"
            :class="{ selected: formData.code === code }"
            @click="selectInstitution(code)"
          >
            <img :src="getLogo(name)" :alt="name" />
            <span>{{ name }}</span>
          </div>
        </div>
      </div>

      <!-- 선택된 은행/카드 표시 -->
      <div v-if="formData.code" class="selected-info">
        {{ getInstitutionName(formData.code) }}
      </div>

      <!-- 폼 -->
      <form @submit.prevent="handleSubmit" class="form-section">
        <!-- 은행 ID -->
        <div class="form-group">
          <label>은행 로그인 ID <span class="required">*</span></label>
          <input
            v-model="formData.id"
            type="text"
            placeholder="은행 로그인 ID를 입력하세요"
            required
          />
          <small class="input-hint"
            >인터넷뱅킹 또는 모바일뱅킹 로그인 ID를 입력해주세요</small
          >
        </div>

        <!-- 비밀번호 -->
        <div class="form-group">
          <label>비밀번호 <span class="required">*</span></label>
          <div class="password-wrapper">
            <input
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="비밀번호를 입력하세요"
              required
            />
            <button
              type="button"
              class="eye-btn"
              @click="showPassword = !showPassword"
            >
              👁
            </button>
          </div>
        </div>

        <!-- 비밀번호 확인 -->
        <div class="form-group">
          <label>비밀번호 확인 <span class="required">*</span></label>
          <div class="password-wrapper">
            <input
              v-model="confirmPassword"
              :type="showConfirm ? 'text' : 'password'"
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
            <button
              type="button"
              class="eye-btn"
              @click="showConfirm = !showConfirm"
            >
              👁
            </button>
          </div>
        </div>

        <!-- 보안 안내 -->
        <div class="security-info">
          <img
            src="@/assets/images/icons/common/exclamation_mark.png"
            alt="보안 아이콘"
          />
          <p>
            입력하신 정보는 암호화되어 저장되며 계좌 연동을 위해서만 사용됩니다.
          </p>
        </div>

        <!-- 버튼 -->
        <div class="modal-actions">
          <button type="button" class="cancel-btn" @click="closeModal">
            취소
          </button>
          <button type="submit" class="submit-btn">추가</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { bankCodeMap } from '@/assets/utils/bankCodeMap.js';
import { getBankLogo } from '@/assets/utils/bankLogoMap.js';
import cardCodeMap from '@/assets/utils/cardCodeMap.js';

const props = defineProps({ isOpen: Boolean, type: String });
const emit = defineEmits(['close', 'update-data']);

const formData = ref({ code: '', id: '', password: '' });
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirm = ref(false);

const institutions = computed(() =>
  props.type === 'account' ? bankCodeMap : cardCodeMap
);
const modalTitle = computed(() =>
  props.type === 'account' ? '계좌 추가' : '카드 추가'
);

const selectInstitution = (code) => (formData.value.code = code);
const getLogo = (name) =>
  props.type === 'account' ? getBankLogo(name) : '/default-logo.png';
const getInstitutionName = (code) =>
  props.type === 'account' ? bankCodeMap[code] : cardCodeMap[code];

const handleSubmit = () => {
  if (!formData.value.code)
    return alert(`${modalTitle.value}의 기관을 선택하세요.`);
  if (formData.value.password !== confirmPassword.value)
    return alert('비밀번호가 일치하지 않습니다.');
  emit('update-data', { ...formData.value });
  closeModal();
};

const closeModal = () => {
  emit('close');
  formData.value = { code: '', id: '', password: '' };
  confirmPassword.value = '';
};
</script>

<style scoped>
/* 오버레이 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

/* 모달 박스 */
/* 모달 박스 */
.modal-content {
  background: white;
  border-radius: 0.75rem;
  padding: 1.25rem; /* 내부 여백 확대 */
  width: 96%; /* 모바일 가로 폭을 거의 채우도록 */
  max-width: 400px; /* 최대 폭 확대 */
  animation: fadeIn 0.3s ease;
}

/* 헤더 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.modal-header h2 {
  font-size: 1rem;
  color: var(--base-blue-dark);
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}

/* 아이콘 */
.icon-section {
  margin-bottom: 1rem;
}
.section-title {
  font-size: 0.85rem;
  color: var(--text-darkgray);
  margin-bottom: 0.5rem;
}
.icon-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}
.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: 1px solid var(--input-outline);
  border-radius: 0.5rem;
  background: var(--input-bg-2);
  cursor: pointer;
}
.icon-item.selected {
  background: var(--base-blue-light);
}
.icon-item img {
  width: 28px;
  height: 28px;
  margin-bottom: 0.25rem;
}
.icon-item span {
  font-size: 0.65rem;
  text-align: center;
}

/* 선택 정보 */

/* 폼 */
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.75rem;
}
label {
  font-size: 0.8rem;
  margin-bottom: 0.2rem;
  color: var(--text-darkgray);
}
input {
  padding: 0.5rem;
  border: 1px solid var(--input-outline);
  border-radius: 0.4rem;
  font-size: 0.8rem;
}
.required {
  color: var(--alert-red);
  font-size: 0.7rem;
}
.input-hint {
  font-size: 0.7rem;
  color: var(--text-lightgray);
  margin-top: 0.2rem;
}

/* 비밀번호 */
.password-wrapper {
  position: relative;
}
.eye-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
}

/* 보안 안내 */
.security-info {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  background: var(--input-bg-1);
  border-radius: 0.5rem;
  padding: 0.75rem;
  font-size: 0.75rem; /* 모바일 기준 폰트 크기 축소 */
  color: var(--text-darkgray);
  line-height: 1.4;
  margin: 0.8rem 0;
  word-break: keep-all; /* 단어 단위 줄바꿈 */
}

.security-info img {
  width: 16px;
  height: 16px;
  margin-top: 2px;
  flex-shrink: 0; /* 아이콘 크기 유지 */
}

.security-info p {
  flex: 1; /* 텍스트가 남은 공간 모두 차지 */
  margin: 0;
}
/* 버튼 */
.modal-actions {
  display: flex;
  gap: 0.4rem;
}
.cancel-btn,
.submit-btn {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 0.4rem;
  font-size: 0.8rem;
  cursor: pointer;
}
.cancel-btn {
  background: var(--input-disabled-1);
  color: var(--text-lightgray);
}
.submit-btn {
  background: var(--base-blue-dark);
  color: white;
}

/* 애니메이션 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
