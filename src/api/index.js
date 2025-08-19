import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import router from '@/router';

// 기본 인스턴스(1초)
const instance = axios.create({
  timeout: 5000,
  withCredentials: true, // Cookie 기반 인증을 위한 설정
});

// CODEF 전용 인스턴스 (5분)
const codefInstance = axios.create({
  timeout: 300000,
  withCredentials: true, // Cookie 기반 인증을 위한 설정
});

// 공통 인터셉터 함수
function applyAuthInterceptors(inst) {
  // 요청 인터셉터
  inst.interceptors.request.use(
    (config) => {
      const authStore = useAuthStore();
      const { getToken, isTokenExpired, logout, state } = authStore;
      const token = getToken();
      
      if (token) {
        if (isTokenExpired()) {
          console.warn('JWT 토큰이 만료되었습니다. 자동 로그아웃 처리');
          logout();
          router.push('/?error=token_expired');
          return Promise.reject({ error: '토큰이 만료되었습니다.' });
        }
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      
      // CSRF 토큰 추가 (POST, PUT, DELETE, PATCH 요청에)
      if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase()) && state.csrfToken) {
        config.headers['X-CSRF-Token'] = state.csrfToken;
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 응답 인터셉터
  inst.interceptors.response.use(
    (response) => {
      if (response.status === 200) return response;
      if (response.status === 404)
        return Promise.reject('404: 페이지 없음 ' + response.request);
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        const { logout } = useAuthStore();
        logout();
        router.push('/?error=login_required');
        return Promise.reject({ error: '로그인이 필요한 서비스입니다.' });
      }
      return Promise.reject(error);
    }
  );
}

applyAuthInterceptors(instance);
applyAuthInterceptors(codefInstance);

export { codefInstance }; // CODEF 전용 인스턴스
export default instance; // 일반 인스턴스
