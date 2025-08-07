<!-- src/pages/asset/tabs/AssetSpendingTab.vue -->
<template>
  <div class="asset-spending-tab">
    <!-- 상단 지출 요약 카드 -->
    <SummaryCard
      title="이번 달 총 지출액"
      :mainAmount="totalSpending"
      :rightLabel="'지난달 대비'"
      :rightValue="comparisonText"
      :rightUnit="''"
    />

    <!-- 월별 네비게이션 -->
    <CalendarSection
      :selectedDate="currentDate"
      @update:selectedDate="updateSelectedDate"
      @monthChange="handleMonthChange"
    />

    <!-- 도넛 차트 -->
    <CategoryDonutChart
      :totalSpending="totalSpending"
      :chartData="chartData"
      @categoryClick="handleCategoryClick"
    />

    <!-- 카테고리 리스트 -->
    <CategoryList
      :categories="categoryList"
      :showAll="showAllCategories"
      @toggleShowAll="toggleShowAll"
      @categoryClick="handleCategoryDetailClick"
    />

    <!-- 월별 지출 추이 차트 -->
    <CategoryChart
      :monthlyTrendData="monthlyTrendData"
      :selectedMonth="selectedMonth"
    />

    <!-- 카테고리 상세보기 모달 -->
    <DetailModal :visible="showCategoryDetail" @close="closeCategoryDetail">
      <CategoryDetailView
        v-if="selectedCategoryData"
        :categoryData="selectedCategoryData"
        :selectedDate="currentDate"
        @back="closeCategoryDetail"
      />
    </DetailModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useSpendingData } from '@/assets/utils/useSpendingData';
import SummaryCard from '../component/common/SummaryCard.vue';
import CalendarSection from '../component/spending/CalendarSection.vue';
import CategoryDonutChart from '../component/spending/CategoryDonutChart.vue';
import CategoryList from '../component/spending/CategoryList.vue';
import CategoryChart from '../component/spending/CategoryChart.vue';
import CategoryDetailView from '../component/spending/CategoryDetailView.vue';
import DetailModal from '../component/detail/DetailModal.vue';

// 지출 데이터 composable 사용
const {
  currentDate,
  totalSpending,
  monthComparison,
  categoryList,
  chartData,
  monthlyTrendData,
} = useSpendingData();

// 로컬 상태
const showAllCategories = ref(false);
const showCategoryDetail = ref(false);
const selectedCategoryData = ref(null);

// 현재 선택된 월 상태 (초기값: 현재 월)
const selectedMonth = ref(currentDate.value.getMonth() + 1);

// 전월 대비 텍스트 계산
const comparisonText = computed(() => {
  const { difference, rate, isIncrease } = monthComparison.value;
  const sign = isIncrease ? '+' : '';
  const percentage = Math.abs(rate);

  return `${sign}${difference.toLocaleString()}원(${sign}${percentage}%)`;
});

// CalendarSection에서 월 변경 시 처리
const handleMonthChange = (month) => {
  selectedMonth.value = month;
};

// CalendarSection에서 날짜 업데이트 시 처리
const updateSelectedDate = (newDate) => {
  currentDate.value = newDate;
  selectedMonth.value = newDate.getMonth() + 1;
};

// 더보기 토글 (한번 누르면 모든 카테고리 표시, 접기 없음)
const toggleShowAll = () => {
  showAllCategories.value = true;
};

// 카테고리 클릭 핸들러 (도넛 차트용)
const handleCategoryClick = (categoryIndex) => {
  const category = categoryList.value[categoryIndex];
  if (category) {
    selectedCategoryData.value = category;
    showCategoryDetail.value = true;
  }
};

// 리스트에서 카테고리 클릭
const handleCategoryDetailClick = (category) => {
  selectedCategoryData.value = category;
  showCategoryDetail.value = true;
};

// 카테고리 상세보기 닫기
const closeCategoryDetail = () => {
  showCategoryDetail.value = false;
  selectedCategoryData.value = null;
};
</script>

<style scoped>
.asset-spending-tab {
  padding: 0;
  margin: 0;
}

/* 각 섹션 간 간격 */
.asset-spending-tab > * {
  margin-bottom: 1rem;
}

.asset-spending-tab > *:last-child {
  margin-bottom: 0;
}
</style>
