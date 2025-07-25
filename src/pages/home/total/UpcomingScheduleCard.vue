<template>
  <div class="schedule-card">
    <h2 class="title">이번 주 중요 일정</h2>
    <div class="schedule-list">
      <template v-if="scheduleItems.length > 0">
        <div
          v-for="(item, index) in scheduleItems"
          :key="index"
          class="schedule-item"
        >
          <p class="content">{{ item.title }}</p>
          <p class="datetime">{{ item.date }}</p>
        </div>
      </template>
      <div v-else class="no-schedule">이번 주 예정된 일정이 없습니다.</div>
    </div>
  </div>
</template>

<script>
//일정 부분은 추후 수정 예정
export default {
  name: 'UpcomingScheduleCard',
  data() {
    return {
      scheduleItems: [
        { title: '신한은행 적금 납입', date: '1월 15일 09:00' },
        { title: '신용카드 결제일', date: '1월 20일 14:00' },
        { title: '부동산 청약 신청', date: '2월 1일 09:00' },
      ],
    };
  },
};
</script>

<style scoped>
.schedule-card {
  background-color: white;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 0 0.625rem rgba(0, 0, 0, 0.03);
}

.title {
  font-size: 1.125rem;
  font-weight: 00;
  color: var(--text-login);
  margin-bottom: 0.75rem;
}

.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.schedule-item {
  background-color: var(--base-white-pink);
  border-radius: 0.625rem;
  padding: 0.625rem 1rem;
  transition: border 0.2s;
}

.content {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.125rem 0;
}

.datetime {
  font-size: 0.75rem;
  color: var(--text-bluegray);
  font-weight: 400;
  margin: 0.125rem;
}

.no-schedule {
  background-color: var(--base-white-pink);
  border-radius: 0.625rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: var(--text-bluegray);
  text-align: center;
  margin-top: 0.5rem; /* 제목과의 간격 확보 */
}
</style>
