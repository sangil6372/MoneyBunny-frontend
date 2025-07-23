<template>
  <div class="notification-all">
    <NotificationList :items="allNotifications" />
  </div>
</template>

<script setup>
// 테스트용 전체 알림 데이터 (실제로는 API나 상위에서 props로 받을 수도 있음)
import NotificationList from './common/NotificationList.vue';

const allNotifications = [
  {
    id: 1,
    type: 'feedback',
    title: '맞춤형 피드백',
    message: '저축률이 목표보다 5% 높아요!',
    date: '1월 15일',
  },
  {
    id: 2,
    type: 'policy',
    title: '지출 피크 알림',
    message: '이번 주 식비 지출이 평균보다 30% 증가했어요.',
    date: '1월 15일',
  },
  {
    id: 3,
    type: 'reminder',
    title: '일정 리마인더',
    message: '내일 오후 2시 은행 방문 예정입니다.',
    date: '1월 13일',
  },
];
</script>

<style scoped>
.notification-all {
  padding: 16px;
}
</style>
