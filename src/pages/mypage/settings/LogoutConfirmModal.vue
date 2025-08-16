<template>
  <div class="modalBackdrop" @click.self="$emit('close')">
    <div class="modalCard">
      <!-- 오른쪽 상단 엑스버튼 -->
      <button class="closeBtn" @click="$emit('close')">
        <img
          src="@/assets/images/icons/common/x.png"
          alt="닫기"
          class="xIcon"
        />
      </button>
      <!-- 토끼 이미지 들어간 원 -->
      <div class="circle">
        <img
          src="@/assets/images/icons/bunny/crying_bunny.png"
          alt="토끼"
          class="bunnyImg"
        />
      </div>
      <p class="title font-17 font-bold">로그아웃</p>
      <p class="desc font-13 font-regular">
        정말 로그아웃 하시겠습니까?<br />
        저장되지 않은 정보는 사라질 수 있습니다.
      </p>
      <div class="btnGroup">
        <button class="cancelBtn font-13" @click="$emit('close')">취소</button>
        <button class="logoutBtn font-13" @click="$emit('logout')">
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
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modalCard {
  background-color: white;
  border-radius: 6px;
  width: 320px;
  padding: 24px;
  text-align: center;
  position: relative;
}
.closeBtn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  padding: 0;
  z-index: 1;
  cursor: pointer;
}
.xIcon {
  width: 20px;
  height: 20px;
}
.circle {
  width: 90px;
  height: 90px;
  background-color: #ffecec;
  border-radius: 50%;
  margin: 0 auto 15px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}
.bunnyImg {
  width: 70px;
  height: 70px;
  object-fit: contain;
  margin-top: 5px;
}
.title {
  color: var(--text-login);
  margin-bottom: 8px;
}
.desc {
  color: var(--text-bluegray);
  margin-bottom: 18px;
  line-height: 1.6;
}
.btnGroup {
  display: flex;
  gap: 8px;
  justify-content: center;
}
.cancelBtn {
  background-color: #f0f4f8;
  color: var(--text-login);
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  border: none;
}
.logoutBtn {
  background-color: #d85c5c;
  color: white;
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  border: none;
}
</style>
