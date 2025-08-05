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
  border-radius: 1rem;
  padding: 0.5rem;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  margin-top: 0.5rem;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 0.625rem 0;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-bluegray);
  background-color: transparent;
  transition: background-color 0.2s ease, color 0.2s ease;
  cursor: pointer;
  user-select: none;
}

.tab.active {
  background-color: var(--base-blue-dark);
  color: white;
}
</style>
