<template>
  <div class="account-detail">
    <DetailHeader title="계좌 상세" @back="onClose" />
    <DetailSummaryCard type="account" :data="accountData" />

    <!-- 변경: AccountTransactionFilter → SearchFilterHeader -->
    <SearchFilterHeader
      v-model="searchKeyword"
      :filter-value="currentFilterText"
      :type="'account'"
      @search-input="onSearchInput"
      @filter-modal-open="openFilterModal"
    />

    <!-- 수정: 통합된 TransactionFilterModal 사용 -->
    <TransactionFilterModal
      :show="showFilterModal"
      type="account"
      @close="closeFilterModal"
      @apply="onFilterApply"
    />

    <!-- 거래내역: API에서 직접 받아옴! -->
    <!-- 거래내역 상세보기 -->
    <TransactionList
      type="account"
      :accountId="accountData.id"
      :filter="filter"
      :search-keyword="searchKeyword"
      :advanced-filters="advancedFilters"
      @transaction-click="openTransactionModal"
    />

    <!-- 거래내역 상세 모달 추가 -->
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
import DetailSummaryCard from '../detail/DetailSummaryCard.vue';
// 변경: 통합된 TransactionFilterModal import
import SearchFilterHeader from '../detail/SearchFilterHeader.vue';
import TransactionFilterModal from '../detail/TransactionFilterModal.vue';
import TransactionList from '../detail/TransactionList.vue';
import TransactionDetailModal from '../detail/TransactionDetailModal.vue';

const props = defineProps({
  accountData: { type: Object, required: true },
});
const emit = defineEmits(['close']);
const onClose = () => emit('close');

// 추가: 필터 모달 상태
const showFilterModal = ref(false);

// 추가: 검색어 상태
const searchKeyword = ref('');

// 수정: 현재 필터 텍스트 (드롭다운용)
const currentFilterText = ref('3개월·전체·최신');

// 기존 단순 필터 상태 유지 (기본 필터용)
const filter = ref('전체');

// 추가: 현재 월 상태
const currentMonth = ref(new Date().toISOString().slice(0, 7)); // YYYY-MM

// 추가: 고급 필터 상태 (검색, 기간, 정렬 등)
function makeDefaultAdvancedFilters() {
  const today = new Date();
  const endDate = today.toLocaleDateString('sv-SE'); // YYYY-MM-DD 형식

  const start = new Date();
  start.setMonth(start.getMonth() - 3);
  const startDate = start.toISOString().slice(0, 10);

  return {
    searchKeyword: '',
    dateRange: { type: '3개월', startDate, endDate },
    transactionType: '전체',
    sortBy: '최신순',
  };
}
const advancedFilters = ref(makeDefaultAdvancedFilters());

// 거래 상세 모달 관련 상태 (기존 유지)
const showTransactionModal = ref(false);
const selectedTransaction = ref(null);

// 거래 상세 모달 열기 (기존 유지)
const openTransactionModal = (transaction) => {
  selectedTransaction.value = transaction;
  showTransactionModal.value = true;
};

// 거래 상세 모달 닫기 (기존 유지)
const closeTransactionModal = () => {
  showTransactionModal.value = false;
  selectedTransaction.value = null;
};

// 추가: 검색어 입력 핸들러
const onSearchInput = (keyword) => {
  searchKeyword.value = keyword;
  // 고급 필터에 검색어 반영
  advancedFilters.value.searchKeyword = keyword;
  // TransactionList가 자동으로 새로운 검색어로 필터링할 것임
};

// 추가: 필터 모달 열기/닫기
const openFilterModal = () => {
  showFilterModal.value = true;
};

const closeFilterModal = () => {
  showFilterModal.value = false;
};

// 수정: 필터 모달에서 필터 적용 (통합 모달 대응)
const onFilterApply = (appliedFilters) => {

  // 고급 필터 상태 업데이트
  advancedFilters.value = { ...appliedFilters };

  // 기본 필터 업데이트 (계좌는 입금/출금)
  if (appliedFilters.transactionType === '입금') {
    filter.value = '입금';
  } else if (appliedFilters.transactionType === '출금') {
    filter.value = '출금';
  } else {
    filter.value = '전체';
  }

  // 검색어 업데이트 (계좌는 검색 기능이 없지만 일관성을 위해 유지)
  searchKeyword.value = appliedFilters.searchKeyword || '';

  // 필터 텍스트 업데이트 (드롭다운 표시용)
  const period = appliedFilters.dateRange.type;
  const type = appliedFilters.transactionType;
  const sort = appliedFilters.sortBy === '최신순' ? '최신' : '과거순';
  currentFilterText.value = `${period}·${type}·${sort}`;

  // 모달은 통합 컴포넌트에서 자동으로 닫힘
};
</script>

<style scoped>
.account-detail {
  background-color: var(--input-bg-2);
  min-height: 100vh;
}
</style>
