<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  value: Array,
});
const emit = defineEmits(['close', 'save']);

const options = ['금액', '조회수', '만료일'];
const priorityOrder = ref(props.value ? [...props.value] : []);

watch(
  () => props.value,
  (v) => {
    if (Array.isArray(v)) priorityOrder.value = [...v];
  },
  { immediate: true }
);

// 항목 누르면 토글+순서 지정
function togglePriority(opt) {
  const idx = priorityOrder.value.indexOf(opt);
  if (idx === -1 && priorityOrder.value.length < 3) {
    priorityOrder.value.push(opt);
  } else if (idx !== -1) {
    priorityOrder.value.splice(idx, 1);
  }
}

function reset() {
  priorityOrder.value = [];
}
function close() {
  emit('close');
}
function apply() {
  emit('save', [...priorityOrder.value]);
}
</script>

<template>
  <div class="modalOverlay" @click.self="close">
    <div class="modalContainer">
      <header class="modalHeader">
        <span class="modalTitle font-18 font-bold">우선 순위</span>
        <button class="iconBtn right" @click="close">
          <img src="@/assets/images/icons/common/x.png" alt="닫기" />
        </button>
      </header>

      <div class="priorityList">
        <div
          v-for="opt in options"
          :key="opt"
          class="priorityItem"
          :class="{ selected: priorityOrder.includes(opt) }"
          @click="togglePriority(opt)"
        >
          <span class="priorityLabel">{{ opt }}</span>
          <span
            class="priorityBadge"
            :class="{ invisible: !priorityOrder.includes(opt) }"
          >
            {{
              priorityOrder.includes(opt)
                ? priorityOrder.indexOf(opt) + 1 + '순위'
                : ''
            }}
          </span>
        </div>
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

.priorityList {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px 18px 0 18px;
}
.priorityItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--input-bg-2);
  border-radius: 8px;
  padding: 10px 25px;
  font-size: 16px;
  color: var(--text-login);
  cursor: pointer;
  border: none;
}

.priorityBadge {
  display: inline-block;
  background: var(--base-blue-dark);
  color: #fff;
  border-radius: 10px;
  font-size: 15px;
  min-width: 60px;
  text-align: center;
  padding: 8px 0;
  margin-left: 16px;
  height: 33px;
  line-height: 16px;
  vertical-align: middle;
}

.priorityBadge.invisible {
  background: transparent;
  color: transparent;
  border: none;
  pointer-events: none;
}

.modalFooter {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 24px 18px 0 18px;
  gap: 10px;
}
.resetBtn {
  flex: 1;
  padding: 13px 0;
  border-radius: 10px;
  background: #f8f8fa;
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
