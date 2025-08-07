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

const time = 180;
const timeLeft = ref(time);
let timerInterval = null;
const isExpired = computed(() => timeLeft.value === 0);

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

const startTimer = () => {
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timerInterval);
      errorMessage.value = "인증 시간이 만료되었습니다. 다시 시도해주세요.";
    }
  }, 1000);
};

onMounted(() => {
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
      <transition name="fade">
        <div v-if="showToast" class="toastMsg">
          인증 성공! 비밀번호를 재설정해주세요.
        </div>
      </transition>
      <div class="card">
        <div class="title font-26 font-extrabold">MoneyBunny</div>
        <p class="subtitle font-14">인증코드를 입력해주세요</p>

        <!-- 에러 메시지 -->
        <div v-if="errorMessage" class="errorMessage font-12">
          {{ errorMessage }}
        </div>
        <!-- 성공 메시지 -->
        <div v-if="successMessage" class="successMessage font-12">
          {{ successMessage }}
        </div>

        <div class="formGroup">
          <label class="font-14 font-bold">아이디</label>
          <input
            type="text"
            :value="loginId"
            readonly
            style="background: var(--input-outline)"
          />
        </div>
        <div class="formGroup">
          <label class="font-14 font-bold">이메일</label>
          <input
            type="email"
            :value="email"
            readonly
            style="background: var(--input-outline)"
          />
        </div>

        <div class="formGroup">
          <label class="font-14 font-bold" for="code">인증코드</label>
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
              class="timer font-12"
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
          class="actionButton font-15"
          @click="handleVerify"
          :disabled="isExpired"
        >
          {{ isExpired ? "인증 만료" : "인증하기" }}
        </button>

        <div class="loginLink font-12">
          <a href="/findId">아이디 찾기</a>
          <span>|</span>
          <a href="/">로그인</a>
        </div>
        <div class="signupLink font-12">
          계정이 없으신가요? <a href="/signUpEmailVerify">회원가입</a>
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
  color: var(--text-login);
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
  margin-bottom: 14px;
}
input {
  margin-top: 7px;
  font-size: 13px;
  padding: 12px 16px;
  border: 1.2px solid var(--input-outline);
  border-radius: 8px;
  background-color: transparent;
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
.actionButton {
  width: 100%;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 14px;
  border-radius: 10px;
  border: none;
  margin-top: 10px;
  cursor: pointer;
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
.successMessage {
  margin-top: 8px;
  background: #e6f8e6;
  border: 1px solid #b8e2c0;
  color: #297d46;
  border-radius: 6px;
  font-size: 13px;
  padding: 8px 13px;
  text-align: center;
}
</style>
