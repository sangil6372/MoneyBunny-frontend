<script setup>
const props = defineProps({
  policy: Object,
});
</script>

<template>
  <div class="policyFooter">
    <div class="related">
      <h3 class="font-bold font-15 mb-2">관련 정책</h3>
      <div
        class="relatedItem"
        v-for="(related, index) in policy.relatedPolicies"
        :key="index"
      >
        <div class="info">
          <p class="font-bold font-14">{{ related.title }}</p>
          <p class="font-13 text-bluegray">{{ related.desc }}</p>
        </div>
        <button class="viewButton font-13">자세히 보기</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.policyFooter {
  background-color: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 80px;
}

.relatedItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--input-outline);
}

.relatedItem:last-child {
  border-bottom: none;
}

.viewButton {
  background-color: var(--input-bg-2);
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  color: var(--text-bluegray);
  cursor: pointer;
}

.text-bluegray {
  color: var(--text-bluegray);
}

.mb-2 {
  margin-bottom: 8px;
}
</style>
