<template>
  <header class="detail-header">
    <button class="back-btn" @click="$emit('back')">
      <img
        src="@/assets/images/icons/common/arrow_left.png"
        alt="뒤로가기"
        class="back-icon"
      />
    </button>
    <h2 class="detail-title">{{ title }}</h2>
  </header>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
});
const emit = defineEmits(['back']);
</script>

<style scoped>
.detail-header {
  display: flex;
  align-items: center;
  height: 3.5rem;
  padding: 0 1rem;

  background-color: #fff;
  border-bottom: 1px solid var(--input-bg-3);
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 0.75rem;
}

.back-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.detail-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--base-blue-dark);
  margin: 0;
}
</style>
