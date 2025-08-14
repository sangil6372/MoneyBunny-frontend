<template>
  <div class="account-item">
    <!-- 은행 로고 -->
    <img
      :src="getBankLogoByCode(account.bankCode)"
      :alt="`${getBankName(account.bankCode)} 로고`"
      class="bank-logo"
    />

    <!-- 계좌 정보 -->
    <div class="account-info" @click="openDetail">
      <div class="info-top">
        <div class="name-section">
          <!-- store에서 별명 적용된 이름 표시 -->
          <span class="account-name">{{ displayAccountName }}</span>
          <!-- 대표 뱃지를 계좌명 옆으로 이동 -->
          <span v-if="isMainAccount" class="main-badge">대표</span>
        </div>
        <!-- 설정 버튼을 오른쪽 끝으로 분리 -->
        <button class="settings-btn-inline" @click.stop="openSettingsModal">
          <img
            src="@/assets/images/icons/common/setting.png"
            alt="설정"
            class="setting-icon-inline"
          />
        </button>
      </div>

      <!-- 계좌번호와 복사 버튼 -->
      <div class="account-number-section">
        <p class="account-number">
          {{ getBankName(account.bankCode) }}
          {{ formatAccountNumber(account.accountNumber) }}
        </p>
        <button class="copy-btn" @click.stop="copyAccountNumber">
          <img
            src="@/assets/images/icons/common/copy.png"
            alt="복사"
            class="copy-icon"
          />
        </button>
      </div>

      <!-- 잔액 숨기기 적용 -->
      <p class="balance" v-if="!isBalanceHidden">
        {{ formatWon(account.balance) }}
      </p>
    </div>
  </div>

  <!-- 상세 모달 -->
  <DetailModal :visible="showDetail" @close="showDetail = false">
    <AccountDetail :accountData="enhancedAccount" @close="showDetail = false" />
  </DetailModal>

  <!-- 설정 모달 (하단에서 올라오는 모달) -->
  <AccountSettingsModal
    :key="`account-settings-${account.id}`"
    :visible="showSettingsModal"
    :account="enhancedAccount"
    @close="showSettingsModal = false"
    @copy-account="copyAccountNumber"
    @set-nickname="setAccountNickname"
    @set-main="handleSetMain"
    @toggle-balance="toggleBalanceVisibility"
  />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAccountSettingsStore } from '@/stores/assetSettings';
import DetailModal from '../detail/DetailModal.vue';
import AccountDetail from './AccountDetail.vue';
import AccountSettingsModal from './AccountSettingsModal.vue';
import { getBankLogoByCode } from '@/assets/utils/bankLogoMap.js';
import { getBankName } from '@/assets/utils/bankCodeMap.js';

const props = defineProps({
  account: { type: Object, required: true },
});

const emit = defineEmits([
  'set-main',
  'delete',
  'update-nickname',
  'toggle-balance',
]);

// Pinia store 사용
const accountSettings = useAccountSettingsStore();

const showDetail = ref(false);
const showSettingsModal = ref(false);

// 계산된 속성들
const displayAccountName = computed(() => {
  return (
    accountSettings.getAccountNickname(props.account.id) ||
    props.account.accountName
  );
});

const isMainAccount = computed(() => {
  return accountSettings.isMainAccount(props.account.id);
});

const isBalanceHidden = computed(() => {
  return accountSettings.isBalanceHidden(props.account.id);
});

// 설정이 적용된 계좌 객체
const enhancedAccount = computed(() => ({
  ...props.account,
  accountName: displayAccountName.value,
  isMain: isMainAccount.value,
  hideBalance: isBalanceHidden.value,
}));

const openDetail = () => (showDetail.value = true);
const openSettingsModal = () => (showSettingsModal.value = true);

const formatWon = (value) => `${value.toLocaleString()}원`;
const formatAccountNumber = (number) =>
  number.replace(/(\d{3})(\d{2,3})(\d{4,6})/, '$1-$2-$3');

// 계좌번호 복사 (간편 복사)
const copyAccountNumber = async () => {
  try {
    await navigator.clipboard.writeText(props.account.accountNumber);
    alert('계좌번호가 복사되었습니다.');
  } catch (error) {
    console.error('복사 실패:', error);
    alert('복사에 실패했습니다.');
  }
};

// 계좌 별명 설정 - store 사용
const setAccountNickname = (newNickname) => {
  accountSettings.setAccountNickname(props.account.id, newNickname);
  // 부모 컴포넌트에도 알림 (필요한 경우)
  emit('update-nickname', { ...props.account, accountName: newNickname });
  showSettingsModal.value = false;
};

// 대표 계좌 설정 - store 사용
const handleSetMain = () => {
  if (!isMainAccount.value) {
    accountSettings.setMainAccount(props.account.id);
    emit('set-main', props.account);
  }
  // 모달은 유지하고 UI만 업데이트됨
};

// 잔액 숨기기 토글 - store 사용
const toggleBalanceVisibility = () => {
  accountSettings.toggleBalanceVisibility(props.account.id);
  emit('toggle-balance', props.account.id, isBalanceHidden.value);
  // 모달은 닫지 않음
};
</script>

<style scoped>
.account-item {
  position: relative;
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--input-outline);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.75rem;
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
}

.account-item:active {
  transform: scale(0.98);
}

/* 은행 로고 */
.bank-logo {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  object-fit: contain;
  flex-shrink: 0;
}

/* 계좌 정보 */
.account-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.info-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  width: 100%;
}

.name-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.bank-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--base-blue-dark);
}

.account-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-darkgray);
  /* 긴 계좌명 말줄임표 처리 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* 대표 뱃지 - 라벤더 색상으로 변경 */
.main-badge {
  background: var(--base-lavender);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  flex-shrink: 0;
}

/* 인라인 설정 버튼 - 패딩 원래대로 복구 */
.settings-btn-inline {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.settings-btn-inline:hover {
  background: var(--input-bg-1);
}

.setting-icon-inline {
  width: 0.75rem;
  height: 0.75rem;
  opacity: 0.5;
  transition: opacity 0.2s ease;
  object-fit: contain;
  object-position: center;
}

.settings-btn-inline:hover .setting-icon-inline {
  opacity: 0.8;
}

/* 계좌번호와 복사 버튼 섹션 */
.account-number-section {
  display: flex;
  align-items: center;
  gap: 0.25rem; /* 계좌번호와 복사 버튼 사이 간격 축소 */
  margin: 0.25rem 0;
}

.account-number {
  font-size: 0.75rem;
  color: var(--text-lightgray);
  margin: 0;
  /* 긴 계좌번호 말줄임표 처리 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1; /* 필요시 축소 가능 */
}

/* 복사 버튼 */
.copy-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  flex-shrink: 0;

  /* 모바일 터치 최적화 */
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.copy-btn:active {
  background: var(--input-bg-1);
  transform: scale(0.95);
}

.copy-icon {
  width: 1rem;
  height: 1rem;
  opacity: 0.5;
  transition: opacity 0.2s ease;
  object-fit: contain;
}

.copy-btn:active .copy-icon {
  opacity: 0.8;
}

.balance {
  font-size: 1rem;
  font-weight: 600;
  color: var(--base-blue-dark);
  margin: 0;
}

.balance.hidden {
  color: var(--text-lightgray);
  font-size: 0.9rem;
  font-style: italic;
}
</style>
