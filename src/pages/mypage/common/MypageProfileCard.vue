<template>
  <div class="userCard">
    <div class="userInfo">
      <img
        :src="userInfo.profileImage"
        alt="프로필 이미지"
        class="profileImage"
      />

      <div class="userText">
        <p class="userName font-18 font-bold">{{ userInfo.name }}</p>
        <p class="userEmail font-13">{{ userInfo.email }}</p>
      </div>
      <button class="editBtn" @click="$emit('edit')">
        <img src="@/assets/images/icons/mypage/edit.png" alt="수정" />
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({ userInfo: Object });
</script>

<style scoped>
.userCard {
  background-color: white;
  width: 100%;
  min-height: 120px;
  box-sizing: border-box;
}

.userInfo {
  justify-content: space-between;
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
}

.profileImage {
  margin-left: 10px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--input-bg-3);
  object-fit: cover;
}

.userText {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  gap: 2px;
  min-width: 0;
}

.userText p {
  margin: 0;
}

.userName {
  color: var(--text-login);
}

.userEmail {
  color: var(--text-bluegray);
}

.editBtn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  margin-right: 14px;
}

.editBtn img {
  width: 20px;
  height: 20px;
}
</style>
