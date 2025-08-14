// stores/transactionFilter.js
import { defineStore } from 'pinia';

export const useTransactionFilterStore = defineStore('transactionFilter', {
  state: () => ({
    // 계좌 필터 상태
    accountFilters: {
      searchKeyword: '',
      dateRange: {
        type: '3개월',
        startDate: null,
        endDate: null,
      },
      transactionType: '전체', // '전체', '입금', '출금'
      sortBy: '최신순', // '최신순', '과거순'
    },

    // 카드 필터 상태
    cardFilters: {
      searchKeyword: '',
      dateRange: {
        type: '3개월',
        startDate: null,
        endDate: null,
      },
      transactionType: '전체', // '전체', '지출', '환불'
      sortBy: '최신순', // '최신순', '과거순'
    },
  }),

  getters: {
    /**
     * 특정 타입의 필터 상태 반환
     * @param {string} type - 'account' 또는 'card'
     */
    getFilterState: (state) => (type) => {
      return type === 'account' ? state.accountFilters : state.cardFilters;
    },

    /**
     * 계좌 필터 상태 반환
     */
    accountFilterState: (state) => state.accountFilters,

    /**
     * 카드 필터 상태 반환
     */
    cardFilterState: (state) => state.cardFilters,
  },

  actions: {
    /**
     * 검색 키워드 설정
     * @param {string} type - 'account' 또는 'card'
     * @param {string} keyword - 검색할 키워드
     */
    setSearchKeyword(type, keyword) {
      if (type === 'account') {
        this.accountFilters.searchKeyword = keyword;
      } else if (type === 'card') {
        this.cardFilters.searchKeyword = keyword;
      }
    },

    /**
     * 날짜 범위 설정
     * @param {string} type - 'account' 또는 'card'
     * @param {object} dateRange - 날짜 범위 객체
     */
    setDateRange(type, dateRange) {
      if (type === 'account') {
        this.accountFilters.dateRange = { ...dateRange };
      } else if (type === 'card') {
        this.cardFilters.dateRange = { ...dateRange };
      }
    },

    /**
     * 거래 유형 설정
     * @param {string} type - 'account' 또는 'card'
     * @param {string} transactionType - 거래 유형
     */
    setTransactionType(type, transactionType) {
      if (type === 'account') {
        this.accountFilters.transactionType = transactionType;
      } else if (type === 'card') {
        this.cardFilters.transactionType = transactionType;
      }
    },

    /**
     * 정렬 방식 설정
     * @param {string} type - 'account' 또는 'card'
     * @param {string} sortBy - 정렬 방식
     */
    setSortBy(type, sortBy) {
      if (type === 'account') {
        this.accountFilters.sortBy = sortBy;
      } else if (type === 'card') {
        this.cardFilters.sortBy = sortBy;
      }
    },

    /**
     * 특정 타입의 필터 초기화
     * @param {string} type - 'account' 또는 'card'
     */
    resetFilters(type) {
      const defaultFilters = {
        searchKeyword: '',
        dateRange: {
          type: '3개월',
          startDate: null,
          endDate: null,
        },
        transactionType: '전체',
        sortBy: '최신순',
      };

      if (type === 'account') {
        this.accountFilters = { ...defaultFilters };
      } else if (type === 'card') {
        this.cardFilters = { ...defaultFilters };
      }
    },

    /**
     * 모든 필터 초기화
     */
    resetAllFilters() {
      this.resetFilters('account');
      this.resetFilters('card');
    },

    /**
     * 필터 상태 전체 설정
     * @param {string} type - 'account' 또는 'card'
     * @param {object} filters - 필터 객체
     */
    setFilters(type, filters) {
      if (type === 'account') {
        this.accountFilters = { ...this.accountFilters, ...filters };
      } else if (type === 'card') {
        this.cardFilters = { ...this.cardFilters, ...filters };
      }
    },
  },
});
