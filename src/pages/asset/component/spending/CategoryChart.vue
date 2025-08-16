<!-- src/pages/asset/component/spending/CategoryChart.vue -->
<template>
  <div class="category-chart">
    <div class="chart-header">
      <div class="chart-title">월별 지출 추이</div>
      <p class="chart-subtitle">최근 6개월</p>
    </div>

    <!-- 데이터가 없을 때 SpendingNodata 컴포넌트 사용 -->
    <SpendingNodata v-if="isEmpty" />

    <!-- 차트 컨테이너 -->
    <div v-else class="chart-container">
      <div class="chart-bars">
        <div
          v-for="(value, index) in chartData.amounts"
          :key="index"
          class="chart-bar-wrapper"
          @click="selectBar(index)"
        >
          <!-- 현재 월이거나 선택된 막대 위에 금액 표시 -->
          <div v-if="shouldShowAmount(index)" class="bar-amount">
            {{ formatBarAmount(value) }}만원
          </div>

          <div
            class="chart-bar"
            :class="{
              active: isCurrentMonth(index) && selectedBarIndex === null,
              selected: selectedBarIndex === index,
            }"
            :style="{
              height: `${getBarHeight(value)}px`,
            }"
          ></div>
        </div>
      </div>

      <div class="chart-labels">
        <span
          v-for="(label, index) in chartData.months"
          :key="index"
          class="chart-label"
          :class="{
            active: isCurrentMonth(index) && selectedBarIndex === null,
            selected: selectedBarIndex === index,
          }"
          @click="selectBar(index)"
        >
          {{ label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import SpendingNodata from './SpendingNodata.vue';

// Props 정의 (월별 추이 데이터와 현재 선택된 월)
const props = defineProps({
  monthlyTrendData: {
    type: Object,
    default: () => ({ months: [], amounts: [] }), // 기본값: 빈 배열
  },
  selectedMonth: {
    type: Number,
    default: new Date().getMonth() + 1, // 기본값: 현재 월
  },
});

// 선택된 막대 인덱스 상태
const selectedBarIndex = ref(null);

// Props에서 받은 차트 데이터
const chartData = computed(() => props.monthlyTrendData);

// 차트 데이터가 비어있는지 확인
const isEmpty = computed(() => {
  const amounts = chartData.value.amounts || [];
  return amounts.length === 0 || amounts.every((val) => val === 0);
});

// 차트 높이 계산용 최대값 구하기
const maxValue = computed(() => {
  const amounts = chartData.value.amounts || [];
  return Math.max(...amounts, 1);
});

// 현재 월 인덱스 찾기
const currentMonthIndex = computed(() => {
  return chartData.value.months.findIndex((monthStr) => {
    if (!monthStr) return false;
    const monthNum = parseInt(monthStr.replace('월', ''));
    return monthNum === props.selectedMonth;
  });
});

// 컴포넌트 마운트 시 현재 월 자동 선택하지 않음 (기본 상태 유지)
onMounted(() => {
  // 현재 월은 기본적으로 강조되지만 선택되지는 않음
  selectedBarIndex.value = null;
});

// 금액 표시 여부 결정 함수
const shouldShowAmount = (index) => {
  // 선택된 막대가 있으면 선택된 막대만 표시
  if (selectedBarIndex.value !== null) {
    return selectedBarIndex.value === index;
  }
  // 선택된 막대가 없으면 현재 월만 표시
  return isCurrentMonth(index);
};

// 막대 높이 계산 (픽셀 단위로 반환)
const getBarHeight = (value) => {
  if (!value || value === 0) return 8; // 최소 높이 8px
  const maxHeight = 80; // 최대 높이 80px
  return Math.max((value / maxValue.value) * maxHeight, 8);
};

// 현재 월인지 확인 (강조 표시용)
const isCurrentMonth = (index) => {
  const monthStr = chartData.value.months[index];
  if (!monthStr) return false;
  const monthNum = parseInt(monthStr.replace('월', ''));
  return monthNum === props.selectedMonth;
};

// 막대 선택 함수
const selectBar = (index) => {
  // 같은 막대를 다시 클릭하면 선택 해제
  if (selectedBarIndex.value === index) {
    selectedBarIndex.value = null;
  } else {
    selectedBarIndex.value = index;
  }
};

// 막대 위 금액 포맷팅 (만원 단위로 간단히)
const formatBarAmount = (amount) => {
  if (!amount) return '0';
  const manWon = Math.round(amount / 10000);
  return manWon.toLocaleString();
};
</script>

<style scoped>
.category-chart {
  background: white;
  border-radius: 6px;
  padding: 1.2rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-title {
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--text-login);
  margin: 0;
}

.chart-subtitle {
  font-size: 0.75rem;
  color: var(--text-bluegray);
  margin: 0;
}

.chart-container {
  position: relative;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 100px;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0 0.25rem;
}

.chart-bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  max-width: 40px;
}

/* 막대 위 금액 표시 */
.bar-amount {
  position: absolute;
  bottom: 100%;
  margin-bottom: 6px;
  font-size: 0.6rem;
  color: var(--text-login);
  font-weight: bold;
  text-align: center;
  animation: slideUp 0.2s ease;
  white-space: nowrap;
  z-index: 10;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chart-bar {
  width: 100%;
  border-radius: 3px;

  position: relative;
  background: #bfc8d9;
}

/* 현재 월 막대 스타일 */
.chart-bar.active {
  background: var(--base-blue-dark);
}

/* 선택된 막대 스타일 */
.chart-bar.selected {
  background: var(--base-blue-dark);
  /* transform: scaleY(1.05); */
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0 0.25rem;
}

.chart-label {
  flex: 1;
  text-align: center;
  font-size: 0.75rem;
  color: var(--text-bluegray);
  padding: 0.25rem 0.15rem;
  border-radius: 2px;
  font-weight: bold;
}

.chart-label.active {
  color: var(--base-blue-dark);
  font-weight: bold;
}

.chart-label.selected {
  color: var(--text-login);
  font-weight: bold;
}

.no-data {
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-data-text {
  font-size: 0.75rem;
  color: var(--text-lightgray);
  margin: 0;
}

/* 반응형 처리 */
@media (max-width: 375px) {
  .chart-bars {
    gap: 0.5rem;
  }

  .chart-labels {
    gap: 0.5rem;
  }

  .chart-label {
    font-size: 0.7rem;
    padding: 0.25rem 0.125rem;
  }

  .bar-amount {
    font-size: 0.65rem;
    padding: 3px 4px;
  }
}
</style>
