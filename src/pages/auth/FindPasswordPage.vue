<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const code = ref('');
const isCodeSent = ref(false);

const router = useRouter();

const handleSubmit = () => {
  if (!isCodeSent.value) {
    isCodeSent.value = true; // 인증코드 입력창 보여주기
  } else {
    // 인증 완료 후 로그인으로 이동
    router.push('/resetPassword');
  }
};
</script>

<template>
  <div class="findPasswordContainer">
    <div class="card">
      <h1 class="title font-28 font-extrabold">MoneyBunny</h1>
      <p class="subtitle font-15 font-regular">
        비밀번호를 재설정하기 위해 이메일을 입력해주세요
      </p>

      <div class="formGroup">
        <label class="font-15 font-bold">이메일</label>
        <input type="email" v-model="email" placeholder="이메일을 입력하세요" />
      </div>

      <!-- 인증코드 입력 -->
      <div v-if="isCodeSent" class="formGroup">
        <label class="font-15 font-bold">인증코드</label>
        <div class="inputRow">
          <input
            type="text"
            v-model="code"
            placeholder="인증코드를 입력하세요"
          />
          <span class="timer font-13">2:56</span>
        </div>
      </div>

      <!-- 버튼 -->
      <button class="actionButton font-15 font-bold" @click="handleSubmit">
        {{ isCodeSent ? '인증하기' : '인증코드 발송' }}
      </button>

      <!-- 링크 -->
      <div class="linkGroup font-13">
        <a href="/findId">아이디 찾기</a>
        <span>|</span>
        <a href="/">로그인</a>
      </div>
      <div class="signupLink font-13">
        계정이 없으신가요? <a href="/signUpEmailVerify">회원가입</a>
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
  padding: 24px;
  box-sizing: border-box;
}

.card {
  width: 100%;
  max-width: 360px;
  background-color: white;
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
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

input {
  font-size: 14px;
  padding: 12px 14px;
  border: none;
  border-radius: 8px;
  background-color: var(--input-bg-1);
  outline: none;
}

.submitButton {
  width: 100%;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 14px;
  border-radius: 10px;
  border: none;
  margin-top: 12px;
  cursor: pointer;
}

.linkGroup {
  margin-top: 16px;
  text-align: center;
  color: var(--text-bluegray);
}

.linkGroup a {
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

.inputRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.timer {
  margin-left: 8px;
  color: var(--text-lightgray);
}

.actionButton {
  width: 100%;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 14px;
  border-radius: 10px;
  border: none;
  margin-top: 16px;
  cursor: pointer;
}
</style>
