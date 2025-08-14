<template>
  <div class="category-month-selector">
    <!-- 월 선택 드롭다운만 표시 -->
    <select
      v-model="selectedMonth"
      class="month-dropdown"
      @change="onMonthChange"
    >
      <option v-for="month in months" :key="month.value" :value="month.value">
        {{ month.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  currentMonth: {
    type: String,
    default: () => new Date().toISOString().slice(0, 7), // YYYY-MM
  },
});

const emit = defineEmits(['month-change']);

// 월 선택 관련 로직
const selectedMonth = ref(props.currentMonth);
const months = ref(generateMonths());

function generateMonths() {
  const monthsList = [];
  const now = new Date();

  // 3년치 월 데이터 생성 (현재월부터 36개월 전까지)
  for (let i = 0; i < 36; i++) {
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

function onMonthChange() {
  emit('month-change', selectedMonth.value);
}

// currentMonth props 변경 시 selectedMonth 업데이트
watch(
  () => props.currentMonth,
  (newVal) => {
    selectedMonth.value = newVal;
  }
);
</script>

<style scoped>
.category-month-selector {
  display: flex;
  justify-content: flex-end; /* 우측 정렬 */
  align-items: center;
  padding: 0;
  background: transparent;
}

/* 월 선택 드롭다운 스타일 */
.month-dropdown {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--input-outline);
  border-radius: 0.5rem;
  background-color: white;
  color: var(--text-login);
  font-size: 0.875rem;
  font-weight: 500;
  min-width: 120px;
  cursor: pointer;
  transition: all 0.2s ease;

  /* 화살표 커스터마이징 */
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1rem;
  padding-right: 2.5rem;

  /* 드롭다운 높이 제한 (1년치만 보이도록) */
  max-height: 200px;
  overflow-y: auto;
}

.month-dropdown:hover {
  border-color: var(--base-blue-dark);
}

.month-dropdown:focus {
  outline: none;
  border-color: var(--base-blue-dark);
  box-shadow: 0 0 0 3px var(--base-blue-light);
}

/* 드롭다운 옵션 스타일링 */
.month-dropdown option {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-login);
  background-color: white;
  border: none;
  cursor: pointer;
  line-height: 1.5;

  /* 호버 효과 (브라우저 지원 제한적) */
  transition: all 0.2s ease;
}

.month-dropdown option:hover {
  background-color: var(--input-bg-1);
  color: var(--base-blue-dark);
}

.month-dropdown option:checked {
  background-color: var(--base-blue-dark);
  color: white;
  font-weight: 600;
}

/* 스크롤바 커스터마이징 (Webkit 브라우저) */
.month-dropdown::-webkit-scrollbar {
  width: 6px;
}

.month-dropdown::-webkit-scrollbar-track {
  background: var(--input-bg-2);
  border-radius: 3px;
}

.month-dropdown::-webkit-scrollbar-thumb {
  background: var(--base-lavender);
  border-radius: 3px;
}

.month-dropdown::-webkit-scrollbar-thumb:hover {
  background: var(--base-blue-dark);
}

/* Firefox 스크롤바 */
.month-dropdown {
  scrollbar-width: thin;
  scrollbar-color: var(--base-lavender) var(--input-bg-2);
}
</style>
