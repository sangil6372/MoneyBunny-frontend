<template>
  <header class="detail-header">
    <button class="back-btn" @click="$emit('back')">
      <img
        src="@/assets/images/icons/common/arrow_left.png"
        alt="뒤로가기"
        class="back-icon"
      />
    </button>
    <div class="detail-title">{{ title }}</div>
  </header>
</template>

<script>
export default {
  props: {
    title: String,
  },
};
</script>

<style scoped>
.detail-header {
  display: flex;
  align-items: center;
  height: 3.4rem;
  padding: 0 1rem;
  background-color: #fff;
  border-bottom: 1px solid var(--input-bg-3);
}

.back-btn {
  background: none;
  border: none;
  margin-right: 0.65rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
/*
.back-btn:active {
  background-color: var(--input-bg-1);
  transform: scale(0.95);
} */

.back-icon {
  width: 1rem;
  height: 1rem;
}

.detail-title {
  font-size: 1rem;
  font-weight: bold;
  color: var(--base-blue-dark);
  margin: 0;
}
</style>
