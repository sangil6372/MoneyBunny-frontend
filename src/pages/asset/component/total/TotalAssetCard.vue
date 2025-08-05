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
</style>
