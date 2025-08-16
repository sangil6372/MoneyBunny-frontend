import axios from './index';

// 정책 관련 API 호출 함수 모음
export const policyAPI = {
  // 사용자 정책 정보 조회
  getUserPolicy: () => axios.get('/api/userPolicy'),

  // 사용자 정책 정보 저장 (신규)
  createUserPolicy: (payload) => axios.post('/api/userPolicy', payload),

  // 사용자 정책 정보 수정
  updateUserPolicy: (payload) => axios.put('/api/userPolicy', payload),

  // 사용자 정책 정보 삭제
  deleteUserPolicy: () => axios.delete('/api/userPolicy'),

  // 정책 검색 (POST: 조건검색)
  searchUserPolicy: (payload) => axios.post('/api/userPolicy/search', payload),

  // 정책 검색 (GET: 전체/추천/기본)
  getUserPolicySearch: () => axios.get('/api/userPolicy/search'),

  // 인기 검색어
  getUserPolicyPopularKeywords: () =>
    axios.get('/api/userPolicy/popular-keywords'),

  // 최근 검색어
  getUserPolicyRecentKeywords: () =>
    axios.get('/api/userPolicy/recent-keywords'),

  // 최근 검색어 전체 삭제
  clearAllRecentKeywords: () => axios.delete('/api/userPolicy/recent-keywords'),

  // 선택한 최근 검색어 삭제
  removeRecentKeyword: (keyword) =>
    axios.delete(
      `/api/userPolicy/recent-keywords/${encodeURIComponent(keyword)}`
    ),

  // 정책 상세 조회
  getPolicyDetail: (policyId) => axios.get(`/api/policy/detail/${policyId}`),

  // 정책 조회수 TOP3 (추천)
  getTop3Views: () => axios.get('/api/userPolicy/search/top3-views'),

  // 정책 조회수 TOP3 (전체) - 조건 없이 is_financial_support=1 정책을 조회수 순으로 topN 반환
  getTop3ViewsAll: () => axios.get('/api/userPolicy/search/top-views/all'),
};
