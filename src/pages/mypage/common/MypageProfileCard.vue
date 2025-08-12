<template>
  <div class="userCard">
    <div class="userInfo">
      <div class="profileWrap">
        <img
          :src="userInfo.profileImage"
          alt="프로필 이미지"
          class="profileImage"
        />
        <button
          class="editBadge"
          @click="$emit('edit')"
          aria-label="프로필 이미지 수정"
        >
          <img src="@/assets/images/icons/mypage/edit.png" alt="" />
        </button>
      </div>

      <div class="userText">
        <p class="userName font-18 font-bold">{{ userInfo.name }}</p>
        <p class="userEmail font-13">{{ userInfo.email }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ userInfo: Object });
defineEmits(['edit']);
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

/* ✅ 추가: 아이콘을 프로필 이미지 우하단에 겹치기 */
.profileWrap {
  position: relative;
  margin-left: 10px;
}
.profileImage {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--input-bg-3);
  object-fit: cover;
}

.editBadge {
  position: absolute;
  right: -4px;
  bottom: -4px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #fff;
  /* border: 1px solid #e5e7eb; */
  border: none;
  display: grid;
  place-items: center;
  cursor: pointer;
  padding: 0;
}
.editBadge img {
  width: 15px;
  height: 15px;
  display: block;
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
</style>
