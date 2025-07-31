<template>
  <div class="home-card summary-card">
    <div class="summary-left">
      <p class="home-card-label">이번 달 총 사용액</p>
      <p class="home-card-value">{{ totalUsage.toLocaleString() }}원</p>
    </div>
    <p class="home-card-rate">카드 수 {{ cardCount }}개</p>
  </div>
</template>

<script setup>
defineProps({
  totalUsage: { type: Number, default: 0 },
  cardCount: { type: Number, default: 0 },
});
</script>

<style scoped>
@import '@/assets/styles/homecard.css';
.summary-card {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>
