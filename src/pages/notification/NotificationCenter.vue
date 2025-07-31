<template>
  <div>
    <!--헤더 추가-->
    <div class="notification-center">
      <NotificationTabSwitcher v-model="selectedTab" />

      <div v-if="filteredNotifications.length === 0">
        <NoNotification />
      </div>
      <div v-else>
        <NotificationList :items="filteredNotifications" />
      </div>
    </div>
  </div>
  <h1></h1>
</template>

<script setup>
import { ref, computed } from 'vue';
/*알림용 해더 추가 */
import NotificationHeader from './common/NotificationHeader.vue';
import NotificationTabSwitcher from './common/NotificationTabSwitcher.vue';
import NoNotification from './common/NoNotification.vue';
import NotificationList from './common/NotificationList.vue';

// 현재 선택된 탭
const selectedTab = ref('all');

// 전체 알림 데이터 (샘플)

const allNotifications = [
  {
    id: 101,
    type: 'policy',
    title: '경기 청년 지원금 신청 마감 임박',
    message:
      '북마크하신 경기 청년 지원금 신청이 3일 후 마감됩니다. 놓치지 마세요!',
    benefit: '월 10만원 × 6개월',
    dday: 3,
    date: '1월 20일',
    action: true,
  },
];

// 선택된 탭에 따라 알림 필터링
const filteredNotifications = computed(() => {
  if (selectedTab.value === 'all') return allNotifications;
  return allNotifications.filter((n) => n.type === selectedTab.value);
});
</script>
