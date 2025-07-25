<!-- pages/home/HomeMainPage.vue -->
<template>
  <div class="home-container">
    <!-- 각 탭에서 전용 요약 카드 렌더링 -->
    <component :is="summaryCardComponent" />

    <!--상단 탭-->
    <TabSwitcher :selectedTab="selectedTab" @switch="handleTabSwitch" />

    <!-- 탭별 컴포넌트 -->
    <HomeTotalTab v-if="selectedTab === '전체'" @switchTab="handleTabSwitch" />
    <HomeAccountTab v-if="selectedTab === '계좌'" />
    <HomeSavingTab v-if="selectedTab === '적금'" />
    <HomeSpendingTab v-if="selectedTab === '지출'" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

import TabSwitcher from '@/pages/home/common/TabSwitcher.vue';
import HomeTotalTab from '@/pages/home/tabs/HomeTotalTab.vue';
import HomeAccountTab from '@/pages/home/tabs/HomeAccountTab.vue';
import HomeSavingTab from '@/pages/home/tabs/HomeSavingTab.vue';
import SavingSummaryCard from '@/pages/home/saving/SavingSummaryCard.vue';
import HomeSpendingTab from '@/pages/home/tabs/HomeSpendingTab.vue';
import SpendingSummaryCard from '@/pages/home/spending/SpendingSummaryCard.vue';
import TotalSummaryCard from '@/pages/home/total/TotalSummaryCard.vue';
import AccountSummaryCard from './account/AccountSummaryCard.vue';

const selectedTab = ref('전체');
const handleTabSwitch = (tab) => {
  selectedTab.value = tab;
};
// 각 탭에 맞는 본문 컴포넌트
const currentTabComponent = computed(() => {
  switch (selectedTab.value) {
    case '전체':
      return HomeTotalTab;
    case '계좌':
      return HomeAccountTab;
    case '적금':
      return HomeSavingTab;
    case '지출':
      return HomeSpendingTab;
  }
});

// 각 탭에 맞는 상단 요약 카드 컴포넌트
const summaryCardComponent = computed(() => {
  switch (selectedTab.value) {
    case '전체':
      return TotalSummaryCard;
    case '계좌':
      return AccountSummaryCard;
    case '적금':
      return SavingSummaryCard;
    case '지출':
      return SpendingSummaryCard;
  }
});
</script>

<style scoped>
.home-container {
  padding: 1.25rem;
}
</style>
