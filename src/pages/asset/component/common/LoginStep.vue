<template>
  <div class="login-step">
    <!-- 헤더 -->
    <div class="modal-header">
      <h2>{{ modalTitle }}</h2>
      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>

    <!-- 기관 선택 -->
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

    <!-- 선택된 기관 표시 -->
    <div v-if="formData.code" class="selected-info">
      <span class="selected-label">선택된 기관:</span>
      <span class="selected-name">{{ getInstitutionName(formData.code) }}</span>
    </div>

    <!-- 로그인 폼 -->
    <form @submit.prevent="handleLogin" class="form-section">
      <div class="form-group">
        <label>로그인 ID <span class="required">*</span></label>
        <input
          v-model="formData.id"
          type="text"
          placeholder="로그인 ID를 입력하세요"
          required
        />
      </div>

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

      <div class="modal-actions">
        <button type="button" class="cancel-btn" @click="$emit('close')">
          취소
        </button>
        <button type="submit" class="submit-btn" :disabled="isLoading">
          {{ isLoading ? '로그인 중...' : '로그인' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { bankCodeMap } from '@/assets/utils/bankCodeMap.js';
import { getBankLogo } from '@/assets/utils/bankLogoMap.js';
import { getCardLogo } from '@/assets/utils/cardLogoMap.js';
import cardCodeMap from '@/assets/utils/cardCodeMap.js';

import { connectAccount, connectCard } from '@/api/assetApi.js';

const props = defineProps({
  type: { type: String, required: true },
});

const emit = defineEmits(['close', 'login-success']);

const formData = ref({ code: '', id: '', password: '' });
const showPassword = ref(false);
const isLoading = ref(false);

const institutions = computed(() =>
  props.type === 'account' ? bankCodeMap : cardCodeMap
);

const modalTitle = computed(() =>
  props.type === 'account' ? '계좌 추가' : '카드 추가'
);

const selectInstitution = (code) => {
  formData.value.code = code;
};

// 은행과 카드사 각각 적절한 로고 사용
const getLogo = (name) => {
  return props.type === 'account' ? getBankLogo(name) : getCardLogo(name);
};

const getInstitutionName = (code) =>
  props.type === 'account' ? bankCodeMap[code] : cardCodeMap[code];

const handleLogin = async () => {
  if (!formData.value.code) {
    alert(`기관을 선택하세요.`);
    return;
  }

  isLoading.value = true;
  try {
    let result;
    if (props.type === 'account') {
      result = await connectAccount({
        organization: formData.value.code,
        loginId: formData.value.id,
        password: formData.value.password,
      });
    } else {
      result = await connectCard({
        organization: formData.value.code,
        loginId: formData.value.id,
        password: formData.value.password,
      });
    }

    console.log('✅ [LoginStep] result:', result);
    console.log('✅ [LoginStep] result.data:', result.data);

    // 성공 시 → 기관/아이디/목록 emit!
    emit('login-success', {
      institutionCode: formData.value.code,
      institutionName: getInstitutionName(formData.value.code),
      loginId: formData.value.id,
      items: result.data || [],
      password: formData.value.password,
    });
  } catch (error) {
    let message = '로그인 또는 정보 불러오기에 실패했습니다.';
    if (error?.response?.data?.message) {
      message = error.response.data.message;
    }
    console.error('[LoginStep] error:', error);
    alert(message);
  } finally {
    isLoading.value = false;
  }
};

//   try {
//     await new Promise((resolve) => setTimeout(resolve, 1000)); // 로딩 시뮬레이션

//     emit('login-success', {
//       institutionCode: formData.value.code,
//       institutionName: getInstitutionName(formData.value.code),
//       loginId: formData.value.id,
//     });
//   } catch (error) {
//     alert('로그인에 실패했습니다.');
//   } finally {
//     isLoading.value = false;
//   }
// };
</script>

<style scoped>
.login-step {
  width: 100%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-header h2 {
  font-size: 1rem;
  color: var(--base-blue-dark);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--text-darkgray);
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
  margin-bottom: 1rem;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;

  border-radius: 0.5rem;
  background: var(--input-bg-2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-item.selected {
  background: var(--base-blue-light);
  border-color: var(--base-blue-dark);
}

.icon-item img {
  width: 28px;
  height: 28px;
  margin-bottom: 0.25rem;
  border-radius: 4px;
}

.icon-item span {
  font-size: 0.65rem;
  text-align: center;
  color: var(--text-darkgray);
}

/* 선택된 기관 표시 */
.selected-info {
  background: var(--input-bg-1);
  padding: 0.6rem;
  border-radius: 0.4rem;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  border: 1px solid var(--base-blue-light);
}

.selected-label {
  color: var(--text-darkgray);
  margin-right: 0.5rem;
}

.selected-name {
  color: var(--base-blue-dark);
  font-weight: 600;
}

.form-group {
  margin-bottom: 0.75rem;
}

label {
  font-size: 0.8rem;
  margin-bottom: 0.3rem;
  color: var(--text-darkgray);
  display: block;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid var(--input-outline);
  border-radius: 0.4rem;
  font-size: 0.8rem;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

input:focus {
  outline: none;
  border-color: var(--base-blue-dark);
}

.required {
  color: var(--alert-red);
}

.password-wrapper {
  position: relative;
}

.eye-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-lightgray);
}

.eye-btn:hover {
  color: var(--text-darkgray);
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.cancel-btn,
.submit-btn {
  flex: 1;
  padding: 0.7rem;
  border: none;
  border-radius: 0.4rem;
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 500;
}

.cancel-btn {
  background: var(--input-disabled-1);
  color: var(--text-darkgray);
}

.cancel-btn:hover {
  background: var(--input-disabled-2);
}

.submit-btn {
  background: var(--base-blue-dark);
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: #243653;
}

.submit-btn:disabled {
  background: var(--input-disabled-1);
  color: var(--text-lightgray);
  cursor: not-allowed;
}
</style>
