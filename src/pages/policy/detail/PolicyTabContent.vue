<script setup>
import PolicyOverviewTab from './PolicyOverviewTab.vue';

const props = defineProps({
  tab: String,
  policy: Object,
});

// 정책 개요 탭에 필요한 값 추출
const description = props.policy?.description || '';
const supportContent = props.policy?.supportContent || '';
const applyPeriod = props.policy?.applyPeriod || '';
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
