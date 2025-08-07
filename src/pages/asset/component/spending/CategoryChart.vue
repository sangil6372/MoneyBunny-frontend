<!-- src/pages/asset/component/spending/CategoryChart.vue -->
<template>
  <div class="category-chart">
    <div class="chart-header">
      <h4 class="chart-title">월별 지출 추이</h4>
      <p class="chart-subtitle">최근 6개월</p>
    </div>

    <!-- 데이터가 없을 때 -->
    <div v-if="isEmpty" class="no-data">
      <p class="no-data-text">지출 내역이 없습니다</p>
    </div>

    <!-- 차트 컨테이너 -->
    <div v-else class="chart-container">
      <div class="chart-bars">
        <div
          v-for="(value, index) in chartData.amounts"
          :key="`bar-${index}`"
          class="chart-bar"
          :style="{
            height: `${getBarHeight(value)}%`,
            backgroundColor: getBarColor(index),
          }"
        ></div>
      </div>

      <div class="chart-labels">
        <span
          v-for="(label, index) in chartData.months"
          :key="`label-${index}`"
          class="chart-label"
          :class="{ active: isCurrentMonth(index) }"
        >
          {{ label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  monthlyTrendData: {
    type: Object,
    required: true,
    default: () => ({ months: [], amounts: [] }),
  },
  selectedMonth: {
    type: Number,
    required: true,
  },
});

const chartData = computed(() => props.monthlyTrendData);

const isEmpty = computed(() => {
  const amounts = chartData.value.amounts || [];
  return amounts.length === 0 || amounts.every((val) => val === 0);
});

const maxValue = computed(() => {
  const amounts = chartData.value.amounts || [];
  return Math.max(...amounts, 1);
});

// 막대 높이 계산 (최소 높이 보장)
const getBarHeight = (value) => {
  if (!value || value === 0) return 3; // 최소 높이 2px → 3px (모바일 가시성)
  return Math.max((value / maxValue.value) * 100, 3);
};

// 현재 월인지 확인 (인덱스 기반)
const isCurrentMonth = (index) => {
  const monthStr = chartData.value.months[index];
  if (!monthStr) return false;

  const monthNum = parseInt(monthStr.replace('월', ''));
  return monthNum === props.selectedMonth;
};

// 막대 색상 결정 (단순화)
const getBarColor = (index) => {
  return isCurrentMonth(index)
    ? 'var(--base-blue-dark)'
    : 'var(--base-blue-light)';
};
</script>

<style scoped>
.category-chart {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-login);
  margin: 0;
}

.chart-subtitle {
  font-size: 0.75rem;
  color: var(--text-bluegray);
  margin: 0;
}

.chart-container {
  height: 120px;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 100px;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.chart-bar {
  flex: 1;
  border-radius: 0.25rem 0.25rem 0 0;
  transition: background-color 0.2s ease; /* 모바일 최적화: transition 단순화 */
  min-height: 3px; /* 모바일 가시성 개선 */
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.chart-label {
  flex: 1;
  text-align: center;
  font-size: 0.75rem;
  color: var(--text-bluegray);
  transition: color 0.2s ease;
}

/* 현재 월 라벨 강조 */
.chart-label.active {
  color: var(--base-blue-dark);
  font-weight: 600;
}

.no-data {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-data-text {
  font-size: 0.875rem;
  color: var(--text-lightgray);
  margin: 0;
}
</style>
