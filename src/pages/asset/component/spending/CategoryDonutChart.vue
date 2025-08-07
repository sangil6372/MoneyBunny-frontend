<template>
  <div class="chart-section">
    <!-- 데이터가 없을 때-->
    <div v-if="totalSpending === 0" class="chart-list-container"></div>
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
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue';
import { Chart as ChartJS, ArcElement, DoughnutController } from 'chart.js';

// Chart.js 등록 (필요한 요소만)
ChartJS.register(ArcElement, DoughnutController);

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

// emit 제거 - 클릭 이벤트 불필요

const chartCanvas = ref(null);
let chartInstance = null;

// 금액 포맷팅 함수
const formatAmount = (amount) => `${amount.toLocaleString()}원`;

// 차트 생성 함수
const createChart = () => {
  if (!chartCanvas.value || !props.chartData.datasets) return;

  // 기존 차트 인스턴스 제거
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const ctx = chartCanvas.value.getContext('2d');
  chartInstance = new ChartJS(ctx, {
    type: 'doughnut',
    data: props.chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }, // 모바일 앱용: 툴팁 비활성화
      },
      cutout: '70%',
      animation: {
        duration: 300, // 모바일 최적화: 짧은 애니메이션
      },
      interaction: {
        intersect: false, // 모바일 터치 최적화
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

// 컴포넌트 언마운트 시 차트 정리
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
});
</script>

<style scoped>
.chart-section {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
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
  font-size: 0.875rem;
  color: var(--text-bluegray);
  margin: 0 0 0.25rem 0;
  line-height: 1.4;
}

.center-amount {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-login);
  margin: 0;
  line-height: 1.2;
}
</style>
