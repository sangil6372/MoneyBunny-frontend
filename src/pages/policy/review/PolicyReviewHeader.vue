<template>
  <header class="reviewHeader">
    <button class="backBtn" @click="$router.back()">
      <img src="@/assets/images/icons/common/arrow-left.png" alt="뒤로가기" />
    </button>

    <img
      src="@/assets/images/icons/policy/policy_detail_header.png"
      alt="header bunny"
      class="bunny"
    />
    <div class="titleWrap">
      <div class="pageTitle font-15 font-bold">이용자 리뷰</div>
      <div class="pageSub font-12">{{ policyTitle }}</div>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  policyTitle: { type: String, default: '' },
});
</script>

<style scoped>
.reviewHeader {
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

.titleWrap {
  display: flex;
  flex-direction: column;
  z-index: 2;
}
.pageTitle {
  color: var(--text-login);
  line-height: 1.1;
}
.pageSub {
  color: var(--text-bluegray);
  font-weight: 400;
  margin-top: 2px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 220px;
}
.bunny {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
</style>
