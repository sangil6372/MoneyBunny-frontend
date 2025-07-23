<!-- src/pages/policy/tabs/PolicyMainTab.vue -->
<template>
  <div class="policy-wrapper">
    <h1>정책 메인 탭</h1>
    <!-- 추후에 정책 추천 카드 등 들어갈 예정 -->
    <BottomNav />
  </div>
</template>

<script setup>
import BottomNav from '@/components/layouts/NavBar.vue';
</script>

<style scoped>
.policy-wrapper {
  padding: 20px;
  padding-bottom: 80px; /* 하단 네비게이션 영역 확보 */
  text-align: center;
}
</style>
