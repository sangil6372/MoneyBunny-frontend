<template>
  <div class="category-detail-view">
    <!-- 헤더 -->
    <DetailHeader :title="headerTitle" @back="$emit('back')" />

    <!-- 필터 + 월 선택 -->
    <TransactionFilter
      v-model="currentFilter"
      :current-month="selectedMonth"
      type="category"
      @month-change="handleMonthChange"
    />

    <!-- 카테고리 정보 + 거래내역 카드 -->
    <DetailInfoCard>
      <!-- 카테고리 아이콘 -->
      <template #custom-icon>
        <div
          class="category-icon"
          :style="{ backgroundColor: (categoryData.color || '#999') + '20' }"
        >
          <div
            class="category-dot"
            :style="{ backgroundColor: categoryData.color || '#999' }"
          ></div>
        </div>
      </template>

      <!-- 카테고리 정보 -->
      <template #custom-content>
        <p class="category-name">
          {{ categoryData.name || '알 수 없는 카테고리' }}
        </p>
        <p class="category-period">{{ getSelectedMonthText() }} 총 지출</p>
        <p class="category-amount">{{ formatAmount(filteredAmount) }}</p>
      </template>

      <!-- 거래내역 리스트 -->
      <template #additional>
        <div class="transaction-section">
          <div class="section-header">
            <h4 class="section-title">거래 내역</h4>
            <span class="transaction-count"
              >{{ filteredTransactions.length }}건</span
            >
          </div>

          <!-- 거래내역 리스트 -->
          <div
            v-if="filteredTransactions.length > 0"
            class="transaction-list-container"
          >
            <div
              v-for="transaction in sortedFilteredTransactions"
              :key="
                transaction.id || transaction.transactionId || Math.random()
              "
              class="transaction-item"
              @click="openTransactionDetail(transaction)"
            >
              <div class="transaction-info">
                <p class="transaction-meta">
                  {{ formatTransactionDate(transaction.date) }}
                </p>

                <p class="transaction-title">
                  {{ getTransactionTitle(transaction) }}
                </p>
              </div>

              <div class="transaction-amount">
                <p class="amount-text">
                  -{{
                    formatAmount(transaction.amount || transaction.price || 0)
                  }}
                </p>
              </div>
            </div>
          </div>

          <!-- 거래내역 없음 -->
          <div v-else class="no-transactions">
            <p class="no-transactions-text">
              {{ getSelectedMonthText() }}에는 이 카테고리의 거래 내역이
              없습니다
            </p>
          </div>
        </div>
      </template>
    </DetailInfoCard>

    <!-- 카테고리 거래 상세보기 모달 -->
    <CategoryTransactionDetailModal
      :show="showDetailModal"
      :transaction="selectedTransaction"
      @close="closeTransactionDetail"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import DetailHeader from '../detail/DetailHeader.vue';
import DetailInfoCard from '../detail/DetailInfoCard.vue';
import TransactionFilter from '../detail/TransactionFilter.vue';
import CategoryTransactionDetailModal from '../detail/CategoryTransactionDetailModal.vue';

const props = defineProps({
  categoryData: {
    type: Object,
    required: true,
    default: () => ({ name: '', color: '#999', transactions: [] }),
  },
  selectedDate: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
});

const emit = defineEmits(['back']);

// 현재 날짜 상태
const currentDate = ref(new Date(props.selectedDate));

// 선택된 월 상태 (YYYY-MM 형식)
const selectedMonth = ref(currentDate.value.toISOString().slice(0, 7));

// 필터 상태
const currentFilter = ref('전체');

// 거래 상세보기 모달 상태
const showDetailModal = ref(false);
const selectedTransaction = ref({});

// 헤더 제목
const headerTitle = computed(() => `카테고리별 거래내역`);

// 선택된 월 텍스트
const getSelectedMonthText = () => {
  const [year, month] = selectedMonth.value.split('-');
  return `${parseInt(month)}월`;
};

// Props 변화 감지
watch(
  () => props.selectedDate,
  (newDate) => {
    if (newDate) {
      currentDate.value = new Date(newDate);
      selectedMonth.value = newDate.toISOString().slice(0, 7);
    }
  }
);

// 월 변경 처리
const handleMonthChange = (newMonthString) => {
  selectedMonth.value = newMonthString;
  const [year, month] = newMonthString.split('-');
  const newDate = new Date(parseInt(year), parseInt(month) - 1, 1);
  currentDate.value = newDate;
};

// 거래 상세보기 모달 열기
const openTransactionDetail = (transaction) => {
  console.log('카테고리 거래 상세보기 열기:', transaction);
  selectedTransaction.value = transaction;
  showDetailModal.value = true;
};

// 거래 상세보기 모달 닫기
const closeTransactionDetail = () => {
  showDetailModal.value = false;
  selectedTransaction.value = {};
};

// 거래내역 필터링
const filteredTransactions = computed(() => {
  if (
    !props.categoryData?.transactions ||
    !Array.isArray(props.categoryData.transactions)
  ) {
    return [];
  }

  return props.categoryData.transactions.filter((t) => {
    if (!t.date) return false;

    try {
      let dateStr = t.date;
      if (typeof dateStr === 'string') {
        dateStr = dateStr.replace(/\./g, '-');
      }

      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return false;

      const month = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;
      return month === selectedMonth.value;
    } catch (error) {
      return false;
    }
  });
});

// 거래내역 총합
const filteredAmount = computed(() => {
  return filteredTransactions.value.reduce((sum, t) => {
    const amount = t.amount || t.price || 0;
    return sum + (typeof amount === 'number' ? amount : 0);
  }, 0);
});

// 최신순 정렬
const sortedFilteredTransactions = computed(() => {
  return [...filteredTransactions.value].sort((a, b) => {
    try {
      const dateA = new Date(a.date.replace(/\./g, '-'));
      const dateB = new Date(b.date.replace(/\./g, '-'));
      return dateB - dateA;
    } catch (error) {
      return 0;
    }
  });
});

// 유틸리티 함수들
const formatAmount = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) return '0원';
  return `${amount.toLocaleString()}원`;
};

const getTransactionTitle = (transaction) => {
  return (
    transaction.merchant ||
    transaction.description ||
    transaction.storeName ||
    transaction.title ||
    transaction.memo ||
    '거래'
  );
};

const formatTransactionDate = (dateStr) => {
  try {
    if (!dateStr) return '';
    const date = new Date(dateStr.replace(/\./g, '-'));
    if (isNaN(date.getTime())) return dateStr;
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  } catch (error) {
    return dateStr || '';
  }
};
</script>

<style scoped>
.category-detail-view {
  background-color: transparent;
  padding-bottom: 1rem;
}

/* 카테고리 아이콘 */
.category-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-dot {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
}

/* 카테고리 정보 */
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

/* 거래내역 섹션 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--input-bg-3);
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

/* 거래내역 아이템 - 클릭 기능 추가 */
.transaction-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--input-bg-3);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

/* 거래내역 아이템 터치 피드백 */
.transaction-item:active {
  background-color: var(--input-bg-1);
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-info {
  flex: 1;
}

.transaction-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-login);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0 0.25rem 0;
}

.transaction-meta {
  font-size: 0.75rem;
  color: var(--text-bluegray);
  margin: 0;
}

.transaction-amount .amount-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--alert-red);
  margin: 0;
}

.no-transactions {
  text-align: center;
  padding: 2rem 0;
}

.no-transactions-text {
  font-size: 0.875rem;
  color: var(--text-lightgray);
  margin: 0;
}
</style>
