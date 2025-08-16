<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AttendanceCheckModal from "./AttendanceCheckModal.vue";
// 💪(상일) FCM 토큰 관리 및 알림 설정용 import 추가
import { fcmTokenManager, TOKEN_STATES } from "@/firebase/FCMTokenManager";
import { useNotificationStore } from "@/stores/notification";

const showToast = ref(false);

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
// 💪(상일) 알림 스토어 추가
const notificationStore = useNotificationStore();

// 돌아갈 목적지: 쿼리의 redirect가 있으면 그걸, 없으면 /home
const redirectTarget = computed(
  () => route.query.redirect?.toString() || '/home'
);

const showModal = ref(false);
const id = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const showPassword = ref(false);

// 👁️ 비밀번호 보기/숨기기 아이콘
const eyeView = new URL(
  '@/assets/images/icons/signup/eye_view.png',
  import.meta.url
).href;
const eyeHide = new URL(
  '@/assets/images/icons/signup/eye_hide.png',
  import.meta.url
).href;

const guestIcon = new URL(
  '@/assets/images/icons/signup/user.png',
  import.meta.url
).href;

// 💪(상일) 로그인 성공 후 알림 권한 자동 요청
const requestNotificationAfterLogin = async () => {
  try {
    // 브라우저 알림 지원 확인
    if (!('Notification' in window)) {
      console.log('이 브라우저는 알림을 지원하지 않습니다.');
      return;
    }

    const tokenState = fcmTokenManager.getTokenState();
    
    // default 상태에서만 자동 권한 요청 (granted/denied는 사용자 의도 존중)
    if (tokenState === TOKEN_STATES.NEED_PERMISSION && 
        Notification.permission === "default") {
      console.log('🔔 로그인 후 알림 권한 자동 요청 시작');
      
      // FCM 토큰 발급 (권한 요청 포함)
      const token = await fcmTokenManager.getValidToken();
      
      // 초기 구독 설정 (모든 알림 false로 시작)
      const initialSubscription = {
        token,
        isActiveBookmark: false,
        isActiveTop3: false,
        isActiveNewPolicy: false,
        isActiveFeedback: false,
      };
      
      await notificationStore.updateSubscription(initialSubscription);
      console.log('✅ 로그인 후 알림 권한 요청 및 초기 구독 완료');
    } else {
      console.log('알림 권한 자동 요청 건너뜀 - 상태:', tokenState);
    }
  } catch (error) {
    // 권한 거부 또는 기타 오류 시에도 로그인 진행에는 영향 없음
    console.log('로그인 후 알림 권한 요청 실패:', error.message);
  }
};

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
      password: password.value,
    });

    // 💪(상일) 로그인 성공 후 알림 권한 자동 요청
    await requestNotificationAfterLogin();

    // 로그인 성공 시 출석체크 모달 표시
    // showModal.value = true;

    // 로그인 성공!
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
      // router.push('/home');
      router.replace(redirectTarget.value);
    }, 1200); // 1.2초 보여주고 홈으로
  } catch (error) {
    console.error('로그인 에러:', error);

    // 에러 상태별 메시지 처리
    if (error.response?.status === 401) {
      errorMessage.value = '아이디 또는 비밀번호가 잘못되었습니다.';
    } else if (error.response?.status >= 500) {
      errorMessage.value =
        '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage.value =
        '요청 시간이 초과되었습니다. 네트워크를 확인해주세요.';
    } else {
      errorMessage.value = '로그인에 실패했습니다. 다시 시도해주세요.';
    }
  } finally {
    isLoading.value = false;
  }
  // 🔐 서버 로그인 로직 생략
  // showModal.value = true;

  // setTimeout(() => {
  //   router.push('/home'); // ✅ HomeTotalTab 으로 이동
  // }, 1000); // 1초 후 이동 (원하는 시간으로 조절 가능)
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

const goGuestPolicyPage = () => {
  // 게스트는 정책 메인으로 바로 이동
  router.push({ name: 'policyMain' });
};

// 💪(상일) URL 파라미터로 전달된 에러 메시지 처리
onMounted(() => {
  // ✅ 이미 로그인 상태로 /login 접근한 경우: redirect 목적지로
  if (authStore.isLogin) {
    router.replace(redirectTarget.value);
    return;
  }

  if (route.query.error === 'auth_required') {
    errorMessage.value = '로그인이 필요한 페이지입니다.';
  } else if (route.query.error === 'login_required') {
    errorMessage.value = '세션이 만료되었습니다. 다시 로그인해주세요.';
  } else if (route.query.error === 'token_expired') {
    errorMessage.value = 'JWT 토큰이 만료되었습니다. 다시 로그인해주세요.';
  }
});

// 에러 메시지 변경 감지
watch(errorMessage, () => {
  if (errorMessage.value) {
    clearErrorMessage();
  }
});
</script>

<template>
  <div class="loginContainer">
    <div class="cardBox">
      <img
        src="@/assets/images/icons/signup/login_main.png"
        alt="login-bunny"
        class="bunnyImage"
      />
      <transition name="fade">
        <div v-if="showToast" class="toastMsg">로그인 되었습니다!</div>
      </transition>
      <div class="loginCard">
        <div class="loginTitle font-24 font-extrabold">MoneyBunny</div>
        <p class="loginSubtitle font-13">아이디와 비밀번호를 입력해주세요</p>

        <!-- 💪(상일) 에러 메시지 표시 영역 추가 -->
        <div v-if="errorMessage" class="errorMessage font-11">
          {{ errorMessage }}
        </div>

        <div class="formGroup">
          <label for="id" class="font-13 font-bold">아이디</label>
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
          <label for="password" class="font-13 font-bold">비밀번호</label>
          <div class="inputRow">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              class="passwordInput"
              placeholder="비밀번호를 입력하세요"
              @keypress="handleKeyPress"
              :disabled="isLoading"
            />
            <img
              :src="showPassword ? eyeView : eyeHide"
              class="icon"
              alt="비밀번호 보기 토글"
              @click="showPassword = !showPassword"
            />
          </div>
        </div>

        <button
          class="loginButton font-14"
          @click="handleLogin"
          :disabled="isLoading"
        >
          <span v-if="isLoading">로그인 중...</span>
          <span v-else>로그인</span>
        </button>

        <div class="divider">
          <span class="divider-line"></span>
          <span class="divider-text">또는</span>
          <span class="divider-line"></span>
        </div>

        <button
          class="guestButton"
          type="button"
          @click="goGuestPolicyPage"
          :disabled="isLoading"
        >
          <img :src="guestIcon" alt="" class="guestIcon" />
          <span class="guestText">비회원 로그인</span>
        </button>

        <div class="loginLink font-11">
          <!-- <router-link to="/findId">아이디 찾기</router-link> -->
          <router-link
            :to="{ name: 'findId', query: { redirect: route.query.redirect } }"
            >아이디 찾기</router-link
          >
          <span>|</span>
          <!-- <router-link to="/findPassword">비밀번호 찾기</router-link> -->
          <router-link
            :to="{
              name: 'findPassword',
              query: { redirect: route.query.redirect },
            }"
            >비밀번호 찾기</router-link
          >
        </div>

        <div class="signupLink font-11">
          계정이 없으신가요?
          <!-- <router-link to="/signUpEmailRequest">회원가입</router-link> -->
          <router-link
            :to="{
              name: 'signUpEmailRequest',
              query: { redirect: route.query.redirect },
            }"
            >회원가입</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loginContainer {
  width: 100%;
  min-height: 100vh;
  background-color: var(--input-bg-2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.cardBox {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 320px;
}
.bunnyImage {
  width: 90px;
  height: 90px;
  margin-bottom: -30px;
  z-index: 2;
}

.loginCard {
  width: 100%;
  max-width: 320px;
  min-height: 420px;
  background-color: white;
  padding: 28px 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.loginTitle {
  text-align: center;
  color: var(--text-login);
  margin-bottom: 8px;
}

.loginSubtitle {
  text-align: center;
  color: var(--text-bluegray);
  margin-bottom: 16px;
}

.formGroup {
  display: flex;
  flex-direction: column;
}

input {
  margin-top: 7px;
  margin-bottom: 13px;
  font-size: 12px;
  padding: 10px 14px;
  border: 1.2px solid var(--input-outline);
  border-radius: 8px;
  background-color: transparent;
  outline: none;
}

input:focus {
  border: 1.5px solid var(--input-outline-2);
}

.inputRow {
  position: relative;
  width: 100%;
}
.passwordInput {
  width: 100%;
  font-size: 12px;
  padding: 10px 42px 10px 14px;
  border: 1.2px solid var(--input-outline);
  border-radius: 8px;
  background-color: transparent;
  outline: none;
  box-sizing: border-box;
}
.passwordInput:focus {
  border: 1.5px solid var(--input-outline-2);
}
.inputRowHorizontal {
  display: flex;
  align-items: center;
  gap: 10px;
}
.icon {
  position: absolute;
  right: 16px;
  top: 45%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  cursor: pointer;
  user-select: none;
  z-index: 2;
}
.loginButton {
  width: 100%;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 10px;
  border-radius: 6px;
  border: none;
  margin-top: 6px;
  cursor: pointer;
}

.loginLink {
  margin-top: 12px;
  text-align: center;
  color: var(--text-bluegray);
}

.loginLink a {
  color: var(--text-bluegray);
  text-decoration: none;
  margin: 0 6px;
}

.signupLink {
  text-align: center;
  margin-top: 14px;
  color: var(--text-lightgray);
}

.signupLink a {
  color: var(--base-lavender);
  text-decoration: none;
  margin-left: 6px;
  font-size: 12px;
}

/* 💪(상일) 에러 메시지 및 로딩 상태 스타일 추가 */
.errorMessage {
  background-color: var(--alert-light-3);
  color: var(--alert-red);
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  text-align: center;
  border: 1px solid var(--alert-light-2);
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

.toastMsg {
  position: absolute;
  /* top: -54px; */
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  background: var(--base-blue-dark);
  color: #fff;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  width: 250px;
  pointer-events: none;
  text-align: center;
  box-sizing: border-box;
  white-space: nowrap;
}

.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 12px 0;
  width: 100%;
}

.divider-line {
  flex: 1;
  height: 1px;
  background-color: var(--input-outline);
}

.divider-text {
  margin: 0 10px;
  font-size: 11px;
  color: var(--text-bluegray);
  white-space: nowrap;
}

.guestButton {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #fff;
  color: var(--base-blue-dark);
  border: 1.5px solid var(--input-outline);
  border-radius: 6px;
  padding: 10px;
  cursor: pointer;
  box-sizing: border-box;
}

.guestButton:disabled {
  background-color: #f5f5f5;
  color: #9aa5b1;
  border-color: #e5e7eb;
  cursor: not-allowed;
}

.guestIcon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.guestText {
  font-size: 14px;
}
</style>
