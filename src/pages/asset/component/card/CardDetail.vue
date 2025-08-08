<template>
  <div class="card-detail">
    <DetailHeader title="카드 상세" @back="onClose" />
    <DetailInfoCard type="card" :data="cardData" />

    <!-- TransactionFilter 추가 (카드용) -->
    <TransactionFilter v-model="filter" type="card" />

    <!--🥕-->
    <TransactionList
      type="card"
      :cardId="cardData.id"
      :filter="filter"
      @transaction-click="openTransactionModal"
    />

    <!-- 🥕 카드 거래내역 상세 모달 -->
    <TransactionDetailModal
      v-if="showTransactionModal && selectedTransaction"
      :show="showTransactionModal"
      :transaction="selectedTransaction"
      type="card"
      @close="closeTransactionModal"
      @memo-updated="onMemoUpdated"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

import DetailHeader from '../detail/DetailHeader.vue';
import DetailInfoCard from '../detail/DetailInfoCard.vue';
import TransactionFilter from '../detail/TransactionFilter.vue'; // TransactionFilter import 추가
import TransactionList from '../detail/TransactionList.vue';
import TransactionDetailModal from '../detail/TransactionDetailModal.vue';

const props = defineProps({ cardData: Object });
const emit = defineEmits(['close']);
const onClose = () => emit('close'); // 부모에게 close 이벤트 전달

// 필터 상태 추가
const filter = ref('전체');

// 🥕거래 상세 모달 관련 상태
const showTransactionModal = ref(false);
const selectedTransaction = ref(null);

// 거래 상세 모달 열기
const openTransactionModal = (transaction) => {
  console.log('카드 거래 클릭됨:', transaction);
  selectedTransaction.value = transaction;
  showTransactionModal.value = true;
};

// 거래 상세 모달 닫기
const closeTransactionModal = () => {
  showTransactionModal.value = false;
  selectedTransaction.value = null;
};

// 👇 이걸 <script setup>에 추가!
function onMemoUpdated({ id, memo }) {
  // 1. 현재 상세 모달에서만 memo 반영 (이미 하고 있을 수 있음)
  if (selectedTransaction.value && selectedTransaction.value.id === id) {
    selectedTransaction.value.memo = memo;
  }
  // 2. 만약 상위 거래 리스트(예: 거래내역 배열)에도 반영하고 싶으면
  // cardTransactions.value.find((tx) => tx.id === id).memo = memo;
  //   (부모에서 거래내역 배열을 관리 중일 때 필요)
}
</script>

<style scoped>
.card-detail {
  background-color: var(--input-bg-2);
  min-height: 100vh;
}
</style>
