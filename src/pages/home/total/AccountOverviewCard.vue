<template>
  <div class="overview-card">
    <div class="title-row" @click="goToAccountTab">
      <h3>계좌 현황</h3>
      <div class="arrow">
        <img
          src="@/assets/images/icons/common/arrow_right.png"
          alt="계좌이동 아이콘"
          class="arrow-icon"
        />
      </div>
    </div>

    <!--계좌 목록:2개-->

    <div
      v-for="(account, index) in accounts.slice(0, 2)"
      :key="index"
      class="account-item"
    >
      <img
        :src="getBankLogo(account.bank)"
        :alt="`${account.bank} 로고`"
        class="bank-logo"
      />
      <div class="info">
        <p class="name">{{ account.bank }} {{ account.accountName }}</p>
        <p class="number">{{ account.number }}</p>
      </div>
      <div class="balance">
        <p class="amount">{{ formatWon(account.balance) }}</p>
        <p class="type">{{ account.type }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import accountsData from '@/assets/data/accounts.json';

// 은행명과 로고 이미지 파일명을 매핑
import { getBankLogo } from '@/assets/utils/bankLogoMap.js';

const router = useRouter();
const accounts = ref([]);

//계좌탭으로 이동
const emit = defineEmits(['switchTab']);

function goToAccountTab() {
  emit('switchTab', '계좌'); // 탭 이름은 '계좌'
}

function formatWon(value) {
  return `${value.toLocaleString()}원`;
}

onMounted(() => {
  accounts.value = accountsData;
});
</script>

<style scoped>
.overview-card {
  background-color: #fff;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: var(--shadow-sm);
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: 1rem;
}

.title-row h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-title);
}

.account-item {
  display: flex;
  align-items: center;
  background-color: var(--input-bg-2);
  padding: 0.75rem;
  border-radius: 0.75rem;
  margin-bottom: 0.75rem;
}
.arrow-icon {
  width: 1rem;
  height: 1rem;
}

.bank-logo {
  width: 2.5rem;
  height: 2.5rem;
  object-fit: contain;
  margin-right: 0.75rem;
}

.info {
  flex: 1;
}

.name {
  font-weight: 600;
  font-size: 0.875rem;
}

.number {
  font-size: 0.75rem;
  color: var(--text-gray);
}

.balance {
  text-align: right;
}

.amount {
  font-weight: 600;
  font-size: 1rem;
}

.type {
  font-size: 0.8125rem;
  color: var(--text-gray);
}
</style>
