<template>
  <div class="account-detail">
    <DetailHeader title="계좌 상세" @back="onClose" />
    <DetailInfoCard type="account" :data="accountData" />

    <!-- 🥕 변경: AccountTransactionFilter → SearchFilterHeader -->
    <SearchFilterHeader
      v-model="searchKeyword"
      :filter-value="currentFilterText"
      :type="'account'"
      @search-input="onSearchInput"
      @filter-modal-open="openFilterModal"
    />

    <!-- 🥕 추가: AccountFilterModal -->
    <AccountFilterModal
      :show="showFilterModal"
      @close="closeFilterModal"
      @apply="onFilterApply"
    />

    <!-- 거래내역: API에서 직접 받아옴! -->
    <!-- 🥕거래내역 상세보기-->
    <TransactionList
      type="account"
      :accountId="accountData.id"
      :filter="filter"
      :search-keyword="searchKeyword"
      :advanced-filters="advancedFilters"
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
// 🥕 변경: SearchFilterHeader import 추가, AccountFilterModal import 추가
import SearchFilterHeader from '../common/SearchFilterHeader.vue';
import AccountFilterModal from '../account/AccountFilterModal.vue';
import TransactionList from '../detail/TransactionList.vue';
import TransactionDetailModal from '../detail/TransactionDetailModal.vue';

const props = defineProps({
  accountData: { type: Object, required: true },
});
const emit = defineEmits(['close']);
const onClose = () => emit('close');

// 🥕 추가: 필터 모달 상태
const showFilterModal = ref(false);

// 🥕 추가: 검색어 상태
const searchKeyword = ref('');

// 🥕 수정: 현재 필터 텍스트 (드롭다운용)
const currentFilterText = ref('3개월·전체·최신');

// 🥕 기존 단순 필터 상태 유지 (기본 필터용)
const filter = ref('전체');

// 🥕 추가: 현재 월 상태
const currentMonth = ref(new Date().toISOString().slice(0, 7)); // YYYY-MM

// 🥕 추가: 고급 필터 상태 (검색, 기간, 정렬 등)
const advancedFilters = ref({
  searchKeyword: '',
  dateRange: {
    type: '3개월',
    startDate: null,
    endDate: null,
  },
  transactionType: '전체',
  sortBy: '최신순',
});

// 🥕 거래 상세 모달 관련 상태 (기존 유지)
const showTransactionModal = ref(false);
const selectedTransaction = ref(null);

// 🥕 거래 상세 모달 열기 (기존 유지)
const openTransactionModal = (transaction) => {
  console.log('AccountDetail에서 모달 열기:', transaction);
  console.log('showTransactionModal 변경 전:', showTransactionModal.value);
  selectedTransaction.value = transaction;
  showTransactionModal.value = true;
  console.log('showTransactionModal 변경 후:', showTransactionModal.value);
};

// 🥕 거래 상세 모달 닫기 (기존 유지)
const closeTransactionModal = () => {
  showTransactionModal.value = false;
  selectedTransaction.value = null;
};

// 🥕 추가: 검색어 입력 핸들러
const onSearchInput = (keyword) => {
  console.log('검색어 입력됨:', keyword);
  searchKeyword.value = keyword;
  // 고급 필터에 검색어 반영
  advancedFilters.value.searchKeyword = keyword;
  // TransactionList가 자동으로 새로운 검색어로 필터링할 것임
};

// 🥕 추가: 필터 모달 열기/닫기
const openFilterModal = () => {
  showFilterModal.value = true;
};

const closeFilterModal = () => {
  showFilterModal.value = false;
};

// 🥕 추가: 필터 모달에서 필터 적용
const onFilterApply = (appliedFilters) => {
  console.log('필터 적용됨:', appliedFilters);

  // 고급 필터 상태 업데이트
  advancedFilters.value = { ...appliedFilters };

  // 기본 필터 업데이트
  if (appliedFilters.transactionType === '입금만') {
    filter.value = '입금';
  } else if (appliedFilters.transactionType === '출금만') {
    filter.value = '출금';
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

  // 모달 닫기
  closeFilterModal();
};
</script>

<style scoped>
.account-detail {
  background-color: var(--input-bg-2);
  min-height: 100vh;
}
</style>
