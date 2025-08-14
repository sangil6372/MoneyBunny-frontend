import { defineStore } from 'pinia';

export const usePolicyMatchingStore = defineStore('policyMatching', {
  state: () => ({
    recommendedPolicies: [],
  }),
  actions: {
    setRecommendedPolicies(policies) {
      this.recommendedPolicies = policies;
    },
    clearRecommendedPolicies() {
      this.recommendedPolicies = [];
    },
    // 💪(상일) 특정 정책을 목록에서 제거
    removePolicyById(policyId) {
      this.recommendedPolicies = this.recommendedPolicies.filter(
        policy => policy.policyId !== policyId
      );
    },
  },
});
