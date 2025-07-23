<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const password = ref('');
const confirmPassword = ref('');
const showSuccess = ref(false); // ✅ 성공 메시지 표시 여부

const isFormValid = computed(() => {
  return password.value.length >= 8 && password.value === confirmPassword.value;
});

const handleReset = () => {
  if (!isFormValid.value) return;

  // 실제 비밀번호 변경 API 연동 시 여기에 비동기 호출
  showSuccess.value = true;
};

const goToLogin = () => {
  router.push('/');
};
</script>

<template>
  <div class="resetPasswordContainer">
    <div class="card" v-if="!showSuccess">
      <h1 class="title font-28 font-extrabold">MoneyBunny</h1>
      <p class="subtitle font-15 font-regular">
        비밀번호를 재설정하기 위해 이메일을 입력해주세요
      </p>

      <div class="formGroup">
        <label for="password" class="font-15 font-bold">새 비밀번호</label>
        <input
          id="password"
          type="password"
          v-model="password"
          placeholder="새 비밀번호를 입력하세요"
        />
      </div>

      <div class="formGroup">
        <label for="confirmPassword" class="font-15 font-bold"
          >비밀번호 확인</label
        >
        <input
          id="confirmPassword"
          type="password"
          v-model="confirmPassword"
          placeholder="비밀번호를 다시 입력하세요"
        />
      </div>

      <button
        class="resetButton font-15 font-bold"
        :disabled="!isFormValid"
        @click="handleReset"
      >
        비밀번호 변경
      </button>

      <div class="link font-13">
        <a href="/findId">아이디 찾기</a>
        <span>|</span>
        <a href="/">로그인</a>
      </div>
      <div class="signupLink font-13">
        계정이 없으신가요? <a href="/signUpEmailVerify">회원가입</a>
      </div>
    </div>

    <!-- ✅ 변경 성공 메시지 -->
    <div class="card successCard" v-else>
      <h2 class="title font-24 font-bold">비밀번호 변경 완료</h2>
      <p class="subtitle font-15 font-regular">
        비밀번호가 성공적으로 변경되었습니다.<br />
        새 비밀번호로 로그인해주세요.
      </p>
      <button class="resetButton font-15 font-bold" @click="goToLogin">
        로그인하러 가기
      </button>
    </div>
  </div>
</template>

<style scoped>
.resetPasswordContainer {
  width: 100%;
  min-height: 100vh;
  background-color: var(--input-bg-2);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
}

.card {
  width: 100%;
  max-width: 360px;
  background: white;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.title {
  text-align: center;
  color: var(--base-blue-dark);
}

.subtitle {
  text-align: center;
  color: var(--text-bluegray);
  margin-top: 8px;
  margin-bottom: 24px;
}

.formGroup {
  margin-bottom: 16px;
}

input {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: none;
  background-color: var(--input-bg-1);
  font-size: 14px;
}

.resetButton {
  width: 100%;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 14px;
  border-radius: 10px;
  border: none;
  margin-top: 16px;
  cursor: pointer;
}

.resetButton:disabled {
  background-color: var(--input-disabled-2);
  cursor: not-allowed;
}

.link {
  margin-top: 16px;
  text-align: center;
  color: var(--text-bluegray);
}

.link a {
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
  margin-left: 4px;
}
</style>
