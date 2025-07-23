<template>
  <div class="no-notification-container">
    <img
      src="@/assets/images/icons/notification/no_notification.png"
      alt="알림 없음"
      class="empty-icon"
    />
    <h2 class="title">새로운 알림이 없습니다</h2>
    <p class="description">
      현재 확인할 알림이 없어요.<br />
      새로운 알림이 오면 여기에 표시됩니다.
    </p>
    <div class="button-group">
      <button class="btn primary" @click="goToSettings">알림 설정</button>
      <button class="btn secondary" @click="refreshList">새로고침</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

//알림 설정
const goToSettings = () => {
  router.push('/mypage'); // 마이페이지 메인 경로로 이동
};

//알림 새로고침
const refreshList = () => {
  // 알림 목록 새로고침 기능
  console.log('알림 새로고침');
};
</script>

<style scoped>
.no-notification-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* 세로 가운데 정렬 */

  height: calc(100vh - 60px); /* 헤더 제외 시 */
  padding: 48px 16px;
  text-align: center;
  color: #333;
}

.empty-icon {
  width: 100px;
  margin-bottom: 24px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.description {
  font-size: 14px;
  color: #777;
  line-height: 1.4;
  margin-bottom: 24px;
}

.button-group {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.btn.primary {
  background-color: var(--base-blue-dark);
  color: #fff;
}

.btn.secondary {
  background-color: #fff;
  border: 1px solid #ccc;
  color: #333;
}
</style>
