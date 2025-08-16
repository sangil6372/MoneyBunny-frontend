<template>
  <div class="tab-container">
    <div
      v-for="tab in tabs"
      :key="tab"
      class="tab"
      :class="{ active: selectedTab === tab }"
      @click="$emit('switchTab', tab)"
    >
      {{ tab }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  selectedTab: String,
});

defineEmits(['switchTab']);

const tabs = ['메인', '계좌', '카드', '지출'];
</script>

<style scoped>
.tab-container {
  display: flex;
  justify-content: space-between;
  background-color: white;
  border-radius: 6px;
  padding: 0.25rem;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 0.5rem 0;
  border-radius: 6px;
  font-size: 0.75rem;
  color: var(--text-bluegray);
  background-color: transparent;
  cursor: pointer;
  user-select: none;
}

.tab.active {
  background-color: var(--base-blue-dark);
  color: white;
}
</style>
