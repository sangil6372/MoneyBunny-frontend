<script setup>
import { ref, watch } from 'vue';
const props = defineProps({ value: String });
const emit = defineEmits(['close', 'save']);

const options = [
  '제한없음',
  '재직자',
  '자영업자',
  '미취업자',
  '프리랜서',
  '일용근로자',
  '(예비)창업자',
  '단기근로자',
  '영농종사자',
  '기타',
];

const selected = ref(props.value || '');

watch(
  () => props.value,
  (v) => {
    selected.value = v ?? '';
  },
  { immediate: true }
);

const close = () => emit('close');
const apply = () => emit('save', selected.value); // save 이벤트로 맞춤
const reset = () => (selected.value = '');
</script>

<template>
  <div class="modalOverlay" @click.self="close">
    <div class="modalContainer">
      <header class="modalHeader">
        <span class="modalTitle font-17 font-bold">현재 상황</span>
        <button class="iconBtn right" @click="close">
          <img src="@/assets/images/icons/common/x.png" alt="닫기" />
        </button>
      </header>
      <div class="optionList">
        <button
          v-for="opt in options"
          :key="opt"
          class="optionBtn"
          :class="{ selected: selected === opt }"
          @click="selected = opt"
        >
          {{ opt }}
        </button>
      </div>
      <div class="modalFooter">
        <button class="resetBtn" @click="reset">초기화</button>
        <button class="applyBtn" @click="apply">저장</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modalOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modalContainer {
  background: #fff;
  border-radius: 12px;
  width: 340px;
  box-sizing: border-box;
  padding: 0 0 20px 0;
  display: flex;
  flex-direction: column;
}
.modalHeader {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  position: relative;
  justify-content: center;
}

.modalTitle {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

.optionList {
  padding: 10px 18px 5px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.optionBtn {
  width: 100%;
  padding: 12px 0;
  font-size: 14px;
  background: #fff;
  border: 1.5px solid var(--input-bg-1);
  border-radius: 8px;
  color: var(--text-login);
  cursor: pointer;
}
.optionBtn.selected {
  background: var(--base-blue-dark);
  color: #fff;
  border-color: var(--base-blue-dark);
}
.modalFooter {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 18px 0 18px;
  gap: 8px;
}
.resetBtn {
  flex: 1;
  padding: 10px 0;
  border-radius: 8px;
  background: var(--input-bg-2);
  color: var(--text-login);
  border: none;
  font-size: 14px;
  cursor: pointer;
  margin-right: 6px;
}

.applyBtn {
  flex: 2;
  padding: 10px 0;
  border-radius: 8px;
  background: var(--base-blue-dark);
  color: #fff;
  border: none;
  font-size: 14px;
  cursor: pointer;
}
.applyBtn:disabled {
  color: #fff;
  cursor: not-allowed;
}

.iconBtn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.iconBtn img {
  width: 22px;
  height: 22px;
  display: block;
}
.iconBtn.right {
  margin-left: auto;
}
</style>
