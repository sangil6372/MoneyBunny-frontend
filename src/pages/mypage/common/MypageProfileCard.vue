<template>
  <div class="userCard">
    <div class="userInfo">
      <img
        src="@/assets/images/icons/profile/profile_edit_beard.png"
        alt="프로필 이미지"
        class="profileImage"
      />
      <div class="userText">
        <p class="userName font-22 font-bold">{{ userInfo.name }}</p>
        <p class="userEmail font-15 font-regular">{{ userInfo.email }}</p>
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
  margin: 0 auto 24px; /* ✅ 좌우 가운데 정렬 */
  width: 416px;
  height: 136px;
}

.userInfo {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
}

.profileImage {
  margin-left: 12px;
  width: 74px;
  height: 74px;
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
