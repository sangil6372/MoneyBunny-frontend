<template>
  <div class="asset-page">
    <!-- 각 탭별 요약카드를 상단에 배치 -->

    <!-- 메인 탭 요약카드 -->
    <TotalAssetCard v-if="currentTab === '메인'" :summary="summary" />

    <!-- 계좌 탭 요약카드 -->
    <SummaryCard
      v-else-if="currentTab === '계좌'"
      title="총 계좌 잔액"
      :mainAmount="totalAccountBalance"
      rightLabel="계좌 수"
      :rightValue="(summary.accounts || []).length"
      rightUnit="개"
    />

    <!-- 카드 탭 요약카드 -->
    <SummaryCard
      v-else-if="currentTab === '카드'"
      title="이번 달 총 사용액"
      :mainAmount="totalCardUsage"
      rightLabel="카드 수"
      :rightValue="(summary.cards || []).length"
      rightUnit="개"
    />

    <!-- 지출 탭 요약카드 -->
    <SummaryCard
      v-else-if="currentTab === '지출'"
      title="이번 달 총 지출액"
      :mainAmount="totalSpending"
      rightLabel="지난달 대비"
      :rightValue="comparisonText"
      rightUnit=""
      variant="spending"
    />

    <!-- 탭 스위처 -->
    <AssetTabSwitcher :selectedTab="currentTab" @switchTab="switchTab" />

    <!-- 각 탭별 컨텐츠 (요약카드 제외) -->

    <!-- 메인 탭 컨텐츠 -->
    <div v-if="currentTab === '메인'" class="tab-content">
      <AccountOverviewCard
        :accounts="summary.accounts || []"
        @switchTab="switchTab"
      />
      <CardOverviewCard :cards="summary.cards || []" @switchTab="switchTab" />
    </div>

    <!-- 계좌 탭 컨텐츠 -->
    <div v-else-if="currentTab === '계좌'" class="tab-content">
      <div v-if="(summary.accounts || []).length > 0">
        <AccountList
          :accounts="summary.accounts || []"
          @delete-account="deleteAccount"
          @update-accounts="onUpdateAccounts"
        />
      </div>
      <div v-else>
        <NoDataCard type="account" @add="onAddAccount" />
      </div>
    </div>

    <!-- 카드 탭 컨텐츠 -->
    <div v-else-if="currentTab === '카드'" class="tab-content">
      <div v-if="(summary.cards || []).length > 0">
        <CardList
          :cards="summary.cards || []"
          @delete-card="deleteCard"
          @update-cards="onUpdateCards"
        />
      </div>
      <div v-else>
        <NoDataCard type="card" @add="onAddCard" />
      </div>
    </div>

    <!-- 지출 탭 컨텐츠 -->
    <div v-else-if="currentTab === '지출'" class="tab-content">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAssetStore } from '@/stores/asset';
import { useSync } from '@/composables/useSync';
import { useRoute, useRouter } from 'vue-router';
import { useSpendingData } from '@/assets/utils/useSpendingData';

// 컴포넌트 import
import AssetTabSwitcher from './component/common/AssetTabSwitcher.vue';
import TotalAssetCard from './component/total/TotalAssetCard.vue';
import SummaryCard from './component/common/SummaryCard.vue';
import AccountOverviewCard from './component/total/AccountOverviewCard.vue';
import CardOverviewCard from './component/total/CardOverviewCard.vue';
import AccountList from './component/account/AccountList.vue';
import CardList from './component/card/CardList.vue';
import NoDataCard from './component/common/NoDataCard.vue';
import CalendarSection from './component/spending/CalendarSection.vue';
import CategoryDonutChart from './component/spending/CategoryDonutChart.vue';
import CategoryList from './component/spending/CategoryList.vue';
import CategoryChart from './component/spending/CategoryChart.vue';
import CategoryDetailView from './component/spending/CategoryDetailView.vue';
import DetailModal from './component/detail/DetailModal.vue';

const accountTabRef = ref(null);
const cardTabRef = ref(null);

const assetStore = useAssetStore();

const route = useRoute();
const router = useRouter();
const currentTab = ref(route.query.tab || '메인');

// 뒤로/앞으로가기 등 쿼리 변화 대응
watch(
  () => route.query.tab,
  (tab) => {
    if (tab && tab !== currentTab.value) {
      currentTab.value = tab;
    }
  }
);

// 동기화 composable 가져오기
const { syncWithUX: syncAccounts } = useSync('account');
const { syncWithUX: syncCards } = useSync('card');

// 지출 데이터 composable
const {
  currentDate,
  totalSpending,
  monthComparison,
  categoryList,
  chartData,
  monthlyTrendData,
  getCategoryDetail,
} = useSpendingData();

// 새로고침, 진입시 항상 동기화 + summary 최신화
onMounted(async () => {
  await syncAccounts(true);
  await syncCards(true);
  await assetStore.loadSummary();
});

function switchTab(tab) {
  currentTab.value = tab;
  router.replace({ query: { ...route.query, tab } });

  if (tab === '계좌' && accountTabRef.value) {
    accountTabRef.value.syncWithUX();
  }
  if (tab === '카드' && cardTabRef.value) {
    cardTabRef.value.syncWithUX();
  }
}

const summary = computed(() => assetStore.summary || {});

// 계좌 총 잔액 계산
const totalAccountBalance = computed(() =>
  (summary.value.accounts || []).reduce(
    (sum, acc) => sum + (acc.balance || 0),
    0
  )
);

// 카드 총 사용액 계산
const totalCardUsage = computed(() =>
  (summary.value.cards || []).reduce(
    (sum, card) => sum + (card.thisMonthUsed || 0),
    0
  )
);

// 전월 대비 텍스트 계산
const comparisonText = computed(() => {
  const { difference, rate, isIncrease } = monthComparison.value;
  const sign = isIncrease ? '+' : '';
  const percentage = Math.abs(rate);
  return `${sign}${difference.toLocaleString()}원(${sign}${percentage}%)`;
});

// 월별 추이 차트용 데이터 변환
const monthlyTrendChartData = computed(() => {
  const { months, amounts } = monthlyTrendData.value;
  return months.map((month, index) => ({
    date: month.replace('월', '.1'),
    price: amounts[index],
    category: '지출',
    memo: '월별 지출',
  }));
});

// 지출 탭 관련 상태
const showAllCategories = ref(false);
const showCategoryDetail = ref(false);
const selectedCategoryData = ref(null);

// 지출 탭 이벤트 핸들러들
const updateSelectedDate = (newDate) => {
  currentDate.value = newDate;
};

const toggleShowAll = () => {
  showAllCategories.value = !showAllCategories.value;
};

const handleCategoryClick = (categoryIndex) => {
  const category = categoryList.value[categoryIndex];
  if (category) {
    openCategoryDetail(category);
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

// 계좌/카드 관련 이벤트 핸들러들
const deleteAccount = (account) => {
  // 계좌 삭제 로직
  console.log('계좌 삭제:', account);
};

const onUpdateAccounts = (accounts) => {
  // 계좌 업데이트 로직
  console.log('계좌 업데이트:', accounts);
};

const onAddAccount = () => {
  alert('계좌 추가 기능(모달)!');
};

const deleteCard = (cardToDelete) => {
  // 카드 삭제 로직
  console.log('카드 삭제:', cardToDelete);
};

const onUpdateCards = (newCards) => {
  // 카드 업데이트 로직
  console.log('카드 업데이트:', newCards);
};

const onAddCard = () => {
  console.log('카드 추가 모달 열기');
};
</script>

<style scoped>
.asset-page {
  display: flex;
  flex-direction: column;
}

.tab-content {
  margin-top: 1rem;
}

.tab-content > * {
  margin-bottom: 1rem;
}

.tab-content > *:last-child {
  margin-bottom: 0;
}
</style>
