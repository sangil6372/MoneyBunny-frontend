<!-- src/pages/asset/component/spending/TransactionItem.vue -->
<template>
  <div class="transaction-item">
    <div class="transaction-details">
      <p class="merchant-name">{{ transaction.memo }}</p>
      <div class="transaction-meta">
        <span class="category-name">{{ transaction.category }}</span>
        <span class="transaction-date">{{ formatDate(transaction.date) }}</span>
      </div>
    </div>

    <div class="transaction-amount">
      <p class="amount">{{ formatAmount(transaction.price) }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  transaction: {
    type: Object,
    required: true,
  },
});

const formatAmount = (amount) => {
  return `${amount.toLocaleString()}원`;
};

const formatDate = (dateStr) => {
  // "2024.01.15" 형식을 "1/15" 형식으로 변환
  const [year, month, day] = dateStr.split('.');
  return `${parseInt(month)}/${parseInt(day)}`;
};
</script>

<style scoped>
.transaction-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem;
  border-radius: 0.5rem;

  /* 모바일 터치 최적화 */
  -webkit-tap-highlight-color: transparent;
}

.transaction-item:active {
  background-color: var(--input-bg-1);
}

.transaction-details {
  flex: 1;
  min-width: 0;
}

.merchant-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-login);
  margin: 0 0 0.25rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.transaction-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-name {
  font-size: 0.75rem;
  color: var(--text-bluegray);
}

.transaction-date {
  font-size: 0.75rem;
  color: var(--text-lightgray);
}

.transaction-amount {
  flex-shrink: 0;
  text-align: right;
}

.amount {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-login);
  margin: 0;
}
</style>
