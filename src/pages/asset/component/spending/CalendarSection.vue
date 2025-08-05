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
    default: () => new Date(), // 현재 날짜로 자동 설정
  },
});

const emit = defineEmits(['update:selectedDate']);

const currentDate = ref(new Date()); // 현재 날짜로 자동 초기화

// 부모에서 받은 selectedDate 변화 감지
watch(
  () => props.selectedDate,
  (newDate) => {
    currentDate.value = new Date(newDate);
  }
);

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${month}월 ${year}년`;
};

const previousMonth = () => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() - 1);
  currentDate.value = newDate;
  emit('update:selectedDate', newDate);
};

const nextMonth = () => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() + 1);
  currentDate.value = newDate;
  emit('update:selectedDate', newDate);
};

// 컴포넌트 마운트시 부모에게 초기 날짜 전달
onMounted(() => {
  emit('update:selectedDate', currentDate.value);
});
</script>

<style scoped>
.calendar-section {
  background: white;
  border-radius: 0.75rem;
  padding: 1rem 1.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.05);
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.calendar-nav-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--base-blue-dark);
  padding: 0.5rem;
  border-radius: 0.375rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  /* 모바일 터치 최적화 */
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.calendar-nav-btn:active {
  background-color: var(--input-bg-1);
  transform: scale(0.95);
}

.calendar-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-login);
  margin: 0;
}
</style>
