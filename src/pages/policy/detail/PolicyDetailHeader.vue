<template>
  <header class="policyDetailHeader">
    <button class="backBtn" @click="$router.back()">
      <img src="@/assets/images/icons/common/arrow-left.png" alt="뒤로가기" />
    </button>
    <img
      src="@/assets/images/icons/policy/policy_detail_header.png"
      class="bunny"
    />
    <div>
      <div class="headerTitle font-bold font-15">정책 상세</div>
      <div class="headerSubtitle font-12">
        {{ policyTitle }}
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.policyDetailHeader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  height: 60px;
  border-bottom: 1px solid var(--base-lavender);
  background: white;
  display: flex;
  align-items: center;
  z-index: 1000;
}
.bunny {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
.headerTitle {
  color: var(--text-login);
  line-height: 1.1;
}
.headerSubtitle {
  color: var(--text-bluegray);
  font-weight: 400;
  margin-top: 2px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 220px;
}
.backBtn {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 8px;
  margin-right: 5px;
}
.backBtn img {
  width: 28px;
  height: 28px;
}
</style>
