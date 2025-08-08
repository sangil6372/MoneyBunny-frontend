import axios from './index';

// 💪(상일) 정책 상호작용 API (북마크, 신청)
export const policyInteractionAPI = {
  // ────────────────────────────────────────
  // 📌 북마크 관련 API
  // ────────────────────────────────────────
  
  // 사용자 북마크 목록 조회
  getBookmarks: () => axios.get('/api/policy-interaction/bookmark/list'),
  
  // 북마크 추가
  addBookmark: (policyId) => axios.post(`/api/policy-interaction/bookmark/${policyId}`),
  
  // 북마크 삭제
  removeBookmark: (policyId) => axios.delete(`/api/policy-interaction/bookmark/${policyId}`),

  // ────────────────────────────────────────
  // 📌 신청 관련 API  
  // ────────────────────────────────────────
  
  // 정책 신청 등록
  addApplication: (policyId) => axios.post(`/api/policy-interaction/application/${policyId}`),
  
  // 사용자 신청 목록 조회
  getApplications: () => axios.get('/api/policy-interaction/application/list'),
  
  // 정책 신청 완료 처리
  completeApplication: (policyId) => axios.put(`/api/policy-interaction/application/${policyId}/complete`),
  
  // 정책 신청 기록 삭제
  removeApplication: (policyId) => axios.delete(`/api/policy-interaction/application/${policyId}`),
  
  // 미완료 신청 정책 조회
  getIncompleteApplication: () => axios.get('/api/policy-interaction/application/incomplete')
};

// 💪(상일) 기존 bookmarkAPI 호환성 유지를 위한 export
export const bookmarkAPI = {
  getBookmarks: policyInteractionAPI.getBookmarks,
  addBookmark: policyInteractionAPI.addBookmark,
  removeBookmark: policyInteractionAPI.removeBookmark
};