<template>
  <div>
    <!--헤더 추가-->
    <div class="notification-center">
      <NotificationTabSwitcher v-model="selectedTab" />

      <!-- 로딩 상태 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">알림을 불러오는 중...</p>
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="error" class="error-container">
        <p class="error-text">알림을 불러오는데 실패했습니다.</p>
        <button @click="fetchNotifications" class="retry-btn">다시 시도</button>
      </div>

      <!-- 날짜별 그룹 알림 목록 -->
      <div v-else-if="visibleGroups.length === 0">
        <NoNotification @open-settings="showSettingsModal = true" />
      </div>
      <div v-else class="grouped-notifications">
        <div
          v-for="groupKey in visibleGroups"
          :key="groupKey"
          class="notification-group"
        >
          <div class="group-header">
            <h3 class="group-title">{{ getGroupTitle(groupKey) }}</h3>
            <div class="group-divider"></div>
          </div>
          <NotificationList :items="groupedNotifications[groupKey]" />
        </div>
      </div>
    </div>

    <!-- 알림 설정 모달 -->
    <NotificationSettingsModal 
      v-if="showSettingsModal" 
      @close="showSettingsModal = false" 
    />
  </div>
  <h1></h1>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
/*알림용 해더 추가 */
import NotificationHeader from './common/NotificationHeader.vue';
import NotificationTabSwitcher from './common/NotificationTabSwitcher.vue';
import NoNotification from './common/NoNotification.vue';
import NotificationList from './common/NotificationList.vue';
import NotificationSettingsModal from '@/pages/mypage/modals/NotificationSettingsModal.vue';
import { useNotificationStore } from '@/stores/notification';

// 현재 선택된 탭
const selectedTab = ref('all');

// 알림 설정 모달 상태
const showSettingsModal = ref(false);

// Pinia 스토어 사용
const notificationStore = useNotificationStore();
const { notifications, loading, error } = storeToRefs(notificationStore);
const { fetchNotifications } = notificationStore;

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

// 날짜별 그룹핑을 위한 유틸리티 함수
const getDateGroup = (date) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (targetDate.getTime() === today.getTime()) {
    return 'today';
  } else if (targetDate.getTime() === yesterday.getTime()) {
    return 'yesterday';
  } else if (targetDate >= sevenDaysAgo) {
    return 'recent7';
  } else if (targetDate >= thirtyDaysAgo) {
    return 'recent30';
  } else {
    return 'older';
  }
};

// 날짜별로 그룹핑된 알림 목록
const groupedNotifications = computed(() => {
  const filtered =
    selectedTab.value === 'all'
      ? notifications.value
      : notifications.value.filter((notification) => {
          const mappedType = mapNotificationType(notification.type);
          return mappedType === selectedTab.value;
        });

  const groups = {
    today: [],
    yesterday: [],
    recent7: [],
    recent30: [],
  };

  filtered.forEach((notification) => {
    const date = notification.created_at;
    if (date) {
      const group = getDateGroup(date);
      if (groups[group]) {
        groups[group].push(notification);
      }
    }
  });

  // 각 그룹 내에서 최신순 정렬
  Object.keys(groups).forEach((key) => {
    groups[key].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  });

  return groups;
});

// 그룹별 제목 매핑
const getGroupTitle = (groupKey) => {
  const titles = {
    today: '오늘',
    yesterday: '어제',
    recent7: '최근 7일',
    recent30: '최근 30일',
  };
  return titles[groupKey] || '';
};

// 표시할 그룹들 (빈 그룹 제외)
const visibleGroups = computed(() => {
  return Object.keys(groupedNotifications.value).filter(
    (key) => groupedNotifications.value[key].length > 0
  );
});

// 컴포넌트 마운트 시 알림 데이터 조회
onMounted(async () => {
  await fetchNotifications();
});
</script>

<style scoped>
.notification-center {
  min-height: 100vh;
  padding: 0; /* 패딩 제거 */
  background-color: #f8f9fa;
}

/* 로딩 상태 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--base-blue-dark);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-text {
  color: var(--text-lightgray);
  font-size: 14px;
  margin: 0;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 에러 상태 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.error-text {
  color: var(--text-lightgray);
  font-size: 14px;
  margin: 0 0 16px 0;
  text-align: center;
}

.retry-btn {
  padding: 10px 20px;
  background-color: var(--base-blue-dark);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  /* transition: background-color 0.2s; */
}

.retry-btn:hover {
  background-color: var(--base-blue);
}

/* 날짜별 그룹 스타일 */
.grouped-notifications {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.notification-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 첫 번째 그룹 상단 여백 추가 */
.notification-group:first-child {
  margin-top: 20px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
}

.group-title {
  font-size: 16px;
  font-weight: bold;
  color: var(--text-login);
  margin: 0;
  white-space: nowrap;
}

.group-divider {
  flex: 1;
  height: 1px;
  background-color: #e9ecef;
}
</style>
