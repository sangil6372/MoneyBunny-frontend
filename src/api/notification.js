import axios from './index';

// 알림 조회 API
export const notificationAPI = {
  // 전체 알림 목록 조회
  getNotifications: () => axios.get('/api/push/notifications'),
  
  // 읽지 않은 알림 조회
  getUnreadNotifications: () => axios.get('/api/push/notifications/unread'),
  
  // 읽지 않은 알림 개수 조회
  getUnreadCount: () => axios.get('/api/push/notifications/unread/count'),
  
  // 알림 읽음 처리
  markAsRead: (notificationId) => axios.put(`/api/push/notifications/${notificationId}/read`),
  
  // 알림 삭제
  deleteNotification: (notificationId) => axios.delete(`/api/push/notifications/${notificationId}`),
};

// 구독 관리 API
export const subscriptionAPI = {
  // FCM 토큰 등록 및 초기 알림 설정
  subscribe: (data) => axios.post('/api/push/subscriptions', data),
  
  // 현재 구독 상태 조회
  getStatus: (token) => axios.get('/api/push/subscriptions/status', { params: { token } }),
  
  // 개별 알림 타입 토글
  toggleBookmark: (data) => axios.put('/api/push/subscriptions/bookmark', data),
  toggleTop3: (data) => axios.put('/api/push/subscriptions/top3', data),
  toggleNewPolicy: (data) => axios.put('/api/push/subscriptions/new-policy', data),
  toggleFeedback: (data) => axios.put('/api/push/subscriptions/feedback', data),
};