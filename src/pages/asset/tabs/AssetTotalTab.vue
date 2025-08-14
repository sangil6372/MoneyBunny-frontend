<!--src\pages\asset\AssetMain.vue-->
<template>
  <div class="asset-main-wrapper">
    <div class="asset-main-tab">
      <TotalAssetCard :summary="summary" />
      <!-- <AccountStatusCard class="with-margin" />
      <CardStatusCard /> -->
    </div>
    <!---->
    <!-- 계좌 현황 -->
    <AccountOverviewCard
      :accounts="summary.accounts || []"
      @switchTab="$emit('switchTab', $event)"
    />

    <!-- 카드 현황 -->
    <CardOverviewCard
      :cards="summary.cards || []"
      @switchTab="$emit('switchTab', $event)"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import TotalAssetCard from '../component/total/TotalAssetCard.vue';
import AccountOverviewCard from '../component/total/AccountOverviewCard.vue';
import CardOverviewCard from '../component/total/CardOverviewCard.vue';
import { useSync } from '@/composables/useSync';

defineEmits(['switchTab']);

const props = defineProps({
  summary: { type: Object, required: true },
});

// 동기화 composable 계좌/카드 각각 가져오기
const { syncWithUX: syncAccounts } = useSync('account');
const { syncWithUX: syncCards } = useSync('card');

// 탭 첫 진입 시 계좌/카드 둘 다 동기화 (10분 이내면 무시, 아니면 실행)
onMounted(() => {
  syncAccounts(false);
  syncCards(false);
});
</script>

<style scoped>
.asset-section {
  margin-top: 1.5rem;
  background-color: white;
  border-radius: 1rem;
  padding: 1.25rem;
  /* box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05); */
}

.asset-section-header {
  font-weight: bold;
  font-size: 1rem;
  color: var(--base-blue-dark);
  margin-bottom: 1rem;
}
</style>
