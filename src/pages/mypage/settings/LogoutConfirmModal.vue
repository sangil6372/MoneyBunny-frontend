<template>
  <div class="modalBackdrop" @click.self="$emit('close')">
    <div class="modalCard">
      <div class="circle"></div>
      <p class="title font-20 font-bold">로그아웃</p>
      <p class="desc font-15 font-regular">
        정말 로그아웃 하시겠습니까?<br />
        저장되지 않은 정보는 사라질 수 있습니다.
      </p>
      <div class="btnGroup">
        <button class="cancelBtn font-15 font-bold" @click="$emit('close')">
          취소
        </button>
        <button class="logoutBtn font-15 font-bold" @click="$emit('logout')">
          로그아웃
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modalBackdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modalCard {
  background-color: white;
  border-radius: 24px;
  width: 360px;
  padding: 32px 20px;
  text-align: center;
}

.circle {
  width: 80px;
  height: 80px;
  background-color: #ffecec;
  border-radius: 50%;
  margin: 0 auto 20px;
}

.title {
  color: var(--text-login);
  margin-bottom: 12px;
}

.desc {
  color: var(--text-bluegray);
  margin-bottom: 24px;
  line-height: 1.6;
}

.btnGroup {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.cancelBtn {
  background-color: #f0f4f8;
  color: var(--text-login);
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  border: none;
}

.logoutBtn {
  background-color: #d85c5c;
  color: white;
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  border: none;
}
</style>
