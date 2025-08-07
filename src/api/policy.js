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

  // 정책 상세 조회
  getPolicyDetail: (policyId) => axios.get(`/api/policy/detail/${policyId}`),
};
