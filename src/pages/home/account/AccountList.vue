<!-- AccountList.vue -->
<template>
  <div>
    <div class="header">
      <h3>내 계좌</h3>
    </div>

    <div v-if="accounts.length === 0" class="no-account-box">
      <NoAccountCard @add="handleAddClick" />
    </div>

    <div v-else class="account-list">
      <AccountItemCard
        v-for="account in accounts"
        :key="account.id"
        :account="account"
      />
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import accountData from '@/assets/data/accounts.json';
import { bankLogoMap } from '@/assets/utils/bankLogoMap.js';
import NoAccountCard from './NoAccountCard.vue';
import AccountItemCard from './AccountItemCard.vue';

// 로고를 포함한 계좌 리스트 초기화
const accounts = ref(
  accountData.map((item, idx) => ({
    id: idx + 1, // 또는 고유 id 생성
    bank: item.bank,
    name: item.accountName,
    number: item.number,
    balance: item.balance,
    type: item.type,
    isMain: idx === 0, // 첫 번째만 대표
    logoUrl: bankLogoMap[item.bank] || '', // 로고 매핑
  }))
);

const deleteAccount = (id) => {
  accounts.value = accounts.value.filter((acc) => acc.id !== id);
};

const setMainAccount = (id) => {
  accounts.value = accounts.value.map((acc) => ({
    ...acc,
    isMain: acc.id === id,
  }));
};

const handleAddClick = () => {
  alert('추후 모달 연결 가능');
};
</script>
