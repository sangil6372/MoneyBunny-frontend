<script setup>
import { useRoute } from "vue-router";
// 🎵(유정) 이메일 인증 후 아이디 결과 반환 페이지
const route = useRoute();
const loginId = route.query.loginId || "unknown";
</script>
<template>
  <div class="findIdResultContainer">
    <div class="card">
      <h1 class="title font-28 font-extrabold">MoneyBunny</h1>

      <div class="resultBox">
        <p class="font-15 font-bold">찾은 아이디</p>
        <p class="foundEmail font-18 font-bold">{{ loginId }}</p>
      </div>

      <div class="linkGroup font-13">
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
.findIdResultContainer {
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

.resultBox {
  background-color: var(--input-bg-1);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  margin-bottom: 24px;
}

.foundEmail {
  margin-top: 8px;
  color: var(--base-blue-dark);
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
</style>
