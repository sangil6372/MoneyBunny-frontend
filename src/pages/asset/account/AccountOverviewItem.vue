<template>
  <div class="overview-item">
    <img
      :src="getBankLogoByCode(account.bankCode)"
      :alt="`${getBankName(account.bankCode)} 로고`"
      class="bank-logo"
    />

    <div class="info">
      <p class="name">
        {{ getBankName(account.bankCode) }} {{ account.accountName }}
      </p>
      <p class="number">{{ formatAccountNumber(account.accountNumber) }}</p>
    </div>

    <div class="balance">
      <p class="amount">{{ formatWon(account.balance) }}</p>
      <p class="type">{{ formatType(account.accountType) }}</p>
    </div>
  </div>
</template>

<script setup>
import { getBankLogoByCode } from '@/assets/utils/bankLogoMap.js';
import { getBankName } from '@/assets/utils/bankCodeMap.js';

const props = defineProps({
  account: { type: Object, required: true },
});

const formatWon = (value) => `${value.toLocaleString()}원`;
const formatAccountNumber = (number) =>
  number.replace(/(\d{3})(\d{3})(\d{3,4})/, '$1-$2-$3');
const formatType = (type) => {
  const map = { 11: '입출금통장', 12: '적금', 13: '예금' };
  return map[type] || '기타';
};
</script>

<style scoped>
.overview-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--input-bg-2);
  padding: 0.9rem 1rem;
  border-radius: 0.75rem;
}

.bank-logo {
  width: 40px;
  height: 40px;
  margin-right: 0.75rem;
  object-fit: contain;
}

.info {
  flex: 1;
}

.name {
  font-weight: 600;
  font-size: 0.9rem;
}

.number {
  font-size: 0.8rem;
  color: var(--text-lightgray);
}

.balance {
  text-align: right;
}

.amount {
  font-weight: 600;
  font-size: 1rem;
  color: var(--base-blue-dark);
}

.type {
  font-size: 0.75rem;
  color: var(--text-lightgray);
}
</style>
