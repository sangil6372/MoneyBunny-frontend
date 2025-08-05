<template>
  <header class="changePasswordHeader">
    <button class="backBtn" @click="$router.back()">
      <img src="@/assets/images/icons/common/arrow-left.png" alt="뒤로가기" />
    </button>
    <div class="title font-20 font-bold">비밀번호 변경</div>
  </header>
</template>

<style scoped>
.changePasswordHeader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 474px;
  margin: 0 auto;
  height: 70px;
  border-bottom: 1px solid var(--base-lavender);
  background: white;
  display: flex;
  align-items: center;
  z-index: 1000;
}

.backBtn {
  background: none;
  border: none;
  margin-left: 10px;
  margin-right: 15px;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.backBtn img {
  width: 26px;
  height: 26px;
}
.title {
  color: var(--text-login);
}
</style>
