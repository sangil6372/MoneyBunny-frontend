<template>
  <div class="category-detail-view">
    <!-- 헤더 -->
    <DetailHeader
      :title="headerTitle"
      :current-month="formattedCurrentMonth"
      @back="$emit('back')"
      @month-change="handleMonthChange"
    />

    <!-- 카테고리 정보 + 거래내역 카드 -->
    <DetailInfoCard>
      <!-- 카테고리 아이콘 -->
      <template #custom-icon>
        <div
          class="category-icon"
          :style="{ backgroundColor: categoryData.color + '20' }"
        >
          <div
            class="category-dot"
            :style="{ backgroundColor: categoryData.color }"
          ></div>
        </div>
      </template>

      <!-- 카테고리 정보 -->
      <template #custom-content>
        <p class="category-name">{{ categoryData.name }}</p>
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
              :key="transaction.id || transaction.transactionId"
              class="transaction-item"
            >
              <div class="transaction-info">
                <p class="transaction-title">
                  {{ getTransactionTitle(transaction) }}
                </p>
                <p class="transaction-meta">
                  {{ formatTransactionDate(transaction.date) }}
                  {{ transaction.time || '' }}
                </p>
              </div>

              <div class="transaction-amount">
                <p class="amount-text">
                  -{{ formatAmount(transaction.amount || transaction.price) }}
                </p>
              </div>
            </div>
          </div>

          <!-- 거래내역 없음 -->
          <div v-else class="no-transactions">
            <p class="no-transactions-text">
              이 카테고리의 거래 내역이 없습니다
            </p>
          </div>
        </div>
      </template>
    </DetailInfoCard>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import DetailHeader from '../detail/DetailHeader.vue';
import DetailInfoCard from '../detail/DetailInfoCard.vue';

const props = defineProps({
  categoryData: Object,
  selectedDate: { type: Date, required: true },
});

const emit = defineEmits(['back']);

// 현재 날짜 상태
const currentDate = ref(new Date(props.selectedDate));

// 선택된 월 상태 (YYYY-MM 형식)
const selectedMonth = ref(currentDate.value.toISOString().slice(0, 7));

// 헤더에 전달할 현재 월
const formattedCurrentMonth = computed(() => selectedMonth.value);

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
    currentDate.value = new Date(newDate);
    selectedMonth.value = newDate.toISOString().slice(0, 7);
  }
);

// DetailHeader에서 월 변경 시 처리 (중복 제거된 통합 로직)
const handleMonthChange = (newMonthString) => {
  console.log('Header 월 변경:', newMonthString);
  selectedMonth.value = newMonthString;

  // 새로운 날짜 객체 생성 (해당 월의 1일로 설정)
  const [year, month] = newMonthString.split('-');
  const newDate = new Date(parseInt(year), parseInt(month) - 1, 1);
  currentDate.value = newDate;
};

// 거래내역 필터링
const filteredTransactions = computed(() => {
  return props.categoryData.transactions.filter((t) => {
    const date = new Date(t.date.replace(/\./g, '-'));
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}`;
    return month === selectedMonth.value;
  });
});

// 거래내역 총합
const filteredAmount = computed(() =>
  filteredTransactions.value.reduce((sum, t) => sum + (t.amount || t.price), 0)
);

// 최신순 정렬
const sortedFilteredTransactions = computed(() => {
  return [...filteredTransactions.value].sort((a, b) => {
    const dateA = new Date(a.date.replace(/\./g, '-'));
    const dateB = new Date(b.date.replace(/\./g, '-'));
    return dateB - dateA;
  });
});

// 유틸리티 함수들
const formatAmount = (amount) => `${amount.toLocaleString()}원`;

const getTransactionTitle = (transaction) =>
  transaction.merchant ||
  transaction.description ||
  transaction.storeName ||
  transaction.title ||
  transaction.memo ||
  '거래';

const formatTransactionDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr.replace(/\./g, '-'));
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
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
}

.category-period {
  font-size: 0.875rem;
  color: var(--text-bluegray);
}

.category-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--base-blue-dark);
}

/* 거래내역 섹션 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid var(--input-bg-3);
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-login);
}

.transaction-count {
  font-size: 0.875rem;
  color: var(--text-bluegray);
}

/* 거래내역 아이템 */
.transaction-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--input-bg-3);
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
}

.transaction-meta {
  font-size: 0.75rem;
  color: var(--text-bluegray);
}

.transaction-amount .amount-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--alert-red);
}

.no-transactions {
  text-align: center;
  padding: 2rem 0;
}

.no-transactions-text {
  font-size: 0.875rem;
  color: var(--text-lightgray);
}
</style>
