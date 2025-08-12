<template>
  <div class="homeContainer">
    <TotalSummaryCard ref="totalSummaryCardRef" />

    <PolicyRecommendationCard
      ref="policyRecommendationCardRef"
      class="withGapTop"
    />
    <AssetCompareCard
      :totalAsset="totalAsset"
      :top3TotalAmount="top3TotalAmount"
    />
    <DailyMessageCard class="tightTopMargin" />
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import TotalSummaryCard from '@/pages/home/main/TotalSummaryCard.vue';
import AssetCompareCard from '@/pages/home/main/AssetCompareCard.vue';
import PolicyRecommendationCard from '@/pages/home/main/PolicyRecommendationCard.vue';
import DailyMessageCard from '@/pages/home/main/DailyMessageCard.vue';

const totalSummaryCardRef = ref();
const policyRecommendationCardRef = ref();

const totalAsset = ref(0);
const top3TotalAmount = ref(0);

// 값이 로드된 후 동기화
const syncValues = () => {
  totalAsset.value = totalSummaryCardRef.value?.summary?.totalAsset ?? 0;
  top3TotalAmount.value =
    policyRecommendationCardRef.value?.top3TotalAmount ?? 0;
};

// mount 후 값 동기화
nextTick(() => {
  syncValues();
});

// 값 변경 감지하여 동기화
watch(
  () => [
    totalSummaryCardRef.value?.summary?.totalAsset,
    policyRecommendationCardRef.value?.top3TotalAmount,
  ],
  syncValues
);
</script>

<style scoped>
/* 한마디 카드는 아래 간격만 살짝 줄여주기 */
.tightTopMargin {
  margin-top: 1rem;
}
</style>
