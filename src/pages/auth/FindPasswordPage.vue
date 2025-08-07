<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const loginId = ref('');
const email = ref('');
const errorMessage = ref('');
const showToast = ref(false);

const router = useRouter();

const handleSendCode = async () => {
  if (!loginId.value || !email.value) {
    errorMessage.value = '아이디와 이메일을 모두 입력해주세요.';
    setTimeout(() => (errorMessage.value = ''), 2000);
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    errorMessage.value = '올바른 이메일 형식을 입력해주세요.';
    setTimeout(() => (errorMessage.value = ''), 2000);
    return;
  }

  try {
    // ✅ 인증코드 전송 API 호출
    await axios.post('/api/auth/send-find-password-code', {
      email: email.value,
      loginId: loginId.value,
    });

    // 토스트 먼저 띄우기!
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
      // 실제 이동
      router.push({
        path: '/findPasswordCode',
        query: { loginId: loginId.value, email: email.value },
      });
    }, 1200); // 1.2초 후 이동
  } catch (err) {
    console.error(
      '[handleSendCode] 이메일 전송 실패:',
      err.response?.data || err.message
    );
    errorMessage.value =
      err.response?.data?.message || '이메일 전송에 실패했습니다.';
    setTimeout(() => (errorMessage.value = ''), 2000);
  }
};
</script>

<template>
  <div class="findPasswordContainer">
    <div class="cardBox">
      <img
        src="@/assets/images/icons/signup/login_main.png"
        alt="login-bunny"
        class="bunnyImage"
      />
      <transition name="fade">
        <div v-if="showToast" class="toastMsg">인증코드가 발송되었습니다.</div>
      </transition>

      <div class="card">
        <div class="title font-24 font-extrabold">MoneyBunny</div>
        <p class="subtitle font-13">이메일을 입력해주세요</p>

        <div v-if="errorMessage" class="errorMessage font-11">
          {{ errorMessage }}
        </div>

        <div class="formGroup">
          <label class="font-13 font-bold">아이디</label>
          <input
            type="text"
            v-model="loginId"
            placeholder="아이디를 입력하세요"
          />
        </div>

        <div class="formGroup">
          <label class="font-13 font-bold">이메일</label>
          <input
            type="email"
            v-model="email"
            placeholder="이메일을 입력하세요"
          />
        </div>

        <button
          class="actionButton font-14"
          @click="handleSendCode"
          type="button"
        >
          인증코드 발송
        </button>

        <div class="loginLink font-11">
          <a href="/findId">아이디 찾기</a>
          <span>|</span>
          <a href="/">로그인</a>
        </div>
        <div class="signupLink font-11">
          계정이 없으신가요? <a href="/signUpEmailVerify">회원가입</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.findPasswordContainer {
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
  border: none;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
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
.actionButton {
  width: 100%;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 12px;
  border-radius: 8px;
  border: none;
  margin-top: 6px;
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
