<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const code = ref('');
const isCodeSent = ref(false);
const timer = ref(180);
let interval;

const goBack = () => {
  router.back();
};

const goNext = () => {
  // 코드 유효성 검증 등 추가 가능
  router.push('/signUpProfile');
};

const sendCode = () => {
  if (!email.value.trim()) {
    alert('이메일을 입력해주세요.');
    return;
  }
  isCodeSent.value = true;
  startTimer();
};

const startTimer = () => {
  timer.value = 180;
  clearInterval(interval);
  interval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      clearInterval(interval);
    }
  }, 1000);
};

const formatTime = () => {
  const m = String(Math.floor(timer.value / 60)).padStart(2, '0');
  const s = String(timer.value % 60).padStart(2, '0');
  return `${m}:${s}`;
};
</script>

<template>
  <div class="emailVerifyContainer">
    <div class="card">
      <h1 class="title font-28 font-extrabold">MoneyBunny</h1>
      <p class="subtitle font-15 font-regular">이메일로 인증을 진행해주세요</p>

      <div class="formGroup">
        <label for="email" class="font-15 font-bold">이메일 인증</label>
        <div class="emailRow">
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="이메일을 입력하세요"
            class="emailInput"
          />
          <button class="verifyButton font-13 font-bold" @click="sendCode">
            인증요청
          </button>
        </div>
      </div>

      <div v-if="isCodeSent" class="formGroup">
        <label for="code" class="font-15 font-bold">인증 코드</label>
        <div class="emailRow">
          <input
            type="text"
            id="code"
            v-model="code"
            placeholder="인증코드를 입력하세요"
            class="emailInput"
          />
          <button class="verifyButton font-13 font-bold">확인</button>
        </div>
        <div class="timer font-12 font-regular">{{ formatTime() }}</div>
      </div>

      <div class="buttonGroup">
        <button class="backButton font-15 font-bold" @click="goBack">
          이전
        </button>
        <button class="nextButton font-15 font-bold" @click="goNext">
          다음
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.emailVerifyContainer {
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
  margin-bottom: 24px;
}

.emailRow {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.emailInput {
  flex: 1;
  padding: 12px 14px;
  border: none;
  border-radius: 8px;
  background-color: var(--input-bg-1);
  font-size: 14px;
  outline: none;
}

.verifyButton {
  background-color: var(--base-blue-dark);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
}

.timer {
  margin-top: 6px;
  color: var(--text-bluegray);
}

.buttonGroup {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.backButton {
  flex: 1;
  padding: 12px;
  background-color: white;
  border: 1px solid var(--input-disabled-1);
  border-radius: 8px;
  color: var(--text-darkgray);
  cursor: pointer;
}

.nextButton {
  flex: 1;
  padding: 12px;
  background-color: var(--base-blue-dark);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}
</style>
