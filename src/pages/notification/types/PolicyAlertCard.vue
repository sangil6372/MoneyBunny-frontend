<template>
  <NotificationItem
    :is-read="item.read"
    :notification-type="item.type"
    @delete="handleDelete"
    @card-click="handleButtonClick"
  >
    <div class="title">{{ item.title }}</div>
    <p class="message">{{ item.description }}</p>
    <div class="bottom">
      <small class="date">{{ formatDate(item.created_at || item.date) }}</small>
      <button
        v-if="item.targetUrl"
        class="action-btn"
        @click.stop="handleButtonClick"
        @touchstart.stop=""
        @touchend.stop=""
        @mousedown.stop=""
        @mouseup.stop=""
      >
        {{ getButtonText(item.type) }}
      </button>
    </div>
  </NotificationItem>
</template>

<script setup>
import { useRouter } from 'vue-router';
import NotificationItem from './NotificationItem.vue';
import { useNotificationStore } from '@/stores/notification';

const props = defineProps({ item: Object });
const router = useRouter();
const notificationStore = useNotificationStore();

// 날짜 포맷팅
const formatDate = (iso) => {
  if (!iso) return '';
  const date = new Date(iso);
  return isNaN(date) ? '' : `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

// 타입별 버튼 텍스트 결정
const getButtonText = (type) => {
  switch (type) {
    case 'BOOKMARK':
      return '신청하기';
    case 'NEW_POLICY':
      return '보러가기';
    case 'TOP3':
      return '이동하기';
    case 'FEEDBACK':
      return '확인하기';
    default:
      return '보기';
  }
};

// 타입별 라우팅 경로 결정
const getRoutePath = (type, targetUrl) => {
  switch (type) {
    case 'BOOKMARK':
    case 'NEW_POLICY':
      return targetUrl; // 상대 경로 (예: /policy/detail/828)
    case 'TOP3':
      return '/policy';
    case 'FEEDBACK':
      return '/asset?tab=지출';
    default:
      return targetUrl || '/';
  }
};

// 버튼 클릭 처리 (읽음 처리 후 라우팅)
const handleButtonClick = async () => {
  try {
    // 읽음 처리
    if (!props.item.read) {
      await notificationStore.markAsRead(props.item.id);
    }

    // 라우팅
    const path = getRoutePath(props.item.type, props.item.targetUrl);
    router.push(path);
  } catch (error) {
    console.error('알림 처리 실패:', error);
    // 에러가 발생해도 라우팅은 실행
    const path = getRoutePath(props.item.type, props.item.targetUrl);
    router.push(path);
  }
};

// 알림 삭제 처리
const handleDelete = async () => {
  try {
    await notificationStore.deleteNotification(props.item.id);
  } catch (error) {
    console.error('알림 삭제 실패:', error);
    alert('알림 삭제에 실패했습니다.');
  }
};
</script>

<style scoped>
.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-btn {
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  flex-shrink: 0; /* 버튼이 줄어들지 않도록 */
  min-width: 60px; /* 최소 너비 보장 */
}
</style>
