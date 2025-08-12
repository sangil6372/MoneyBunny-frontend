<template>
  <div class="account-tab">
    <!-- 상단 요약 카드 -->
    <SummaryCard
      title="총 계좌 잔액"
      :mainAmount="totalBalance"
      rightLabel="계좌 수"
      :rightValue="accounts.length"
      rightUnit="개"
    />

    <!-- 계좌 목록 (단순화된 리스트 사용) -->
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
</template>

<script setup>
import { computed } from 'vue';
import SummaryCard from '../component/common/SummaryCard.vue';
import AccountList from '../component/account/AccountList.vue';
import NoDataCard from '../component/common/NoDataCard.vue';

const props = defineProps({
  accounts: { type: Array, required: true },
});

const emit = defineEmits(['delete-account', 'update-accounts']);

// 총 계좌 잔액 계산
const totalBalance = computed(() =>
  props.accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0)
);

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
.account-tab {
  padding: 1rem;
}
</style>
