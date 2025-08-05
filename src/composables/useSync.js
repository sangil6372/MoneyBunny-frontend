// src/composables/useSync.js
import { ref } from 'vue';
import { syncAccounts, syncCards } from '@/api/assetApi';
import { useAssetStore } from '@/stores/asset';

const SYNC_KEYS = {
  account: 'lastSyncTime_account',
  card: 'lastSyncTime_card',
  main: 'lastSyncTime_main',
};

export function useSync(type = 'account') {
  const isSyncing = ref(false);
  const syncMessage = ref('');

  function getLastSync() {
    return Number(localStorage.getItem(SYNC_KEYS[type]) || '0');
  }
  function setLastSync(ts = Date.now()) {
    localStorage.setItem(SYNC_KEYS[type], ts.toString());
  }
  function isSyncedWithin10Min() {
    const last = getLastSync();
    return Date.now() - last < 10 * 60 * 1000;
  }

  // 계좌, 카드, 메인 구분
  async function syncWithUX(force = false) {
    if (isSyncing.value) return;
    if (!force && isSyncedWithin10Min()) {
      syncMessage.value = '최근 10분 이내에 이미 동기화 했어요!';
      setTimeout(() => (syncMessage.value = ''), 2000);
      return;
    }
    try {
      isSyncing.value = true;
      syncMessage.value = '동기화 중...';
      if (type === 'account') await syncAccounts();
      else if (type === 'card') await syncCards();
      // main 동기화는 필요시 구현
      setLastSync();

      // 👇 이 한줄! 동기화 후 summary 최신화!
      const assetStore = useAssetStore();
      await assetStore.loadSummary();

      syncMessage.value = '동기화 완료!';
      setTimeout(() => (syncMessage.value = ''), 2000);
    } catch (e) {
      syncMessage.value = '동기화 실패! 잠시 후 다시 시도해 주세요.';
      setTimeout(() => (syncMessage.value = ''), 2000);
    } finally {
      isSyncing.value = false;
    }
  }

  return {
    isSyncing,
    syncMessage,
    syncWithUX,
    isSyncedWithin10Min,
  };
}
