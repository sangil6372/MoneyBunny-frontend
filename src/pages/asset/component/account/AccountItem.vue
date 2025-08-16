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
      <div class="account-number-row">
        <p class="account-number">
          {{ getBankName(account.bankCode) }}
          {{ formatAccountNumber(account.accountNumber) }}
        </p>
        <button
          class="copy-btn"
          @click.stop="copyAccountNumber"
          aria-label="계좌번호 복사"
        >
          <img
            src="@/assets/images/icons/signup/copy.png"
            alt=""
            class="copy-icon"
          />
        </button>
      </div>

      <!-- 잔액 -->
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

  <transition name="fade">
    <div v-if="toast.show" class="toast">{{ toast.text }}</div>
  </transition>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useAccountSettingsStore } from '@/stores/assetSettings';
import DetailModal from '../detail/DetailModal.vue';
import AccountDetail from './AccountDetail.vue';
import AccountSettingsModal from './AccountSettingsModal.vue';
import { getBankLogoByCode } from '@/assets/utils/bankLogoMap.js';
import { getBankName } from '@/assets/utils/bankCodeMap.js';
import Toast from '@/components/common/Toast.vue';

const toast = ref({ show: false, text: '', timer: null });

const showToast = (msg = '계좌번호가 복사되었습니다.', ms = 1500) => {
  clearTimeout(toast.value.timer);
  toast.value.text = msg;
  toast.value.show = true;
  toast.value.timer = setTimeout(() => (toast.value.show = false), ms);
};
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

// 계좌번호 복사 (토스트 알림)
const copyAccountNumber = async () => {
  try {
    await navigator.clipboard.writeText(props.account.accountNumber);
    showToast(); // 성공
  } catch (error) {
    console.error('복사 실패:', error);
    showToast('복사에 실패했습니다.'); // 실패 문구
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
  border-radius: 6px;
  padding: 12px;
  border: 1px solid var(--input-outline);
  display: flex;
  align-items: center;
  gap: 0.85rem;
  cursor: pointer;
  margin-bottom: 0.65rem;
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
}

.account-item:active {
  transform: scale(0.98);
}

/* 은행 로고 */
.bank-logo {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: contain;
  flex-shrink: 0;
}

/* 계좌 정보 */
.account-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.info-top {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 4px;
}

.name-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  /* margin-bottom: 3px; */
}

.bank-name {
  font-size: 0.75rem;
  font-weight: bold;
  color: var(--base-blue-dark);
}

.account-name {
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--text-darkgray);
  /* 긴 계좌명 말줄임표 처리 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 2rem);
}

.main-badge {
  background: #a5b8d6;
  color: white;
  font-size: 0.625rem;
  padding: 0.15rem 0.4rem;
  border-radius: 6px;
}

/* 인라인 설정 버튼 - 패딩 원래대로 복구 */
.settings-btn-inline {
  position: absolute;
  top: 50%; /* info-top 높이의 가운데 */
  right: 0; /* 오른쪽 끝 고정 */
  transform: translateY(-50%); /* 가운데 정렬 보정 */
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
}

.setting-icon-inline {
  width: 0.85rem;
  height: 0.85rem;
  opacity: 0.75;
  object-fit: contain;
  object-position: center;
}

.settings-btn-inline:hover .setting-icon-inline {
  opacity: 0.8;
}

.account-number {
  margin: 0;
  font-size: 0.7rem;
  color: var(--text-lightgray);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  letter-spacing: 0.1px;
}
.account-number-row {
  display: inline-flex;
  align-items: center;
  /* justify-content: flex-start; */
  gap: 4px;
  margin: 2px 0 4px;
  min-width: 0;
}

.copy-btn {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.copy-icon {
  width: 14px;
  height: 14px;
  opacity: 0.6;
  transform: translateY(1px);
  object-fit: contain;
}

.balance {
  font-size: 0.95rem;
  font-weight: bold;
  color: var(--base-blue-dark);
  margin: 2px 0 0;
}

.balance.hidden {
  color: var(--text-lightgray);
  font-size: 0.8rem;
  font-style: italic;
}

.toast {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translateX(-50%);
  max-width: 390px;
  padding: 8px 14px;
  border-radius: 6px;
  background: rgba(24, 24, 27, 0.92);
  color: #fff;
  font-size: 0.7rem;
  z-index: 2147483647;
  pointer-events: none;
  text-align: center;
  word-break: keep-all;
}
</style>
