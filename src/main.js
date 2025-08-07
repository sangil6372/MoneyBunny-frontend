import './assets/styles/fonts.css';
import './assets/styles/colors.css';
import './assets/styles/main.css';

import 'bootstrap/dist/css/bootstrap.css';
import 'vue-awesome-paginate/dist/style.css'; // 페이지네이션 스타일

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueAwesomePaginate from 'vue-awesome-paginate'; // 페이지네이션 컴포넌트

import App from './App.vue';
import router from './router';
import { registerServiceWorker } from './firebase/registerServiceWorker';
import { checkPermissionOnAppStart } from './firebase/notificationPermission';
import { setupForegroundMessageListener } from './firebase/foregroundMessage';

const app = createApp(App);

app.use(VueAwesomePaginate); // 전역 컴포넌트 등록
app.use(createPinia());
app.use(router);

app.mount('#app');

// 💪(상일) 서비스 워커 등록
registerServiceWorker();

// 💪(상일) 앱 시작 시 알림 권한 체크 및 토큰 정리
checkPermissionOnAppStart();

// 💪(상일) 포그라운드 메시지 리스너 설정
setupForegroundMessageListener();

// 💪(상일) 페이지 포커스 시 미읽은 알림 개수 새로고침 - 특정 라우트에서만
window.addEventListener('focus', async () => {
  try {
    // 현재 라우트 확인
    const currentPath = window.location.pathname;
    const targetRoutes = ['/home', '/asset', '/policy', '/mypage'];
    
    if (targetRoutes.some(routePath => currentPath.startsWith(routePath))) {
      const { useNotificationStore } = await import('@/stores/notification');
      const notificationStore = useNotificationStore();
      await notificationStore.fetchUnreadCount();
      console.log('🔍 페이지 포커스 - 미읽은 알림 개수 새로고침');
    }
  } catch (error) {
    console.error('미읽은 알림 개수 새로고침 실패:', error);
  }
});
