<template>
  <div class="home-card">
    <div class="home-card-section">
      <div class="home-card-label">내 자산</div>
      <div class="home-card-value">{{ totalAssetDisplay }}</div>
    </div>
    <div class="home-card-section">
      <div class="home-card-label">이번달 카드 사용 금액</div>
      <div class="home-card-value">{{ monthlyExpenseDisplay }}</div>
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

/* 카드 사이즈만 SummaryCard와 동일하게 조정 */
.home-card {
  height: 120px;
  padding: 1.25rem 1.5rem;
  /* 좌우 배치를 위한 flexbox 설정 */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

/* 각 섹션 스타일 조정 */
.home-card-section {
  flex: 1;
  margin-bottom: 0;
}

/* 우측 섹션은 오른쪽 정렬 */
.home-card-section:last-child {
  text-align: right;
}
</style>
