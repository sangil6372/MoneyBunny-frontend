<script setup>
import axios from "axios";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";

const email = ref("");
const code = ref("");
const isCodeSent = ref(false);

const loginId = ref("");
const errorMessage = ref("");

const router = useRouter();

// 이메일 전송 및 인증 관련 변수
const route = useRoute();

// 타이머 관련 변수
const time = 180; // 180초 == 3분
const timeLeft = ref(time); // 남은 시간
let timerInterval = null;

const isExpired = computed(() => timeLeft.value === 0);

const handleSubmit = async () => {
  if (!isCodeSent.value) {
    try {
      const response = await axios.post("/api/auth/send-find-password-code", {
        loginId: loginId.value,
        email: email.value,
      });
      isCodeSent.value = true;
      errorMessage.value = "";

      // 타이머 시작
      timeLeft.value = time; // 남은 시간 초기화
      clearInterval(timerInterval); // 기존 타이머 제거 (중복 방지)
      startTimer();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        errorMessage.value = "아이디와 이메일이 일치하지 않습니다.";
      } else {
        errorMessage.value = "인증코드 전송 중 오류가 발생했습니다.";
      }
    }
  } else {
    // 인증 확인 후 다음 단계로
    try {
      const response = await axios.post("/api/auth/verify", {
        email: email.value,
        code: code.value,
      });
      if (response.data === "verified") {
        router.push({
          path: "/resetPassword",
          query: { loginId: loginId.value },
        });
      }
    } catch (error) {
      errorMessage.value = "인증코드가 일치하지 않습니다.";
    }
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
      errorMessage.value = "인증 시간이 만료되었습니다. 다시 시도해주세요.";
    }
  }, 1000);
};

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
  <div class="findPasswordContainer">
    <div class="card">
      <h1 class="title font-28 font-extrabold">MoneyBunny</h1>
      <p class="subtitle font-15 font-regular">
        비밀번호를 재설정하기 위해 이메일을 입력해주세요
      </p>

      <!-- 에러 메시지 표시 -->
      <div v-if="errorMessage" class="errorMessage font-13">
        {{ errorMessage }}
      </div>

      <!-- 아이디 입력칸 추가 -->
      <div class="formGroup">
        <label class="font-15 font-bold">아이디</label>
        <input
          type="text"
          v-model="loginId"
          placeholder="아이디를 입력하세요"
        />
      </div>

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
          <span class="timer font-13">{{ formattedTime }}</span>
        </div>
      </div>

      <!-- 버튼 -->
      <button class="actionButton font-15 font-bold" @click="handleSubmit">
        {{ isCodeSent ? "인증하기" : "인증코드 발송" }}
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
.errorMessage {
  background-color: #fee;
  color: #c33;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  text-align: center;
  border: 1px solid #fcc;
}
</style>
