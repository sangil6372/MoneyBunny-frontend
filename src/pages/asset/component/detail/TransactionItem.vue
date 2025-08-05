<template>
  <div class="transaction-item">
    <div class="transaction-left">
      <p class="transaction-title">
        {{ data.description }}
      </p>
      <p class="transaction-sub">
        {{ data.date }} · {{ data.time }}
        <span v-if="type === 'card' && data.category">
          · {{ data.category }}</span
        >
        <span v-else> · {{ data.type }}</span>
      </p>
    </div>
    <div class="transaction-right">
      <p :class="['transaction-amount', amountClass]">
        {{ amountSign }}{{ formattedAmount }}원
      </p>
      <p v-if="type === 'account'" class="transaction-balance">
        잔액 {{ data.balanceAfter.toLocaleString() }}원
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: { type: Object, required: true },
  type: { type: String, required: true }, // 'card' | 'account'
});

const formattedAmount = computed(() => props.data.amount.toLocaleString());

// 카드면 환불이면 입금, 아니면 지출
const amountClass = computed(() => {
  if (props.type === 'card') {
    return props.data.isCancel ? 'positive' : 'negative';
  }
  return props.data.type === '입금' ? 'positive' : 'negative';
});

const amountSign = computed(() => {
  if (props.type === 'card') {
    return props.data.isCancel ? '+' : '-';
  }
  return props.data.type === '입금' ? '+' : '-';
});
</script>

<style scoped>
.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0; /* 카드 내부 간격 축소 */
  background: transparent; /* 개별 아이템 배경 제거 (리스트 카드 내 배경 유지) */
  border-bottom: 1px solid var(--input-bg-3); /* 리스트 구분선 */
}

.transaction-item:last-child {
  border-bottom: none; /* 마지막 아이템은 구분선 제거 */
}

.transaction-left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.transaction-title {
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
  color: var(--base-blue-dark);
}

.transaction-sub {
  font-size: 0.75rem;
  color: var(--text-bluegray);
  margin: 0;
}

.transaction-right {
  text-align: right;
}

.transaction-amount {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
}

.transaction-amount.positive {
  color: var(--text-green); /* 입금 파란색 강조 */
}

.transaction-amount.negative {
  color: var(--alert-red); /* 출금 빨간색 */
}

.transaction-balance {
  font-size: 0.75rem;
  color: var(--text-lightgray);
  margin-top: 0.25rem;
}
</style>
