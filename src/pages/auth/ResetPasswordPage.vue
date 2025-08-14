<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

// 👁️ 눈 아이콘 상태
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// 👁️ 아이콘 경로
const eyeView = new URL(
  "@/assets/images/icons/signup/eye_view.png",
  import.meta.url
).href;
const eyeHide = new URL(
  "@/assets/images/icons/signup/eye_hide.png",
  import.meta.url
).href;

// 🎵(유정) 이메일 인증(FindPasswordPage) 후 비밀번호 재설정 페이지
const router = useRouter();
const route = useRoute(); // loginId

const password = ref("");
const confirmPassword = ref("");
const showSuccess = ref(false); // ✅ 성공 메시지 표시 여부
const errorMsg = ref("");
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
  if (!password.value) return "8자 이상, 영문/숫자/특수문자 모두 포함";
  if (!isPasswordValid.value) return "비밀번호 조건을 확인하세요.";
  return "사용 가능한 비밀번호입니다.";
});
const passwordHintClass = computed(() => {
  if (!password.value) return "inputHint";
  if (!isPasswordValid.value) return "inputError";
  return "inputSuccess";
});

const confirmErrorMsg = computed(() => {
  if (!confirmPassword.value) return "";
  if (
    password.value &&
    confirmPassword.value &&
    password.value !== confirmPassword.value
  )
    return "비밀번호가 일치하지 않습니다.";
  return "";
});

// ✨ 비밀번호 변경 (토스트 → 로그인)
const handleReset = async () => {
  errorMsg.value = "";
  if (!password.value || !confirmPassword.value) {
    errorMsg.value = "비밀번호를 다시 입력하세요.";
    return;
  }
  if (!isPasswordValid.value) {
    errorMsg.value = "비밀번호 조건을 확인하세요.";
    return;
  }
  if (password.value !== confirmPassword.value) {
    errorMsg.value = "비밀번호가 일치하지 않습니다.";
    return;
  }
  try {
    await axios.post("/api/auth/reset-password", {
      loginId,
      password: password.value,
    });
    errorMsg.value = "";
    showSuccess.value = true;
    showToast.value = true;
    // setTimeout(() => {
    //   showToast.value = false;
    //   router.push('/');
    // }, 1200);
  } catch (err) {
    errorMsg.value =
      err.response?.data || "비밀번호 변경 중 오류가 발생했습니다.";

    // 비밀번호 값 리셋
    password.value = "";
    confirmPassword.value = "";
  }
};

const goToLogin = () => {
  router.push("/");
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

      <div class="card">
        <div class="title font-24 font-extrabold">MoneyBunny</div>
        <p class="subtitle font-13">새 비밀번호를 입력해주세요</p>
        <!-- 에러창 -->
        <div
          v-if="errorMsg"
          class="errorMessage font-11"
          style="margin-top: 4px"
        >
          {{ errorMsg }}
        </div>
        <div class="formGroup">
          <label for="password" class="font-13">새 비밀번호</label>
          <div class="inputRow">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              class="passwordInput"
              placeholder="새 비밀번호를 입력하세요"
              autocomplete="new-password"
            />
            <img
              :src="showPassword ? eyeView : eyeHide"
              class="icon"
              alt="비밀번호 보기 토글"
              @click="showPassword = !showPassword"
            />
          </div>
          <div :class="[passwordHintClass, 'font-10']">
            {{ passwordHintMsg }}
          </div>
        </div>

        <div class="formGroup">
          <label for="confirmPassword" class="font-13">비밀번호 확인</label>
          <div class="inputRow">
            <input
              id="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              class="passwordInput"
              placeholder="비밀번호를 다시 입력하세요"
              autocomplete="new-password"
            />
            <img
              :src="showConfirmPassword ? eyeView : eyeHide"
              class="icon"
              alt="비밀번호 보기 토글"
              @click="showConfirmPassword = !showConfirmPassword"
            />
          </div>
          <div v-if="confirmErrorMsg" class="inputError font-11">
            {{ confirmErrorMsg }}
          </div>
        </div>

        <!-- template 부분, 버튼 쪽만 이렇게! -->
        <button
          class="resetButton font-14"
          @click="showSuccess ? goToLogin() : handleReset()"
        >
          {{ showSuccess ? "로그인하러 가기" : "비밀번호 변경" }}
        </button>

        <div class="loginLink font-11">
          <a href="/findId">아이디 찾기</a>
          <span>|</span>
          <a href="/">로그인</a>
        </div>
        <div class="signupLink font-11" v-if="!showSuccess">
          계정이 없으신가요? <a href="/signUpEmailRequest">회원가입</a>
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
  max-width: 320px;
}

.bunnyImage {
  width: 90px;
  height: 90px;
  margin-bottom: -30px;
  z-index: 2;
}
.card {
  width: 100%;
  max-width: 320px;
  min-height: 420px;
  background-color: white;
  padding: 28px 20px;
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
  margin-bottom: 16px;
}

.formGroup {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 14px; /* 간격 넉넉하게 */
}

.formGroup label {
  font-size: 13px;
  font-weight: bold;
  color: var(--text-bluegray);
  margin-bottom: 7px;
  margin-left: 3px;
  letter-spacing: -0.01em;
}

input {
  font-size: 12px;

  padding: 10px 14px;
  border: 1.2px solid var(--input-outline);
  border-radius: 8px;
  background-color: transparent;
  outline: none;
}
input:focus {
  border: 1.5px solid var(--input-outline-2);
}

.resetButton {
  width: 100%;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin-top: 6px;
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
  margin-top: 14px;
  color: var(--text-lightgray);
}

.signupLink a {
  color: var(--base-lavender);
  text-decoration: none;
  margin-left: 6px;
  font-size: 12px;
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
  font-size: 14px;
  min-width: 250px;
  max-width: 350px;
  pointer-events: none;
  text-align: center;
  box-sizing: border-box;
  white-space: nowrap;
}

.inputHint {
  color: var(--text-hint);
  font-size: 10px;
  margin-top: 3px;
  margin-left: 4px;
  letter-spacing: -0.01em;
}
.inputSuccess {
  color: var(--success-text);
  font-size: 10px;
  margin-top: 3px;
  margin-left: 4px;
  letter-spacing: -0.01em;
}
.inputError {
  color: var(--alert-red);
  font-size: 10px;
  margin-left: 4px;
}
.inputRow {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.passwordInput {
  width: 100%;
  font-size: 14px;
  padding: 12px 44px 12px 14px;
  border: 1.2px solid var(--input-outline);
  border-radius: 8px;
  background-color: transparent;
  outline: none;
  box-sizing: border-box;
  transition: border 0.18s;
}
.passwordInput:focus {
  border: 1.5px solid var(--input-outline-2);
}
.icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  cursor: pointer;
  user-select: none;
  z-index: 2;
  background: #fff;
  border-radius: 50%;
  padding: 2px;
}
</style>
