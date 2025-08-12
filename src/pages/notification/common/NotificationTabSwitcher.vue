<template>
  <div class="tab-switcher">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      :class="['tab-button', { active: tab.value === modelValue }]"
      @click="$emit('update:modelValue', tab.value)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

const tabs = [
  { label: '전체', value: 'all' },
  { label: '정책', value: 'policy' },
  { label: '피드백', value: 'feedback' },
];
</script>

<style scoped>
.tab-switcher {
  display: flex;
  justify-content: space-around;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 6px;
  /* box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05); */
}

.tab-button {
  flex: 1;
  background: none;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;

  color: #777;
  cursor: pointer;
  position: relative;
  font-size: 14px;
  font-weight: bold;

  /* transition: all 0.2s ease-in-out; */
}

.tab-button.active {
  color: #2f466c;
}

.tab-button.active {
  background-color: var(--base-blue-dark); /* 진한 네이비 */
  color: white;
}
</style>
