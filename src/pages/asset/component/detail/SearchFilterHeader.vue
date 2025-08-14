<template>
  <div class="search-filter-header">
    <!-- 검색 입력 영역 -->
    <div class="search-container">
      <div class="search-input-wrapper">
        <img
          src="@/assets/images/icons/mypage/search.png"
          alt="검색"
          class="search-icon"
        />
        <input
          v-model="searchKeyword"
          type="text"
          :placeholder="searchPlaceholder"
          class="search-input"
          @keyup.enter="onSearchSubmit"
          @input="onSearchInput"
        />
      </div>
    </div>

    <!-- 필터 버튼 영역 -->
    <div class="filter-button-container">
      <button class="filter-button" @click="openFilterModal">
        {{ selectedFilterText }}
        <svg
          class="dropdown-arrow"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// Props 정의
const props = defineProps({
  modelValue: { type: String, default: '' }, // 검색어
  filterValue: { type: String, default: '3개월 전체 최신' }, // 현재 선택된 필터
  type: {
    type: String,
    default: 'account', // 'account' | 'card' | 'category'
    validator: (value) => ['account', 'card', 'category'].includes(value),
  },
  placeholder: {
    type: String,
    default: '검색어를 입력하세요',
  },
});

const emit = defineEmits([
  'update:modelValue',
  'filter-modal-open',
  'search-input',
]);

// 검색어 상태
const searchKeyword = ref(props.modelValue);

// 선택된 필터 텍스트 (표시용)
const selectedFilterText = ref(props.filterValue);

// 타입별 설정을 객체로 통합
const TYPE_CONFIG = {
  account: {
    placeholder: '계좌 거래내역 검색',
    filterOptions: [
      '3개월 전체 최신',
      '1개월 전체 최신',
      '6개월 전체 최신',
      '3개월 입금만 최신',
      '3개월 출금만 최신',
      '3개월 전체 과거순',
      '직접설정',
    ],
  },
  card: {
    placeholder: '카드 거래내역 검색',
    filterOptions: [
      '3개월 전체 최신',
      '1개월 전체 최신',
      '6개월 전체 최신',
      '3개월 지출 최신',
      '3개월 환불 최신',
      '3개월 전체 과거순',
      '직접설정',
    ],
  },
  category: {
    placeholder: '지출내역 검색',
    filterOptions: [
      '3개월 전체 최신',
      '1개월 전체 최신',
      '6개월 전체 최신',
      '3개월 전체 과거순',
    ],
  },
};

// computed로 단순화
const searchPlaceholder = computed(
  () => TYPE_CONFIG[props.type]?.placeholder || props.placeholder
);

const filterOptions = computed(
  () =>
    TYPE_CONFIG[props.type]?.filterOptions.map((value) => ({
      value,
      label: value,
    })) || []
);

// 필터 모달 열기 함수
function openFilterModal() {
  emit('filter-modal-open');
}

// 검색 로직
function onSearchSubmit() {
  const keyword = searchKeyword.value.trim();
  emit('update:modelValue', keyword);
  emit('search-input', keyword);
}

// 실시간 검색 입력
function onSearchInput() {
  emit('search-input', searchKeyword.value);
}

// watch를 하나로 통합
watch(
  () => [props.modelValue, props.filterValue],
  ([newSearchValue, newFilterValue]) => {
    searchKeyword.value = newSearchValue;
    selectedFilterText.value = newFilterValue;
  },
  { immediate: true }
);
</script>

<style scoped>
.search-filter-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  /* 🔥 수정: DetailInfoCard와 동일한 스타일 */
  background: white;
  border-radius: 0.75rem; /* DetailInfoCard와 동일 */
  padding: 1rem;
  margin: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04); /* DetailInfoCard와 동일 */
  border: 1px solid var(--input-bg-3); /* DetailInfoCard와 동일 */

  /* 가로 폭 맞춤 */
  width: calc(100% - 2rem);
  box-sizing: border-box;
}

/* 검색 영역 */
.search-container {
  flex: 1;
  min-width: 0;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #f8f9fb;
  border-radius: 0.5rem; /* 🔥 수정: 더 작은 둥글기 */
  padding: 0.75rem 1rem;
  border: none;
  box-shadow: none;
}

.search-icon {
  width: 20px;
  height: 20px;
  opacity: 0.6;
  margin-right: 0.75rem;
  flex-shrink: 0;
  transition: opacity 0.2s ease;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.9rem;
  color: #1f2937;

  /* 🔥 플레이스홀더 스타일 */
  font-weight: 400;
}

.search-input::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

/* 필터 버튼 영역 */
.filter-button-container {
  flex-shrink: 0;
}

.filter-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;

  padding: 0.75rem 1rem;
  background: #f8f9fb;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  color: #374151;
  cursor: pointer;
  font-weight: 500;

  /* 너비 조정 */
  min-width: 130px;
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  transition: background-color 0.2s ease;
}

.filter-button:active {
  transform: scale(0.98);
  background: #d1d5db;
}

.dropdown-arrow {
  color: #6b7280;
  flex-shrink: 0;
}

/* 모바일 최적화 */
@media (max-width: 474px) {
  .search-filter-header {
    gap: 0.5rem;
    padding: 0.875rem;
    margin: 0.875rem;
    width: calc(100% - 1.75rem);
  }

  .search-input-wrapper {
    padding: 0.625rem 0.875rem;
  }

  .filter-button {
    font-size: 0.8rem;
    min-width: 110px;
    max-width: 130px;
    padding: 0.625rem 0.875rem;
  }

  .search-input {
    font-size: 0.85rem;
  }

  .search-icon {
    width: 18px;
    height: 18px;
    margin-right: 0.5rem;
  }
}

@media (max-width: 360px) {
  .search-filter-header {
    gap: 0.375rem;
    padding: 0.75rem;
    margin: 0.75rem;
    width: calc(100% - 1.5rem);
  }

  .filter-button {
    min-width: 95px;
    max-width: 110px;
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
  }

  .search-input-wrapper {
    padding: 0.5rem 0.75rem;
  }

  .search-input {
    font-size: 0.8rem;
  }
}

/* 포커스 상태 */
.search-input-wrapper:focus-within {
  background: #e5e7eb;
}

.search-input-wrapper:focus-within .search-icon {
  opacity: 1;
}
</style>
