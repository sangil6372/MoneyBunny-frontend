import axios from './index';

// 💪(상일) 북마크 관련 API 호출 함수들
export const bookmarkAPI = {
  // 사용자 북마크 목록 조회
  getBookmarks: () => axios.get('/api/policy-interaction/bookmark/list'),
  
  // 북마크 추가
  addBookmark: (policyId) => axios.post(`/api/policy-interaction/bookmark/${policyId}`),
  
  // 북마크 삭제
  removeBookmark: (policyId) => axios.delete(`/api/policy-interaction/bookmark/${policyId}`)
};