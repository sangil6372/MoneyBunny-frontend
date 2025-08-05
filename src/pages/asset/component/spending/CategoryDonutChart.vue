<template>
  <div class="chart-section">
    <!-- 데이터가 없을 때만 SpendingNodata 표시 -->
    <div v-if="totalSpending === 0" class="no-data-container">
      <SpendingNodata />
    </div>

    <!-- 데이터가 있을 때만 차트 표시 -->
    <div v-else class="chart-container">
      <canvas ref="chartCanvas"></canvas>
      <!-- 중앙 텍스트 -->
      <div class="chart-center-text">
        <p class="center-label">총 지출</p>
        <p class="center-amount">{{ formatAmount(totalSpending) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
} from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

const props = defineProps({
  totalSpending: {
    type: Number,
    default: 0,
  },
  chartData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['category-click']);

const chartCanvas = ref(null);
let chartInstance = null;

const formatAmount = (amount) => `${amount.toLocaleString()}원`;

const createChart = () => {
  if (!chartCanvas.value || !props.chartData.datasets) return;
  if (chartInstance) chartInstance.destroy();

  const ctx = chartCanvas.value.getContext('2d');
  chartInstance = new ChartJS(ctx, {
    type: 'doughnut',
    data: props.chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: false, // 모바일 앱용: 툴팁 완전 비활성화
        },
      },
      cutout: '70%',
      onClick: (_, elements) => {
        if (elements.length > 0) {
          emit('category-click', elements[0].index);
        }
      },
    },
  });
};

// chartData 변경 감지하여 차트 재생성
watch(
  () => props.chartData,
  () => {
    nextTick(() => createChart());
  },
  { deep: true }
);

// 컴포넌트 마운트 시 차트 생성
onMounted(() => {
  nextTick(() => createChart());
});
</script>

<style scoped>
.chart-section {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.chart-container {
  position: relative;
  height: 250px;
  width: 250px;
}

.chart-center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.center-label {
  font-size: 14px;
  color: var(--text-bluegray);
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.center-amount {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-login);
  margin: 0;
  line-height: 1.2;
}
</style>
