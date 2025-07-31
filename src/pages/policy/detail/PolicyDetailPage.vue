<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

import PolicyHeader from './PolicyHeader.vue';
import PolicyTab from './PolicyTabs.vue';
import PolicyTabContent from './PolicyTabContent.vue';
import PolicyConditionTab from './PolicyConditionTab.vue';
import PolicyApplyTab from './PolicyApplyTab.vue';

import PolicyFooter from './PolicyFooter.vue';

// 라우터에서 id 가져오기
const route = useRoute();
const selectedTab = ref('정책 개요');

// 예시 정책 데이터 (id로 필터링할 수 있도록 배열 형태)
const policyList = [
  {
    id: 1,
    title: '청년 주택드림 청약통장',
    description: '청년층의 주거안정을 지원하는 청약통장',
    tags: ['주택', '청년'],
    supportAmount: '최대 5,000만원',
    objective: '청년의 주거안정을 돕기 위해...',
    supportDetails: [
      {
        title: '우대 금리 제공',
        desc: '연 2.5% 금리 혜택 제공',
      },
    ],
    relatedPolicies: [],
  },
  {
    id: 2,
    title: '청년 내일채움공제',
    description: '청년층의 장기근속과 목돈마련을 지원하는 정책',
    tags: ['취업', '청년'],
    supportAmount: '최대 3,000만원',
    objective:
      '청년층의 장기근속을 유도하고 목돈마련을 지원하여 청년 고용안정과 사회진출을 촉진하는 정부 정책입니다.',
    supportDetails: [
      {
        title: '적립금 지원',
        desc: '근로자 본인 적립금 + 기업 적립금 + 정부 지원금',
      },
      {
        title: '이자 지원',
        desc: '연 1.8% 이자율 적용 (일반 적금 대비 우대금리)',
      },
      {
        title: '취업 연계',
        desc: '우수기업 취업 기회 제공 및 장기근속 유도',
      },
    ],
    relatedPolicies: [
      {
        title: '국민취업지원제도',
        desc: '취업취약계층 및 청년층 취업지원',
      },
      {
        title: '청년 전세자금 대출',
        desc: '무주택 청년의 주거안정을 위한 전세 자금 대출',
      },
    ],
  },
];

// 현재 id에 맞는 정책 데이터 가져오기
const policyId = parseInt(route.params.id);
const policy = policyList.find((p) => p.id === policyId);
</script>

<template>
  <div class="policyDetailPage" v-if="policy">
    <PolicyHeader :policy="policy" />

    <!-- ✅ 탭 콘텐츠를 감싸는 공통 박스 -->
    <div class="contentBox">
      <PolicyTab v-model:selectedTab="selectedTab" />
      <PolicyTabContent :policy="policy" :tab="selectedTab">
        <template #overview><PolicyTabContent /> </template>

        <template #condition>
          <PolicyConditionTab />
        </template>

        <template #apply>
          <PolicyApplyTab />
        </template>
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
