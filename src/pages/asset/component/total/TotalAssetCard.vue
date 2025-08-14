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

/* SummaryCard와 동일한 기본 구조 */
.total-asset-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 120px;
  padding: 1.25rem 1.5rem;
  gap: 1rem;
  border-radius: 6px;
  overflow: hidden;
}

/* SummaryCard의 summary-content와 동일 */
.asset-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
}

.asset-main .home-card-label {
  margin-bottom: 0.5rem;
}

.asset-main .home-card-value {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
  word-break: keep-all;
  overflow-wrap: break-word;
  line-height: 1.3;
}

/* SummaryCard의 summary-right와 동일 */
.asset-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  text-align: right;
  gap: 0.25rem;
  flex-shrink: 0;
  min-width: 120px;
}

.asset-right .home-card-rate {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-rate);
  margin: 0;
}

/* 우측 값 스타일 */
.asset-right-value {
  font-weight: 700;
  margin: 0;
  word-break: keep-all;
  overflow-wrap: break-word;
  max-width: 100%;
  font-size: 1rem;
  color: white;
}

/* 모바일 대응 */
@media (max-width: 400px) {
  .total-asset-card {
    gap: 0.75rem;
    padding: 1rem 1.25rem;
  }

  .asset-main .home-card-value {
    font-size: 1.1rem;
  }

  .asset-right-value {
    font-size: 0.9rem;
  }

  .asset-right {
    min-width: 100px;
  }
}
</style>
