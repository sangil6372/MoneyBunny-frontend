<template>
  <div class="asset-summary-card">
    <div class="header">
      <span class="label">총 자산</span>
      <span class="rate-change">+{{ rate }}%</span>
    </div>
    <div class="amount">{{ formatCurrency(totalAsset) }}</div>
    <div class="sub-info">이번 달 수입 {{ formatCurrency(monthlyIncome) }}</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  totalAsset: {
    type: Number,
    required: true,
  },
  monthlyIncome: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    default: 2.5,
  },
});

// 통화 형식 함수 (원 단위)
function formatCurrency(amount) {
  return amount.toLocaleString('ko-KR') + '원';
}
</script>

<style scoped>
.asset-summary-card {
  background-color: #2d3a55;
  color: #ffffff;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  opacity: 0.9;
}

.label {
  font-weight: 500;
}

.rate-change {
  color: #a3d4ff;
  font-weight: bold;
}

.amount {
  font-size: 28px;
  font-weight: bold;
  margin-top: 6px;
}

.sub-info {
  margin-top: 8px;
  font-size: 14px;
  opacity: 0.8;
}
</style>
