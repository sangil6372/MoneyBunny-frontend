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
  },
});
