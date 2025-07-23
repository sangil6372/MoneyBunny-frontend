<script setup>
import { ref } from 'vue';
import AttendanceCheckModal from './AttendanceCheckModal.vue';

const showModal = ref(false);
const id = ref('');
const password = ref('');

const handleLogin = () => {
  if (!id.value.trim()) {
    alert('아이디를 입력해주세요.');
    return;
  }
  if (!password.value.trim()) {
    alert('비밀번호를 입력해주세요.');
    return;
  }

  // 🔐 서버 로그인 로직 생략
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};
</script>

<template>
  <div class="loginContainer">
    <div class="loginWrapper">
      <!-- 🐰 토끼 이미지 추가 -->
      <img
        src="@/assets/images/icons/signup/login_main.png"
        alt="login-bunny"
        class="bunnyImage"
      />

      <div class="loginCard">
        <h1 class="loginTitle font-28 font-extrabold">MoneyBunny</h1>
        <p class="loginSubtitle font-15 font-regular">
          아이디와 비밀번호를 입력해주세요
        </p>

        <div class="formGroup">
          <label for="id" class="font-15 font-bold">아이디</label>
          <input
            type="text"
            id="id"
            v-model="id"
            placeholder="아이디를 입력하세요"
          />
        </div>

        <div class="formGroup">
          <label for="password" class="font-15 font-bold">비밀번호</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="비밀번호를 입력하세요"
          />
        </div>

        <button class="loginButton font-15 font-bold" @click="handleLogin">
          로그인
        </button>

        <div class="loginLinks font-13">
          <router-link to="/findId">아이디 찾기</router-link>
          <span>|</span>
          <router-link to="/findPassword">비밀번호 찾기</router-link>
        </div>

        <div class="signupLink font-13">
          계정이 없으신가요?
          <router-link to="/signUpEmailVerify">회원가입</router-link>
        </div>
      </div>
    </div>

    <!-- ✅ 출석체크 모달 -->
    <AttendanceCheckModal v-if="showModal" @close="closeModal" />
  </div>
</template>

<style scoped>
.loginContainer {
  width: 100%;
  min-height: 100vh;
  background-color: var(--input-bg-2);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  box-sizing: border-box;
}

.loginCard {
  width: 100%;
  max-width: 350px;
  background-color: white;
  padding: 24px;
  border-radius: 16px;
  /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); */
}

.loginTitle {
  text-align: center;
  color: var(--text-login);
  margin-bottom: 9px;
}

.loginSubtitle {
  text-align: center;
  color: var(--text-bluegray);
  margin-top: 9px;
  margin-bottom: 36px;
}

.formGroup {
  display: flex;
  flex-direction: column;
  /* margin-bottom: 16px; */
}

input {
  margin-top: 9px;
  margin-bottom: 16px;
  font-size: 14px;
  padding: 12px 16px;
  border: 1px solid var(--input-outline);
  border-radius: 8px;
  background-color: transparent;
  outline: none;
}

.loginButton {
  width: 100%;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 14px;
  border-radius: 8px;
  border: none;
  margin-top: 8px;
  cursor: pointer;
}

.loginLinks {
  margin-top: 13px;
  text-align: center;
  color: var(--text-bluegray);
}

.loginLinks a {
  color: var(--text-bluegray);
  text-decoration: none;
  margin: 0 6px;
}

.signupLink {
  text-align: center;
  margin-top: 16px;
  color: var(--text-lightgray);
}

.signupLink a {
  color: var(--base-lavender);
  text-decoration: none;
  margin-left: 10px;
}
.loginWrapper {
  position: relative;
  width: 100%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bunnyImage {
  width: 90px;
  height: auto;
  position: absolute;
  top: -30px;
  z-index: 2;
}

.loginCard {
  background-color: white;
  padding: 24px;
  border-radius: 16px;
  margin-top: 40px; /* 토끼 머리 공간 확보 */
  width: 100%;
  box-sizing: border-box;
}
</style>
