<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

// 회원가입 - 이메일 인증코드 입력 페이지
const route = useRoute();
const email = ref(route.query.email || "");

const router = useRouter();
const code = ref("");
const errorMsg = ref("");
const showToast = ref(false);
const showSuccessToast = ref(false);

const time = 180; // 180초 == 3분
const timeLeft = ref(time);
let timerInterval = null;
const isExpired = computed(() => timeLeft.value === 0);

const resetState = () => {
  // 메시지/입력/토스트/타이머 모두 초기화
  errorMsg.value = "";
  code.value = "";
  showToast.value = false;
  timeLeft.value = time;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

// 인증코드 검증 (회원가입용)
const verify = async () => {
  if (isExpired.value) {
    errorMsg.value = "인증 시간이 만료되었습니다. 다시 시도해주세요.";
    return;
  }
  if (!email.value || !code.value) {
    errorMsg.value = "이메일과 인증코드를 모두 입력해주세요.";
    return;
  }
  try {
    await axios.post("/api/auth/verify", {
      email: email.value,
      code: code.value,
    });
    // 성공 토스트 표시 후 다음 단계로 이동
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
      // 회원가입 입력폼으로 이동
      router.push({ name: "signUpProfile", query: { email: email.value } });
    }, 1000);
  } catch (err) {
    errorMsg.value =
      "인증 실패: " + (err.response?.data?.message || "코드를 확인해주세요");
  }
};

// 타이머
const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      errorMsg.value = "인증 시간이 만료되었습니다. 다시 시도해주세요.";
    }
  }, 1000);
};
onMounted(() => {
  // 이메일 발송 성공 시 토스트 표시
  if (route.query.showSuccessToast === 'true') {
    showSuccessToast.value = true;
    setTimeout(() => {
      showSuccessToast.value = false;
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

// 재전송
const goBackToEmailRequest = () => {
  if (timerInterval) clearInterval(timerInterval);
  resetState();
  router.push({
    name: "signUpEmailRequest",
    query: { email: email.value || "" },
  });
};
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
        <div v-if="showToast" class="toastMsg">
          이메일 인증이 완료되었습니다!
        </div>
      </transition>
      <transition name="fade">
        <div v-if="showSuccessToast" class="toastMsg">
          인증코드가 발송되었습니다.
        </div>
      </transition>
      <div class="card">
        <div class="title font-24 font-extrabold">MoneyBunny</div>
        <p class="subtitle font-13">이메일로 전송된 인증코드를 입력해주세요</p>
        <div v-if="errorMsg" class="errorMessage font-12">
          {{ errorMsg }}
        </div>
        <div class="formGroup">
          <label class="font-13 font-bold" for="email">이메일</label>
          <input
            id="email"
            type="email"
            class="input"
            v-model="email"
            readonly
            style="background: #f7f7fb"
          />
        </div>
        <div class="formGroup">
          <label class="font-13 font-bold" for="code">인증코드</label>
          <div class="inputRow">
            <input
              id="code"
              type="text"
              placeholder="인증코드를 입력하세요"
              class="input"
              v-model="code"
              :disabled="isExpired"
              style="flex: 1"
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
          @click="verify"
          :disabled="isExpired"
          :class="{ expired: isExpired }"
        >
          {{ isExpired ? "인증 만료" : "인증하기" }}
        </button>

        <!-- 만료 시: 재전송(요청 페이지로 돌아가기) -->
        <button
          v-if="isExpired"
          class="submitButton font-14"
          @click="goBackToEmailRequest"
        >
          인증코드 재전송
        </button>

        <div class="signupLink font-11">
          이미 계정이 있으신가요? <a href="/login">로그인</a>
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
.inputRow {
  width: 100%;
  display: flex;
  align-items: center;
}
.inputRow .input {
  flex: 1;
}
.timer {
  margin-left: 5px;
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
  margin-top: 6px;
  cursor: pointer;
}
.submitButton.expired {
  background-color: var(--input-disabled-2);
  cursor: not-allowed;
}
.loginLink {
  margin-top: 12px;
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
</style>
