<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const code = ref('');
const isCodeSent = ref(false);

const handleClick = () => {
  if (!isCodeSent.value) {
    if (!email.value) {
      alert('이메일을 입력해주세요.');
      return;
    }
    // 인증코드 전송 로직
    isCodeSent.value = true;
  } else {
    if (!code.value) {
      alert('인증코드를 입력해주세요.');
      return;
    }

    // 실제 인증 확인 로직 (API 등)을 여기에 구현할 수 있음

    // 인증 완료되면 아이디 결과 페이지로 이동 (이메일 값을 넘길 수도 있음)
    router.push({ name: 'findIdResult' });
  }
};
</script>

<template>
  <div class="findIdContainer">
    <div class="card">
      <h1 class="title font-28 font-extrabold">MoneyBunny</h1>
      <p class="subtitle font-13 font-regular">
        아이디를 재설정하기 위해 이메일을 입력해주세요
      </p>

      <!-- 이메일 입력 -->
      <div class="formGroup">
        <label for="email" class="font-15 font-regular">이메일</label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="이메일을 입력하세요"
        />
      </div>

      <!-- 인증코드 입력: isCodeSent이 true일 때 표시 -->
      <div v-if="isCodeSent" class="formGroup">
        <label for="code" class="font-15 font-bold">인증코드</label>
        <input
          type="text"
          id="code"
          v-model="code"
          placeholder="인증코드를 입력하세요"
        />
      </div>

      <!-- 버튼 -->
      <button class="submitButton font-15 font-bold" @click="handleClick">
        {{ isCodeSent ? '인증하기' : '인증코드 발송' }}
      </button>

      <!-- 하단 링크 -->
      <div class="link font-13">
        <router-link to="/findPassword">비밀번호 찾기</router-link>
        <span>|</span>
        <router-link to="/">로그인</router-link>
      </div>
      <div class="signupLink font-13">
        계정이 없으신가요?
        <router-link to="/signUpEmailVerify">회원가입</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.findIdContainer {
  width: 100%;
  min-height: 100vh;
  background-color: var(--input-bg-2);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  box-sizing: border-box;
}

.card {
  width: 100%;
  max-width: 350px;
  background-color: white;
  padding: 32px;
  border-radius: 20px;
  border: none;
}

.title {
  text-align: center;
  color: var(--text-login);
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: var(--text-bluegray);
  margin-bottom: 32px;
}

.formGroup {
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
}

input {
  margin-top: 9px;
  font-size: 14px;
  padding: 12px 16px;
  border: 1px solid var(--input-outline);
  border-radius: 8px;
  background-color: transparent;
  outline: none;
}

.submitButton {
  width: 100%;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 14px;
  border-radius: 10px;
  border: none;
  /* margin-top: px; */
  cursor: pointer;
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
  margin-left: 10px;
}
</style>
