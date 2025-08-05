<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
// 🎵(유정) 이메일 인증(이메일 입력) for 아이디 찾기 페이지
const router = useRouter();
const email = ref("");
const isCodeSent = ref(false);
const errorMsg = ref("");

// 인증코드 전송
const sendIdCode = async () => {
  errorMsg.value = "";

  // 이메일 입력 확인
  if (!email.value.trim()) {
    errorMsg.value = "이메일을 입력해주세요.";
    return;
  }

  // 이메일 형식 확인
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.value)) {
    errorMsg.value = "올바른 이메일 형식을 입력해주세요.";
    return;
  }

  try {
    // 인증 코드 요청
    await axios.post("/api/auth/send-find-id-code", { email: email.value });
    isCodeSent.value = true;

    // 성공 시 다음 페이지로 이동
    router.push({ name: "findIdCode", query: { email: email.value } });
  } catch (err) {
    // 가입되지 않은 이메일 등 에러 처리
    errorMsg.value =
      err.response?.data?.message || "가입되지 않은 이메일입니다.";
  }
};

// 버튼 핸들러는 단순 호출만
const handleClick = () => {
  if (!email.value) {
    alert("이메일을 입력해주세요.");
    return;
  }
  sendIdCode();
};
</script>

<template>
  <div class="findIdContainer">
    <div class="card">
      <h1 class="title font-28 font-extrabold">MoneyBunny</h1>
      <p class="subtitle font-13 font-regular">
        아이디를 재설정하기 위해 이메일을 입력해주세요
      </p>

      <!-- 에러 메시지 또는 안내 메시지 -->
      <div
        v-if="errorMsg"
        :class="[
          'errorMessage font-13',
          errorMsg.includes('요청되었습니다') ? 'successMessage' : '',
        ]"
      >
        {{ errorMsg }}
      </div>

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

      <!-- 버튼 -->
      <button class="submitButton font-15 font-bold" @click="sendIdCode">
        인증코드 발송
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
