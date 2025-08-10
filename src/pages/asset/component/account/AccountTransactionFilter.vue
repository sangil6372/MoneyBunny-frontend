<template>
  <div class="account-transaction-filter">
    <!-- 기본 필터 버튼들 (좌측) -->
    <div class="filter-buttons">
      <button
        v-for="option in filterOptions"
        :key="option"
        :class="['filter-btn', { active: currentFilter === option }]"
        @click="handleFilterChange(option)"
      >
        {{ option }}
      </button>
    </div>

    <!-- 우측 영역: 월 선택 + 고급 필터 버튼 -->
    <div class="filter-controls">
      <!-- 월 선택 드롭다운 -->
      <select
        :value="currentMonth"
        class="month-dropdown"
        @change="handleMonthChange"
      >
        <option v-for="month in months" :key="month.value" :value="month.value">
          {{ month.label }}
        </option>
      </select>

      <!-- 고급 필터 버튼 -->
      <button
        class="advanced-filter-btn"
        @click="openFilterModal"
        :class="{ 'has-filters': activeFilterCount > 0 }"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
        </svg>
        <span v-if="activeFilterCount > 0" class="filter-count">{{
          activeFilterCount
        }}</span>
      </button>
    </div>

    <!-- 고급 필터 모달 -->
    <AccountFilterModal
      v-if="showFilterModal"
      :show="showFilterModal"
      @close="closeFilterModal"
      @apply="handleFilterApply"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useTransactionFilterStore } from '@/stores/transactionFilter';
import AccountFilterModal from './AccountFilterModal.vue';

const props = defineProps({
  modelValue: { type: String, required: true }, // 현재 선택된 기본 필터 (전체/입금/출금)
  currentMonth: {
    type: String,
    default: () => new Date().toISOString().slice(0, 7), // YYYY-MM
  },
});

const emit = defineEmits([
  'update:modelValue',
  'month-change',
  'filter-change',
]);

// Store 사용
const filterStore = useTransactionFilterStore();

// 기본 필터 옵션
const filterOptions = ['전체', '입금', '출금'];

// 월 선택 옵션 생성
const months = ref([]);

// 현재 선택된 기본 필터
const currentFilter = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// 현재 월
const currentMonth = computed(() => props.currentMonth);

// Store에서 계좌 필터 상태 가져오기
const showFilterModal = computed(
  () => filterStore.getFilterState('account').showFilterModal
);
const activeFilterCount = computed(() =>
  filterStore.getActiveFilterCount('account')
);

// 월 선택 옵션 생성 함수
function generateMonths() {
  const monthsList = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}`;
    monthsList.push({
      label: `${date.getFullYear()}년 ${date.getMonth() + 1}월`,
      value,
    });
  }
  return monthsList;
}

// 기본 필터 변경 핸들러
function handleFilterChange(option) {
  currentFilter.value = option;
  // Store에도 반영
  filterStore.setTransactionType('account', option);
  // 부모에게 필터 변경 알림
  emitFilterChange();
}

// 월 변경 핸들러
function handleMonthChange(event) {
  const newMonth = event.target.value;
  filterStore.setCurrentMonth('account', newMonth);
  emit('month-change', newMonth);
  emitFilterChange();
}

// 고급 필터 모달 열기
function openFilterModal() {
  filterStore.setShowFilterModal('account', true);
}

// 고급 필터 모달 닫기
function closeFilterModal() {
  filterStore.setShowFilterModal('account', false);
}

// 고급 필터 적용 핸들러
function handleFilterApply(filterParams) {
  closeFilterModal();
  emitFilterChange();
}

// 통합 필터 변경 이벤트 발생
function emitFilterChange() {
  const filterParams = filterStore.getFilterParams('account');
  emit('filter-change', {
    ...filterParams,
    basicFilter: currentFilter.value,
    currentMonth: currentMonth.value,
  });
}

// 컴포넌트 초기화
onMounted(() => {
  months.value = generateMonths();

  // Store 초기 상태 설정
  filterStore.setTransactionType('account', props.modelValue);
  filterStore.setCurrentMonth('account', props.currentMonth);
});

// props 변경 감지
watch(
  () => props.modelValue,
  (newVal) => {
    filterStore.setTransactionType('account', newVal);
  }
);

watch(
  () => props.currentMonth,
  (newVal) => {
    filterStore.setCurrentMonth('account', newVal);
  }
);
</script>

<style scoped>
.account-transaction-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: #fff;
  border-bottom: 1px solid var(--input-bg-3);
}

/* 좌측 기본 필터 버튼들 */
.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  border: none;
  background: var(--input-bg-3);
  color: var(--text-bluegray);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn.active {
  background: var(--base-blue-dark);
  color: #fff;
}

/* 우측 컨트롤 영역 */
.filter-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 월 선택 드롭다운 */
.month-dropdown {
  padding: 0.5rem;
  border: 1px solid var(--base-lavender);
  border-radius: 0.5rem;
  background-color: var(--input-bg-2);
  color: var(--text-darkgray);
  font-size: 0.875rem;
  min-width: 100px;
}

/* 고급 필터 버튼 */
.advanced-filter-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--base-lavender);
  border-radius: 0.5rem;
  background-color: var(--input-bg-2);
  color: var(--text-darkgray);
  cursor: pointer;
  transition: all 0.2s ease;
}

.advanced-filter-btn:active {
  transform: scale(0.95);
}

/* 필터가 적용된 상태 */
.advanced-filter-btn.has-filters {
  background-color: var(--base-blue-dark);
  color: white;
  border-color: var(--base-blue-dark);
}

/* 필터 개수 배지 */
.filter-count {
  position: absolute;
  top: -6px;
  right: -6px;
  background: var(--alert-red);
  color: white;
  font-size: 0.6rem;
  font-weight: 600;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
</style>
