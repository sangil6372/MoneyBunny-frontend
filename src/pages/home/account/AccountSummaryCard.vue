<template>
  <div class="home-card">
    <div class="home-card-section">
      <div class="home-card-label">총 예금 잔액</div>
      <div class="home-card-value">{{ formatCurrency(totalBalance) }}</div>
    </div>

    <div class="home-card-subinfo">
      <div>
        <div class="home-card-label">이번 달 입출금 현황</div>
        <div class="home-card-value positive">+2,500,000원</div>
      </div>
      <div>
        <div class="home-card-label">계좌 수</div>
        <div class="home-card-value">{{ accountCount }}개</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import accountsData from '@/assets/data/accounts.json';

const accounts = accountsData;

const totalBalance = computed(() => {
  return accounts.reduce((sum, acc) => sum + acc.balance, 0);
});

const accountCount = computed(() => accounts.length);

const formatCurrency = (val) => {
  return parseInt(val).toLocaleString() + '원';
};
</script>

<style scoped>
@import '@/assets/styles/homecard.css';

.home-card-subinfo {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
}
</style>
