<template>
  <div class="no-notification-container">
    <img
      src="@/assets/images/icons/notification/no_notification.png"
      alt="알림 없음"
      class="empty-icon"
    />
    <div class="title">새로운 알림이 없습니다</div>
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
};
</script>

<style scoped>
.no-notification-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* 세로 가운데 정렬 */
  /* height: calc(100vh - 60px); */
  padding: 48px 16px;
  text-align: center;
  color: #333;
}

.empty-icon {
  width: 100px;
  margin-bottom: 16px;
}

.title {
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 8px;
}

.description {
  font-size: 13px;
  color: #777;
  /* line-height: 1.4; */
  margin-bottom: 16px;
}

.button-group {
  display: flex;
  gap: 6px;
}

.btn {
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 13px;
  /* font-weight: bold; */
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
