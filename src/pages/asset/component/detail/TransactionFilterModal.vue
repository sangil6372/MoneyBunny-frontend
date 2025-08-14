<template>
  <!-- 필터 모달 오버레이 -->
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <!-- 헤더 -->
      <div class="modal-header">
        <h2>필터</h2>
        <button class="close-btn" @click="closeModal">
          <img
            src="@/assets/images/icons/common/x.png"
            alt="닫기"
            class="close-icon"
          />
        </button>
      </div>

      <!-- 필터 내용 -->
      <div class="modal-content">
        <!-- 조회기간 -->
        <div class="filter-section">
          <h3>조회기간</h3>
          <div class="period-tabs">
            <button
              v-for="period in periodOptions"
              :key="period"
              :class="[
                'period-tab',
                { active: localFilters.dateRange.type === period },
              ]"
              @click="setPeriod(period)"
            >
              {{ period }}
            </button>
          </div>

          <!-- 직접설정인 경우 날짜 입력 -->
          <div
            v-if="localFilters.dateRange.type === '직접설정'"
            class="date-range-picker"
          >
            <div class="date-input-group">
              <label>시작일</label>
              <input
                v-model="localFilters.dateRange.startDate"
                type="date"
                class="date-input"
              />
            </div>
            <div class="date-input-group">
              <label>종료일</label>
              <input
                v-model="localFilters.dateRange.endDate"
                type="date"
                class="date-input"
              />
            </div>
          </div>
        </div>

        <!-- 유형선택 -->
        <div class="filter-section">
          <h3>유형선택</h3>
          <div class="type-buttons">
            <button
              v-for="transactionType in transactionTypes"
              :key="transactionType"
              :class="[
                'type-btn',
                { active: localFilters.transactionType === transactionType },
              ]"
              @click="localFilters.transactionType = transactionType"
            >
              {{ transactionType }}
            </button>
          </div>
        </div>

        <!-- 정렬선택 -->
        <div class="filter-section">
          <h3>정렬선택</h3>
          <div class="sort-buttons">
            <button
              v-for="sort in sortOptions"
              :key="sort"
              :class="['sort-btn', { active: localFilters.sortBy === sort }]"
              @click="localFilters.sortBy = sort"
            >
              {{ sort }}
            </button>
          </div>
        </div>
      </div>

      <!-- 하단 버튼들 -->
      <div class="modal-footer">
        <button class="reset-btn" @click="resetFilters">초기화</button>
        <button class="confirm-btn" @click="applyFilters">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useTransactionFilterStore } from '@/stores/transactionFilter';

const props = defineProps({
  show: { type: Boolean, required: true },
  type: {
    type: String,
    required: true,
    validator: (value) => ['account', 'card'].includes(value),
  },
});

const emit = defineEmits(['close', 'apply']);

// Store 사용
const filterStore = useTransactionFilterStore();

// 옵션들
const periodOptions = ['1개월', '3개월', '6개월', '직접설정'];

// 타입에 따른 거래 유형 옵션
const transactionTypes = computed(() => {
  return props.type === 'card'
    ? ['전체', '지출', '환불'] // 카드: 지출/환불
    : ['전체', '입금', '출금']; // 계좌: 입금/출금
});

const sortOptions = ['최신순', '과거순'];

// 로컬 필터 상태 (모달 내에서만 사용, 확인 버튼 클릭 시 store에 반영)
const localFilters = ref({
  searchKeyword: '',
  dateRange: {
    type: '3개월',
    startDate: null,
    endDate: null,
  },
  transactionType: '전체',
  sortBy: '최신순',
});

// 현재 날짜 기준으로 기본 날짜 범위 계산
function calculateDateRange(period) {
  const now = new Date();
  const endDate = now.toISOString().split('T')[0]; // YYYY-MM-DD

  let startDate;
  switch (period) {
    case '1개월':
      startDate = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      break;
    case '3개월':
      startDate = new Date(
        now.getFullYear(),
        now.getMonth() - 3,
        now.getDate()
      );
      break;
    case '6개월':
      startDate = new Date(
        now.getFullYear(),
        now.getMonth() - 6,
        now.getDate()
      );
      break;
    default:
      return { startDate: null, endDate: null };
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate,
  };
}

// 기간 선택 함수
function setPeriod(period) {
  localFilters.value.dateRange.type = period;

  if (period !== '직접설정') {
    const dateRange = calculateDateRange(period);
    localFilters.value.dateRange.startDate = dateRange.startDate;
    localFilters.value.dateRange.endDate = dateRange.endDate;
  } else {
    // 직접설정인 경우 기존 날짜 유지하거나 기본값 설정
    if (!localFilters.value.dateRange.startDate) {
      const defaultRange = calculateDateRange('3개월');
      localFilters.value.dateRange.startDate = defaultRange.startDate;
      localFilters.value.dateRange.endDate = defaultRange.endDate;
    }
  }
}

// 필터 초기화
function resetFilters() {
  localFilters.value = {
    searchKeyword: '',
    dateRange: {
      type: '3개월',
      startDate: null,
      endDate: null,
    },
    transactionType: '전체',
    sortBy: '최신순',
  };

  // 3개월 기본 날짜 설정
  setPeriod('3개월');
}

// 필터 적용
function applyFilters() {
  // Store에 필터 상태 저장 (type에 따라 분기)
  filterStore.setSearchKeyword(props.type, localFilters.value.searchKeyword);
  filterStore.setDateRange(props.type, localFilters.value.dateRange);
  filterStore.setTransactionType(
    props.type,
    localFilters.value.transactionType
  );
  filterStore.setSortBy(props.type, localFilters.value.sortBy);

  // 부모에게 적용 이벤트 전달
  emit('apply', localFilters.value);
  closeModal();
}

// 모달 닫기
function closeModal() {
  emit('close');
}

// 모달이 열릴 때 현재 store 상태로 로컬 필터 초기화
watch(
  () => props.show,
  (newShow) => {
    if (newShow) {
      const currentState = filterStore.getFilterState(props.type);
      localFilters.value = {
        searchKeyword: currentState.searchKeyword || '',
        dateRange: {
          type: currentState.dateRange?.type || '3개월',
          startDate: currentState.dateRange?.startDate || null,
          endDate: currentState.dateRange?.endDate || null,
        },
        transactionType: currentState.transactionType || '전체',
        sortBy: currentState.sortBy || '최신순',
      };

      // 날짜가 없으면 기본값 설정
      if (
        !localFilters.value.dateRange.startDate &&
        localFilters.value.dateRange.type !== '직접설정'
      ) {
        setPeriod(localFilters.value.dateRange.type);
      }
    }
  }
);
</script>

<style scoped>
/* 모달 오버레이 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 2000;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

/* 모달 컨테이너 */
.modal-container {
  width: 100%;
  max-width: 474px;
  background: white;
  border-radius: 1rem 1rem 0 0;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  transform: translateY(100%);
  animation: slideUp 0.3s ease-out forwards;
}

/* 슬라이드 업 애니메이션 */
@keyframes slideUp {
  to {
    transform: translateY(0);
  }
}

/* 모달 헤더 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--input-bg-3);
  background: white;
  border-radius: 1rem 1rem 0 0;
}

.modal-header h2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-login);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-darkgray);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:active {
  background-color: var(--input-bg-1);
}

.close-icon {
  width: 20px;
  height: 20px;
}

/* 모달 내용 */
.modal-content {
  flex: 1;
  padding: 1.25rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 필터 섹션 */
.filter-section {
  margin-bottom: 1.5rem;
}

.filter-section h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-login);
  margin: 0 0 0.75rem 0;
}

/* 검색 입력 */
.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--input-bg-3);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--base-blue-dark);
}

/* 기간 탭 */
.period-tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.period-tab {
  padding: 0.75rem 0.5rem;
  border: 1px solid var(--input-bg-3);
  border-radius: 0.5rem;
  background: white;
  font-size: 0.875rem;
  color: var(--text-darkgray);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px; /* 터치 친화적 최소 높이 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.period-tab:active {
  transform: scale(0.98);
}

.period-tab.active {
  background: var(--base-blue-dark);
  border-color: var(--base-blue-dark);
  color: white;
}

/* 날짜 범위 선택 */
.date-range-picker {
  display: flex;
  gap: 1rem;
  margin-top: 0.75rem;
}

.date-input-group {
  flex: 1;
}

.date-input-group label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-darkgray);
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.date-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--input-bg-3);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

.date-input:focus {
  outline: none;
  border-color: var(--base-blue-dark);
}

/* 유형 버튼들 */
.type-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.type-btn {
  padding: 0.75rem 0.5rem;
  border: 1px solid var(--input-bg-3);
  border-radius: 0.5rem;
  background: white;
  font-size: 0.875rem;
  color: var(--text-darkgray);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px; /* 터치 친화적 최소 높이 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.type-btn:active {
  transform: scale(0.98);
}

.type-btn.active {
  background: var(--base-blue-dark);
  border-color: var(--base-blue-dark);
  color: white;
}

/* 정렬 버튼들 */
.sort-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.sort-btn {
  padding: 0.75rem 0.5rem;
  border: 1px solid var(--input-bg-3);
  border-radius: 0.5rem;
  background: white;
  font-size: 0.875rem;
  color: var(--text-darkgray);
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px; /* 터치 친화적 최소 높이 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.sort-btn:active {
  transform: scale(0.98);
}

.sort-btn.active {
  background: var(--base-blue-dark);
  border-color: var(--base-blue-dark);
  color: white;
}

/* 모달 푸터 */
.modal-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--input-bg-3);
  background: white;
}

.reset-btn {
  flex: 1;
  padding: 0.875rem;
  border: 1px solid var(--input-bg-3);
  border-radius: 0.5rem;
  background: white;
  color: var(--text-darkgray);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 48px; /* 터치 친화적 최소 높이 */
}

.confirm-btn {
  flex: 2;
  padding: 0.875rem;
  border: none;
  border-radius: 0.5rem;
  background: var(--base-blue-dark);
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 48px; /* 터치 친화적 최소 높이 */
}

.reset-btn:active,
.confirm-btn:active {
  transform: scale(0.98);
}

.confirm-btn:active {
  background: var(--base-lavender);
}

/* 터치 디바이스에서 더 나은 스크롤링 */
@media (max-width: 768px) {
  .modal-content {
    -webkit-overflow-scrolling: touch;
  }

  /* iOS Safari의 바운스 효과 방지 */
  .modal-overlay {
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }
}
</style>
