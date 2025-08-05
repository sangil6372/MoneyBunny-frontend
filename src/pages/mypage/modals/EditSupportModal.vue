<script setup>
import { ref, watch } from 'vue';
const props = defineProps({ value: String });
const emit = defineEmits(['close', 'save']);

const options = [
  '제한없음',
  '중소기업',
  '여성',
  '기초생활수급자',
  '한부모가정',
  '장애인',
  '농업인',
  '지역인재',
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
        <span class="modalTitle font-18 font-bold">필요한 지원</span>
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
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.16);
  z-index: 10001;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modalContainer {
  background: #fff;
  border-radius: 16px;
  width: 92vw;
  max-width: 420px;
  min-width: 320px;
  box-sizing: border-box;
  padding: 0 0 20px 0;
  display: flex;
  flex-direction: column;
}
.modalHeader {
  display: flex;
  align-items: center;
  padding: 24px 24px 18px 18px;
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
  padding: 14px 18px 0 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.optionBtn {
  width: 100%;
  padding: 13px 0;
  font-size: 15px;
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
  padding: 20px 18px 0 18px;
  gap: 10px;
}
.resetBtn {
  flex: 1;
  padding: 13px 0;
  border-radius: 10px;
  background: var(--input-bg-2);
  color: var(--text-login);
  border: none;
  font-size: 15px;
  cursor: pointer;
  margin-right: 6px;
}

.applyBtn {
  flex: 2;
  padding: 13px 0;
  border-radius: 10px;
  background: var(--base-blue-dark);
  color: #fff;
  border: none;
  font-size: 15px;
  cursor: pointer;
}
.applyBtn:disabled {
  background: #bcc7e5;
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
  width: 24px;
  height: 24px;
  display: block;
}
.iconBtn.right {
  margin-left: auto;
}
</style>
