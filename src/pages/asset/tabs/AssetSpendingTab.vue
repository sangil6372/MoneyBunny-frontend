<!-- src/pages/asset/tabs/AssetSpendingTab.vue -->
<template>
  <div class="asset-spending-tab">
    <!-- 일반 지출 탭 화면 -->
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

    <!-- 월별 지출 추이 차트 -->
    <CategoryChart :spending-data="monthlyTrendChartData" />

    <!-- 카테고리 상세보기 모달 -->
    <DetailModal :visible="showCategoryDetail" @close="closeCategoryDetail">
      <CategoryDetailView
        v-if="selectedCategoryData"
        :category-data="selectedCategoryData"
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

// 지출 데이터 composable 사용
const {
  currentDate,
  totalSpending,
  monthComparison,
  categoryList,
  chartData,
  monthlyTrendData,
  previousMonth,
  nextMonth,
  getCategoryDetail,
} = useSpendingData();

// 로컬 상태
const showAllCategories = ref(false);
const showCategoryDetail = ref(false);
const selectedCategoryData = ref(null);

// 전월 대비 텍스트 계산
const comparisonText = computed(() => {
  const { difference, rate, isIncrease } = monthComparison.value;
  const sign = isIncrease ? '+' : '';
  const percentage = Math.abs(rate);

  return `${sign}${difference.toLocaleString()}원(${sign}${percentage}%)`;
});

// 월별 추이 차트용 데이터 변환 (CategoryChart 컴포넌트에 맞게)
const monthlyTrendChartData = computed(() => {
  const { months, amounts } = monthlyTrendData.value;

  return months.map((month, index) => ({
    date: month.replace('월', '.1'), // "8월" -> "8.1" 형식으로 변환
    price: amounts[index],
    category: '지출',
    memo: '월별 지출',
  }));
});

// 월별 네비게이션 업데이트 핸들러
const updateSelectedDate = (newDate) => {
  // useSpendingData의 currentDate 직접 업데이트
  currentDate.value = newDate;
};

// 더보기/접기 토글
const toggleShowAll = () => {
  showAllCategories.value = !showAllCategories.value;
};

// 도넛 차트 카테고리 클릭 핸들러
const handleCategoryClick = (categoryIndex) => {
  const category = categoryList.value[categoryIndex];
  if (category) {
    console.log('도넛 차트 카테고리 클릭:', category.name);
    openCategoryDetail(category);
  }
};

// 카테고리 리스트 아이템 클릭 핸들러
const handleCategoryDetailClick = (category) => {
  console.log('카테고리 상세 클릭:', category.name);
  openCategoryDetail(category);
};

// 카테고리 상세보기 열기
const openCategoryDetail = (category) => {
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
