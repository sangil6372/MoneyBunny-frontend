<!-- src/pages/asset/component/spending/CategoryDetailView.vue -->
<template>
  <div class="category-detail-view">
    <!-- 헤더 -->
    <DetailHeader :title="headerTitle" @back="$emit('back')" />

    <!-- 카테고리 정보 카드 (고정) -->
    <div class="category-info-card">
      <div class="category-header">
        <!-- 카테고리 아이콘 -->
        <div
          class="category-icon"
          :style="{ backgroundColor: (categoryData.color || '#999') + '20' }"
        >
          <div
            class="category-dot"
            :style="{ backgroundColor: categoryData.color || '#999' }"
          ></div>
        </div>

        <!-- 카테고리 정보 -->
        <div class="category-info">
          <p class="category-name">
            {{ categoryData.name || '알 수 없는 카테고리' }}
          </p>
          <p class="category-period">{{ getSelectedMonthText() }} 총 지출</p>
          <p class="category-amount">{{ formatAmount(totalAmount) }}</p>
        </div>
      </div>
    </div>

    <!-- 거래내역 카드 (스크롤 가능) -->
    <div class="transaction-card">
      <div class="transaction-section">
        <!-- 섹션 헤더: 제목 + 건수 + 월 선택 -->
        <div class="section-header">
          <div class="header-left">
            <h4 class="section-title">거래 내역</h4>
            <span class="transaction-count"> {{ transactions.length }}건 </span>
          </div>

          <!-- 월 선택 드롭다운 -->
          <CategoryMonthSelector
            :current-month="selectedMonth"
            @month-change="handleMonthChange"
          />
        </div>

        <!-- 로딩 -->
        <div v-if="loading" class="no-transactions">
          <p class="no-transactions-text">불러오는 중...</p>
        </div>

        <!-- 거래내역 리스트 -->
        <div
          v-else-if="transactions.length > 0"
          class="transaction-list-container"
        >
          <div
            v-for="t in sortedTransactions"
            :key="t.id || t.transactionId || Math.random()"
            class="transaction-item"
            @click="openTransactionDetail(t)"
          >
            <div class="transaction-info">
              <p class="transaction-date">
                {{ formatTransactionDate(t.date) }}
              </p>
              <p class="transaction-title">
                {{ getTransactionTitle(t) }}
              </p>
              <!-- 메모가 있으면 표시 -->
              <p v-if="t.memo" class="transaction-memo">
                {{ t.memo }}
              </p>
            </div>

            <div class="transaction-amount">
              <p class="amount-text">
                -{{ formatAmount(t.amount || t.price || 0) }}
              </p>
            </div>
          </div>
        </div>

        <!-- 거래내역 없음 -->
        <div v-else class="no-transactions">
          <p class="no-transactions-text">
            {{ getSelectedMonthText() }}에는 이 카테고리의 거래 내역이 없습니다
          </p>
        </div>
      </div>
    </div>

    <!-- 거래 상세 모달 -->
    <CategoryTransactionDetailModal
      :show="showDetailModal"
      :transaction="selectedTransaction"
      @close="closeTransactionDetail"
      @memo-updated="onMemoUpdated"
      @category-updated="onCategoryUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import DetailHeader from '../detail/DetailHeader.vue';
import CategoryMonthSelector from '../detail/CategoryMonthSelector.vue';
import CategoryTransactionDetailModal from '../detail/CategoryTransactionDetailModal.vue';
import {
  fetchCategoryTransactions,
  updateCardTransactionMemo,
  updateTransactionCategory,
} from '@/api/assetApi';
import { categoryMap } from '@/constants/categoryMap';
import { useUiFlagsStore } from '@/stores/uiFlags';

const props = defineProps({
  // AssetMain에서 { id, name, color, transactions? } 형태로 전달
  categoryData: {
    type: Object,
    required: true,
    default: () => ({ id: null, name: '', color: '#999', transactions: [] }),
  },
  selectedDate: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
});

const emit = defineEmits(['back']);

const ui = useUiFlagsStore();

const currentDate = ref(new Date(props.selectedDate));
const selectedMonth = ref(currentDate.value.toISOString().slice(0, 7)); // YYYY-MM

const loading = ref(false);
const transactions = ref([]); // 내부 운용 목록

// 상세 모달
const showDetailModal = ref(false);
const selectedTransaction = ref({});

const headerTitle = computed(() => `카테고리별 거래내역`);
const getSelectedMonthText = () =>
  `${parseInt(selectedMonth.value.split('-')[1])}월`;

// 이름 -> ID 역매핑 (카테고리 변경 PATCH용)
const nameToId = Object.fromEntries(
  Object.entries(categoryMap || {}).map(([id, name]) => [name, Number(id)])
);

// 유틸: 트랜잭션 ID 추출
const getTxId = (tx) => tx?.transactionId ?? tx?.id;

// 유틸: 리스트에서 특정 거래 패치
const patchTxInList = (transactionId, patch) => {
  const idx = transactions.value.findIndex((t) => getTxId(t) === transactionId);
  if (idx !== -1) {
    transactions.value[idx] = { ...transactions.value[idx], ...patch };
    // 상세 모달도 열려 있으면 동기화
    if (getTxId(selectedTransaction.value) === transactionId) {
      selectedTransaction.value = {
        ...selectedTransaction.value,
        ...patch,
      };
    }
  }
};

// 유틸: 리스트에서 특정 거래 제거
const removeTxFromList = (transactionId) => {
  const idx = transactions.value.findIndex((t) => getTxId(t) === transactionId);
  if (idx !== -1) {
    transactions.value.splice(idx, 1);
  }
};

// 초기 세팅: 부모에서 넘긴 현재월 데이터 먼저 보여주기
onMounted(() => {
  transactions.value = Array.isArray(props.categoryData.transactions)
    ? props.categoryData.transactions
    : [];
});

// 월 변경 핸들러: API 재호출
const handleMonthChange = (ym) => {
  selectedMonth.value = ym;
  const [y, m] = ym.split('-').map(Number);
  currentDate.value = new Date(y, m - 1, 1);
  loadMonth(props.categoryData.id, y, m);
};

// 카테고리 id 변경 시 현재 선택 월로 재조회
watch(
  () => props.categoryData?.id,
  (id) => {
    if (id) {
      const [y, m] = selectedMonth.value.split('-').map(Number);
      loadMonth(id, y, m);
    }
  },
  { immediate: false }
);

// 외부에서 선택 월(Date)이 바뀌면 동기화
watch(
  () => props.selectedDate,
  (newDate) => {
    if (!newDate) return;
    currentDate.value = new Date(newDate);
    selectedMonth.value = currentDate.value.toISOString().slice(0, 7);
    const [y, m] = selectedMonth.value.split('-').map(Number);
    if (props.categoryData?.id) loadMonth(props.categoryData.id, y, m);
  }
);

// API 호출
async function loadMonth(categoryId, year, month) {
  if (!categoryId || !year || !month) return;
  loading.value = true;
  try {
    const { data } = await fetchCategoryTransactions({
      categoryId,
      year,
      month,
    });
    // 백엔드 VO → 화면용으로 정규화
    transactions.value = (data || []).map(adaptTx);
  } catch (e) {
    console.error('[CategoryDetailView] loadMonth error:', e);
    transactions.value = [];
  } finally {
    loading.value = false;
  }
}

// 백엔드 VO → 화면 객체
function adaptTx(vo) {
  const dt = vo.transactionDate ? new Date(vo.transactionDate) : null;
  const yyyy = dt ? dt.getFullYear() : '';
  const mm = dt ? String(dt.getMonth() + 1).padStart(2, '0') : '';
  const dd = dt ? String(dt.getDate()).padStart(2, '0') : '';
  const hh = dt ? String(dt.getHours()).padStart(2, '0') : '';
  const mi = dt ? String(dt.getMinutes()).padStart(2, '0') : '';

  return {
    id: vo.id,
    transactionId: vo.transactionId ?? vo.id, // 방어
    amount: Number(vo.amount ?? 0),
    merchant: vo.storeName || vo.storeName1 || vo.merchant || '',
    storeName: vo.storeName || vo.storeName1 || '',
    date: dt ? `${yyyy}-${mm}-${dd}` : '', // YYYY-MM-DD
    time: dt ? `${hh}:${mi}` : '',
    category: props.categoryData.name || '',
    memo: vo.memo || '',
    storeType: vo.storeType || '',
    paymentMethod: vo.paymentType || vo.payment_type || '',
  };
}

// 합계/정렬
const totalAmount = computed(() =>
  transactions.value.reduce((sum, t) => sum + (t.amount || 0), 0)
);
const sortedTransactions = computed(() =>
  [...transactions.value].sort((a, b) => new Date(b.date) - new Date(a.date))
);

// 상세 모달 컨트롤
const openTransactionDetail = (t) => {
  selectedTransaction.value = { ...t };
  showDetailModal.value = true;
};
const closeTransactionDetail = () => {
  showDetailModal.value = false;
  selectedTransaction.value = {};
};

// 메모 업데이트 (자식 emit → API → 목록/모달 반영)
const onMemoUpdated = async ({ transactionId, memo }) => {
  try {
    await updateCardTransactionMemo(transactionId, memo);
    patchTxInList(transactionId, { memo });
  } catch (e) {
    console.error('[onMemoUpdated] 실패:', e);
    alert('메모 저장에 실패했어요.');
  }
};

// 카테고리 변경 (자식 emit → API → 목록/합계 반영)
const onCategoryUpdated = async ({ transactionId, category }) => {
  try {
    const newCategoryId = nameToId[category];
    if (newCategoryId === undefined) {
      console.warn('카테고리 ID를 찾을 수 없음:', category);
      // 그래도 라벨은 반영
      patchTxInList(transactionId, { category });
      return;
    }

    await updateTransactionCategory(transactionId, newCategoryId);

    ui.markSpendingDirty();

    // 현재 상세 카테고리와 다른 카테고리로 바꿨다면 목록에서 제거
    const currentCategoryName = props.categoryData.name || '';
    if (category !== currentCategoryName) {
      removeTxFromList(transactionId);
      // 선택되어 열려있던 상세 모달도 닫아줌(옵션)
      if (showDetailModal.value) closeTransactionDetail();
    } else {
      // 동일 카테고리면 라벨만 갱신
      patchTxInList(transactionId, { category });
    }
  } catch (e) {
    console.error('[onCategoryUpdated] 실패:', e);
    alert('카테고리 변경에 실패했어요.');
  }
};

// 유틸
const formatAmount = (n) => `${(n || 0).toLocaleString()}원`;
const getTransactionTitle = (t) =>
  t.merchant || t.description || t.storeName || t.title || t.memo || '거래';
const formatTransactionDate = (d) => {
  if (!d) return '';
  const x = new Date(d);
  if (isNaN(x.getTime())) return d;
  return `${x.getMonth() + 1}월 ${x.getDate()}일`;
};
</script>

<style scoped>
.category-detail-view {
  background-color: var(--input-bg-2);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 카테고리 정보 카드 (고정) */
.category-info-card {
  background: white;
  border-radius: 0.75rem;
  margin: 0.75rem 1rem 0 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
}

.category-header {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  gap: 1rem;
}

/* 카테고리 아이콘 */
.category-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.category-dot {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
}

/* 카테고리 정보 */
.category-info {
  flex: 1;
}

.category-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--base-blue-dark);
  margin: 0 0 0.25rem 0;
}

.category-period {
  font-size: 0.875rem;
  color: var(--text-bluegray);
  margin: 0 0 0.5rem 0;
}

.category-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--base-blue-dark);
  margin: 0;
}

/* 거래내역 카드 (스크롤 가능) */
.transaction-card {
  background: white;
  border-radius: 0.75rem;
  margin: 0.75rem 1rem 1rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.transaction-section {
  padding: 1.5rem;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* 거래내역 섹션 헤더 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--input-bg-3);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-login);
  margin: 0;
}

.transaction-count {
  font-size: 0.875rem;
  color: var(--text-bluegray);
}

/* 거래내역 리스트 컨테이너 (스크롤 영역) */
.transaction-list-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE, Edge */
  /* 하단 여백 추가로 마지막 아이템까지 스크롤 가능하게 */
  padding-bottom: 1rem;
}

/* 웹킷 스크롤바 숨기기 */
.transaction-list-container::-webkit-scrollbar {
  display: none;
}

/* 거래내역 아이템 */
.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--input-bg-3);
  user-select: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.transaction-item:active {
  background-color: var(--input-bg-1);
}

.transaction-item:last-child {
  border-bottom: none;
  /* 마지막 아이템 하단 여백 추가 */
  margin-bottom: 0.5rem;
}

.transaction-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

/* 거래 날짜 (상단) */
.transaction-date {
  font-size: 0.75rem;
  color: var(--text-bluegray);
  margin: 0;
}

/* 거래 제목 (중간) */
.transaction-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--base-blue-dark);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
}

/* 거래 메모 (하단) */
.transaction-memo {
  font-size: 0.75rem;
  color: var(--text-bluegray);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 거래 금액 */
.transaction-amount {
  text-align: right;
}

.transaction-amount .amount-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--alert-red);
  margin: 0;
}

/* 상태 메시지 */
.no-transactions {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.no-transactions-text {
  font-size: 0.875rem;
  color: var(--text-lightgray);
  margin: 0;
  text-align: center;
}
</style>
