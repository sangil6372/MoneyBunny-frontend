<template>
  <div class="infoCard">
    <div class="infoRow">
      <span class="infoLabel font-regular">이름</span>
      <span class="infoValue font-bold">{{ userInfo.name }}</span>
    </div>
    <div class="infoRow">
      <span class="infoLabel font-regular">이메일</span>
      <span class="infoValue font-bold">{{ userInfo.email }}</span>
    </div>
    <div class="infoRow">
      <span class="infoLabel font-regular">전화번호</span>
      <span class="infoValue font-bold">{{ userInfo.phone }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  userInfo: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.infoCard {
  background-color: white;
  border-radius: 16px;
  padding: 20px 18px;
  margin-top: 0;
}

.infoRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0 10px 0;
  border-bottom: 1px solid var(--input-bg-1);
}
.infoRow:last-child {
  border-bottom: none;
}

.infoLabel {
  color: var(--text-lightgray);
  font-size: 13px;
  letter-spacing: -0.03em;
}

.infoValue {
  color: var(--base-blue-dark);
  font-size: 15px;
  text-align: right;
  letter-spacing: -0.01em;
}
</style>
