<!-- src/pages/asset/tabs/AssetMainTab.vue -->
<template>
  <div class="asset-main-tab">
    <h1>자산 메인 탭</h1>
    <!-- 추후에 자산 요약, 그래프 등 추가 예정 -->
    <BottomNav />
  </div>
</template>

<script setup>
import BottomNav from '@/components/layouts/NavBar.vue';
</script>

<style scoped>
.asset-main-tab {
  padding: 20px;
  padding-bottom: 80px; /* 하단 네비바 공간 확보 */
  text-align: center;
}
</style>
