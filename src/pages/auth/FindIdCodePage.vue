<template>
  <div class="codeContainer">
    <div class="card">
      <h1 class="title font-28 font-extrabold">MoneyBunny</h1>
      <p class="subtitle font-15 font-regular">
        아이디를 재설정하기 위해 이메일을 입력해주세요
      </p>

      <div class="formGroup">
        <label class="font-15 font-bold" for="email">이메일</label>
        <input
          id="email"
          type="email"
          placeholder="이메일을 입력하세요"
          class="input"
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
          />
          <span class="timer font-13">2:56</span>
        </div>
      </div>

      <button class="submitButton font-15 font-bold">인증하기</button>

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

<script setup>
// 추후 이메일 인증 로직 및 타이머 구현 가능
</script>

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
</style>
