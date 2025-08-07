<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// 🎵 회원가입 - 이메일 인증 시작 페이지
const router = useRouter();
const signUpEmail = ref("");
const isRequesting = ref(false);
const errorMsg = ref("");
const showToast = ref(false);

// 인증코드 전송
const requestSignUpCode = async () => {
  errorMsg.value = "";

  // 이메일 입력 확인
  if (!signUpEmail.value.trim()) {
    errorMsg.value = "이메일을 입력해주세요.";
    return;
  }

  // 이메일 형식 확인
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(signUpEmail.value)) {
    errorMsg.value = "올바른 이메일 형식을 입력해주세요.";
    return;
  }

  try {
    isRequesting.value = true;
    await axios.post("/api/auth/send-join-code", {
      email: signUpEmail.value,
    });
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
      // 회원가입 인증코드 입력 페이지로 이동 (route 네임은 프로젝트에 맞게!)
      router.push({
        name: "signUpEmailCode",
        query: { email: signUpEmail.value },
      });
    }, 1200);
  } catch (err) {
    errorMsg.value =
      err.response?.data?.message ||
      "이미 가입된 이메일이거나 오류가 발생했습니다.";
  } finally {
    isRequesting.value = false;
  }
};
</script>

<template>
  <div class="signUpAuthContainer">
    <div class="cardBox">
      <transition name="fade">
        <div v-if="showToast" class="toastMsg">인증코드가 발송되었습니다.</div>
      </transition>

      <img
        src="@/assets/images/icons/signup/login_main.png"
        alt="login-bunny"
        class="bunnyImage"
      />

      <div class="card">
        <div class="title font-24 font-extrabold">MoneyBunny</div>
        <p class="subtitle font-13">이메일로 회원가입을 진행합니다</p>
        <div v-if="errorMsg" class="errorMessage font-12">
          {{ errorMsg }}
        </div>
        <div class="formGroup">
          <label for="signUpEmail" class="font-13">이메일</label>
          <input
            type="email"
            id="signUpEmail"
            v-model="signUpEmail"
            placeholder="이메일을 입력하세요"
            autocomplete="email"
          />
        </div>
        <button
          class="submitButton font-14"
          @click="requestSignUpCode"
          :disabled="isRequesting"
        >
          인증코드 발송
        </button>
        <div class="loginLink font-11">
          이미 계정이 있으신가요? <a href="/">로그인</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.signUpAuthContainer {
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
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  background: white;
  border-radius: 12px;
  border: none;
  padding: 28px 20px;
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
  width: 100%;
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
  width: 100%;
}
input:focus {
  border: 1.5px solid var(--input-outline-2);
}
.submitButton {
  width: 100%;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin-top: 6px;
}
.loginLink {
  text-align: center;
  margin-top: 12px;
  color: var(--text-lightgray);
}
.loginLink a {
  color: var(--base-lavender);
  text-decoration: none;
  margin-left: 6px;
  font-size: 12px;
}

.errorMessage {
  width: 100%;
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
  min-width: 260px;
  max-width: 400px;
  text-align: center;
  pointer-events: none;
  box-sizing: border-box;
  white-space: nowrap;
}
</style>
