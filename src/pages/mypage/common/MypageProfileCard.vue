<template>
  <div class="userCard">
    <div class="userInfo">
      <img
        :src="userInfo.profileImage"
        alt="프로필 이미지"
        class="profileImage"
      />

      <div class="userText">
        <p class="userName font-20 font-bold">{{ userInfo.name }}</p>
        <p class="userEmail font-14 font-regular">{{ userInfo.email }}</p>
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
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  height: 136px;
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
  width: 85px;
  height: 85px;
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
  margin-top: 4px;
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
  margin-right: 12px;
}

.editBtn img {
  width: 23px;
  height: 23px;
}
</style>
