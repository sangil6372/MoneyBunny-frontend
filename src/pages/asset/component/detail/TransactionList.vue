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
  filter: { type: String, default: '전체' },
});

const emit = defineEmits(['transaction-click']);

const transactions = ref([]);
const page = ref(0);
const hasMore = ref(true);
const loading = ref(false);
const listRef = ref(null);
const observerTarget = ref(null);

// 필터링된 거래내역 computed 추가
const filteredTransactions = computed(() => {
  if (props.filter === '전체') {
    return transactions.value;
  }

  if (props.type === 'card') {
    // 카드 필터링
    if (props.filter === '환불') {
      return transactions.value.filter((tx) => tx.isCancel === true);
    } else if (props.filter === '지출') {
      return transactions.value.filter((tx) => tx.isCancel === false);
    }
  } else if (props.type === 'account') {
    // 계좌 필터링 (서버에서 이미 필터링되어 오므로 클라이언트에서는 추가 필터링 불필요)
    // 하지만 만약 클라이언트 필터링을 원한다면:
    if (props.filter === '입금') {
      return transactions.value.filter((tx) => tx.type === '입금');
    } else if (props.filter === '출금') {
      return transactions.value.filter((tx) => tx.type === '출금');
    }
  }

  return transactions.value;
});

// 카드 거래내역용 파서 (수정)
function parseCardTransactions(rawList = []) {
  return rawList.map((tx) => {
    // 날짜 가공
    const dateObj = new Date(tx.transactionDate);
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    const date = `${y}-${m}-${d}`;
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
      time,
      isCancel, // 필터링용
      category: tx.category || '', // 카테고리 추가
      //🥕
      paymentType: tx.paymentType,
      storeType: tx.storeType,
      cancelStatus: tx.cancelStatus,
    };
  });
}

// 데이터 파싱(서버에서 받은 raw 데이터 → 화면 표출용)
function parseAccountTransactions(rawList = []) {
  return rawList.map((tx) => {
    const dateObj = new Date(tx.transactionDateTime);
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    const date = `${y}-${m}-${d}`;
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
      time,
    };
  });
}

// 🥕거래 상세 클릭 핸들러 (수정됨)
function handleItemClick(item) {
  console.log('🥕TransactionList에서 클릭 받음:', item); // 디버깅 로그
  emit('transaction-click', item);
}
// 공통 API 로딩 함수
async function loadMore() {
  if (loading.value || !hasMore.value) return;
  loading.value = true;
  try {
    let items = [];
    if (props.type === 'account') {
      // 계좌는 서버에서 필터링
      const typeParam =
        props.filter === '전체'
          ? null
          : props.filter === '입금'
          ? 'income'
          : props.filter === '출금'
          ? 'expense'
          : null;
      const res = await fetchAccountTransactions(
        props.accountId,
        page.value,
        20,
        typeParam
      );
      items = parseAccountTransactions(res.data.content || []);
      hasMore.value = !(res.data.last || items.length === 0);
    } else if (props.type === 'card') {
      // 카드는 모든 데이터를 가져와서 클라이언트에서 필터링
      const res = await fetchCardTransactions(props.cardId, page.value, 20);
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

// 필터 변경 시 초기화
watch(
  () => [props.filter, props.accountId, props.cardId, props.type],
  async () => {
    // 카드의 경우 필터 변경시 데이터 다시 로딩하지 않고 클라이언트에서만 필터링
    if (props.type === 'card' && page.value > 0) {
      // 이미 데이터가 있으면 새로 로딩하지 않음 (클라이언트 필터링)
      return;
    }
    // 계좌이거나 처음 로딩인 경우 데이터 다시 로딩
    page.value = 0;
    hasMore.value = true;
    await loadMore();
  },
  { deep: true }
);

// 무한스크롤 IntersectionObserver
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
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
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
