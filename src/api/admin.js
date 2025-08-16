// 💪(상일) 관리자 API 모듈
import apiClient from './index'

export const adminAPI = {
  // 💪(상일) 정책 데이터 동기화 API
  syncPolicyData() {
    return apiClient.get('/api/policy/sync')
  },

  // 💪(상일) GPT 프롬프트 관리 API들
  // 조건 관리
  getPromptConditions() {
    return apiClient.get('/api/admin/prompt/conditions')
  },
  
  createPromptCondition(condition) {
    return apiClient.post('/api/admin/prompt/conditions', condition)
  },
  
  updatePromptCondition(id, condition) {
    return apiClient.put(`/api/admin/prompt/conditions/${id}`, condition)
  },
  
  deletePromptCondition(id) {
    return apiClient.delete(`/api/admin/prompt/conditions/${id}`)
  },

  // 예시 관리
  getPromptExamples() {
    return apiClient.get('/api/admin/prompt/examples')
  },
  
  createPromptExample(example) {
    return apiClient.post('/api/admin/prompt/examples', example)
  },
  
  updatePromptExample(id, example) {
    return apiClient.put(`/api/admin/prompt/examples/${id}`, example)
  },
  
  deletePromptExample(id) {
    return apiClient.delete(`/api/admin/prompt/examples/${id}`)
  },

  // 계산 규칙 관리
  getCalculationRules() {
    return apiClient.get('/api/admin/prompt/calculation-rules')
  },
  
  createCalculationRule(rule) {
    return apiClient.post('/api/admin/prompt/calculation-rules', rule)
  },
  
  updateCalculationRule(id, rule) {
    return apiClient.put(`/api/admin/prompt/calculation-rules/${id}`, rule)
  },
  
  deleteCalculationRule(id) {
    return apiClient.delete(`/api/admin/prompt/calculation-rules/${id}`)
  },

  // 프롬프트 미리보기
  previewPrompt(sampleContent) {
    return apiClient.get('/api/admin/prompt/preview', {
      params: { sampleContent }
    })
  },

  // 💪(상일) CODEF 동기화 API들
  syncAccountData() {
    return apiClient.post('/api/codef/sync/accounts')
  },
  
  syncCardData() {
    return apiClient.post('/api/codef/sync/cards')
  },

  // 💪(상일) 알림 발송 API들
  sendTestNotification() {
    return apiClient.post('/api/push/admin/send-test')
  },

  sendBookmarkNotification() {
    return apiClient.post('/api/push/admin/bookmark-policy/send')
  },

  sendNewPolicyNotification() {
    return apiClient.post('/api/push/admin/new-policy/send')
  },

  sendTop3Notification() {
    return apiClient.post('/api/push/admin/top3/send')
  },

  sendFeedbackNotification() {
    return apiClient.post('/api/push/admin/feedback/send')
  },

  cleanupTokens() {
    return apiClient.post('/api/push/admin/tokens/cleanup')
  },

  sendAllNotifications() {
    return apiClient.post('/api/push/admin/send-all')
  },

  // 💪(상일) 리뷰 관리 API들
  getAllReviews() {
    return apiClient.get('/api/policy-interaction/review/all')
  },

  getPolicyReviews(policyId) {
    return apiClient.get(`/api/policy-interaction/review/${policyId}/list`)
  },

  deleteReviewsByPolicyId(policyId) {
    return apiClient.delete(`/api/policy-interaction/review/admin/${policyId}`)
  },

  deleteSingleReview(reviewId) {
    return apiClient.delete(`/api/policy-interaction/review/admin/single/${reviewId}`)
  }
}