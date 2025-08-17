<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

const router = useRouter();
const route = useRoute();

const loginId = ref(route.query.loginId || "");
const email = ref(route.query.email || "");

const code = ref("");
const errorMessage = ref("");
const successMessage = ref("");

const showToast = ref(false);
const isResending = ref(false);

const time = 180;
const timeLeft = ref(time);
let timerInterval = null;
const isExpired = computed(() => timeLeft.value === 0);

// 상태 초기화 (필요 시 재사용)
const resetState = () => {
  errorMessage.value = "";
  successMessage.value = "";
  code.value = "";
  timeLeft.value = time;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

const handleVerify = async () => {
  if (isExpired.value) {
    errorMessage.value = "인증 시간이 만료되었습니다. 다시 시도해주세요.";
    return;
  }
  if (!code.value) {
    errorMessage.value = "인증코드를 입력해주세요.";
    return;
  }
  try {
    const response = await axios.post("/api/auth/verify", {
      email: email.value,
      code: code.value,
    });
    if (response.data === "verified") {
      successMessage.value = "인증에 성공했습니다!";
      // 토스트 or 성공메시지 보여주고 이동
      showToast.value = true;
      setTimeout(() => {
        showToast.value = false;
        router.push({
          path: "/resetPassword",
          query: { loginId: loginId.value },
        });
      }, 1200);
    }
  } catch (err) {
    errorMessage.value = "인증코드가 올바르지 않습니다.";
  }
};

// 인증코드 재전송 (만료되었을 때만 허용)
const resendCode = async () => {
  if (isResending.value) return; // 이미 처리 중이면 리턴
  
  if (!email.value) {
    errorMessage.value = "이메일 정보가 없습니다.";
    return;
  }
  if (!isExpired.value) return; // 안전 가드

  isResending.value = true; // 로딩 시작
  
  try {
    await axios.post("/api/auth/send-find-password-code", {
      email: email.value,
      loginId: loginId.value,
    });

    // // 메시지/타이머 리셋
    // errorMessage.value = "";
    // successMessage.value = "인증코드를 재전송했습니다.";
    // setTimeout(() => (successMessage.value = ""), 2000);

    // 기존 메시지 대신 토스트 표시
    errorMessage.value = "";
    successMessage.value = "인증코드를 재전송했습니다.";
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
      successMessage.value = "";
    }, 2000);

    // 타이머 재시작
    if (timerInterval) clearInterval(timerInterval);
    timeLeft.value = time;
    startTimer();
  } catch (err) {
    errorMessage.value =
      "재전송 실패: " +
      (err.response?.data?.message || "잠시 후 다시 시도해주세요");
  } finally {
    isResending.value = false; // 로딩 종료
  }
};

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      errorMessage.value = "인증 시간이 만료되었습니다. 다시 시도해주세요.";
    }
  }, 1000);
};

onMounted(() => {
  // URL 쿼리에서 성공 토스트 표시 여부 확인
  if (route.query.showSuccessToast === "true") {
    successMessage.value = "인증코드가 발송되었습니다!";
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
      successMessage.value = "";
    }, 2000);
  }
  
  startTimer();
});
onBeforeUnmount(() => {
  if (timerInterval) clearInterval(timerInterval);
});

const formattedTime = computed(() => {
  const minutes = String(Math.floor(timeLeft.value / 60)).padStart(2, "0");
  const seconds = String(timeLeft.value % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
});
</script>

<template>
  <div class="findPasswordCodeContainer">
    <div class="cardBox">
      <img
        src="@/assets/images/icons/signup/login_main.png"
        alt="login-bunny"
        class="bunnyImage"
      />
      <!-- <transition name="fade">
        <div v-if="showToast" class="toastMsg">
          인증 성공! 비밀번호를 재설정해주세요.
        </div>
      </transition> -->
      <transition name="fade">
        <div v-if="showToast" class="toastMsg">
          {{ successMessage || "인증 성공! 비밀번호를 재설정해주세요." }}
        </div>
      </transition>

      <div class="card">
        <div class="title font-24 font-extrabold">MoneyBunny</div>
        <p class="subtitle font-13">인증코드를 입력해주세요</p>

        <!-- 에러 메시지 -->
        <div v-if="errorMessage" class="errorMessage font-11">
          {{ errorMessage }}
        </div>
        <!-- 성공 메시지 -->
        <!-- <div v-if="successMessage" class="successMessage font-11">
          {{ successMessage }}
        </div> -->

        <div class="formGroup">
          <label class="font-13 font-bold">아이디</label>
          <input
            type="text"
            :value="loginId"
            readonly
            style="background: var(--input-outline)"
          />
        </div>
        <div class="formGroup">
          <label class="font-13 font-bold">이메일</label>
          <input
            type="email"
            :value="email"
            readonly
            style="background: var(--input-outline)"
          />
        </div>

        <div class="formGroup">
          <label class="font-13 font-bold" for="code">인증코드</label>
          <div class="inputWrapper">
            <input
              id="code"
              type="text"
              placeholder="인증코드를 입력하세요"
              class="input"
              v-model="code"
              :disabled="isExpired"
              style="width: 100%"
            />
            <span
              class="timer font-11"
              :style="{
                color:
                  timeLeft < 30
                    ? 'var(--alert-strong)'
                    : 'var(--base-blue-dark)',
              }"
            >
              {{ formattedTime }}
            </span>
          </div>
        </div>

        <button
          class="submitButton font-14"
          @click="handleVerify"
          :disabled="isExpired"
          :class="{ expired: isExpired }"
        >
          {{ isExpired ? "인증 만료" : "인증하기" }}
        </button>

        <!-- 만료된 경우에만 보이는 재전송 버튼 -->
        <button
          v-if="isExpired"
          class="actionButton font-14"
          @click="resendCode"
          :disabled="isResending"
          :class="{ loading: isResending }"
        >
          {{ isResending ? '재전송 중...' : '인증코드 재전송' }}
        </button>

        <div class="loginLink font-11">
          <a href="/findId">아이디 찾기</a>
          <span>|</span>
          <a href="/">로그인</a>
        </div>
        <div class="signupLink font-11">
          계정이 없으신가요? <a href="/signUpEmailRequest">회원가입</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.findPasswordCodeContainer {
  width: 100%;
  min-height: 100vh;
  background-color: var(--input-bg-2);
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
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
  color: var(--text-login);
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
  margin-bottom: 14px;
}
input {
  margin-top: 7px;
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
.inputWrapper {
  position: relative;
  width: 100%;
  margin-top: 7px;
}
.inputWrapper .input {
  width: 100%;
  padding-right: 60px;
}
.timer {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--base-blue-dark);
  min-width: 50px;
  text-align: center;
  letter-spacing: 1px;
}
.actionButton {
  width: 100%;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 12px;
  border-radius: 8px;
  border: none;
  margin-top: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.actionButton:disabled,
.actionButton.loading {
  background-color: var(--input-disabled-2);
  cursor: not-allowed;
  opacity: 0.7;
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
.submitButton {
  width: 100%;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 12px;
  border-radius: 8px;
  border: none;
  margin-top: 6px;
  cursor: pointer;
}

.submitButton:disabled,
.submitButton.expired {
  background-color: var(--input-disabled-2);
  cursor: not-allowed;
  color: #fff;
}
</style>
