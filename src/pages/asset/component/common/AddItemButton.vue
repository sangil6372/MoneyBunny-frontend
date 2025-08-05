<template>
  <button class="add-item-button" @click="$emit('click')">
    <span class="plus-icon">+</span>
    <span class="label">{{ computedLabel }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: { type: String, required: true }, // 'account' 또는 'card'
});

// type에 따라 label 자동 결정
const computedLabel = computed(() =>
  props.type === 'account' ? '계좌 추가' : '카드 추가'
);
</script>

<style scoped>
.add-item-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--base-blue-dark);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
  cursor: pointer;
}

.plus-icon {
  margin-right: 0.25rem;
  font-size: 1rem;
}

.label {
  font-weight: 500;
}
</style>
