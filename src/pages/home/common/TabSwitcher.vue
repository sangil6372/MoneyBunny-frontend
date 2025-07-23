<template>
  <div class="tab-switcher">
    <button
      v-for="tab in tabs"
      :key="tab"
      :class="['tab-button', { active: selectedTab === tab }]"
      @click="$emit('switch', tab)"
    >
      {{ tab }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  selectedTab: String,
});

const tabs = ['전체', '계좌', '적금', '지출'];
</script>

<style scoped>
.tab-switcher {
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.tab-button {
  flex: 1;
  padding: 12px 0;
  border: none;
  border-radius: 10px;
  background-color: transparent;
  color: #7a7a7a;
  font-weight: 500;
  font-size: 15px;
  transition: all 0.2s ease-in-out;
}

.tab-button.active {
  background-color: #2e3a59; /* 진한 네이비 */
  color: white;
}
</style>
