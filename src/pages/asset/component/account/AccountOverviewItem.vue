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
@import '@/assets/styles/overview-item-styles.css';
</style>
