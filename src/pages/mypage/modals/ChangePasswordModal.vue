<template>
  <div class="modalOverlay">
    <div class="modalBox">
      <div class="modalHeader">
        <span class="modalTitle font-17 font-bold">비밀번호 변경</span>
        <img
          src="@/assets/images/icons/common/x.png"
          class="closeIcon"
          alt="닫기"
          @click="handleClose"
        />
      </div>
      <transition name="fade">
        <div v-if="showToast" class="toastMsg">비밀번호가 변경되었습니다!</div>
      </transition>
      <div class="card">
        <label class="font-14 font-bold">현재 비밀번호</label>
        <input
          type="password"
          placeholder="현재 비밀번호를 입력하세요"
          class="inputBox font-13"
        />
        <!-- 새 비밀번호 -->
        <label class="font-14 font-bold">새 비밀번호</label>
        <input
          type="password"
          placeholder="새 비밀번호를 입력하세요"
          v-model="newPassword"
          @input="validatePassword"
          :class="['inputBox', 'font-13', { error: passwordError }]"
        />
        <p v-if="passwordError" class="font-11 errorMessage">
          8자 이상 입력해야 합니다.
        </p>
        <p v-else class="hint font-11">
          8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.
        </p>

        <!-- 새 비밀번호 확인 -->
        <label class="font-14 font-bold">새 비밀번호 확인</label>
        <input
          type="password"
          placeholder="새 비밀번호를 다시 입력하세요"
          v-model="confirmPassword"
          @input="validateConfirm"
          :class="[
            'inputBox',
            'font-13',
            { error: confirmError && confirmTouched },
          ]"
        />
        <p v-if="confirmError && confirmTouched" class="font-11 errorMessage">
          비밀번호가 일치하지 않습니다.
        </p>

        <button class="submitBtn font-14" @click="handleChangePassword">
          비밀번호 변경
        </button>
      </div>
      <div class="guide">
        <div class="font-15 font-bold">비밀번호 변경 안내</div>
        <ul>
          <li class="font-12">비밀번호는 8자 이상이어야 합니다.</li>
          <li class="font-12">영문, 숫자, 특수문자를 포함해야 합니다.</li>
          <li class="font-12">이전에 사용한 비밀번호는 사용할 수 없습니다.</li>
          <li class="font-12">
            비밀번호 변경 후 모든 기기에서 재로그인이 필요합니다.
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineEmits } from 'vue';
const emit = defineEmits(['close']);

const newPassword = ref('');
const confirmPassword = ref('');
const passwordError = ref(false);
const confirmError = ref(false);
const confirmTouched = ref(false);

const showToast = ref(false);

// 새 비밀번호 실시간 유효성 체크
watch(newPassword, (val) => {
  passwordError.value = val.length < 8;
  if (confirmTouched.value) {
    confirmError.value = confirmPassword.value !== val;
  }
});

// 비밀번호 확인창 실시간 체크
watch(confirmPassword, (val) => {
  confirmTouched.value = true;
  confirmError.value = val !== newPassword.value;
});

// 닫기(X)버튼 기능
const handleClose = () => emit('close');

// 유효성 검사 함수 (버튼에서도 사용)
const validatePassword = () => {
  passwordError.value = newPassword.value.length < 8;
};
const validateConfirm = () => {
  confirmTouched.value = true;
  confirmError.value = confirmPassword.value !== newPassword.value;
};

const handleChangePassword = () => {
  validatePassword();
  validateConfirm();
  if (!passwordError.value && !confirmError.value) {
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
      emit('close');
    }, 1300); // 1.3초 후 모달 닫기
  }
};
</script>

<style scoped>
.modalOverlay {
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: rgba(30, 40, 60, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 모달 */
.modalBox {
  width: 95vw;
  max-width: 350px;
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
  max-height: 96vh;
  padding: 5px;
}

.modalHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 14px 0 14px;
  background-color: white;
  min-height: 30px;
}

.modalTitle {
  flex: 1;
  text-align: center;
}

.closeIcon {
  width: 22px;
  height: 22px;
  right: 22px;
  cursor: pointer;
}

/* 내용 카드 */
.card {
  background-color: white;
  border-radius: 12px;
  border: none;
  padding: 20px;
  margin-bottom: 10px;
  margin-top: 0;
}

.card label {
  display: block;
  margin-top: 16px;
  color: var(--text-login);
}

.inputBox {
  width: 100%;
  padding: 10px 12px;
  margin-top: 8px;
  border-radius: 8px;
  border: 1px solid var(--input-outline);
  color: var(--text-login);
}

.inputBox.error {
  border: 1px solid var(--alert-red);
}

.hint {
  margin-bottom: 0;
  margin-left: 6px;
  margin-top: 4px;
  color: var(--text-lightgray);
}

.submitBtn {
  width: 100%;
  margin: 24px 0 0 0;
  padding: 12px;
  border-radius: 8px;
  border: none;
  background-color: var(--base-blue-dark);
  color: white;
  cursor: pointer;
  display: block;
}

.guide {
  background-color: white;
  border-radius: 12px;
  padding: 0 20px 20px 20px;
}

.guide ul {
  margin-top: 12px;
  padding-left: 8px;
  color: var(--base-blue-dark);
}
.guide li {
  margin-bottom: 7px;
  color: var(--text-bluegray);
}
.errorMessage {
  color: var(--alert-red);
  margin-top: 6px;
  margin-left: 6px;
  margin-bottom: 0;
}
.toastMsg {
  position: fixed;
  left: 50%;
  top: 25%;
  z-index: 99999;
  transform: translateX(-50%);
  z-index: 5;
  background: var(--base-blue-dark);
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  min-width: 235px;
  max-width: 340px;
  pointer-events: none;
  text-align: center;
  box-sizing: border-box;
  white-space: nowrap;
}
</style>
