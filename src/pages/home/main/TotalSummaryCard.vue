<template>
  <div class="homeCard">
    <div class="homeCardSection">
      <div class="labelRow">
        <span class="homeCardLabel">총 자산</span>
        <!-- <span class="homeCardRate">{{ rate }}</span> -->
      </div>
      <div class="homeCardValue">{{ totalAssetDisplay }}</div>
    </div>

    <div class="homeCardSection">
      <div class="homeCardLabel">이번 달 지출</div>
      <div class="homeCardValue">{{ monthlyExpenseDisplay }}</div>
    </div>
    <div v-if="assetStore.loading" style="font-size: 11px; color: gray">
      불러오는 중...
    </div>
    <div v-if="assetStore.error" style="color: tomato">
      {{ assetStore.error }}
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useAssetStore } from '@/stores/asset';

const assetStore = useAssetStore();

onMounted(() => {
  assetStore.loadSummary();
});

console.log('setup 함수 진입!');

const summary = computed(() => assetStore.summary || {});

const rate = computed(() => summary.value.rate ?? '+0%');
const totalAssetDisplay = computed(() =>
  summary.value.totalAsset != null
    ? summary.value.totalAsset.toLocaleString() + '원'
    : '-'
);
const monthlyExpenseDisplay = computed(() =>
  summary.value.thisMonthCardUsed != null
    ? summary.value.thisMonthCardUsed.toLocaleString() + '원'
    : '-'
);

// expose summary to parent
defineExpose({
  summary,
});
</script>

<style scoped>
.homeCard {
  background-color: var(--base-blue-dark);
  border-radius: 0.5rem;
  padding: 1.5rem;
  color: white;
  margin-bottom: 1rem;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.homeCardLabel {
  font-size: 0.7rem;
  font-weight: bold;
  color: var(--base-blue-light);
  margin-bottom: 0.125rem;
}

.homeCardRate {
  font-size: 0.6rem;
  font-weight: bold;
  color: var(--text-rate);
  /* line-height: 1.4; */
}

.homeCardValue {
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  /* line-height: 1.2; */
  margin-bottom: 0.325rem;
  margin-top: 0;
}

.homeCardValue.positive {
  color: var(--text-green);
}

.homeCardSection {
  margin-bottom: 0.5rem;
}

.labelRow {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
}
</style>
