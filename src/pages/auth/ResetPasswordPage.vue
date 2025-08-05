<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

// 🎵(유정) 이메일 인증(FindPasswordPage) 후 비밀번호 재설정 페이지
const router = useRouter();
const route = useRoute(); // loginId

const password = ref('');
const confirmPassword = ref('');
const showSuccess = ref(false); // ✅ 성공 메시지 표시 여부
const errorMsg = ref('');
const loginId = route.query.loginId; // loginId 가져옴

const showToast = ref(false); // ✅ 토스트용

// 비밀번호 유효성 검사
const passwordRules = {
  minLength: 8,
  pattern:
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]|\\;:'",.<>/?]).{8,}$/,
};

const isPasswordValid = computed(() =>
  passwordRules.pattern.test(password.value)
);

// 힌트/에러/성공 메시지 판별용 computed
const passwordHintMsg = computed(() => {
  if (!password.value) return '8자 이상, 영문/숫자/특수문자 모두 포함';
  if (!isPasswordValid.value) return '비밀번호 조건을 확인하세요.';
  return '사용 가능한 비밀번호입니다.';
});
const passwordHintClass = computed(() => {
  if (!password.value) return 'inputHint';
  if (!isPasswordValid.value) return 'inputError';
  return 'inputSuccess';
});

const confirmErrorMsg = computed(() => {
  if (!confirmPassword.value) return '';
  if (
    password.value &&
    confirmPassword.value &&
    password.value !== confirmPassword.value
  )
    return '비밀번호가 일치하지 않습니다.';
  return '';
});

// ✨ 비밀번호 변경 (토스트 → 로그인)
const handleReset = async () => {
  errorMsg.value = '';
  if (!password.value || !confirmPassword.value) {
    errorMsg.value = '비밀번호를 다시 입력하세요.';
    return;
  }
  if (!isPasswordValid.value) {
    errorMsg.value = '비밀번호 조건을 확인하세요.';
    return;
  }
  if (password.value !== confirmPassword.value) {
    errorMsg.value = '비밀번호가 일치하지 않습니다.';
    return;
  }
  try {
    await axios.post('/api/auth/reset-password', {
      loginId,
      password: password.value,
    });
    errorMsg.value = '';
    showSuccess.value = true;
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
      router.push('/');
    }, 1200);
  } catch (err) {
    errorMsg.value =
      err.response?.data || '비밀번호 변경 중 오류가 발생했습니다.';
  }
};

const goToLogin = () => {
  router.push('/');
};
</script>

<template>
  <div class="resetPasswordContainer">
    <div class="cardBox">
      <img
        src="@/assets/images/icons/signup/login_main.png"
        alt="login-bunny"
        class="bunnyImage"
      />
      <!-- ✅ 변경 성공 토스트 -->
      <transition name="fade">
        <div v-if="showToast" class="toastMsg">
          비밀번호 변경이 완료되었습니다.
        </div>
      </transition>

      <div class="card" v-if="!showSuccess">
        <div class="title font-26 font-extrabold">MoneyBunny</div>
        <p class="subtitle font-14">새 비밀번호를 입력해주세요</p>

        <div class="formGroup">
          <label for="password" class="font-14">새 비밀번호</label>
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="새 비밀번호를 입력하세요"
            autocomplete="new-password"
          />
          <div :class="[passwordHintClass, 'font-12']">
            {{ passwordHintMsg }}
          </div>
        </div>

        <div class="formGroup">
          <label for="confirmPassword" class="font-14">비밀번호 확인</label>
          <input
            id="confirmPassword"
            type="password"
            v-model="confirmPassword"
            placeholder="비밀번호를 다시 입력하세요"
            autocomplete="new-password"
          />
          <!-- ✨ 에러 메시지 (불일치) -->
          <div v-if="confirmErrorMsg" class="inputError font-12">
            {{ confirmErrorMsg }}
          </div>
        </div>

        <!-- template 부분, 버튼 쪽만 이렇게! -->
        <button
          class="resetButton font-15"
          @click="showSuccess ? goToLogin() : handleReset()"
        >
          {{ showSuccess ? '로그인하러 가기' : '비밀번호 변경' }}
        </button>

        <div class="loginLink font-12">
          <a href="/findId">아이디 찾기</a>
          <span>|</span>
          <a href="/">로그인</a>
        </div>
        <div class="signupLink font-12" v-if="!showSuccess">
          계정이 없으신가요? <a href="/signUpEmailVerify">회원가입</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.resetPasswordContainer {
  width: 100%;
  min-height: 100vh;
  background-color: var(--input-bg-2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.cardBox {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 360px;
}

.bunnyImage {
  width: 90px;
  height: 90px;
  margin-bottom: -30px;
  z-index: 2;
}
.card {
  width: 100%;
  max-width: 360px;
  min-height: 460px;
  background-color: white;
  padding: 32px 24px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border: none;
}

.title {
  text-align: center;
  color: var(--base-blue-dark);
  margin-bottom: 8px;
}

.subtitle {
  text-align: center;
  color: var(--text-bluegray);
  margin-bottom: 18px;
}

.formGroup {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 22px; /* 간격 넉넉하게 */
}

.formGroup label {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-bluegray);
  margin-bottom: 7px;
  margin-left: 3px;
  letter-spacing: -0.01em;
}

input {
  font-size: 14px;
  padding: 13px 16px;
  border: 1.2px solid var(--input-outline);
  border-radius: 8px;
  background-color: transparent;
  outline: none;
  transition: border-color 0.18s;
}
input:focus {
  border: 1.5px solid var(--input-outline-2);
}

.resetButton {
  width: 100%;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 14px;
  border-radius: 10px;
  border: none;
  margin-top: 8px;
  cursor: pointer;
}

.resetButton:disabled {
  background-color: var(--input-disabled-2);
  cursor: not-allowed;
}

.loginLink {
  margin-top: 12px;
  text-align: center;
  color: var(--text-bluegray);
}

.loginLink a {
  color: var(--text-bluegray);
  text-decoration: none;
  margin: 0 6px;
}

.signupLink {
  text-align: center;
  margin-top: 12px;
  color: var(--text-lightgray);
}

.signupLink a {
  color: var(--base-lavender);
  text-decoration: none;
  margin-left: 6px;
  font-size: 13px;
}
.errorMessage {
  background-color: var(--alert-light-3);
  color: var(--alert-red);
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 12px;
  text-align: center;
  border: 1px solid var(--alert-light-2);
}

.toastMsg {
  position: absolute;
  top: -54px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  background: var(--base-blue-dark);
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 15px;
  min-width: 300px;
  max-width: 400px;
  pointer-events: none;
  text-align: center;
  box-sizing: border-box;
  white-space: nowrap;
}

.inputHint {
  color: var(--text-hint);
  font-size: 11px;
  margin-top: 4px;
  margin-left: 4px;
  letter-spacing: -0.01em;
}
.inputSuccess {
  color: var(--success-text);
  font-size: 11px;
  margin-top: 4px;
  margin-left: 4px;
  letter-spacing: -0.01em;
}
.inputError {
  color: var(--alert-red);
  font-size: 11px;
  margin-top: 4px;
  margin-left: 4px;
}
</style>
