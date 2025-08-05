<script setup>
import axios from "axios";
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
// 🎵(유정) 회원 가입 전 이메일 인증 페이지
const router = useRouter();

const email = ref("");
const code = ref("");
const isCodeSent = ref(false);

const time = 180; // 180초 == 3분
const timeLeft = ref(time); // 남은 시간
let timerInterval = null;

const isVerified = ref(false); // 인증 성공 여부
const isExpired = computed(() => timeLeft.value === 0); // 만료 여부
// 재시도
const canRetry = computed(() => isCodeSent.value && isExpired.value);

// 에러 메시지 출력
const errorMsg = ref("");

// 뒤로 가기(이전)
const goBack = () => {
  router.back();
};

// 앞으로 가기(다음)
const goNext = () => {
  if (!isVerified.value) {
    errorMsg.value = "인증을 완료해주세요.";
    return;
  }

  router.push("/signUpProfile");
};

// 이메일 확인
const checkEmail = async () => {
  errorMsg.value = "";

  if (!email.value.trim()) {
    errorMsg.value = "이메일을 입력해주세요.";
    return;
  }
  // 이메일 형식 체크 (정규식)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.value)) {
    errorMsg.value = "올바른 이메일 형식을 입력해주세요.";
    return;
  }

  try {
    // 중복 확인
    const checkRes = await axios.get("/api/member/check-email", {
      params: { email: email.value },
    });

    const isRegistered = checkRes.data === true;

    if (isRegistered) {
      // 중복된 이메일일 경우
      errorMsg.value = "이미 등록된 이메일입니다.";
      return;
    }

    // 인증코드 전송
    await axios.post("/api/auth/send-join-code", { email: email.value });

    // 인증코드 UI 표시 + 타이머 시작
    isCodeSent.value = true;
    startTimer();
    errorMsg.value = "";
  } catch (err) {
    errorMsg.value =
      "이메일 확인 중 오류가 발생했습니다: " +
      (err.response?.data?.message || "다시 시도해주세요");
  }
};

// 버튼 핸들러는 단순 호출만
// const handleClick = () => {
//   if (!email.value) {
//     alert("이메일을 입력해주세요.");
//     return;
//   }
//   sendIdCode();
// };

// 타이머
const startTimer = () => {
  // 초기화
  clearInterval(timerInterval);
  timeLeft.value = time;

  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);

  // 만료 메시지 업데이트
  errorMsg.value = "인증번호가 만료되었습니다. 다시 시도해주세요.";
};

// 타이머 출력 형식
const formattedTime = () => {
  const minutes = String(Math.floor(timeLeft.value / 60)).padStart(2, "0");
  const seconds = String(timeLeft.value % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

// 타이머 0초 -> 인증번호 만료
watch(timeLeft, (newVal) => {
  if (newVal === 0 && isCodeSent.value && !isVerified.value) {
    errorMsg.value = "인증번호가 만료되었습니다. 다시 시도해주세요.";
  }
});

// 인증코드 확인
const confirmCode = async () => {
  errorMsg.value = "";

  if (!code.value.trim()) {
    errorMsg.value = "인증 코드를 입력해주세요.";
    return;
  }

  try {
    // 인증 코드 검증 요청
    await axios.post("/api/auth/verify", {
      email: email.value,
      code: code.value,
    });

    // 인증 번호 확인 -> 인증 번호 확인
    isVerified.value = true;
    errorMsg.value = "인증번호가 확인되었습니다.";
  } catch (err) {
    isVerified.value = false; // 실패 시 초기화
    errorMsg.value =
      "인증 실패: " +
      (err.response?.data?.message || "코드를 다시 확인해주세요");
  }

  errorMsg.value = "인증번호가 확인되었습니다.";
};

// 다시 시도 (만료 후 인증 재전송)
const retry = async () => {
  errorMsg.value = "";

  try {
    await axios.post("/api/auth/send-join-code", { email: email.value });

    timeLeft.value = time;
    isCodeSent.value = true;
    startTimer();

    errorMsg.value = "인증 메일을 다시 보냈습니다.";
  } catch (err) {
    errorMsg.value =
      "다시 시도 중 오류가 발생했습니다: " +
      (err.response?.data?.message || "잠시 후 다시 시도해주세요.");
  }
};

// 이메일 코드 전송 / 인증코드 확인 / 만료 시 인증코드 재전송
const handleVerifyButton = () => {
  if (!isCodeSent.value) {
    checkEmail();
  } else if (isExpired.value) {
    retry();
  } else {
    confirmCode();
  }
};
</script>

<template>
  <div class="emailVerifyContainer">
    <div class="card">
      <h1 class="title font-28 font-extrabold">MoneyBunny</h1>
      <p class="subtitle font-15 font-regular">이메일로 인증을 진행해주세요</p>

      <!-- 성공/에러 메시지 표시 -->
      <div
        v-if="errorMsg"
        :class="[
          'errorMessage font-13',
          errorMsg.includes('확인되었습니다') ? 'successMessage' : '',
        ]"
      >
        {{ errorMsg }}
      </div>
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
          <button
            class="verifyButton font-13 font-bold"
            @click="checkEmail"
            :disabled="isExpired"
            :class="{ expired: isExpired }"
          >
            {{ isExpired ? "인증 만료" : "인증하기" }}
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
          <button
            class="verifyButton font-13 font-bold"
            @click="handleVerifyButton"
            :disabled="isCodeSent && !isExpired && !code"
            :class="{ expired: isCodeSent && isExpired }"
          >
            {{
              !isCodeSent ? "인증하기" : isExpired ? "다시 시도하기" : "확인"
            }}
          </button>
        </div>
        <div class="timer font-12 font-regular">{{ formattedTime() }}</div>
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

.errorMessage {
  background-color: #fee;
  color: #c33;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  text-align: center;
  border: 1px solid #fcc;
}
.successMessage {
  background-color: #e0f8e9;
  color: #2d7a3c;
  border: 1px solid #b8e2c0;
}
</style>
