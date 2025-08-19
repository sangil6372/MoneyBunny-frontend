import axios from "axios";
import { useAuthStore } from "@/stores/auth";

// 동시에 여러 요청이 만료될 때 refresh를 1회만 수행하기 위한 큐
let isRefreshing = false;
let waiters = [];

function flushQueue(error, newToken) {
  waiters.forEach((p) => (error ? p.reject(error) : p.resolve(newToken)));
  waiters = [];
}

function isAuthPath(url = "") {
  return url.includes("/api/auth/");
}

// 요청 인터셉터: 토큰 부착 + CSRF 토큰 부착 + 사전 만료 체크
axios.interceptors.request.use(
  async (config) => {
    const auth = useAuthStore();

    // /api/auth/* 요청은 건너뜀
    if (!isAuthPath(config.url)) {
      // 토큰이 곧 만료되면 선제적으로 refresh 시도 (Cookie 기반이므로 refreshToken 체크 제거)
      try {
        if (auth.isTokenExpired()) {
          if (isRefreshing) {
            // 이미 다른 요청이 갱신 중이면 대기
            await new Promise((resolve, reject) => {
              waiters.push({
                resolve: () => resolve(),
                reject,
              });
            });
          } else {
            isRefreshing = true;
            await auth.refreshAccessToken();
            flushQueue(null, auth.state.token);
            isRefreshing = false;
          }
        }
      } catch (e) {
        flushQueue(e, null);
        isRefreshing = false;
        // 선제 refresh 실패는 여기서 막지 않고, 요청을 그대로 내보내고
        // 응답 인터셉터(401)에서 최종 처리
      }
    }

    // 헤더 초기화
    config.headers = config.headers || {};
    
    // Access Token 부착
    const token = auth.state.token;
    if (token && !isAuthPath(config.url)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // CSRF Token 부착 (모든 POST, PUT, DELETE 요청에)
    if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase()) && auth.state.csrfToken) {
      config.headers['X-CSRF-Token'] = auth.state.csrfToken;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401이면 refresh 후 원요청 1회 재시도
axios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    // 이미 재시도했거나 /api/auth/* 경로면 패스
    if (original?._retry || isAuthPath(original?.url)) {
      return Promise.reject(error);
    }

    if (status !== 401) {
      return Promise.reject(error);
    }

    const auth = useAuthStore();

    if (isRefreshing) {
      // 다른 요청이 갱신 중이면 대기 후 재시도
      return new Promise((resolve, reject) => {
        waiters.push({
          resolve: (newToken) => {
            original.headers = original.headers || {};
            original.headers.Authorization = `Bearer ${newToken}`;
            
            // CSRF 토큰도 다시 설정
            if (['post', 'put', 'delete', 'patch'].includes(original.method?.toLowerCase()) && auth.state.csrfToken) {
              original.headers['X-CSRF-Token'] = auth.state.csrfToken;
            }
            
            original._retry = true;
            resolve(axios(original));
          },
          reject,
        });
      });
    }

    try {
      isRefreshing = true;
      await auth.refreshAccessToken();
      flushQueue(null, auth.state.token);

      original.headers = original.headers || {};
      original.headers.Authorization = `Bearer ${auth.state.token}`;
      
      // CSRF 토큰도 다시 설정
      if (['post', 'put', 'delete', 'patch'].includes(original.method?.toLowerCase()) && auth.state.csrfToken) {
        original.headers['X-CSRF-Token'] = auth.state.csrfToken;
      }
      
      original._retry = true;
      return axios(original);
    } catch (e) {
      flushQueue(e, null);
      try {
        await auth.logout();
      } catch {}
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
);
