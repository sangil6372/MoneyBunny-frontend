<script setup>
import PolicyOverviewTab from './PolicyOverviewTab.vue';

const props = defineProps({
  tab: String,
  policy: Object,
});
</script>

<template>
  <PolicyOverviewTab v-if="tab === '정책 개요'" :policy="policy" />

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
