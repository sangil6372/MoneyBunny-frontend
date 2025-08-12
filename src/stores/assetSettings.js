// stores/assetSettings.js
import { defineStore } from 'pinia';

export const useAccountSettingsStore = defineStore('accountSettings', {
  state: () => ({
    // === 계좌 설정 ===
    // 계좌 숨김 상태 관리 (계좌 ID별)
    hiddenBalances: {},
    // 계좌 별명 관리 (계좌 ID별)
    nicknames: {},
    // 대표 계좌 ID
    mainAccountId: null,

    // === 카드 설정 ===
    // 카드 금액 숨김 상태 관리 (카드 ID별)
    hiddenCardAmounts: {},
    // 카드 별명 관리 (카드 ID별)
    cardNicknames: {},
    // 대표 카드 ID
    mainCardId: null,
  }),

  getters: {
    // === 계좌 관련 Getters ===
    /**
     * 특정 계좌의 잔액 숨김 상태 확인
     * @param {string} accountId - 계좌 ID
     * @returns {boolean} - 숨김 여부
     */
    isBalanceHidden: (state) => (accountId) => {
      return state.hiddenBalances[accountId] || false;
    },

    /**
     * 특정 계좌의 별명 가져오기
     * @param {string} accountId - 계좌 ID
     * @returns {string|null} - 설정된 별명 또는 null
     */
    getAccountNickname: (state) => (accountId) => {
      return state.nicknames[accountId] || null;
    },

    /**
     * 대표 계좌 여부 확인
     * @param {string} accountId - 계좌 ID
     * @returns {boolean} - 대표 계좌 여부
     */
    isMainAccount: (state) => (accountId) => {
      return state.mainAccountId === accountId;
    },

    // === 카드 관련 Getters ===
    /**
     * 특정 카드의 금액 숨김 상태 확인
     * @param {string} cardId - 카드 ID
     * @returns {boolean} - 숨김 여부
     */
    isCardAmountHidden: (state) => (cardId) => {
      return state.hiddenCardAmounts[cardId] || false;
    },

    /**
     * 특정 카드의 별명 가져오기
     * @param {string} cardId - 카드 ID
     * @returns {string|null} - 설정된 별명 또는 null
     */
    getCardNickname: (state) => (cardId) => {
      return state.cardNicknames[cardId] || null;
    },

    /**
     * 대표 카드 여부 확인
     * @param {string} cardId - 카드 ID
     * @returns {boolean} - 대표 카드 여부
     */
    isMainCard: (state) => (cardId) => {
      return state.mainCardId === cardId;
    },
  },

  actions: {
    // === 계좌 관련 Actions ===
    /**
     * 잔액 숨김 상태 토글
     * @param {string} accountId - 계좌 ID
     * @param {boolean} isHidden - 숨김 여부 (선택적)
     */
    toggleBalanceVisibility(accountId, isHidden = null) {
      if (isHidden === null) {
        this.hiddenBalances[accountId] = !this.hiddenBalances[accountId];
      } else {
        this.hiddenBalances[accountId] = isHidden;
      }
      this.saveToLocalStorage();
    },

    /**
     * 계좌 별명 설정
     * @param {string} accountId - 계좌 ID
     * @param {string} nickname - 설정할 별명
     */
    setAccountNickname(accountId, nickname) {
      if (nickname && nickname.trim()) {
        this.nicknames[accountId] = nickname.trim();
      } else {
        delete this.nicknames[accountId];
      }
      this.saveToLocalStorage();
    },

    /**
     * 대표 계좌 설정
     * @param {string} accountId - 계좌 ID
     */
    setMainAccount(accountId) {
      this.mainAccountId = accountId;
      this.saveToLocalStorage();
    },

    /**
     * 계좌 삭제 시 관련 설정 정리
     * @param {string} accountId - 삭제할 계좌 ID
     */
    removeAccountSettings(accountId) {
      delete this.hiddenBalances[accountId];
      delete this.nicknames[accountId];

      // 대표 계좌였다면 해제
      if (this.mainAccountId === accountId) {
        this.mainAccountId = null;
      }

      this.saveToLocalStorage();
    },

    /**
     * 계좌 목록에 설정 적용
     * @param {Array} accounts - 원본 계좌 목록
     * @returns {Array} - 설정이 적용된 계좌 목록
     */
    applySettingsToAccounts(accounts) {
      return accounts.map((account) => ({
        ...account,
        accountName: this.getAccountNickname(account.id) || account.accountName,
        isMain: this.isMainAccount(account.id),
        hideBalance: this.isBalanceHidden(account.id),
      }));
    },

    // === 카드 관련 Actions ===
    /**
     * 카드 금액 숨김 상태 토글
     * @param {string} cardId - 카드 ID
     * @param {boolean} isHidden - 숨김 여부 (선택적)
     */
    toggleCardAmountVisibility(cardId, isHidden = null) {
      if (isHidden === null) {
        this.hiddenCardAmounts[cardId] = !this.hiddenCardAmounts[cardId];
      } else {
        this.hiddenCardAmounts[cardId] = isHidden;
      }
      this.saveToLocalStorage();
    },

    /**
     * 카드 별명 설정
     * @param {string} cardId - 카드 ID
     * @param {string} nickname - 설정할 별명
     */
    setCardNickname(cardId, nickname) {
      if (nickname && nickname.trim()) {
        this.cardNicknames[cardId] = nickname.trim();
      } else {
        delete this.cardNicknames[cardId];
      }
      this.saveToLocalStorage();
    },

    /**
     * 대표 카드 설정
     * @param {string} cardId - 카드 ID
     */
    setMainCard(cardId) {
      this.mainCardId = cardId;
      this.saveToLocalStorage();
    },

    /**
     * 카드 삭제 시 관련 설정 정리
     * @param {string} cardId - 삭제할 카드 ID
     */
    removeCardSettings(cardId) {
      delete this.hiddenCardAmounts[cardId];
      delete this.cardNicknames[cardId];

      // 대표 카드였다면 해제
      if (this.mainCardId === cardId) {
        this.mainCardId = null;
      }

      this.saveToLocalStorage();
    },

    /**
     * 카드 목록에 설정 적용
     * @param {Array} cards - 원본 카드 목록
     * @returns {Array} - 설정이 적용된 카드 목록
     */
    applySettingsToCards(cards) {
      return cards.map((card) => ({
        ...card,
        cardName: this.getCardNickname(card.id) || card.cardName,
        isRepresentative: this.isMainCard(card.id),
        hideAmount: this.isCardAmountHidden(card.id),
      }));
    },

    // === 공통 Actions ===
    /**
     * 로컬스토리지에 설정 저장
     */
    saveToLocalStorage() {
      try {
        const settings = {
          // 계좌 설정
          hiddenBalances: this.hiddenBalances,
          nicknames: this.nicknames,
          mainAccountId: this.mainAccountId,
          // 카드 설정
          hiddenCardAmounts: this.hiddenCardAmounts,
          cardNicknames: this.cardNicknames,
          mainCardId: this.mainCardId,
        };
        localStorage.setItem('assetSettings', JSON.stringify(settings));
      } catch (error) {
        console.error('자산 설정 저장 실패:', error);
      }
    },

    /**
     * 로컬스토리지에서 설정 불러오기
     */
    loadFromLocalStorage() {
      try {
        const saved = localStorage.getItem('assetSettings');
        if (saved) {
          const settings = JSON.parse(saved);
          // 계좌 설정
          this.hiddenBalances = settings.hiddenBalances || {};
          this.nicknames = settings.nicknames || {};
          this.mainAccountId = settings.mainAccountId || null;
          // 카드 설정
          this.hiddenCardAmounts = settings.hiddenCardAmounts || {};
          this.cardNicknames = settings.cardNicknames || {};
          this.mainCardId = settings.mainCardId || null;
        }
      } catch (error) {
        console.error('자산 설정 불러오기 실패:', error);
      }
    },

    /**
     * 모든 설정 초기화
     */
    resetAllSettings() {
      // 계좌 설정 초기화
      this.hiddenBalances = {};
      this.nicknames = {};
      this.mainAccountId = null;
      // 카드 설정 초기화
      this.hiddenCardAmounts = {};
      this.cardNicknames = {};
      this.mainCardId = null;

      localStorage.removeItem('assetSettings');
    },
  },
});
