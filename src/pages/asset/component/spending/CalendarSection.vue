<!-- src/pages/asset/component/spending/CalendarSection.vue -->
<template>
  <div class="calendar-section">
    <div class="calendar-header">
      <button
        class="calendar-nav-btn"
        @click="previousMonth"
        aria-label="이전 달"
      >
        &#8249;
      </button>

      <h3 class="calendar-title">
        {{ formatDate(currentDate) }}
      </h3>

      <button class="calendar-nav-btn" @click="nextMonth" aria-label="다음 달">
        &#8250;
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  selectedDate: {
    type: Date,
    default: () => new Date(),
  },
});

const emit = defineEmits(['update:selectedDate', 'monthChange']);

const currentDate = ref(new Date());

// 부모에서 받은 selectedDate 변화 감지
watch(
  () => props.selectedDate,
  (newDate) => {
    currentDate.value = new Date(newDate);
  }
);

// 날짜 포맷팅 (통합된 유틸리티 함수)
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${month}월 ${year}년`;
};

// 월 이동 로직 (중복 제거된 통합 함수)
const changeMonth = (monthOffset) => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() + monthOffset);
  currentDate.value = newDate;
  emit('update:selectedDate', newDate);
  emit('monthChange', newDate.getMonth() + 1);
};

// 이전 달 이동
const previousMonth = () => changeMonth(-1);

// 다음 달 이동
const nextMonth = () => changeMonth(1);

// 컴포넌트 마운트시 부모에게 초기 날짜 전달
onMounted(() => {
  emit('update:selectedDate', currentDate.value);
  emit('monthChange', currentDate.value.getMonth() + 1);
});
</script>

<style scoped>
.calendar-section {
  background: white;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.calendar-nav-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--base-blue-dark);
  padding: 0.375rem;
  border-radius: 0.25rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  /* 모바일 터치 최적화 */
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.calendar-nav-btn:active {
  background-color: var(--input-bg-1);
  transform: scale(0.9);
}

.calendar-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-login);
  margin: 0;
}
</style>
