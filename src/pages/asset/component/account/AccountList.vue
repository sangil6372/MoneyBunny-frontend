<template>
  <div class="account-list-simple">
    <!-- 계좌 아이템들 -->
    <AccountItem
      v-for="account in visibleAccounts"
      :key="account.id"
      :account="account"
      @delete="$emit('delete-account', account)"
      @set-main="setMainItem"
      @update-nickname="updateAccountNickname"
      @toggle-balance="toggleAccountBalance"
    />

    <!-- 계좌 추가 버튼 -->
    <AddItemButton type="account" @click="isAccountModalOpen = true" />

    <!-- 전체보기 버튼 -->
    <button
      v-if="!showAll && accounts.length > 3"
      class="view-all-btn"
      @click="showAll = true"
    >
      전체 보기
    </button>

    <!-- 계좌 추가 모달 -->
    <AddItemModal
      v-if="isAccountModalOpen"
      :isOpen="isAccountModalOpen"
      type="account"
      @close="isAccountModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, toRef, onMounted } from 'vue';
import { useAccountSettingsStore } from '@/stores/assetSettings';
import AccountItem from './AccountItem.vue';
import AddItemButton from '@/pages/asset/component/common/AddItemButton.vue';
import AddItemModal from '@/pages/asset/component/common/AddItemModal.vue';
import { useMainItem } from '../utils/useMainItem';

const props = defineProps({
  accounts: { type: Array, required: true },
});

const emit = defineEmits(['delete-account', 'update-accounts']);

// Pinia store 사용
const accountSettings = useAccountSettingsStore();

const showAll = ref(false);
const isAccountModalOpen = ref(false);

// 컴포넌트 마운트 시 로컬스토리지에서 설정 불러오기
onMounted(() => {
  accountSettings.loadFromLocalStorage();
});

// 설정이 적용된 계좌 목록
const processedAccountsWithSettings = computed(() => {
  return accountSettings.applySettingsToAccounts(props.accounts);
});

// 대표 계좌 관리 composable 사용 (설정이 적용된 계좌 목록 사용)
const { processedItems: processedAccounts, setMainItem } = useMainItem({
  type: 'account',
  items: processedAccountsWithSettings,
  onUpdate: (reorderedAccounts) => {
    // 대표 계좌 변경 시 store에도 반영
    const mainAccount = reorderedAccounts.find((acc) => acc.isMain);
    if (mainAccount) {
      accountSettings.setMainAccount(mainAccount.id);
    }
    emit('update-accounts', reorderedAccounts);
  },
});

// 보여질 계좌 목록
const visibleAccounts = computed(() =>
  showAll.value ? processedAccounts.value : processedAccounts.value.slice(0, 3)
);

// 계좌 별명 업데이트 (store를 통해 이미 처리되므로 부모에게만 알림)
const updateAccountNickname = (updatedAccount) => {
  // store에서 이미 처리되었으므로 부모 컴포넌트에만 알림
  const updatedAccounts = props.accounts.map((acc) =>
    acc.id === updatedAccount.id
      ? { ...acc, accountName: updatedAccount.accountName }
      : acc
  );
  emit('update-accounts', updatedAccounts);
};

// 잔액 숨기기 토글 (store를 통해 이미 처리됨)
const toggleAccountBalance = (accountId, isHidden) => {
  console.log(`계좌 ${accountId} 잔액 숨기기: ${isHidden} (store에서 처리됨)`);
  // store에서 이미 처리되었으므로 추가 작업 불필요
};
</script>

<style scoped>
.account-list-simple {
  display: flex;
  flex-direction: column;
  gap: 0;
  /* margin-top: 1rem; */
}

/* 전체보기 버튼 */
.view-all-btn {
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: 1px solid var(--base-blue-dark);
  border-radius: 6px;
  color: var(--base-blue-dark);
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  margin: 0.5rem 0;
}

/* .view-all-btn:hover {
  background: var(--base-blue-dark);
  color: white;
} */
</style>
