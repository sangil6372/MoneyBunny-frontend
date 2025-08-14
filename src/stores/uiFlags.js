// src/stores/uiFlags.ts
import { defineStore } from 'pinia';

export const useUiFlagsStore = defineStore('uiFlags', {
  state: () => ({
    spendingDirty: false, // 지출 탭 데이터가 오래됐는지 표시
  }),
  actions: {
    markSpendingDirty() {
      this.spendingDirty = true;
    },
    clearSpendingDirty() {
      this.spendingDirty = false;
    },
  },
});
