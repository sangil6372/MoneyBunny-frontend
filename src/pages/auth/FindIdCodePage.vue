5
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

// 이메일 인증 코드 전송 후 인증코드 입력 for 아이디 찾기 페이지
// 이메일 전송 및 인증 관련 변수
const route = useRoute();
const email = ref(route.query.email || "");

const router = useRouter();
const code = ref("");
const errorMsg = ref("");

// 토스트 관련 추가
const showToast = ref(false);
const toastText = ref("");
const isResending = ref(false);
// 타이머 관련 변수
const time = 180; // 180초 == 3분
const timeLeft = ref(time); // 남은 시간
let timerInterval = null;

const isExpired = computed(() => timeLeft.value === 0);

// 인증 만료 메시지 clear
const clearError = () => {
  setTimeout(() => {
    errorMsg.value = "";
  }, 3000);
};

// 인증

// 2단계: 인증코드 확인 및 아이디 조회
const verify = async () => {
  // 인증 시간 관련
  if (isExpired.value) {
    errorMsg.value = "인증 시간이 만료되었습니다. 다시 시도해주세요.";
    // clearError();
    return;
  }

  // 이메일 & 인증코드 입력 관련
  if (!email.value || !code.value) {
    errorMsg.value = "이메일과 인증코드를 모두 입력해주세요.";
    return;
  }

  // 인증 처리
  try {
    await axios.post("/api/auth/verify", {
      email: email.value,
      code: code.value,
    });

    // 인증 성공 -> 토스트 띄우고 이동
    toastText.value = "인증 성공!";
    showToast.value = true;

    setTimeout(async () => {
      showToast.value = false;
      const res = await axios.post("/api/auth/find-id", { email: email.value });
      const loginId = res.data;
      router.push({ name: "findIdResult", query: { loginId } });
    }, 1000); // 1초 후 이동
  } catch (err) {
    errorMsg.value =
      "인증 실패: " + (err.response?.data?.message || "코드를 확인해주세요");
  }
};

// 인증코드 재전송 (중복방지 없음)
const resendCode = async () => {
  if (isResending.value) return; // 이미 처리 중이면 리턴
  
  if (!email.value) {
    errorMsg.value = "이메일을 입력해주세요.";
    return;
  }
  // 만료되지 않았으면 재전송하지 않음 (버튼도 안 보이지만 안전장치)
  if (!isExpired.value) return;

  isResending.value = true; // 로딩 시작
  
  try {
    await axios.post("/api/auth/send-find-id-code", {
      email: email.value,
    });
    // 오류메시지 리셋
    errorMsg.value = "";

    // 타이머 리셋
    if (timerInterval) clearInterval(timerInterval);
    timeLeft.value = time;
    startTimer();
    // 토스트
    toastText.value = "인증코드를 재전송했습니다.";
    showToast.value = true;
    setTimeout(() => (showToast.value = false), 2000);
  } catch (err) {
    errorMsg.value =
      "재전송 실패: " +
      (err.response?.data?.message || "잠시 후 다시 시도해주세요");
  } finally {
    isResending.value = false; // 로딩 종료
  }
};

// 타이머

// 타이머 시작 함수
const startTimer = () => {
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timerInterval);
      errorMsg.value = "인증 시간이 만료되었습니다. 다시 시도해주세요.";
    }
  }, 1000);
};

// 컴포넌트 마운트 시 타이머 시작
onMounted(() => {
  // URL 쿼리에서 성공 토스트 표시 여부 확인
  if (route.query.showSuccessToast === "true") {
    toastText.value = "인증코드가 발송되었습니다!";
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
      toastText.value = "";
    }, 2000);
  }
  
  startTimer();
});

// 컴포넌트 언마운트 시 타이머 제거
onBeforeUnmount(() => {
  if (timerInterval) clearInterval(timerInterval);
});

// mm:ss 형식으로 포맷
const formattedTime = computed(() => {
  const minutes = String(Math.floor(timeLeft.value / 60)).padStart(2, "0");
  const seconds = String(timeLeft.value % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
});
</script>

<template>
  <div class="codeContainer">
    <div class="cardBox">
      <img
        src="@/assets/images/icons/signup/login_main.png"
        alt="login-bunny"
        class="bunnyImage"
      />
      <transition name="fade">
        <div v-if="showToast" class="toastMsg">{{ toastText }}</div>
      </transition>
      <div class="card">
        <div class="title font-24 font-extrabold">MoneyBunny</div>
        <p class="subtitle font-13">인증코드를 입력해주세요</p>

        <!-- 에러 메시지 표시 -->
        <div v-if="errorMsg" class="errorMessage font-12">
          {{ errorMsg }}
        </div>

        <div class="formGroup">
          <label class="font-13 font-bold" for="email">이메일</label>
          <input
            id="email"
            type="email"
            placeholder="이메일을 입력하세요"
            class="input"
            v-model="email"
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
              style="width: 100%"
            />
            <span
              class="timer font-10"
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
          @click="verify"
          :disabled="isExpired"
          :class="{ expired: isExpired }"
        >
          {{ isExpired ? "인증 만료" : "인증하기" }}
        </button>

        <!-- 만료됐을 때만 재전송 버튼 노출 -->
        <button
          v-if="isExpired"
          class="submitButton font-14"
          @click="resendCode"
          :disabled="isResending"
          :class="{ loading: isResending }"
        >
          {{ isResending ? '재전송 중...' : '인증코드 재전송' }}
        </button>

        <div class="loginLink font-11">
          <a href="/findPassword">비밀번호 찾기</a>
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
.codeContainer {
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
  color: var(--text-login);
  margin-bottom: 8px;
}

.subtitle {
  text-align: center;
  color: var(--text-bluegray);
  margin-bottom: 16px;
}

.formGroup {
  margin-bottom: 14px;
}

.input {
  margin-top: 7px;
  width: 100%;
  padding: 10px 14px;
  border: 1.2px solid var(--input-outline);
  border-radius: 8px;
  background-color: transparent;
  font-size: 12px;
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

.submitButton {
  width: 100%;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 12px;
  border-radius: 8px;
  border: none;
  margin-top: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.submitButton.expired,
.submitButton:disabled,
.submitButton.loading {
  background-color: var(--input-disabled-2);
  cursor: not-allowed;
  opacity: 0.7;
}

.loginLink {
  margin-top: 16px;
  text-align: center;
  color: var(--text-bluegray);
}

.loginLink a {
  margin: 0 6px;
  color: var(--text-bluegray);
  text-decoration: none;
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
</style>
