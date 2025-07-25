<template>
  <button class="add-item-button" @click="$emit('click')">
    <span class="plus">+</span>
    <slot>항목 추가</slot>
  </button>
</template>

<script setup>
// 클릭 이벤트를 상위 컴포넌트로 전달
</script>

<style scoped>
.add-item-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.625rem 1rem;
  background-color: #f1f5f9; /* 연한 회색 */
  color: #1e293b; /* 다크 네이비 */
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-item-button:hover {
  background-color: #e2e8f0;
}

.plus {
  font-size: 1.125rem;
  font-weight: bold;
}
</style>
