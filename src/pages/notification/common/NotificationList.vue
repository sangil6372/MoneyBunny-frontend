<template>
  <div class="notification-list">
    <component
      v-for="item in items"
      :key="item.id"
      :is="getComponent(item.type)"
      :item="item"
    />
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

import PolicyAlertCard from '../types/PolicyAlertCard.vue';
import FeedbackAlertCard from '../types/FeedbackAlertCard.vue';
import ReminderAlertCard from '../types/ReminderAlertCard.vue';
import NotificationItem from '../types/NotificationItem.vue'; // fallback

// props 정의
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

// 백엔드 알림 타입을 프론트엔드 타입으로 매핑
const mapNotificationType = (backendType) => {
  switch (backendType) {
    case 'BOOKMARK':
    case 'TOP3':
    case 'NEW_POLICY':
      return 'policy';
    case 'FEEDBACK':
      return 'feedback';
    default:
      return 'policy'; // 기본값
  }
};

// 알림 타입에 따라 렌더링할 컴포넌트 결정
const getComponent = (backendType) => {
  const mappedType = mapNotificationType(backendType);
  
  switch (mappedType) {
    case 'policy':
      return PolicyAlertCard;
    case 'feedback':
      return FeedbackAlertCard;
    case 'reminder':
      return ReminderAlertCard;
    default:
      return NotificationItem;
  }
};
</script>

<style scoped>
.notification-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center; /* 카드가 가운데 정렬됨 */
  padding: 0; /* 💪(상일) 패딩 제거 */
}
</style>
