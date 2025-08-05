<template>
  <div class="home-card">
    <div class="home-card-section">
      <div class="label-row">
        <span class="home-card-label">총 자산</span>
        <!-- <span class="home-card-rate">{{ rate }}</span> -->
      </div>
      <div class="home-card-value">{{ totalAssetDisplay }}</div>
    </div>

    <div class="home-card-section">
      <div class="home-card-label">이번 달 지출</div>
      <div class="home-card-value">{{ monthlyExpenseDisplay }}</div>
    </div>
    <div v-if="assetStore.loading" style="font-size: 12px; color: gray">
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

// 마운트 시 API 호출 (데이터 없으면만)
onMounted(() => {
  assetStore.loadSummary();
});

console.log('setup 함수 진입!');

// computed로 바인딩 (안전하게 null 체크)
const summary = computed(() => assetStore.summary || {});

// 전월 대비 변동률, 이번달 지출 가공(예시)
const rate = computed(
  () => summary.value.rate ?? '+0%' // rate 필드는 백엔드에서 필요하면 추가!
);
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
</script>

<style scoped>
@import '@/assets/styles/homecard.css';

.label-row {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
  margin-bottom: 0.25rem; /* 간격 줄이기 */
}
</style>
