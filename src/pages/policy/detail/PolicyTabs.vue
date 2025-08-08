<script setup>
import { ref } from 'vue';

const tabs = ['정책 개요', '신청 조건', '신청 방법'];
const selected = defineModel('selectedTab', { type: String });
</script>

<template>
  <div class="policyTab">
    <div
      class="tab"
      v-for="tab in tabs"
      :key="tab"
      @click="selected = tab"
      :class="{ active: selected === tab }"
    >
      {{ tab }}
    </div>
  </div>
</template>

<style scoped>
.policyTab {
  display: flex;
  border-bottom: 1px solid var(--input-outline);
  justify-content: space-around;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 15px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-bluegray);
  border-bottom: 2px solid transparent;
}

.tab.active {
  color: var(--base-blue-dark);
  font-weight: bold;
  border-bottom: 2px solid var(--base-blue-dark);
}
</style>
