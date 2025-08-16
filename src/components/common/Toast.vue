<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="toast">
      {{ message }}
    </div>
  </Teleport>
</template>

<style scoped>
.toast {
  position: fixed;
  left: 50%;
  bottom: 100px;
  transform: translateX(-50%);
  max-width: 390px;
  padding: 8px 14px;
  border-radius: 6px;
  background: rgba(24, 24, 27, 0.92);
  color: #fff;
  font-size: 0.8rem;
  z-index: 2147483647;
  pointer-events: none;
  text-align: center;
  word-break: keep-all;
}
</style>
