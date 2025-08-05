<!-- src/pages/asset/component/spending/CategoryChart.vue -->
<template>
  <div class="category-chart">
    <div class="chart-header">
      <h4 class="chart-title">월별 지출 추이</h4>
      <p class="chart-subtitle">최근 6개월</p>
    </div>

    <!-- 데이터가 없을 때 -->
    <div v-if="isEmpty" class="no-data">
      <p class="no-data-text">지출 데이터가 없습니다</p>
    </div>

    <!-- 차트 컨테이너 -->
    <div v-else class="chart-container">
      <div class="chart-bars">
        <div
          v-for="(value, index) in chartData.amounts"
          :key="index"
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
          :key="index"
          class="chart-label"
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
});

// 차트 데이터 (간단화)
const chartData = computed(() => props.monthlyTrendData);

// 데이터가 비어있는지 확인
const isEmpty = computed(() =>
  chartData.value.amounts.every((val) => val === 0)
);

// 최대값 계산
const maxValue = computed(() => Math.max(...chartData.value.amounts, 1));

// 바 높이 계산
const getBarHeight = (value) => {
  if (value === 0) return 2; // 최소 높이
  return Math.max((value / maxValue.value) * 100, 2);
};

// 바 색상 계산 (현재 월 강조)
const getBarColor = (index) => {
  const currentMonth = new Date().getMonth() + 1;
  const barMonth = parseInt(chartData.value.months[index].replace('월', ''));

  return barMonth === currentMonth
    ? 'var(--base-blue-dark)'
    : 'var(--base-lavender)';
};
</script>

<style scoped>
.category-chart {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
  transition: all 0.2s ease;
  min-height: 2px;
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
