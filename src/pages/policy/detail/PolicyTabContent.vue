<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import PolicyOverviewTab from './PolicyOverviewTab.vue';

const props = defineProps({
  tab: String,
  policy: Object,
});

const route = useRoute();
const description = computed(() => props.policy?.description || '');
const supportContent = computed(() => props.policy?.supportContent || '');
const applyPeriod = computed(() => props.policy?.applyPeriod || '');

// URL에서 policyId 추출 (숫자 변환)
const policyId = computed(() =>
  Number(route.params.policyId || route.params.id)
);

// supportContent 값 로그 출력
console.log(
  'PolicyTabContent에서 넘기는 supportContent:',
  supportContent.value
);
</script>

<template>
  <PolicyOverviewTab
    v-if="tab === '정책 개요'"
    :description="description"
    :supportContent="supportContent"
    :applyPeriod="applyPeriod"
    :policyId="policyId"
  />

  <div v-else-if="tab === '신청 조건'">
    <slot name="condition" />
  </div>

  <div v-else-if="tab === '신청 방법'">
    <slot name="apply" />
  </div>
</template>

<style scoped>
.tabContent {
  margin-bottom: 10px;
}
</style>
