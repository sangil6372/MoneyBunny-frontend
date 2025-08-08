<!-- src/pages/asset/tabs/AssetSpendingTab.vue -->
<template>
  <div class="asset-spending-tab">
    <!-- 상단 지출 요약 카드 -->
    <SummaryCard
      title="이번 달 총 지출액"
      :main-amount="totalSpending"
      right-label="지난달 대비"
      :right-value="comparisonText"
      right-unit=""
      variant="spending"
    />

    <!-- 월별 네비게이션 -->
    <CalendarSection
      :selected-date="currentDate"
      @update:selectedDate="updateSelectedDate"
      @monthChange="handleMonthChange"
    />

    <!-- 도넛 차트 -->
    <CategoryDonutChart
      :total-spending="totalSpending"
      :chart-data="chartData"
      @category-click="handleCategoryClick"
    />

    <!-- 카테고리 리스트 -->
    <CategoryList
      :categories="categoryList"
      :show-all="showAllCategories"
      @toggle-show-all="toggleShowAll"
      @category-click="handleCategoryDetailClick"
    />

    <!--🥕(0807) 월별 지출 추이 차트  -->
    <CategoryChart
      v-if="monthlyTrendData && selectedMonth"
      :monthly-trend-data="monthlyTrendData"
      :selected-month="selectedMonth"
    />

    <!-- 카테고리 상세보기 모달 -->
    <DetailModal :visible="showCategoryDetail" @close="closeCategoryDetail">
      <CategoryDetailView
        v-if="selectedCategoryData"
        :category-data="selectedCategoryData"
        :selected-date="currentDate"
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
import DetailModal from '../component/common/DetailModal.vue';

const {
  currentDate,
  totalSpending,
  monthComparison,
  categoryList,
  chartData,
  monthlyTrendData,
  getCategoryDetail,
} = useSpendingData();

const showAllCategories = ref(false);
const showCategoryDetail = ref(false);
const selectedCategoryData = ref(null);

const selectedMonth = ref(currentDate.value.getMonth() + 1);
const handleMonthChange = (month) => {
  selectedMonth.value = month;
};

const comparisonText = computed(() => {
  const { difference, rate, isIncrease } = monthComparison.value;
  const sign = isIncrease ? '+' : '';
  const percentage = Math.abs(rate);
  return `${sign}${difference.toLocaleString()}원(${sign}${percentage}%)`;
});

const updateSelectedDate = (newDate) => {
  currentDate.value = newDate;
  selectedMonth.value = newDate.getMonth() + 1;
};

const toggleShowAll = () => {
  showAllCategories.value = !showAllCategories.value;
};

const handleCategoryClick = (categoryIndex) => {
  const category = categoryList.value[categoryIndex];
  if (category) {
    selectedCategoryData.value = category;
    showCategoryDetail.value = true;
  }
};

const handleCategoryDetailClick = (category) => {
  openCategoryDetail(category);
};

const openCategoryDetail = (category) => {
  selectedCategoryData.value = category;
  showCategoryDetail.value = true;
};

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
