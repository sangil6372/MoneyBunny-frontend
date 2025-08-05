<script setup>
import { ref, computed, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api'; // api 인스턴스 import 추가

import PolicyHeader from './PolicyHeader.vue';
import PolicyTab from './PolicyTabs.vue';
import PolicyTabContent from './PolicyTabContent.vue';
import PolicyConditionTab from './PolicyConditionTab.vue';
import PolicyApplyTab from './PolicyApplyTab.vue';

// 실제 데이터(예시)
const ALL_POLICIES = [
  {
    policyId: 202,
    title: '2025년 청년사회진입 활동지원사업',
    description: '청년 사회진입 활동을 지원하는 정책',
    tags: ['청년'],
    supportAmount: '일시금 30만원 지급',
    objective: '청년의 사회진입을 돕기 위한 지원사업입니다.',
    supportDetails: [{ title: '현금 지원', desc: '30만원 일시금 지급' }],
    relatedPolicies: [
      { title: '청년내일채움공제', desc: '청년 장기근속 지원' },
    ],
  },
  {
    policyId: 5,
    title: '2025년 청년도전지원사업(원주시)',
    description: '청년의 도전을 지원하는 원주시 청년 대상 정책',
    tags: ['청년'],
    supportAmount: '최대 35만원 일시금 지급',
    objective: '청년들의 자기계발 및 사회진입을 위한 일시금 지원 정책',
    supportDetails: [{ title: '일시금 지원', desc: '최대 35만원 일시금 지급' }],
    relatedPolicies: [
      {
        title: '청년사회진입 활동지원사업',
        desc: '청년 사회진입을 위한 활동 지원',
      },
    ],
    endDate: '20250721 ~ 20250930',
  },
  {
    policyId: 1135,
    title:
      '[밀알복지재단] 경기도 저출생 위기극복 지원사업  ‘우리가족, 함께 기대’',
    description: '경기도 내 저출생 위기 극복을 위한 임산부 건강검진 지원사업',
    tags: ['육아'],
    supportAmount: '임산부 건강검진비 최대 100만원 지원',
    objective: '저출생 위기 가정에 건강검진비 지원을 통해 출산을 장려하는 사업',
    supportDetails: [
      { title: '건강검진비 지원', desc: '임산부 건강검진비 최대 100만원 지원' },
    ],
    relatedPolicies: [
      { title: '임신축하금 지원사업', desc: '임신 가정에 축하금 10만원 지급' },
    ],
    endDate: '20240911 ~ 20250831',
  },
];

const route = useRoute();
const selectedTab = ref('정책 개요');

// 라우터 param에서 policyId 추출 (문자일 수도 있으니 숫자 변환)
const policyId = computed(() =>
  Number(route.params.policyId || route.params.id)
);

// API에서 받아온 정책 데이터 저장
const policyData = ref(null);

// 정책 상세 API 호출
async function fetchPolicyDetail(id) {
  try {
    const res = await api.get(`/api/policy/detail/${id}`);
    policyData.value = res.data;
  } catch (e) {
    policyData.value = null;
  }
}

// policyId가 바뀔 때마다 API 호출
watchEffect(() => {
  if (policyId.value) {
    fetchPolicyDetail(policyId.value);
  }
});

// 기존 ALL_POLICIES에서 찾는 로직은 유지 (예시 데이터)
const policy = computed(() =>
  policyData.value
    ? policyData.value
    : ALL_POLICIES.find((p) => p.policyId === policyId.value)
);
// 기간 문자열 추출 (endDate 필드)
const period = computed(() => policy.value?.endDate || '');
</script>

<template>
  <div class="policyDetailPage" v-if="policy">
    <PolicyHeader
      :title="policy.title"
      :description="policy.policyBenefitDescription"
      :policy="policy"
    />

    <div class="contentBox">
      <PolicyTab v-model:selectedTab="selectedTab" />
      <PolicyTabContent :policy="policy" :tab="selectedTab">
        <template #overview>
          <PolicyTabContent
            :policy="policy"
            :period="policy.endDate"
            :tab="selectedTab"
          />
        </template>
        <template #condition>
          <PolicyConditionTab :policy="policy" />
        </template>
        <template #apply> <PolicyApplyTab :policy="policy" /> </template>
      </PolicyTabContent>
    </div>
  </div>
  <div v-else class="noData">정책 정보를 찾을 수 없습니다.</div>
</template>

<style scoped>
.policyDetailPage {
  background-color: var(--input-bg-2);
}

.contentBox {
  background-color: white;
  border-radius: 12px;
  padding: 10px;
  margin: 26px 0;
}

.noData {
  padding: 40px;
  text-align: center;
  color: gray;
}
</style>
