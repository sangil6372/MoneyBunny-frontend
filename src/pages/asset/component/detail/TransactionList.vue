<template>
  <div class="transaction-list" ref="listRef">
    <TransactionItem
      v-for="item in filteredTransactions"
      :key="item.transactionId"
      :data="item"
      :type="type"
      @click="handleItemClick(item)"
    />
    <p v-if="!loading && filteredTransactions.length === 0" class="no-data">
      거래 내역이 없습니다.
    </p>
    <div ref="observerTarget" style="height: 1px"></div>
    <p v-if="loading" class="no-data">로딩중...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted, nextTick, computed } from 'vue';
import TransactionItem from './TransactionItem.vue';
import {
  fetchAccountTransactions,
  fetchCardTransactions,
} from '@/api/assetApi';

const props = defineProps({
  type: { type: String, required: true }, // 'account' | 'card'
  accountId: { type: Number, required: false },
  cardId: { type: Number, required: false },
  filter: { type: String, default: '전체' }, // 기본 필터 (전체/입금/출금 등)
  // 🥕 수정: searchKeyword를 별도 prop으로 분리
  searchKeyword: { type: String, default: '' },
  // 🥕 수정: currentMonth 제거, advancedFilters로 통합
  advancedFilters: {
    type: Object,
    default: () => ({
      searchKeyword: '',
      dateRange: { type: '3개월', startDate: null, endDate: null },
      transactionType: '전체',
      sortBy: '최신순',
    }),
  },
});

const emit = defineEmits(['transaction-click']);

const transactions = ref([]);
const page = ref(0);
const hasMore = ref(true);
const loading = ref(false);
const listRef = ref(null);
const observerTarget = ref(null);

// 🥕 수정: 필터링된 거래내역 computed - 고급 필터 적용
const filteredTransactions = computed(() => {
  let filtered = [...transactions.value];

  // 1. 기본 필터 적용 (전체/입금/출금 또는 전체/지출/환불)
  if (props.filter !== '전체') {
    if (props.type === 'card') {
      if (props.filter === '환불') {
        filtered = filtered.filter((tx) => tx.isCancel === true);
      } else if (props.filter === '지출') {
        filtered = filtered.filter((tx) => tx.isCancel === false);
      }
    } else if (props.type === 'account') {
      if (props.filter === '입금') {
        filtered = filtered.filter((tx) => tx.type === '입금');
      } else if (props.filter === '출금') {
        filtered = filtered.filter((tx) => tx.type === '출금');
      }
    }
  }

  // 🥕 추가: 2. 고급 필터 적용
  const advFilters = props.advancedFilters;

  // 🥕 수정: 검색어 필터 - searchKeyword prop과 advancedFilters 둘 다 체크
  const searchTerm = props.searchKeyword || advFilters.searchKeyword;
  if (searchTerm && searchTerm.trim()) {
    const keyword = searchTerm.trim().toLowerCase();
    filtered = filtered.filter(
      (tx) =>
        tx.description.toLowerCase().includes(keyword) ||
        (tx.memo && tx.memo.toLowerCase().includes(keyword))
    );
  }

  // 거래 유형 필터 (고급 필터의 거래 유형)
  if (advFilters.transactionType !== '전체') {
    if (props.type === 'account') {
      if (advFilters.transactionType === '입금만') {
        filtered = filtered.filter((tx) => tx.type === '입금');
      } else if (advFilters.transactionType === '출금만') {
        filtered = filtered.filter((tx) => tx.type === '출금');
      }
    } else if (props.type === 'card') {
      if (advFilters.transactionType === '환불') {
        filtered = filtered.filter((tx) => tx.isCancel === true);
      } else if (advFilters.transactionType === '지출') {
        filtered = filtered.filter((tx) => tx.isCancel === false);
      }
    }
  }

  // 날짜 범위 필터 (기간 필터가 적용된 경우)
  if (
    advFilters.dateRange &&
    advFilters.dateRange.startDate &&
    advFilters.dateRange.endDate
  ) {
    const startDate = new Date(advFilters.dateRange.startDate);
    const endDate = new Date(advFilters.dateRange.endDate);
    endDate.setHours(23, 59, 59, 999); // 종료일 마지막 시간까지 포함

    filtered = filtered.filter((tx) => {
      const txDate = new Date(tx.date.replace(/\./g, '-')); // YYYY.MM.DD → YYYY-MM-DD
      return txDate >= startDate && txDate <= endDate;
    });
  }

  // 정렬 적용
  if (advFilters.sortBy === '과거순') {
    filtered.sort((a, b) => {
      const dateA = new Date(a.date.replace(/\./g, '-') + ' ' + a.time);
      const dateB = new Date(b.date.replace(/\./g, '-') + ' ' + b.time);
      return dateA - dateB; // 오름차순 (과거순)
    });
  } else {
    // 최신순 (기본값)
    filtered.sort((a, b) => {
      const dateA = new Date(a.date.replace(/\./g, '-') + ' ' + a.time);
      const dateB = new Date(b.date.replace(/\./g, '-') + ' ' + b.time);
      return dateB - dateA; // 내림차순 (최신순)
    });
  }

  return filtered;
});

// 카드 거래내역용 파서 (기존 유지)
function parseCardTransactions(rawList = []) {
  return rawList.map((tx) => {
    // 날짜 가공
    const dateObj = new Date(tx.transactionDate);
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    const date = `${y}.${m}.${d}`;
    const date2 = `${m}.${d}`;
    const time = dateObj.toTimeString().slice(0, 5);

    // 환불 여부 체크 수정! (실제 API 응답에 맞게)
    const isCancel = tx.cancelStatus === 'normal'; // 'normal'이면 환불

    return {
      transactionId: tx.id,
      description: tx.storeName || tx.storeName1 || '',
      type: isCancel ? '환불' : '지출', // 환불이면 '환불', 아니면 '지출'
      amount: tx.amount ?? 0,
      cancelAmount: tx.cancelAmount, // (UI에서 필요하면 표시)
      date,
      date2,
      time,
      isCancel, // 필터링용
      memo: tx.memo || '',
      category: tx.category || '', // 카테고리 추가
      //🥕
      paymentType: tx.paymentType,
      storeType: tx.storeType,
      cancelStatus: tx.cancelStatus,
    };
  });
}

// 데이터 파싱(서버에서 받은 raw 데이터 → 화면 표출용) (기존 유지)
function parseAccountTransactions(rawList = []) {
  return rawList.map((tx) => {
    const dateObj = new Date(tx.transactionDateTime);
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    const date = `${y}.${m}.${d}`;
    const date2 = `${m}.${d}`;
    const time = dateObj.toTimeString().slice(0, 5);

    let typeKor = '';
    if (tx.txType === 'income') typeKor = '입금';
    else if (tx.txType === 'expense') typeKor = '출금';
    else typeKor = tx.txType;

    return {
      transactionId: tx.id,
      description: tx.storeName || tx.branchName || '',
      type: typeKor,
      amount: tx.amount ?? 0,
      balanceAfter: tx.balanceAfter ?? 0,
      date,
      date2,
      time,
      memo: tx.memo || '',
    };
  });
}

// 🥕거래 상세 클릭 핸들러 (기존 유지)
function handleItemClick(item) {
  console.log('🥕TransactionList에서 클릭 받음:', item); // 디버깅 로그
  emit('transaction-click', item);
}

// 🥕 수정: API 로딩 함수 - 고급 필터 고려
async function loadMore() {
  if (loading.value || !hasMore.value) return;
  loading.value = true;
  try {
    let items = [];
    if (props.type === 'account') {
      // 🥕 수정: 고급 필터의 거래 유형을 우선적으로 사용
      const advTransactionType = props.advancedFilters.transactionType;
      let typeParam = null;

      if (advTransactionType === '입금만') {
        typeParam = 'income';
      } else if (advTransactionType === '출금만') {
        typeParam = 'expense';
      } else if (props.filter === '입금') {
        typeParam = 'income';
      } else if (props.filter === '출금') {
        typeParam = 'expense';
      }

      const res = await fetchAccountTransactions(
        props.accountId,
        page.value,
        20,
        typeParam
      );
      items = parseAccountTransactions(res.data.content || []);
      hasMore.value = !(res.data.last || items.length === 0);
    } else if (props.type === 'card') {
      // 🥕 수정: 고급 필터의 거래 유형을 우선적으로 사용
      const advTransactionType = props.advancedFilters.transactionType;
      let typeParam = null;

      if (advTransactionType === '지출') {
        typeParam = 'expense';
      } else if (advTransactionType === '환불') {
        typeParam = 'refund';
      } else if (props.filter === '지출') {
        typeParam = 'expense';
      } else if (props.filter === '환불') {
        typeParam = 'refund';
      }

      const res = await fetchCardTransactions(
        props.cardId,
        page.value,
        20,
        typeParam
      );
      items = parseCardTransactions(res.data.content || []);
      hasMore.value = !(res.data.last || items.length === 0);
    }
    if (page.value === 0) {
      transactions.value = items;
    } else {
      transactions.value.push(...items);
    }
    page.value += 1;
  } catch (e) {
    console.error('거래내역 로딩 실패:', e);
    hasMore.value = false;
  } finally {
    loading.value = false;
  }
}

// 🥕 수정: watch 로직 - searchKeyword prop도 감지
watch(
  () => [
    props.filter,
    props.accountId,
    props.cardId,
    props.type,
    // 🥕 추가: searchKeyword prop 감지
    props.searchKeyword,
    // 🥕 수정: advancedFilters 감지
    props.advancedFilters.searchKeyword,
    props.advancedFilters.dateRange,
    props.advancedFilters.transactionType,
    props.advancedFilters.sortBy,
  ],
  async () => {
    // 🥕 수정: 검색어나 날짜 범위 필터는 클라이언트에서만 처리하므로 API 재호출 안함
    const needsApiReload =
      page.value === 0 || // 처음 로딩
      props.advancedFilters.transactionType !== '전체'; // 거래 유형 변경시에만 API 재호출

    if (needsApiReload) {
      page.value = 0;
      hasMore.value = true;
      await loadMore();
    }
    // 검색어, 날짜 범위, 정렬은 computed에서 클라이언트 필터링으로 처리
  },
  { deep: true }
);

// 무한스크롤 IntersectionObserver (기존 유지)
let observer = null;
onMounted(async () => {
  await loadMore(); // 첫 페이지 로딩
  await nextTick();
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !loading.value) {
        loadMore();
      }
    },
    { root: listRef.value, threshold: 1 }
  );
  if (observerTarget.value) observer.observe(observerTarget.value);
});
onUnmounted(() => {
  if (observer && observerTarget.value)
    observer.unobserve(observerTarget.value);
});
</script>

<style scoped>
.transaction-list {
  background: #fff; /* 화이트 카드 스타일 */
  border-radius: 0.75rem;
  margin: 1rem;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0; /* 간격 대신 border로 구분 */
  max-height: 460px; /* 적당히! 모바일이면 60~80vh로도 가능 */
  overflow-y: auto;
  scrollbar-width: none; /* 파이어폭스 */
}
.transaction-list::-webkit-scrollbar {
  display: none; /* 크롬, 사파리 */
}

/* 거래 내역 아이템 간 구분선 */
.transaction-list > :deep(.transaction-item):not(:last-child) {
  border-bottom: 1px solid var(--input-bg-3);
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
}

.load-more {
  width: 100%;
  text-align: center;
  border: none;
  background: none;
  font-size: 0.875rem;
  color: var(--base-blue-dark);
  padding: 0.75rem 0 0.25rem;
  cursor: pointer;
}

.no-data {
  text-align: center;
  color: var(--text-lightgray);
  font-size: 0.875rem;
  margin: 1rem 0;
}
</style>
