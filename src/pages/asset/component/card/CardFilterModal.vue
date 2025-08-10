<template>
  <!-- 필터 모달 오버레이 -->
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <!-- 헤더 -->
      <div class="modal-header">
        <h2>필터</h2>
        <button class="close-btn" @click="closeModal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </button>
      </div>

      <!-- 필터 내용 -->
      <div class="modal-content">
        <!-- 검색어 입력 -->
        <div class="filter-section">
          <h3>검색</h3>
          <input
            v-model="localFilters.searchKeyword"
            type="text"
            placeholder="카드 거래내역 검색"
            class="search-input"
          />
        </div>

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

        <!-- 🥕 카드 전용: 유형선택 (지출/환불) -->
        <div class="filter-section">
          <h3>유형선택</h3>
          <div class="type-buttons">
            <button
              v-for="type in transactionTypes"
              :key="type"
              :class="[
                'type-btn',
                { active: localFilters.transactionType === type },
              ]"
              @click="localFilters.transactionType = type"
            >
              {{ type }}
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
});

const emit = defineEmits(['close', 'apply']);

// Store 사용
const filterStore = useTransactionFilterStore();

// 옵션들
const periodOptions = ['1개월', '3개월', '6개월', '직접설정'];
// 🥕 카드 전용: 거래 유형 (지출/환불)
const transactionTypes = ['전체', '지출', '환불'];
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
    // 직접설정인 경우 기존 날짜 유지하거나 빈 값
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
  // 🥕 Store에 카드 필터 상태 저장 ('card' 타입 사용)
  filterStore.setSearchKeyword('card', localFilters.value.searchKeyword);
  filterStore.setDateRange('card', localFilters.value.dateRange);
  filterStore.setTransactionType('card', localFilters.value.transactionType);
  filterStore.setSortBy('card', localFilters.value.sortBy);

  // 부모에게 적용 이벤트 전달
  emit('apply', localFilters.value);
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
      // 🥕 카드 상태 가져오기
      const currentState = filterStore.getFilterState('card');
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
}

/* 모달 헤더 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--input-bg-3);
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
  padding: 0.25rem;
}

/* 모달 내용 */
.modal-content {
  flex: 1;
  padding: 1.25rem;
  overflow-y: auto;
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
  padding: 0.6rem 0.5rem;
  border: 1px solid var(--input-bg-3);
  border-radius: 0.5rem;
  background: white;
  font-size: 0.875rem;
  color: var(--text-darkgray);
  cursor: pointer;
  transition: all 0.2s ease;
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
}

.date-input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid var(--input-bg-3);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  box-sizing: border-box;
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
  padding: 0.6rem 0.5rem;
  border: 1px solid var(--input-bg-3);
  border-radius: 0.5rem;
  background: white;
  font-size: 0.875rem;
  color: var(--text-darkgray);
  cursor: pointer;
  transition: all 0.2s ease;
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
  padding: 0.6rem 0.5rem;
  border: 1px solid var(--input-bg-3);
  border-radius: 0.5rem;
  background: white;
  font-size: 0.875rem;
  color: var(--text-darkgray);
  cursor: pointer;
  transition: all 0.2s ease;
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
}

.reset-btn:active,
.confirm-btn:active {
  transform: scale(0.98);
}
</style>
