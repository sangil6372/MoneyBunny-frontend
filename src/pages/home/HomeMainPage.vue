<template>
  <div class="home-container">
    <TotalSummaryCard />
    <AssetCompareCard />
    <PolicyRecommendationCard class="with-gap-top" />
    <DailyMessageCard class="tight-top-margin" />
  </div>
</template>

<script setup>
import TotalSummaryCard from '@/pages/home/main/TotalSummaryCard.vue';
import AssetCompareCard from '@/pages/home/main/AssetCompareCard.vue';
import PolicyRecommendationCard from '@/pages/home/main/PolicyRecommendationCard.vue';
import DailyMessageCard from '@/pages/home/main/DailyMessageCard.vue';
</script>

<style scoped>
.home-container {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* 한마디 카드는 아래 간격만 살짝 줄여주기 */
.tight-top-margin {
  margin-top: 0.5rem;
}

.with-gap-top {
  margin-top: 0.5rem;
}
</style>
