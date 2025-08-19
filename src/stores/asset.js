import { ref } from 'vue';
import { defineStore } from 'pinia';
import { fetchAssetSummary } from '@/api/assetApi';

export const useAssetStore = defineStore('asset', () => {
  // 1. 상태값
  const summary = ref(null); // { totalAsset, thisMonthCardUsed, accounts, cards }
  const loading = ref(false);
  const error = ref(null);

  // 2. 요약 조회 함수
  const loadSummary = async (force = false) => {
    // 이미 summary가 있고, 강제 호출 아니면 스킵
    if (summary.value && !force) return;
    loading.value = true;
    error.value = null;
    try {
      const { data } = await fetchAssetSummary();
      summary.value = data;
    } catch (err) {
      error.value = err.response?.data?.message || '자산 요약 조회 실패';
    } finally {
      loading.value = false;
    }
  };

  // 3. 상태 초기화 (예: 로그아웃 시)
  const clearSummary = () => {
    summary.value = null;
    error.value = null;
  };

  // 수동 리셋 함수
  const $reset = () => {
    summary.value = null;
    loading.value = false;
    error.value = null;
  };

  return {
    summary,
    loading,
    error,
    loadSummary,
    clearSummary,
    $reset,
  };
});
