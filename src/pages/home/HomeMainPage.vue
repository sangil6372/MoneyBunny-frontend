<!-- pages/home/HomeMainPage.vue -->
<template>
  <div class="home-container">
    <TabSwitcher :selectedTab="selectedTab" @switch="handleTabSwitch" />

    <!-- 탭별 컴포넌트 -->
    <HomeTotalTab v-if="selectedTab === '전체'" />
    <HomeAccountTab v-if="selectedTab === '계좌'" />
    <HomeSavingTab v-if="selectedTab === '적금'" />
    <HomeSpendingTab v-if="selectedTab === '지출'" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

import TabSwitcher from '@/pages/home/common/TabSwitcher.vue';
import HomeTotalTab from '@/pages/home/tabs/HomeTotalTab.vue';
import HomeAccountTab from '@/pages/home/tabs/HomeAccountTab.vue';
import HomeSavingTab from '@/pages/home/tabs/HomeSavingTab.vue';
import HomeSpendingTab from '@/pages/home/tabs/HomeSpendingTab.vue';

const selectedTab = ref('전체');
const handleTabSwitch = (tab) => {
  selectedTab.value = tab;
};
</script>

<style scoped>
.home-container {
  padding: 20px;
}
</style>
