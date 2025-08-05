<template>
  <div class="account-list-wrapper">
    <div class="account-header">
      <h3 class="header-title">내 계좌</h3>
      <div class="header-actions">
        <AddItemButton type="account" @click="isAccountModalOpen = true" />
        <AddItemModal
          v-if="isAccountModalOpen"
          :isOpen="isAccountModalOpen"
          type="account"
          @close="isAccountModalOpen = false"
        />
        <span class="drag-text">드래그로 순서 변경</span>
      </div>
    </div>

    <div class="account-list">
      <AccountItem
        v-for="account in visibleAccounts"
        :key="account.id"
        :account="account"
        @delete="$emit('delete-account', account)"
        @set-main="setMainItem"
      />
    </div>

    <button
      v-if="!showAll && accounts.length > 5"
      class="view-all-btn"
      @click="showAll = true"
    >
      전체 보기
    </button>
  </div>
</template>

<script setup>
import { ref, computed, toRef } from 'vue';
import AccountItem from './AccountItem.vue';
import AddItemButton from '@/pages/asset/component/common/AddItemButton.vue';
import AddItemModal from '@/pages/asset/component/common/AddItemModal.vue';
import { useMainItem } from '../utils/useMainItem';

const props = defineProps({ accounts: Array });
const emit = defineEmits(['delete-account', 'update-accounts']);

const showAll = ref(false);
const isAccountModalOpen = ref(false);

// 대표 계좌 관리 composable 사용
const { processedItems: processedAccounts, setMainItem } = useMainItem({
  type: 'account',
  items: toRef(props, 'accounts'),
  onUpdate: (reorderedAccounts) => emit('update-accounts', reorderedAccounts),
});

// 보여질 계좌 목록
const visibleAccounts = computed(() =>
  showAll.value ? processedAccounts.value : processedAccounts.value.slice(0, 3)
);
</script>

<style scoped>
/* 전체 컨테이너 */
.account-list-wrapper {
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  margin-top: 1rem;
}

/* 상단 헤더 */
.account-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--base-blue-dark);
  margin-top: 0.5rem;
  margin-left: 0.2rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.drag-text {
  font-size: 0.75rem;
  color: var(--text-lightgray);
}

/* 계좌 리스트 */
.account-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* 전체보기 버튼 */
.view-all-btn {
  width: 100%;
  margin-top: 1rem;
  padding: 0.6rem;
  background: none;
  border: 1px solid var(--base-blue-dark);
  border-radius: 0.5rem;
  color: var(--base-blue-dark);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}
.view-all-btn:hover {
  background: var(--base-blue-dark);
  color: white;
}
</style>
