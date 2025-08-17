<template>
  <div class="home-card total-asset-card">
    <!-- 좌측 콘텐츠 (SummaryCard의 summary-content와 동일한 구조) -->
    <div class="asset-content">
      <!-- 메인 정보 (내 자산) -->
      <div class="asset-main">
        <p class="home-card-label">내 자산</p>
        <p class="home-card-value">{{ totalAssetDisplay }}</p>
      </div>
    </div>

    <!-- 구분선 -->
    <div class="divider"></div>

    <!-- 우측 정보 (SummaryCard의 summary-right와 동일한 구조) -->
    <div class="asset-right">
      <p class="home-card-rate">이번달 카드 사용 금액</p>
      <p class="asset-right-value">{{ monthlyExpenseDisplay }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  summary: { type: Object, required: true },
});

const totalAssetDisplay = computed(() =>
  props.summary.totalAsset != null
    ? props.summary.totalAsset.toLocaleString() + '원'
    : '-'
);

const monthlyExpenseDisplay = computed(() =>
  props.summary.thisMonthCardUsed != null
    ? props.summary.thisMonthCardUsed.toLocaleString() + '원'
    : '-'
);
</script>

<style scoped>
@import '@/assets/styles/homecard.css';

/* 카드 */
.total-asset-card {
  display: grid;
  grid-template-columns: 1fr 1px auto;
  align-items: center;
  column-gap: 1.25rem;

  height: 120px;
  padding: 1.25rem;
  border-radius: 6px;

  background: var(--base-blue-dark);
  color: #fff;
  position: relative;
  overflow: hidden;
}

.asset-content {
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.375rem;
}

.asset-main .home-card-label {
  margin: 0;
  font-size: 0.75rem;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.8);
}

.asset-main .home-card-value {
  margin: 0.15rem 0 0;
  line-height: 1.2;
  font-size: 1.05rem;
  font-weight: bold;
  font-variant-numeric: tabular-nums;
  word-break: keep-all;
}

/* 우측 */
.asset-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  row-gap: 0.275rem;
  min-width: 160px;
}

.asset-right .home-card-rate {
  margin: 0;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
}

.asset-right-value {
  margin: 0;
  font-weight: bold;
  font-size: 0.9rem;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
  word-break: keep-all;
  color: #fff;
  text-align: right;
}

/* 구분선 */
.divider {
  background: rgba(255, 255, 255, 0.14);
  border-radius: 1px;
  height: 100%;
  align-self: stretch;
}

/* 모바일 */
@media (max-width: 420px) {
  .total-asset-card {
    grid-template-columns: 1fr 1px auto;
    column-gap: 1rem;
    height: auto;
    padding: 1rem 1.1rem;
  }
  .asset-right {
    min-width: 120px;
  }
}
</style>
