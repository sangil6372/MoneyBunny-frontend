<template>
  <div class="category-detail-view">
    <!-- 헤더 -->
    <DetailHeader
      :title="headerTitle"
      :currentMonth="selectedMonth"
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
            <h4 class="section-title">결제 내역</h4>
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
              <div class="transaction-icon">
                <div class="icon-circle">
                  <span class="icon-text">{{
                    getCategoryInitial(categoryData.name)
                  }}</span>
                </div>
              </div>

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
import { ref, computed } from 'vue';
import DetailHeader from '../detail/DetailHeader.vue';
import DetailInfoCard from '../detail/DetailInfoCard.vue';

const props = defineProps({
  categoryData: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['back']);

const selectedMonth = ref(new Date().toISOString().slice(0, 7)); // YYYY-MM

// 헤더 제목
const headerTitle = computed(() => `카테고리별 결제내역`);

// 선택된 월 텍스트
const getSelectedMonthText = () => {
  const [year, month] = selectedMonth.value.split('-');
  return `${parseInt(month)}월`;
};

// 월 변경 시 필터링
const handleMonthChange = (newMonth) => {
  selectedMonth.value = newMonth;
};

// 거래내역 필터링 (선택된 월 기준)
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

// 금액 포맷팅
const formatAmount = (amount) => `${amount.toLocaleString()}원`;

// 거래내역 제목
const getTransactionTitle = (transaction) =>
  transaction.merchant ||
  transaction.description ||
  transaction.storeName ||
  transaction.title ||
  transaction.memo ||
  '거래';

// 날짜 포맷
const formatTransactionDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr.replace(/\./g, '-'));
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

// 카테고리 초성
const getCategoryInitial = (categoryName) => {
  const initials = {
    식비: '식',
    교통비: '교',
    쇼핑: '쇼',
    '취미/여가': '취',
    생활: '생',
    기타: '기',
  };
  return initials[categoryName] || categoryName.charAt(0);
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

/* 거래내역 리스트 */
.transaction-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--input-bg-3);
}

.transaction-icon {
  margin-right: 0.75rem;
}

.icon-circle {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: var(--base-blue-dark);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-text {
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
}

.transaction-info {
  flex: 1;
  min-width: 0;
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
