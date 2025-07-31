<template>
  <div class="home-card">
    <div class="home-card-section">
      <div class="label-row">
        <span class="home-card-label">총 자산</span>
        <span class="home-card-rate">{{ summary.rate }}</span>
      </div>
      <div class="home-card-value">{{ summary.totalAsset }}</div>
    </div>

    <div class="home-card-section">
      <div class="home-card-label">이번 달 지출</div>
      <div class="home-card-value">{{ summary.monthlyExpense }}</div>
    </div>
  </div>
</template>

<script setup>
const summary = {
  rate: '+2.5%',
  totalAsset: '26,867,500원',
  monthlyExpense: '203,000원',
};
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
