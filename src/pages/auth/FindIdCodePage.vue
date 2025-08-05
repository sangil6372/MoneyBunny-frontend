<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
// 🎵(유정) 이메일 인증 코드 전송 후 인증코드 입력 for 아이디 찾기 페이지
// 이메일 전송 및 인증 관련 변수
const route = useRoute();
const email = ref(route.query.email || "");

const router = useRouter();
const code = ref("");
const errorMsg = ref("");

// 타이머 관련 변수
const time = 180; // 180초 == 3분
const timeLeft = ref(time); // 남은 시간
let timerInterval = null;

const isExpired = computed(() => timeLeft.value === 0);

// 인증 만료 메시지 clear
const clearError = () => {
  setTimeout(() => {
    errorMsg.value = "";
  }, 3000);
};

// 인증

// 2단계: 인증코드 확인 및 아이디 조회
const verify = async () => {
  // 인증 시간 관련
  if (isExpired.value) {
    errorMsg.value = "인증 시간이 만료되었습니다. 다시 시도해주세요.";
    // clearError();
    return;
  }

  // 이메일 & 인증코드 입력 관련
  if (!email.value || !code.value) {
    errorMsg.value = "이메일과 인증코드를 모두 입력해주세요.";
    return;
  }

  // 인증 처리
  try {
    await axios.post("/api/auth/verify", {
      email: email.value,
      code: code.value,
    });

    // 인증 성공 → 아이디 조회
    const res = await axios.post("/api/auth/find-id", { email: email.value });
    const loginId = res.data;
    router.push({ name: "findIdResult", query: { loginId } });
  } catch (err) {
    errorMsg.value =
      "인증 실패: " + (err.response?.data?.message || "코드를 확인해주세요");
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
      errorMsg.value = "인증 시간이 만료되었습니다. 다시 시도해주세요.";
    }
  }, 1000);
};

// 컴포넌트 마운트 시 타이머 시작
onMounted(() => {
  startTimer();
});

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
  <div class="codeContainer">
    <div class="card">
      <h1 class="title font-28 font-extrabold">MoneyBunny</h1>
      <p class="subtitle font-13 font-regular">
        아이디를 재설정하기 위해 인증코드를 입력해주세요
      </p>

      <!-- 에러 메시지 표시 -->
      <div v-if="errorMsg" class="errorMessage font-13">
        {{ errorMsg }}
      </div>

      <div class="formGroup">
        <label class="font-15 font-bold" for="email">이메일</label>
        <input
          id="email"
          type="email"
          placeholder="이메일을 입력하세요"
          class="input"
          v-model="email"
        />
      </div>

      <div class="formGroup">
        <label class="font-15 font-bold" for="code">인증코드</label>
        <div class="inputRow">
          <input
            id="code"
            type="text"
            placeholder="인증코드를 입력하세요"
            class="input"
            v-model="code"
          />
          <!-- 타이머 공간 관련해서 주석 처리 -->
          <!-- <span class="timer font-13">{{ formattedTime }}</span> -->
        </div>
        <span class="timer font-13">{{ formattedTime }}</span>
      </div>

      <button
        class="submitButton font-15 font-bold"
        @click="verify"
        :disabled="isExpired"
        :class="{ expired: isExpired }"
      >
        {{ isExpired ? "인증 만료" : "인증하기" }}
      </button>

      <div class="links font-13">
        <a href="/findPassword">비밀번호 찾기</a>
        <span>|</span>
        <a href="/">로그인</a>
      </div>

      <div class="signup font-13">
        계정이 없으신가요? <a href="/signUpEmailVerify">회원가입</a>
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
  justify-content: center;
  align-items: center;
  padding: 24px;
}

.card {
  width: 100%;
  max-width: 420px;
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
  margin-bottom: 16px;
}

.input {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: var(--input-bg-1);
  font-size: 14px;
  outline: none;
}

.inputRow {
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.timer {
  margin-left: 8px;
  color: var(--text-bluegray);
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
.submitButton.expired {
  background-color: var(--input-disabled-2);
  cursor: not-allowed;
}

.links {
  margin-top: 16px;
  text-align: center;
  color: var(--text-bluegray);
}

.links a {
  margin: 0 6px;
  color: var(--text-bluegray);
  text-decoration: none;
}

.signup {
  text-align: center;
  margin-top: 12px;
  color: var(--text-lightgray);
}

.signup a {
  color: var(--base-lavender);
  text-decoration: none;
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
