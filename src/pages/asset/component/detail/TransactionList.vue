<template>
  <div class="transaction-list" ref="listRef">
    <TransactionItem
      v-for="item in transactions"
      :key="item.transactionId"
      :data="item"
      :type="type"
      @click="handleItemClick(item)"
    />
    <p v-if="!loading && transactions.length === 0" class="no-data">
      거래 내역이 없습니다.
    </p>
    <div ref="observerTarget" style="height: 1px"></div>
    <p v-if="loading" class="no-data">로딩중...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue';
import TransactionItem from './TransactionItem.vue';
import {
  fetchAccountTransactions,
  fetchCardTransactions,
} from '@/api/assetApi';

const props = defineProps({
  type: { type: String, required: true }, // 'account' | 'card'
  accountId: { type: Number, required: false },
  cardId: { type: Number, required: false },
  // 기존 간단필터(라디오 느낌): '전체' | '입금' | '출금' | '지출' | '환불'
  filter: { type: String, default: '전체' },
  // 상단 검색창 v-model
  searchKeyword: { type: String, default: '' },
  // 모달에서 적용한 고급 필터 객체
  advancedFilters: {
    type: Object,
    default: () => {
      const today = new Date();
      const endDate = today.toISOString().slice(0, 10); // 'YYYY-MM-DD'
      const start = new Date();
      start.setMonth(start.getMonth() - 3); // 3개월 전
      const startDate = start.toISOString().slice(0, 10);

      return {
        searchKeyword: '',
        dateRange: {
          type: '3개월',
          startDate: startDate,
          endDate: endDate,
        },
        transactionType: '전체',
        sortBy: '최신순',
      };
    },
  },
});

const emit = defineEmits(['transaction-click']);

const transactions = ref([]);
const page = ref(0);
const hasMore = ref(true);
const loading = ref(false);
const listRef = ref(null);
const observerTarget = ref(null);

/** 화면 데이터 파싱 (백엔드 VO → 프론트용) */
function parseAccountTransactions(rawList = []) {
  return rawList.map((tx) => {
    const dateObj = new Date(tx.transactionDateTime);
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    const date = `${y}.${m}.${d}`;
    const date2 = `${m}.${d}`;
    const time = dateObj.toTimeString().slice(0, 5);

    let typeKor =
      tx.txType === 'income'
        ? '입금'
        : tx.txType === 'expense'
        ? '출금'
        : tx.txType;
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

function parseCardTransactions(rawList = []) {
  return rawList.map((tx) => {
    const dateObj = new Date(tx.transactionDate);
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    const date = `${y}.${m}.${d}`;
    const date2 = `${m}.${d}`;
    const time = dateObj.toTimeString().slice(0, 5);

    const isCancel = tx.cancelStatus === 'normal'; // 환불
    return {
      transactionId: tx.id,
      description: tx.storeName || tx.storeName1 || '',
      type: isCancel ? '환불' : '지출',
      amount: tx.amount ?? 0,
      cancelAmount: tx.cancelAmount,
      date,
      date2,
      time,
      isCancel,
      category: tx.category || '',
      paymentType: tx.paymentType,
      storeType: tx.storeType,
      cancelStatus: tx.cancelStatus,
      memo: tx.memo || '',
    };
  });
}

/** 프론트 필터값 → 서버 파라미터 매핑 */
function buildServerParams(pageNo) {
  // sort
  const sort = props.advancedFilters?.sortBy === '과거순' ? 'ASC' : 'DESC';

  // 날짜
  const startDate = props.advancedFilters?.dateRange?.startDate || null;
  const endDate = props.advancedFilters?.dateRange?.endDate || null;

  // 검색어: 모달 + 상단 입력 통합 (상단이 우선)
  const q =
    (props.searchKeyword ?? '').trim() ||
    (props.advancedFilters?.searchKeyword ?? '').trim() ||
    null;

  // 거래유형 매핑
  let txType = null;
  if (props.type === 'account') {
    const t = props.advancedFilters?.transactionType || props.filter;
    if (t === '입금') txType = 'income';
    else if (t === '출금') txType = 'expense';
  } else if (props.type === 'card') {
    const t = props.advancedFilters?.transactionType || props.filter;
    if (t === '지출') txType = 'expense';
    else if (t === '환불') txType = 'refund';
  }

  return {
    page: pageNo,
    size: 20,
    startDate,
    endDate,
    q,
    txType,
    sort,
  };
}

/** 아이템 클릭 부모로 전달 */
function handleItemClick(item) {
  emit('transaction-click', item);
}

/** 서버 호출 */
async function loadMore() {
  if (loading.value || !hasMore.value) return;
  loading.value = true;
  try {
    const params = buildServerParams(page.value);
    let res, items;

    if (props.type === 'account') {
      res = await fetchAccountTransactions(props.accountId, params);
      items = parseAccountTransactions(res.data.content || []);
    } else {
      res = await fetchCardTransactions(props.cardId, params);
      items = parseCardTransactions(res.data.content || []);
    }

    if (page.value === 0) transactions.value = items;
    else transactions.value.push(...items);

    // PageResponse 기준
    const last = !!res.data.last;
    hasMore.value = !last && items.length > 0;
    page.value += 1;
  } catch (e) {
    console.error('거래내역 로딩 실패:', e);
    hasMore.value = false;
  } finally {
    loading.value = false;
  }
}

/** 필터/검색이 바뀌면 첫 페이지부터 다시 */
watch(
  () => [
    props.type,
    props.accountId,
    props.cardId,
    props.filter,
    props.searchKeyword,
    props.advancedFilters?.dateRange?.startDate,
    props.advancedFilters?.dateRange?.endDate,
    props.advancedFilters?.transactionType,
    props.advancedFilters?.sortBy,
  ],
  async () => {
    page.value = 0;
    hasMore.value = true;
    await loadMore();
  },
  { deep: true }
);

// 무한 스크롤
let observer = null;
onMounted(async () => {
  await loadMore();
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
  background: #fff;
  border-radius: 0.75rem;
  margin: 1rem;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0;
  height: calc(100vh - 120px); /* 헤더(60px) + 푸터(60px) 제외 */
  overflow-y: auto;
  scrollbar-width: none;
}

.transaction-list::-webkit-scrollbar {
  display: none;
}

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
