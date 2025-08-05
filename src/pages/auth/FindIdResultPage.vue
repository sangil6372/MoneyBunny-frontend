<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// 🎵(유정) 이메일 인증 후 아이디 결과 반환 페이지
const route = useRoute();
const router = useRouter();

const loginId = route.query.loginId || 'unknown';
const showCopyMsg = ref(false);
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(loginId);
    showCopyMsg.value = true;
    setTimeout(() => {
      showCopyMsg.value = false;
    }, 1500);
  } catch (e) {
    alert('복사에 실패했습니다.');
  }
};
// 로그인 버튼 핸들러
const goLogin = () => {
  router.push('/');
};
</script>

<template>
  <div class="findIdResultContainer">
    <div class="cardBox">
      <img
        src="@/assets/images/icons/signup/login_main.png"
        alt="login-bunny"
        class="bunnyImage"
      />

      <div class="card">
        <div class="title font-26 font-extrabold">MoneyBunny</div>

        <div class="resultBox">
          <div class="resultLabel">아이디</div>
          <div class="foundIdRow">
            <span class="foundId">{{ loginId }}</span>
            <img
              src="@/assets/images/icons/signup/copy.png"
              alt="복사"
              class="copyIcon"
              @click="handleCopy"
              style="cursor: pointer"
            />
          </div>
          <transition name="fade">
            <div v-if="showCopyMsg" class="copyMsg">
              클립보드에 복사되었습니다!
            </div>
          </transition>
        </div>

        <button class="goLoginButton font-15" @click="goLogin">
          로그인하러가기
        </button>

        <div class="signupLink font-12">
          계정이 없으신가요?
          <router-link to="/signUpEmailVerify">회원가입</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.findIdResultContainer {
  width: 100%;
  min-height: 100vh;
  background-color: var(--input-bg-2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cardBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 360px;
}

.bunnyImage {
  width: 90px;
  height: 90px;
  margin-bottom: -30px;
  z-index: 2;
}

.card {
  width: 100%;
  max-width: 360px;
  min-height: 460px;
  background-color: white;
  padding: 32px 24px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border: none;
}

.title {
  text-align: center;
  color: var(--text-login);
  margin-bottom: 18px;
}

.resultBox {
  background-color: var(--input-bg-2);
  border-radius: 8px;
  margin-top: 8px;
  margin-bottom: px;
  width: 100%;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.resultLabel {
  font-size: 18px;
  margin-bottom: 7px;
}

.foundIdRow {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
}

.foundId {
  font-size: 20px;
  color: var(--base-blue-dark);
  font-weight: bold;
  letter-spacing: 1px;
  word-break: break-all;
  background: none;
  border: none;
  padding: 0;
}

.copyIcon {
  width: 18px;
  height: 18px;
  margin-left: 3px;
}

.copyMsg {
  margin-top: 12px;
  font-size: 12px;
  color: var(--base-blue-dark);
}

.goLoginButton {
  width: 100%;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 12px;
  border-radius: 8px;
  border: none;
  margin: 12px 0;
  cursor: pointer;
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
  font-size: 13px;
}
</style>
