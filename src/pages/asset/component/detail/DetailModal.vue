<template>
  <div v-if="visible" class="modal-overlay" @click="onOverlayClick">
    <div class="modal-content" @click.stop>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: { type: Boolean, required: true },
});
const emit = defineEmits(['close']);

// 배경 클릭 시 닫기
const onOverlayClick = () => emit('close');
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 60px; /* 메인 헤더 높이만큼 아래에서 시작 */
  left: 50%; /* 화면 중앙 기준 */
  transform: translateX(-50%); /* 중앙 정렬 */
  background: var(--input-bg-2); /* 배경색 */
  z-index: 9999;
  width: 390px; /* main.css의 #app 기준 폭 */
  height: calc(100% - 60px); /* 헤더 영역 제외 */
  max-width: 100%; /* 작은 화면 대응 */
}
.modal-content {
  width: 100%;
  height: 100%;
}
</style>
