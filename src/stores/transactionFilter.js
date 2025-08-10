// stores/transactionFilter.js
import { defineStore } from 'pinia';

export const useTransactionFilterStore = defineStore('transactionFilter', {
  state: () => ({
    // 계좌 필터 상태
    account: {
      searchKeyword: '',
      dateRange: {
        type: '3개월', // '1개월', '3개월', '6개월', '직접설정'
        startDate: null,
        endDate: null,
      },
      transactionType: '전체', // '전체', '입금', '출금'
      sortBy: '최신순', // '최신순', '과거순'
      currentMonth: new Date().toISOString().slice(0, 7), // YYYY-MM
      showFilterModal: false,
    },

    // 카드 필터 상태
    card: {
      searchKeyword: '',
      dateRange: {
        type: '3개월',
        startDate: null,
        endDate: null,
      },
      transactionType: '전체', // '전체', '지출', '환불'
      sortBy: '최신순',
      currentMonth: new Date().toISOString().slice(0, 7),
      showFilterModal: false,
    },

    // 지출/카테고리 필터 상태
    category: {
      searchKeyword: '',
      dateRange: {
        type: '3개월',
        startDate: null,
        endDate: null,
      },
      sortBy: '최신순',
      currentMonth: new Date().toISOString().slice(0, 7),
      showFilterModal: false,
    },
  }),

  getters: {
    // 특정 타입의 필터 상태 반환
    getFilterState: (state) => (type) => {
      return state[type] || {};
    },

    // 활성화된 필터 개수 (기본값 제외)
    getActiveFilterCount: (state) => (type) => {
      const filterState = state[type];
      if (!filterState) return 0;

      let count = 0;
      if (filterState.searchKeyword?.trim()) count++;
      if (filterState.dateRange?.type !== '3개월') count++;
      if (filterState.transactionType && filterState.transactionType !== '전체')
        count++;
      if (filterState.sortBy !== '최신순') count++;

      return count;
    },

    // 기간 필터 표시 텍스트
    getPeriodText: (state) => (type) => {
      const filterState = state[type];
      if (!filterState) return '3개월';

      if (
        filterState.dateRange.type === '직접설정' &&
        filterState.dateRange.startDate &&
        filterState.dateRange.endDate
      ) {
        const start = new Date(filterState.dateRange.startDate);
        const end = new Date(filterState.dateRange.endDate);
        return `${start.getMonth() + 1}.${start.getDate()} ~ ${
          end.getMonth() + 1
        }.${end.getDate()}`;
      }
      return filterState.dateRange.type;
    },
  },

  actions: {
    // 검색어 설정
    setSearchKeyword(type, keyword) {
      if (this[type]) {
        this[type].searchKeyword = keyword;
      }
    },

    // 기간 설정
    setDateRange(type, dateRange) {
      if (this[type]) {
        this[type].dateRange = { ...dateRange };
      }
    },

    // 거래 유형 설정
    setTransactionType(type, transactionType) {
      if (this[type]) {
        this[type].transactionType = transactionType;
      }
    },

    // 정렬 방식 설정
    setSortBy(type, sortBy) {
      if (this[type]) {
        this[type].sortBy = sortBy;
      }
    },

    // 현재 월 설정
    setCurrentMonth(type, month) {
      if (this[type]) {
        this[type].currentMonth = month;
      }
    },

    // 필터 모달 표시/숨김
    setShowFilterModal(type, show) {
      if (this[type]) {
        this[type].showFilterModal = show;
      }
    },

    // 필터 초기화 (기본값으로 리셋)
    resetFilters(type) {
      if (this[type]) {
        this[type].searchKeyword = '';
        this[type].dateRange = {
          type: '3개월',
          startDate: null,
          endDate: null,
        };
        this[type].transactionType = '전체';
        this[type].sortBy = '최신순';
        this[type].currentMonth = new Date().toISOString().slice(0, 7);
      }
    },

    // 모든 필터 상태를 반환 (API 호출용)
    getFilterParams(type) {
      const filterState = this[type];
      if (!filterState) return {};

      return {
        searchKeyword: filterState.searchKeyword,
        dateRange: filterState.dateRange,
        transactionType: filterState.transactionType,
        sortBy: filterState.sortBy,
        currentMonth: filterState.currentMonth,
      };
    },
  },
});
