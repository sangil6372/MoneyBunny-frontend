<template>
  <div class="transaction-filter">
    <!-- 기존 필터 버튼들 (좌측) - 카테고리에서는 숨김 -->
    <div v-if="type !== 'category'" class="filter-buttons">
      <button
        v-for="option in filterOptions"
        :key="option"
        :class="['filter-btn', { active: modelValue === option }]"
        @click="$emit('update:modelValue', option)"
      >
        {{ option }}
      </button>
    </div>

    <!-- 카테고리용 빈 공간 -->
    <div v-else class="filter-spacer"></div>

    <!-- 월 선택 드롭다운 (우측) -->
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
import { ref, watch, computed } from 'vue';

const props = defineProps({
  modelValue: { type: String, required: true }, // v-model for filter
  currentMonth: {
    type: String,
    default: () => new Date().toISOString().slice(0, 7), // YYYY-MM
  },
  type: {
    type: String,
    default: 'account', // 'account' | 'card' | 'category' - 구분
  },
});

const emit = defineEmits(['update:modelValue', 'month-change']);

// 타입에 따른 필터 옵션 설정
const filterOptions = computed(() => {
  if (props.type === 'card') {
    return ['전체', '지출', '환불']; // 카드용 필터
  } else if (props.type === 'category') {
    return []; // 카테고리용 - 필터 없음
  }
  return ['전체', '입금', '출금']; // 계좌용 필터 (기본값)
});

// 월 선택 관련 로직
const selectedMonth = ref(props.currentMonth);
const months = ref(generateMonths());

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
.transaction-filter {
  display: flex;
  justify-content: space-between; /* 좌우 정렬 */
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #fff;
  border-bottom: 1px solid var(--input-bg-3);
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.filter-spacer {
  flex: 1; /* 카테고리용 빈 공간 */
}

.filter-btn {
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  border: none;
  background: var(--input-bg-3); /* 기본 배경 연한 회색 */
  color: var(--text-bluegray);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn.active {
  background: var(--base-blue-dark); /* 활성화 시 블루 배경 */
  color: #fff;
}

/* 월 선택 드롭다운 스타일 */
.month-dropdown {
  padding: 0.5rem;
  border: 1px solid var(--base-lavender);
  border-radius: 0.5rem;
  background-color: var(--input-bg-2);
  color: var(--text-darkgray);
  font-size: 0.875rem;
}
</style>
