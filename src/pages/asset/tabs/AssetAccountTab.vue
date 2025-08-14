<template>
  <div class="asset-account-tab">
    <!-- 계좌 탭 컨텐츠 -->
    <div class="tab-content">
      <!-- 계좌 목록 -->
      <div v-if="accounts.length > 0">
        <AccountList
          :accounts="accounts"
          @delete-account="deleteAccount"
          @update-accounts="onUpdateAccounts"
        />
      </div>

      <!-- 데이터 없을 때 -->
      <div v-else>
        <NoDataCard type="account" @add="onAddAccount" />
      </div>
    </div>
  </div>
</template>

<script setup>
import AccountList from '../component/account/AccountList.vue';
import NoDataCard from '../component/common/NoDataCard.vue';

const props = defineProps({
  accounts: { type: Array, required: true },
});

const emit = defineEmits(['delete-account', 'update-accounts']);

// 계좌 삭제: 부모로 이벤트 전달
const deleteAccount = (account) => {
  emit('delete-account', account);
};

// 계좌 배열 변경(정렬/대표변경 등): 부모로 이벤트 전달
const onUpdateAccounts = (accounts) => {
  emit('update-accounts', accounts);
};

const onAddAccount = () => {
  // 계좌 추가 로직
  alert('계좌 추가 기능!');
};
</script>

<style scoped>
.asset-account-tab {
  padding: 0;
  margin: 0;
}

.tab-content {
  margin-top: 0;
}

.tab-content > * {
  margin-bottom: 1rem;
}

.tab-content > *:last-child {
  margin-bottom: 0;
}
</style>
