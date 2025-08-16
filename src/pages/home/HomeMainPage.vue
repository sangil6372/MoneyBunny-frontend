<template>
  <div class="homeContainer">
    <HomeSummaryCard :top3-total-amount="top3TotalAmount" />
    <!-- <TotalSummaryCard ref="totalSummaryCardRef" /> -->

    <PolicyRecommendationCard
      ref="policyRecommendationCardRef"
      class="withGapTop"
    />
    <!-- <AssetCompareCard
      :totalAsset="totalAsset"
      :top3TotalAmount="top3TotalAmount"
    /> -->
    <!-- <DailyMessageCard class="tightTopMargin" /> -->

    <PolicyBannerCarousel :items="top3Banners" :interval="5000" />
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue';
import HomeGuestPanel from './HomeGuestPanel.vue';
import HomeSummaryCard from './main/HomeSummaryCard.vue';
import TotalSummaryCard from '@/pages/home/main/TotalSummaryCard.vue';
import AssetCompareCard from '@/pages/home/main/AssetCompareCard.vue';
import PolicyRecommendationCard from '@/pages/home/main/PolicyRecommendationCard.vue';
import PolicyBannerCarousel from './main/PolicyBannerCarousel.vue';
// import DailyMessageCard from '@/pages/home/main/DailyMessageCard.vue';
import { policyAPI } from '@/api/policy';

import top3bunny from '@/assets/images/icons/bunny/top3_bunny.png';
import banner1 from '@/assets/images/icons/bunny/banner_bunny1.png';
import banner2 from '@/assets/images/icons/bunny/banner_bunny2.png';
import banner3 from '@/assets/images/icons/bunny/banner_bunny3.png';
import banner4 from '@/assets/images/icons/bunny/banner_bunny4.png';
import banner5 from '@/assets/images/icons/bunny/banner_bunny5.png';

const totalSummaryCardRef = ref();
const policyRecommendationCardRef = ref();

const totalAsset = ref(0);
const top3TotalAmount = ref(0);

// 캐러셀 데이터 (TOP3)
const top3Banners = ref([
  {
    policyId: null,
    title: '이번 주 인기 지원금 TOP3',
    description: '한 주간 가장 관심받은 혜택을 모았어요!',
    tag: '',
    deadline: null,
    amount: null,
    image: top3bunny,
  },
]);

async function fetchTop3Policies() {
  // 사용자 정책 정보 조회
  let hasUserPolicyType = false;
  try {
    const userPolicyRes = await policyAPI.getUserPolicy();
    hasUserPolicyType = !!(
      userPolicyRes?.data && Object.keys(userPolicyRes.data).length > 0
    );
  } catch (e) {
    hasUserPolicyType = false;
  }
  const res = hasUserPolicyType
    ? await policyAPI.getTop3Views()
    : await policyAPI.getTop3ViewsAll();
  const banners = [banner1, banner2, banner3];
  const apiBanners = (res.data || []).map((p, idx) => {
    // endDate 처리: "20250102 ~ 20251130" 형태 또는 빈 값
    let deadline = null;
    if (!p.endDate || p.endDate.trim() === '') {
      deadline = null; // 상시
    } else {
      const match = p.endDate.match(/~\s*(\d{8})$/);
      if (match) {
        deadline = match[1];
      } else {
        deadline = null;
      }
    }
    return {
      policyId: p.policyId,
      title: p.title,
      description: p.policyBenefitDescription,
      amount: p.policyBenefitAmount,
      tag: '인기',
      deadline,
      image: banners[idx] ?? '',
    };
  });
  top3Banners.value = [
    {
      policyId: null,
      title: '이번 주 인기 지원금 TOP3',
      description: '한 주간 가장 관심받은 혜택을 모았어요!',
      tag: '',
      deadline: null,
      amount: null,
      image: top3bunny,
    },
    ...apiBanners,
  ];
}

// 값이 로드된 후 동기화
const syncValues = () => {
  totalAsset.value = totalSummaryCardRef.value?.summary?.totalAsset ?? 0;
  top3TotalAmount.value =
    policyRecommendationCardRef.value?.top3TotalAmount ?? 0;
};

// mount 후 값 동기화
nextTick(() => {
  syncValues();
});

// 값 변경 감지하여 동기화
watch(
  () => [
    totalSummaryCardRef.value?.summary?.totalAsset,
    policyRecommendationCardRef.value?.top3TotalAmount,
  ],
  syncValues
);

onMounted(() => {
  fetchTop3Policies();
  nextTick(() => {
    syncValues();
  });
});
</script>

<style scoped>
.tightTopMargin {
  margin-top: 1rem;
}
</style>
