<template>
  <div class="asset-page">
    <!-- 1) 요약카드 (모든 탭 공통 위치) -->
    <div class="summary-area">
      <!-- 메인 탭 요약카드 -->
      <TotalAssetCard v-if="currentTab === '메인'" :summary="summary" />

      <!-- 계좌 탭 요약카드 -->
      <SummaryCard
        v-else-if="currentTab === '계좌'"
        title="총 계좌 잔액"
        :mainAmount="totalAccountBalance"
        rightLabel="계좌 수"
        :rightValue="rightValueForAccounts"
        :rightUnit="typeof rightValueForAccounts === 'number' ? '개' : ''"
      />

      <!-- 카드 탭 요약카드 -->
      <SummaryCard
        v-else-if="currentTab === '카드'"
        title="이번 달 카드 사용액"
        :mainAmount="totalCardUsage"
        rightLabel="카드 수"
        :rightValue="rightValueForCards"
        :rightUnit="typeof rightValueForCards === 'number' ? '개' : ''"
      />

      <!-- 지출 탭 요약카드 (CalendarSection과 연동) -->
      <SummaryCard
        v-else-if="currentTab === '지출'"
        title="이번 달 총 지출액"
        :main-amount="spendingTabData.totalSpending"
        right-label="지난달 대비 변화"
        :right-value="spendingTabData.comparisonText"
        right-unit=""
        variant="spending"
      />
    </div>

    <!-- 2) 탭 스위처 -->
    <AssetTabSwitcher :selectedTab="currentTab" @switchTab="switchTab" />

    <!-- 3) 컨텐츠 -->
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
    <AssetSpendingTab
      v-else-if="currentTab === '지출'"
      ref="spendingTabRef"
      @spending-data-updated="updateSpendingData"
      class="tab-content"
    />

    <!-- 추천 배너 -->
    <RecommendBannerCarousel
      v-if="!recommendLoading && recommendBanners.length > 1"
      :items="recommendBanners"
      :interval="5000"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAssetStore } from '@/stores/asset';
import { useRoute, useRouter } from 'vue-router';
import {
  fetchHrdkoreaCardExists,
  fetchRentAccountExists,
  fetchCardTransportationFees,
  syncAccounts,
  syncCards,
} from '@/api/assetApi'; // API import 추가
import {
  regionCodeMap,
  getRegionNameByCode,
} from '@/assets/utils/regionCodeMap';
import { policyAPI } from '@/api/policy';
import axios from '@/api/index'; // axios 인스턴스 import

// 컴포넌트 import
import AssetTabSwitcher from './component/common/AssetTabSwitcher.vue';
import TotalAssetCard from './component/total/TotalAssetCard.vue';
import SummaryCard from './component/common/SummaryCard.vue';
import AccountOverviewCard from './component/total/AccountOverviewCard.vue';
import CardOverviewCard from './component/total/CardOverviewCard.vue';
import AccountList from './component/account/AccountList.vue';
import CardList from './component/card/CardList.vue';
import NoDataCard from './component/common/NoDataCard.vue';
import AssetSpendingTab from './tabs/AssetSpendingTab.vue';
import RecommendBannerCarousel from './component/banner/RecommendBannerCarousel.vue';

import certificateBunny from '@/assets/images/icons/bunny/certificate_bunny.png';
import trafficBunny from '@/assets/images/icons/bunny/traffic_bunny.png';
import rentBunny from '@/assets/images/icons/bunny/rent_bunny.png';
import recommendBunny from '@/assets/images/icons/bunny/recommend_bunny.png';

// 상태 관리
const assetStore = useAssetStore();
const route = useRoute();
const router = useRouter();
const currentTab = ref(route.query.tab || '메인');

// 지출 탭 데이터 (요약카드용) - reactive 상태로 관리
const spendingTabData = ref({
  totalSpending: 0,
  comparisonText: '–',
});

// 지출 탭에서 데이터를 받는 함수
const updateSpendingData = (data) => {
  spendingTabData.value = {
    totalSpending: data.totalSpending || 0,
    comparisonText: data.comparisonText || '–',
  };
};

const userName = ref('사용자');

// 사용자 프로필에서 name을 받아와 userName에 할당
async function loadUserName() {
  try {
    const { data } = await axios.get('/api/member/information');
    userName.value = data?.name || '사용자';
  } catch (error) {
    console.error('Failed to load user name:', error);
    userName.value = '사용자';
  }
}

// 추천 배너 관련 상태
const recommendBanners = ref([]);
const recommendLoading = ref(true);

// 사용자 정책 정보 상태
const userPolicy = ref(null);

// 사용자 정책 정보 조회 및 지역 정책 추천 로직
async function getUserRegionPolicyId() {
  try {
    if (!userPolicy.value) {
      const { data } = await policyAPI.getUserPolicy();
      userPolicy.value = data;
    }
    const regions = userPolicy.value?.regions || [];
    // 지역코드 우선순위: 첫 번째 값 사용, 없으면 기본
    const code = regions.length ? regions[0] : null;
    if (!code) return { policyId: 3167, title: 'K패스', calcType: 'kpass' };
    // 5자리 코드로 판별
    if (code.startsWith('11')) {
      // 서울(11000)
      return { policyId: 423, title: '기후동행카드', calcType: 'climate' };
    }
    if (code.startsWith('41')) {
      // 경기(41000)
      return { policyId: 3167, title: '경기 K패스', calcType: 'specialKpass' };
    }
    return { policyId: 3589, title: 'K패스', calcType: 'kpass' };
  } catch (error) {
    console.error('Failed to get user region policy:', error);
    return { policyId: 3589, title: 'K패스', calcType: 'kpass' };
  }
}

// 교통비 정책별 예상 혜택 계산 함수
function calcKpassBenefit(amount) {
  if (amount < 23250) return 0;
  return Math.floor(amount * 0.3);
}
function calcClimateBenefit(amount) {
  const benefit = amount - 55000;
  return benefit > 0 ? benefit : 0;
}
function calcSpecialKpassBenefit(amount) {
  if (amount < 93000) return calcKpassBenefit(amount);
  return Math.floor(93000 * 0.3);
}

async function loadRecommendBanners() {
  recommendLoading.value = true;
  const banners = [];

  const user = userName.value;

  // 1. 기본 배너(개인화 멘트)
  banners.push({
    policyId: null,
    title: `${user}님을 위한 맞춤 혜택`,
    description: `꼭 필요한 정책만 모았어요. 확인해보세요!`,
    amount: null,
    tag: '',
    deadline: null,
    image: recommendBunny,
  });

  let hasPolicyBanner = false;

  // 2. 교통비(후불교통대금) - 지역별 정책/계산방식 적용
  try {
    const { policyId, title, calcType } = await getUserRegionPolicyId();
    const { data: transactions } = await fetchCardTransportationFees();
    if (Array.isArray(transactions) && transactions.length > 0) {
      // 월별로 그룹핑
      const monthMap = {};
      transactions.forEach((tx) => {
        const date = new Date(tx.transactionDate);
        const ym = `${date.getFullYear()}-${date.getMonth() + 1}`;
        if (!monthMap[ym]) monthMap[ym] = [];
        monthMap[ym].push(tx);
      });
      let totalBenefit = 0;
      Object.values(monthMap).forEach((list) => {
        const sum = list.reduce((acc, tx) => acc + (tx.amount || 0), 0);
        if (calcType === 'climate') {
          totalBenefit += calcClimateBenefit(sum);
        } else if (calcType === 'kpass') {
          totalBenefit += calcSpecialKpassBenefit(sum);
        } else {
          totalBenefit += calcKpassBenefit(sum);
        }
      });
      banners.push({
        policyId,
        title: `${user}님에게 딱 맞는 ${title} 혜택`,
        description: `${title}로 교통비 아껴보세요!`,
        amount: totalBenefit,
        tag: '추천',
        deadline: '상시',
        image: trafficBunny,
      });
      hasPolicyBanner = true;
    }
  } catch (e) {
    // Ignore transportation fee fetching errors
  }

  // 3. 월세 거래내역 있을 때만
  try {
    const { data: exists } = await fetchRentAccountExists();
    if (exists) {
      banners.push({
        policyId: 1390,
        title: `${user}님 월세 부담을 줄여드려요`,
        description: '월 최대 20만원, 집 걱정 덜어보세요!',
        amount: 2400000,
        tag: '추천',
        deadline: '상시',
        image: rentBunny,
      });
      hasPolicyBanner = true;
    }
  } catch (e) {
    // Ignore transportation fee fetching errors
  }

  // 4. 한국산업인력공단 카드 결제내역 있을 때만
  try {
    const { data: exists } = await fetchHrdkoreaCardExists();
    if (exists) {
      banners.push({
        policyId: 813,
        title: `${user}님의 도전을 응원합니다!`,
        description: '응시료부터 교육비까지 든든하게!',
        amount: 0,
        tag: '추천',
        deadline: '상시',
        image: certificateBunny,
      });
      hasPolicyBanner = true;
    }
  } catch (e) {
    // Ignore transportation fee fetching errors
  }

  // 정책 배너가 하나도 없으면 기본 배너도 제거
  if (!hasPolicyBanner) {
    recommendBanners.value = [];
  } else {
    recommendBanners.value = banners;
  }
  recommendLoading.value = false;
}

const syncing = ref({ accounts: false, cards: false });

// 뒤로/앞으로가기 등 쿼리 변화 대응
watch(
  () => route.query.tab,
  async (tab) => {
    if (!tab) return;
    if (tab !== currentTab.value) currentTab.value = tab;
  }
);

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  await loadUserName();
  await assetStore.loadSummary(true);
  const navEntries = performance.getEntriesByType?.('navigation') || [];
  const isReload = navEntries[0]?.type === 'reload';
  if (
    isReload &&
    (currentTab.value === '계좌' || currentTab.value === '카드')
  ) {
    await autoSyncForTab(currentTab.value);
  }
  await loadRecommendBanners();
});

// 탭 전환 함수
function switchTab(tab) {
  currentTab.value = tab;
  router.replace({ query: { ...route.query, tab } });
}

// 요약 스냅샷 (변경 감지용)
function snapshotSummary() {
  const s = assetStore.summary || {};
  return {
    lastUpdatedAt: s.lastUpdatedAt || null,
    totalAccountBalance:
      (s.accounts || []).reduce((sum, acc) => sum + (acc.balance || 0), 0) || 0,
    accountsLen: (s.accounts || []).length || 0,
    totalCardUsage:
      (s.cards || []).reduce((sum, c) => sum + (c.thisMonthUsed || 0), 0) || 0,
    cardsLen: (s.cards || []).length || 0,
  };
}

// sleep 유틸
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
// 탭별 자동 동기화
async function autoSyncForTab(tab) {
  if (tab === '계좌') {
    if (syncing.value.accounts) return;
    syncing.value.accounts = true;
    const before = snapshotSummary();
    try {
      // 1) 동기화 트리거
      const res = await syncAccounts(); // 202 or 200(+요약)
      // 2) 응답에 요약이 있으면 즉시 반영
      if (res?.data) {
        assetStore.summary = res.data;
      } else {
        // 3) 없으면 잠깐 대기 후 서버 요약 딱 한 번만 강제 호출
        await sleep(1000); // 필요시 1000~2000ms로 조절
        await assetStore.loadSummary(true);
      }
      syncing.value.accounts = false;
    } catch (e) {
      console.error('[SYNC][계좌] 실패', e);
      syncing.value.accounts = false;
    }
  } else if (tab === '카드') {
    if (syncing.value.cards) return;
    syncing.value.cards = true;
    const before = snapshotSummary();
    try {
      const res = await syncCards();
      if (res?.data) {
        assetStore.summary = res.data;
      } else {
        await sleep(1000);
        await assetStore.loadSummary(true);
      }
      syncing.value.cards = false;
    } catch (e) {
      console.error('[SYNC][카드] 실패', e);
      syncing.value.cards = false;
    }
  } else {
    // 메인/지출 등은 기존 요약만 유지
  }
}

// computed 속성들
const summary = computed(() => assetStore.summary || {});

const totalAccountBalance = computed(() =>
  (summary.value.accounts || []).reduce(
    (sum, acc) => sum + (acc.balance || 0),
    0
  )
);

const totalCardUsage = computed(() =>
  (summary.value.cards || []).reduce(
    (sum, card) => sum + (card.thisMonthUsed || 0),
    0
  )
);

// 우측 값: 동기화 중이면 "동기화중…"으로 표시
const rightValueForAccounts = computed(() =>
  syncing.value.accounts ? '동기화중…' : (summary.value.accounts || []).length
);
const rightValueForCards = computed(() =>
  syncing.value.cards ? '동기화중…' : (summary.value.cards || []).length
);

// Placeholder methods for child component handlers
const deleteAccount = (accountId) => {
  // Account deletion logic would be implemented here
  console.log('Delete account:', accountId);
};

const deleteCard = (cardId) => {
  // Card deletion logic would be implemented here
  console.log('Delete card:', cardId);
};

const onUpdateAccounts = () => {
  // Account update handler would be implemented here
  assetStore.loadSummary(true);
};

const onUpdateCards = () => {
  // Card update handler would be implemented here
  assetStore.loadSummary(true);
};

const onAddAccount = () => {
  // Add account handler would be implemented here
  console.log('Add account clicked');
};

const onAddCard = () => {
  // Add card handler would be implemented here
  console.log('Add card clicked');
};

</script>

<style scoped>
.asset-page {
  display: flex;
  flex-direction: column;
}

.summary-area {
  margin-bottom: 0rem;
}

.tab-content {
  margin-top: 1rem;
}

.tab-content > * {
  margin-bottom: 1rem;
}

.tab-content > *:last-child {
  margin-bottom: 1rem;
}
</style>
