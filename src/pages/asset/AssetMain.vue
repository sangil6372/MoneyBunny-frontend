<template>
  <div class="asset-page">
    <AssetTabSwitcher :selectedTab="currentTab" @switchTab="switchTab" />

    <AssetTotalTab v-if="currentTab === '메인'" @switchTab="switchTab" />
    <AssetAccountTab v-else-if="currentTab === '계좌'" />
    <AssetCardTab v-else-if="currentTab === '카드'" />
    <AssetSpendingTab v-else-if="currentTab === '지출'" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

import AssetTabSwitcher from './common/AssetTabSwitcher.vue'; //상단 탭

//각 탭별 화면
import AssetTotalTab from './tabs/AssetTotalTab.vue';
import AssetAccountTab from './tabs/AssetAccountTab.vue';
import AssetCardTab from './tabs/AssetCardTab.vue';
import AssetSpendingTab from './tabs/AssetSpendingTab.vue';

const currentTab = ref('메인');

function switchTab(tab) {
  currentTab.value = tab;
}
</script>
