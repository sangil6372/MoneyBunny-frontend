<template>
  <NotificationItem :is-read="item.read">
    <h3 class="title">{{ item.title }}</h3>
    <p class="message">{{ item.description }}</p>
    <div class="badges">
      <span v-if="item.benefit" class="badge">{{ item.benefit }}</span>
      <span v-if="item.dday" class="badge dday">D-{{ item.dday }}</span>
    </div>
    <div class="bottom">
      <small class="date">{{ formatDate(item.created_at || item.date) }}</small>
      <button 
        v-if="item.targetUrl" 
        class="action-btn"
        @click="handleButtonClick"
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

// 💪(상일) 날짜 포맷팅
const formatDate = (iso) => {
  if (!iso) return '';
  const date = new Date(iso);
  return isNaN(date) ? '' : `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

// 💪(상일) 타입별 버튼 텍스트 결정
const getButtonText = (type) => {
  switch (type) {
    case 'BOOKMARK': return '신청하기';
    case 'NEW_POLICY': return '보러가기';
    case 'TOP3': return '이동하기';
    case 'FEEDBACK': return '확인하기';
    default: return '보기';
  }
};

// 💪(상일) 타입별 라우팅 경로 결정
const getRoutePath = (type, targetUrl) => {
  switch (type) {
    case 'BOOKMARK':
    case 'NEW_POLICY':
      return targetUrl; // 상대 경로 (예: /policy/detail/828)
    case 'TOP3':
      return '/policy';
    case 'FEEDBACK':
      return '/asset';
    default:
      return targetUrl || '/';
  }
};

// 💪(상일) 버튼 클릭 처리 (읽음 처리 후 라우팅)
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
</script>

<style scoped>
.badges {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

.badge {
  font-size: 13px;
  background-color: #f1f3f5;
  padding: 4px 8px;
  border-radius: 6px;
  color: #333;
}

.dday {
  background-color: var(--alert-light-2);
  color: var(--alert-strong);
  font-weight: bold;
}

.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0; /* 💪(상일) 바디 메시지와 하단 영역 사이 공간 제거 */
}

.action-btn {
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}

</style>
