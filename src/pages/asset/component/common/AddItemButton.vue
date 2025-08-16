<template>
  <!-- <button class="addAccountCard" type="button" @click="$emit('click')">
    <span class="plusIcon">＋</span>
    <span class="label font-14 font-bold">계좌 추가</span>
  </button> -->
  <button
    class="addAccountCard"
    type="button"
    :aria-label="`${labelText} 버튼`"
    @click="$emit('click')"
  >
    <span class="plusIcon">＋</span>
    <span class="label font-14 font-bold">{{ labelText }}</span>
  </button>
</template>

<script setup>
// defineProps({
//   type: { type: String, required: true },
// });

// defineEmits(['click']);
import { computed } from 'vue';

const props = defineProps({
  // 'account' | 'card'
  type: { type: String, required: true },
});

defineEmits(['click']);

const labelText = computed(() =>
  props.type === 'card' ? '카드 추가' : '계좌 추가'
);
</script>

<style scoped>
.addAccountCard {
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  border: 1px dashed var(--input-outline);
  color: var(--base-blue-dark);
  border-radius: 6px;
  padding: 12px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.plusIcon {
  font-size: 18px;
  line-height: 1;
}
.addAccountCard:active {
  transform: scale(0.98);
}
/* .add-item-button {
  width: 100%;
  height: 3rem;
  background: var(--base-blue-light);
  border: none;
  border-radius: 0.75rem;
  color: var(--base-blue-light);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: bold;
}

.add-item-button:hover {
  background: var(--input-bg-1);
  border-color: var(--base-blue-dark);
  color: var(--base-blue-dark);
}

.add-item-button:active {
  transform: scale(0.98);
}

.plus-icon {
  width: 1rem;
  height: 1rem;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.add-item-button:hover .plus-icon {
  opacity: 1;
} */
</style>
