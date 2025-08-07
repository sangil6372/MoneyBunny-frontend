<template>
  <div class="account-detail">
    <DetailHeader title="계좌 상세" @back="onClose" />
    <DetailInfoCard type="account" :data="accountData" />
    <TransactionFilter v-model="filter" />

    <!-- 거래내역: API에서 직접 받아옴! -->
    <!-- 🥕거래내역 상세보기-->
    <TransactionList
      type="account"
      :accountId="accountData.id"
      :filter="filter"
      @transaction-click="openTransactionModal"
    />

    <!-- 🥕 거래내역 상세 모달 추가 -->
    <TransactionDetailModal
      :show="showTransactionModal"
      :transaction="selectedTransaction || {}"
      type="account"
      @close="closeTransactionModal"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

import DetailHeader from '../detail/DetailHeader.vue';
import DetailInfoCard from '../detail/DetailInfoCard.vue';
import TransactionFilter from '../detail/TransactionFilter.vue';
import TransactionList from '../detail/TransactionList.vue';
import TransactionDetailModal from '../detail/TransactionDetailModal.vue';

const props = defineProps({
  accountData: { type: Object, required: true },
});
const emit = defineEmits(['close']);
const onClose = () => emit('close');
const filter = ref('전체');

// 🥕 거래 상세 모달 관련 상태 추가
const showTransactionModal = ref(false);
const selectedTransaction = ref(null);

// 🥕 거래 상세 모달 열기
const openTransactionModal = (transaction) => {
  console.log('AccountDetail에서 모달 열기:', transaction);
  console.log('showTransactionModal 변경 전:', showTransactionModal.value);
  selectedTransaction.value = transaction;
  showTransactionModal.value = true;
  console.log('showTransactionModal 변경 후:', showTransactionModal.value);
};

// 🥕 거래 상세 모달 닫기
const closeTransactionModal = () => {
  showTransactionModal.value = false;
  selectedTransaction.value = null;
};
</script>

<style scoped>
.account-detail {
  background-color: var(--input-bg-2);
  min-height: 100vh;
}
</style>
