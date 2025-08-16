<template>
  <div
    class="transaction-item"
    :class="{ hasMemo: !!data.memo }"
    @click="handleClick"
  >
    <div class="transaction-left">
      <p class="transaction-sub">
        {{ data.date2 }}
        <span v-if="type === 'card' && data.category">
          · {{ data.category }}</span
        >
        <!-- <span v-else> · {{ data.type }}</span> -->
      </p>
      <p class="transaction-title">
        {{ data.description }}
      </p>
      <p v-if="data.memo" class="transaction-memo">
        {{ data.memo }}
      </p>
    </div>
    <div class="transaction-right">
      <p :class="['transaction-amount', amountClass]">
        {{ amountSign }}{{ formattedAmount }}원
      </p>
      <p v-if="type === 'account'" class="transaction-balance">
        잔액 : {{ data.balanceAfter.toLocaleString() }}원
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

const emit = defineEmits(['click']);

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

//🥕 거래내역 클릭 시 부모로 거래 데이터 전송
const handleClick = () => {
  emit('click', props.data);
};
</script>

<style scoped>
.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.5rem;
  background: transparent;
  border-bottom: 1px solid var(--input-bg-3);
  min-height: 60px;
  gap: 0.5rem;

  /* 🥕 클릭 가능하도록 추가 */
  cursor: pointer;
}

.transaction-item.hasMemo {
  min-height: 68px;
}

/* 🥕 터치 시 피드백 */
.transaction-item:active {
  background-color: var(--input-bg-1);
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-left {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.transaction-title {
  font-size: 0.75rem;
  color: var(--base-blue-dark);
}

.transaction-sub {
  font-size: 0.65rem;
  color: var(--text-bluegray);
}

.transaction-memo {
  font-size: 0.65rem;
  color: var(--text-bluegray);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.transaction-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  /* gap: 2px; */
  /* padding-top: 2px; */
  white-space: nowrap;
}
.transaction-item.hasMemo .transaction-right {
  padding-top: 8px;
}

.transaction-title,
.transaction-sub,
.transaction-memo,
.transaction-amount,
.transaction-balance {
  line-height: 1.28;
  margin: 0;
}

.transaction-amount {
  font-size: 0.8rem;
  font-weight: bold;
  margin: 0;
}

.transaction-amount.positive {
  color: var(--text-green); /* 입금 파란색 강조 */
}

.transaction-amount.negative {
  color: var(--alert-red); /* 출금 빨간색 */
}

.transaction-balance {
  font-size: 0.65rem;
  color: var(--text-lightgray);
  margin-top: 0.25rem;
}
</style>
