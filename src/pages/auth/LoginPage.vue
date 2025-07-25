<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AttendanceCheckModal from './AttendanceCheckModal.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const showModal = ref(false);
const id = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

// 🔐 실제 서버 로그인 로직 구현
const handleLogin = async () => {
  // 입력값 검증
  if (!id.value.trim()) {
    errorMessage.value = '아이디를 입력해주세요.';
    return;
  }
  if (!password.value.trim()) {
    errorMessage.value = '비밀번호를 입력해주세요.';
    return;
  }

  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    // auth store의 login 메서드 호출
    console.log('로그인 시도:', id.value.trim());
    await authStore.login({
      username: id.value.trim(),
      password: password.value
    });
    
    console.log('로그인 성공, 출석체크 모달 표시');
    // 로그인 성공 시 출석체크 모달 표시
    showModal.value = true;
    
  } catch (error) {
    console.error('로그인 에러:', error);
    
    // 에러 상태별 메시지 처리
    if (error.response?.status === 401) {
      errorMessage.value = '아이디 또는 비밀번호가 잘못되었습니다.';
    } else if (error.response?.status >= 500) {
      errorMessage.value = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage.value = '요청 시간이 초과되었습니다. 네트워크를 확인해주세요.';
    } else {
      errorMessage.value = '로그인에 실패했습니다. 다시 시도해주세요.';
    }
  } finally {
    isLoading.value = false;
  }
};

const closeModal = () => {
  showModal.value = false;
  // 출석체크 모달 닫힌 후 홈으로 이동
  router.push('/home');
};

// 엔터키 입력 처리
const handleKeyPress = (event) => {
  if (event.key === 'Enter' && !isLoading.value) {
    handleLogin();
  }
};

// 에러 메시지 자동 삭제 (3초 후)
const clearErrorMessage = () => {
  if (errorMessage.value) {
    setTimeout(() => {
      errorMessage.value = '';
    }, 3000);
  }
};

// 💪(상일) URL 파라미터로 전달된 에러 메시지 처리
onMounted(() => {
  if (route.query.error === 'auth_required') {
    errorMessage.value = '로그인이 필요한 페이지입니다.';
  } else if (route.query.error === 'login_required') {
    errorMessage.value = '세션이 만료되었습니다. 다시 로그인해주세요.';
  } else if (route.query.error === 'token_expired') {
    errorMessage.value = 'JWT 토큰이 만료되었습니다. 다시 로그인해주세요.';
  }
});

// 에러 메시지 변경 감지
import { watch } from 'vue';
watch(errorMessage, () => {
  if (errorMessage.value) {
    clearErrorMessage();
  }
});
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

        <!-- 💪(상일) 에러 메시지 표시 영역 추가 -->
        <div v-if="errorMessage" class="errorMessage font-13">
          {{ errorMessage }}
        </div>

        <div class="formGroup">
          <label for="id" class="font-15 font-bold">아이디</label>
          <input
            type="text"
            id="id"
            v-model="id"
            placeholder="아이디를 입력하세요"
            @keypress="handleKeyPress"
            :disabled="isLoading"
          />
        </div>

        <div class="formGroup">
          <label for="password" class="font-15 font-bold">비밀번호</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="비밀번호를 입력하세요"
            @keypress="handleKeyPress"
            :disabled="isLoading"
          />
        </div>

        <button 
          class="loginButton font-15 font-bold" 
          @click="handleLogin"
          :disabled="isLoading"
        >
          <span v-if="isLoading">로그인 중...</span>
          <span v-else>로그인</span>
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

/* 💪(상일) 에러 메시지 및 로딩 상태 스타일 추가 */
.errorMessage {
  background-color: #fee;
  color: #c33;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  text-align: center;
  border: 1px solid #fcc;
}

.loginButton:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
</style>
