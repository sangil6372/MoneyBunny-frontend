<template>
  <div class="asset-page">
    <AssetTabSwitcher :selectedTab="currentTab" @switchTab="switchTab" />

    <!-- 메인 탭 (요약/현황 카드) -->
    <AssetTotalTab
      v-if="currentTab === '메인'"
      :summary="summary"
      @switchTab="switchTab"
    />

    <!-- 계좌 탭 (계좌 리스트) -->
    <AssetAccountTab
      v-else-if="currentTab === '계좌'"
      :accounts="summary.accounts || []"
    />

    <!-- 카드 탭 (카드 리스트) -->
    <AssetCardTab
      v-else-if="currentTab === '카드'"
      :cards="summary.cards || []"
    />

    <!-- 지출 탭 (필요시 summary, accounts, cards 원하는대로 넘기기) -->
    <AssetSpendingTab v-else-if="currentTab === '지출'" :summary="summary" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAssetStore } from '@/stores/asset';
import { useSync } from '@/composables/useSync';
import { useRoute, useRouter } from 'vue-router'; // 추가!

import AssetTabSwitcher from './component/common/AssetTabSwitcher.vue'; //상단 탭

//각 탭별 화면
import AssetTotalTab from './tabs/AssetTotalTab.vue';
import AssetAccountTab from './tabs/AssetAccountTab.vue';
import AssetCardTab from './tabs/AssetCardTab.vue';
import AssetSpendingTab from './tabs/AssetSpendingTab.vue';

const accountTabRef = ref(null);
const cardTabRef = ref(null);

const assetStore = useAssetStore();

const route = useRoute();
const router = useRouter();
const currentTab = ref(route.query.tab || '메인');

// 뒤로/앞으로가기 등 쿼리 변화 대응
watch(
  () => route.query.tab,
  (tab) => {
    if (tab && tab !== currentTab.value) {
      currentTab.value = tab;
    }
  }
);

// 1. 동기화 composable 가져오기 (true=무조건 동기화)
const { syncWithUX: syncAccounts } = useSync('account');
const { syncWithUX: syncCards } = useSync('card');

// 2. 새로고침, 진입시 항상 동기화 + summary 최신화
onMounted(async () => {
  await syncAccounts(true); // 계좌 동기화 (무조건)
  await syncCards(true); // 카드 동기화 (무조건)
  await assetStore.loadSummary(); // 최신 자산데이터 불러오기
});

function switchTab(tab) {
  currentTab.value = tab;
  router.replace({ query: { ...route.query, tab } });

  if (tab === '계좌' && accountTabRef.value) {
    accountTabRef.value.syncWithUX();
  }
  if (tab === '카드' && cardTabRef.value) {
    cardTabRef.value.syncWithUX();
  }
}

const summary = computed(() => assetStore.summary || {});
</script>
