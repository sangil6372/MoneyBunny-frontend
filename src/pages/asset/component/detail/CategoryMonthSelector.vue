<template>
  <div class="categoryMonthSelector" ref="root">
    <select
      v-model="selectedMonth"
      class="nativeSelect"
      @change="emitChange"
      aria-hidden="true"
      tabindex="-1"
    >
      <option v-for="m in months" :key="m.value" :value="m.value">
        {{ m.label }}
      </option>
    </select>

    <button
      type="button"
      class="monthTrigger"
      @click="toggle"
      :aria-expanded="open"
    >
      <span>{{ selectedLabel }}</span>
      <svg class="chevron" viewBox="0 0 20 20" aria-hidden="true">
        <path
          d="M6 8l4 4 4-4"
          stroke="currentColor"
          stroke-width="1.6"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <transition name="fade">
      <div
        v-if="open"
        class="monthPanel"
        :class="{ openUp: openUp }"
        role="listbox"
        :style="panelStyle"
        @keydown.stop.prevent="onKeydown"
      >
        <ul class="optionList" ref="listRef">
          <li
            v-for="(m, i) in months"
            :key="m.value"
            class="optionItem"
            :class="{
              selected: m.value === selectedMonth,
              active: i === activeIndex,
            }"
            role="option"
            :aria-selected="m.value === selectedMonth"
            @click="pick(m.value)"
            @mousemove="activeIndex = i"
          >
            <span class="label">{{ m.label }}</span>
            <!-- <span v-if="m.value === selectedMonth" class="check">✓</span> -->
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from 'vue';

const props = defineProps({
  currentMonth: {
    type: String,
    default: () => new Date().toISOString().slice(0, 7),
  }, // YYYY-MM
});
const emit = defineEmits(['month-change']);

const root = ref(null);
const listRef = ref(null);
const open = ref(false);
const openUp = ref(false);
const panelStyle = ref({});

const selectedMonth = ref(props.currentMonth);
const months = ref(makeMonths());

function makeMonths() {
  const arr = [];
  const now = new Date();
  for (let i = 0; i < 36; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    arr.push({
      label: `${y}년 ${m}월`,
      value: `${y}-${String(m).padStart(2, '0')}`,
    });
  }
  return arr;
}

const selectedLabel = computed(
  () =>
    months.value.find((v) => v.value === selectedMonth.value)?.label ||
    selectedMonth.value
);

function emitChange() {
  emit('month-change', selectedMonth.value);
}

function pick(val) {
  selectedMonth.value = val;
  emitChange();
  close();
}

function toggle() {
  open.value ? close() : openPanel();
}
function close() {
  open.value = false;
}

watch(
  () => props.currentMonth,
  (v) => (selectedMonth.value = v)
);

/** 패널 위치 계산: 트리거 아래 기본, 아래 공간 부족하면 위로 */
async function openPanel() {
  open.value = true;
  await nextTick();
  const trigger = root.value?.querySelector('.monthTrigger');
  const rect = trigger.getBoundingClientRect();
  const viewportH = window.innerHeight;
  const panelH = 240; // 6행 정도
  const wantDown = rect.bottom + 8 + panelH <= viewportH;
  openUp.value = !wantDown;

  panelStyle.value = {
    minWidth: rect.width + 'px',
    top: wantDown ? rect.height + 8 + 'px' : 'auto',
    bottom: wantDown ? 'auto' : rect.height + 8 + 'px',
    left: '0px',
  };

  // 선택 항목 보이게 스크롤
  focusToSelected();
}

// 바깥 클릭 닫기
function onClickOutside(e) {
  if (open.value && root.value && !root.value.contains(e.target)) close();
}
onMounted(() => document.addEventListener('click', onClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside));

/** 키보드 내비게이션 */
const activeIndex = ref(0);
function onKeydown(e) {
  if (e.key === 'ArrowDown') move(1);
  else if (e.key === 'ArrowUp') move(-1);
  else if (e.key === 'Enter' || e.key === ' ')
    pick(months.value[activeIndex.value].value);
  else if (e.key === 'Escape') close();
}
function move(step) {
  const max = months.value.length - 1;
  activeIndex.value = Math.min(max, Math.max(0, activeIndex.value + step));
  ensureVisible();
}
function focusToSelected() {
  const idx = months.value.findIndex((m) => m.value === selectedMonth.value);
  activeIndex.value = idx >= 0 ? idx : 0;
  nextTick(ensureVisible);
}
function ensureVisible() {
  const list = listRef.value;
  const item = list?.children?.[activeIndex.value];
  if (!list || !item) return;
  const top = item.offsetTop,
    bottom = top + item.offsetHeight;
  if (top < list.scrollTop) list.scrollTop = top;
  else if (bottom > list.scrollTop + list.clientHeight)
    list.scrollTop = bottom - list.clientHeight;
}
</script>

<style scoped>
.categoryMonthSelector {
  position: relative;
  display: inline-block;
}

/* 숨긴 네이티브 select (값/폼 유지용) */
.nativeSelect {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
}

/* 트리거 버튼: 기존 톤 유지 */
.monthTrigger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  min-width: 100px;
  border: 1px solid var(--input-outline);
  border-radius: 6px;
  background: #fff;
  color: var(--text-login);
  font-weight: bold;
  font-size: 0.75rem;
  cursor: pointer;
}
.monthTrigger:hover {
  border-color: var(--input-bg-3);
}
.chevron {
  width: 1.1rem;
  height: 1.1rem;
  opacity: 0.8;
}

.monthPanel {
  position: absolute;
  left: 0;
  z-index: 40;
  background: #fff;
  color: var(--text-login);
  border: 1px solid var(--input-outline);
  border-radius: 6px;
  min-width: 220px;
}

.monthPanel.openUp {
  transform-origin: bottom;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.optionList {
  margin: 0;
  padding: 0.25rem;
  list-style: none;
  max-height: 240px;
  overflow-y: auto;
  /* 스크롤바 숨기기 (크로스브라우저) */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.optionList::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}
.optionItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  color: #374151;
}
.optionItem:hover,
.optionItem.active {
  background: var(--input-bg-1);
}

.label {
  pointer-events: none;
}
</style>
