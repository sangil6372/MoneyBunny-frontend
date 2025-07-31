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
        v-for="account in visibleAccounts"
        :key="account.id"
        :account="account"
        @delete="deleteAccount"
        @set-main="setMainAccount"
      />
    </div>

    <!-- 더보기 버튼 -->
    <div v-if="!showAll && accounts.length > 5" class="view-all-btn-box">
      <button @click="showAll = true" class="view-all-btn">
        전체 계좌 보기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import accountData from '@/assets/data/accounts.json';
import { getBankName } from '@/assets/utils/bankCodeMap.js';
import { getBankLogoByCode } from '@/assets/utils/bankLogoMap.js';

import NoAccountCard from './NoAccountCard.vue';
import AccountItemCard from './AccountItemCard.vue';

const accounts = ref(
  accountData.map((item, idx) => ({
    id: idx + 1,
    bankCode: item.bankCode,
    bank: getBankName(item.bankCode),
    name: item.accountName,
    number: item.accountNumber,
    balance: item.balance,
    type: item.accountType === '11' ? '입출금통장' : '적금',
    isMain: idx === 0,
    logoUrl: getBankLogoByCode(item.bankCode),
  }))
);

const showAll = ref(false);

const visibleAccounts = computed(() =>
  showAll.value ? accounts.value : accounts.value.slice(0, 4)
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
<style scoped>
.view-all-btn-box {
  margin-top: 1rem;
  text-align: center;
}

.view-all-btn {
  background: none;
  border: none;
  color: var(--text-bluegray);
  font-size: 0.875rem;
  cursor: pointer;
}
</style>
