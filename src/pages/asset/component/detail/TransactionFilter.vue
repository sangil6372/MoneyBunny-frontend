<template>
  <div class="transaction-filter">
    <button
      v-for="option in filterOptions"
      :key="option"
      :class="['filter-btn', { active: modelValue === option }]"
      @click="$emit('update:modelValue', option)"
    >
      {{ option }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: String, required: true }, // v-model
});

const filterOptions = ['전체', '입금', '출금'];
</script>

<style scoped>
.transaction-filter {
  display: flex;
  justify-content: flex-start; /* 좌측 정렬 */
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #fff;
  border-bottom: 1px solid var(--input-bg-3);
}

.filter-btn {
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  border: none;
  background: var(--input-bg-3); /* 기본 배경 연한 회색 */
  color: var(--text-bluegray);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn.active {
  background: var(--base-blue-dark); /* 활성화 시 블루 배경 */
  color: #fff;
}
</style>
