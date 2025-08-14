<template>
  <div class="card-detail">
    <DetailHeader title="카드 상세" @back="onClose" />
    <DetailSummaryCard type="card" :data="cardData" />

    <!-- 🥕 변경: TransactionFilter → SearchFilterHeader -->
    <SearchFilterHeader
      v-model="searchKeyword"
      :filter-value="currentFilterText"
      :type="'card'"
      @search-input="onSearchInput"
      @filter-modal-open="openFilterModal"
    />

    <!-- 🥕 수정: 통합된 TransactionFilterModal 사용 -->
    <TransactionFilterModal
      :show="showFilterModal"
      type="card"
      @close="closeFilterModal"
      @apply="onFilterApply"
    />

    <!--🥕 수정: 새로운 props 추가 -->
    <TransactionList
      type="card"
      :cardId="cardData.id"
      :filter="filter"
      :search-keyword="searchKeyword"
      :advanced-filters="advancedFilters"
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
import DetailSummaryCard from '../detail/DetailSummaryCard.vue';
// 🥕 변경: 통합된 TransactionFilterModal import
import SearchFilterHeader from '../detail/SearchFilterHeader.vue';
import TransactionFilterModal from '../detail/TransactionFilterModal.vue';
import TransactionList from '../detail/TransactionList.vue';
import TransactionDetailModal from '../detail/TransactionDetailModal.vue';

const props = defineProps({ cardData: Object });
const emit = defineEmits(['close']);
const onClose = () => emit('close'); // 부모에게 close 이벤트 전달

// 🥕 추가: 필터 모달 상태
const showFilterModal = ref(false);

// 🥕 추가: 검색어 상태
const searchKeyword = ref('');

// 🥕 수정: 현재 필터 텍스트 (드롭다운용)
const currentFilterText = ref('3개월·전체·최신');

// 🥕 기존 단순 필터 상태 유지 (기본 필터용) - 카드는 지출/환불
const filter = ref('전체');

// 🥕 추가: 고급 필터 상태 (검색, 기간, 정렬 등)
function makeDefaultAdvancedFilters() {
  const today = new Date();
  const endDate = today.toLocaleDateString('sv-SE'); // YYYY-MM-DD 형식

  const start = new Date();
  start.setMonth(start.getMonth() - 3);
  const startDate = start.toISOString().slice(0, 10);

  return {
    searchKeyword: '',
    dateRange: { type: '3개월', startDate, endDate },
    transactionType: '전체', // 카드: 전체/지출/환불
    sortBy: '최신순',
  };
}
const advancedFilters = ref(makeDefaultAdvancedFilters());

// 🥕거래 상세 모달 관련 상태 (기존 유지)
const showTransactionModal = ref(false);
const selectedTransaction = ref(null);

// 거래 상세 모달 열기 (기존 유지)
const openTransactionModal = (transaction) => {
  console.log('카드 거래 클릭됨:', transaction);
  selectedTransaction.value = transaction;
  showTransactionModal.value = true;
};

// 거래 상세 모달 닫기 (기존 유지)
const closeTransactionModal = () => {
  showTransactionModal.value = false;
  selectedTransaction.value = null;
};

// 🥕 추가: 필터 모달 열기/닫기
const openFilterModal = () => {
  showFilterModal.value = true;
};

const closeFilterModal = () => {
  showFilterModal.value = false;
};

// 🥕 추가: 검색어 입력 핸들러
const onSearchInput = (keyword) => {
  console.log('카드 검색어 입력됨:', keyword);
  searchKeyword.value = keyword;
  // 고급 필터에 검색어 반영
  advancedFilters.value.searchKeyword = keyword;
  // TransactionList가 자동으로 새로운 검색어로 필터링할 것임
};

// 🥕 수정: 필터 모달에서 필터 적용 (통합 모달 대응)
const onFilterApply = (appliedFilters) => {
  console.log('카드 필터 적용됨:', appliedFilters);

  // 고급 필터 상태 업데이트
  advancedFilters.value = { ...appliedFilters };

  // 기본 필터 업데이트 (카드는 지출/환불)
  if (appliedFilters.transactionType === '지출') {
    filter.value = '지출';
  } else if (appliedFilters.transactionType === '환불') {
    filter.value = '환불';
  } else {
    filter.value = '전체';
  }

  // 검색어 업데이트
  searchKeyword.value = appliedFilters.searchKeyword || '';

  // 필터 텍스트 업데이트 (드롭다운 표시용)
  const period = appliedFilters.dateRange.type;
  const type = appliedFilters.transactionType;
  const sort = appliedFilters.sortBy === '최신순' ? '최신' : '과거순';
  currentFilterText.value = `${period}·${type}·${sort}`;

  // 모달은 통합 컴포넌트에서 자동으로 닫힘
};

// 👇 메모 업데이트 핸들러 (기존 유지)
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
