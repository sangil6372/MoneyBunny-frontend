<template>
  <div class="account-summary-card">
    <div class="summary-top">
      <p class="label">총 계좌 잔액</p>
      <p class="value">{{ formatWon(totalBalance) }}</p>
    </div>
    <div class="summary-bottom">
      <div class="bottom-item">
        <p class="label">이번 달 순입출금</p>
        <p
          class="change"
          :class="{ positive: monthlyChange >= 0, negative: monthlyChange < 0 }"
        >
          {{ monthlyChange >= 0 ? '+' : '' }}{{ formatWon(monthlyChange) }}
        </p>
      </div>
      <div class="bottom-item right">
        <p class="label">계좌 수</p>
        <p class="count">{{ accountCount }}개</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  totalBalance: { type: Number, required: true },
  monthlyChange: { type: Number, required: true },
  accountCount: { type: Number, required: true },
});

const formatWon = (value) => `${value.toLocaleString()}원`;
</script>

<style scoped>
.account-summary-card {
  background-color: var(--base-blue-dark);
  border-radius: 1rem;
  padding: 1.5rem;
  color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 0.5rem;
}

.summary-top {
  margin-bottom: 1.2rem;
}

.label {
  font-size: 0.875rem;
  color: var(--text-rate); /* 옅은 흰색 느낌 */
  margin-bottom: 0.25rem;
}

.value {
  font-size: 1.75rem;
  font-weight: 700;
}

.summary-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.bottom-item .change {
  font-size: 1rem;
  font-weight: 600;
}

.bottom-item.right {
  text-align: right;
}

.change.positive {
  color: var(--text-green); /* 양수 녹색 */
}

.change.negative {
  color: var(--alert-red); /* 음수 빨간색 */
}

.count {
  font-size: 1rem;
  font-weight: 600;
}
</style>
