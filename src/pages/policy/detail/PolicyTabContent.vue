<script setup>
import { computed } from 'vue';
import PolicyOverviewTab from './PolicyOverviewTab.vue';

const props = defineProps({
  tab: String,
  policy: Object,
});

// 정책 개요 탭에 필요한 값 추출 (computed로 변경)
const description = computed(() => props.policy?.description || '');
const supportContent = computed(() => props.policy?.supportContent || '');
const applyPeriod = computed(() => props.policy?.applyPeriod || '');

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
