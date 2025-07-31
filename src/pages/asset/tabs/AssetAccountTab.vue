<template>
  <div class="account-tab">
    <!-- 상단 요약 카드 -->
    <AccountSummaryCard
      :totalBalance="totalBalance"
      :monthlyChange="monthlyChange"
      :accountCount="accounts.length"
    />

    <!-- 계좌 유무에 따른 조건부 표시 -->
    <div v-if="accounts.length > 0">
      <!-- 상단 컨트롤 바 -->
      <AccountControllerBar @add-account="onAddAccount" />
      <!-- 계좌 리스트 -->
      <AccountList
        :accounts="processedAccounts"
        @delete-account="deleteAccount"
        @set-main="setMainAccount"
      />
    </div>
    <div v-else>
      <!-- 계좌 없음 -->
      <NoDataCard type="account" @add="onAddAccount" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AccountSummaryCard from '../account/AccountSummaryCard.vue';
import AccountList from '../account/AccountList.vue';
import NoDataCard from '../common/NoDataCard.vue';
import accountsData from '@/assets/data/accounts.json'; //계좌데이터

const accounts = ref([]); // 빈 배열 시 '계좌 없음' 화면 표시
const monthlyChange = ref(0); // 이번 달 순입출금

// 대표 계좌 ID 상태 관리 (첫 번째 계좌를 기본 대표 계좌로 설정)
const mainAccountId = ref(null);

onMounted(() => {
  accounts.value = accountsData; // accounts.json 로드

  // 첫 번째 계좌를 기본 대표 계좌로 설정
  if (accounts.value.length > 0) {
    mainAccountId.value = accounts.value[0].id;
  }

  // 저장된 대표 계좌 ID 복원
  const savedMainAccountId = localStorage.getItem('mainAccountId');
  if (savedMainAccountId) {
    const accountExists = accounts.value.some(
      (account) => account.id === parseInt(savedMainAccountId)
    );
    if (accountExists) {
      mainAccountId.value = parseInt(savedMainAccountId);
    }
  }
});

// isMain 필드를 추가한 계좌 데이터 생성
const processedAccounts = computed(() => {
  return accounts.value.map((account) => ({
    ...account,
    isMain: account.id === mainAccountId.value,
  }));
});

const totalBalance = computed(() =>
  accounts.value.reduce((sum, acc) => sum + acc.balance, 0)
);

// 대표 계좌 설정 함수
const setMainAccount = (selectedAccount) => {
  // 이미 대표 계좌인 경우 처리 안함
  if (selectedAccount.id === mainAccountId.value) {
    return;
  }

  // 대표 계좌 ID 변경
  mainAccountId.value = selectedAccount.id;

  // 사용자 피드백
  console.log(
    `${selectedAccount.accountName} 계좌가 대표 계좌로 설정되었습니다.`
  );

  // localStorage에 대표 계좌 ID 저장
  localStorage.setItem('mainAccountId', selectedAccount.id.toString());
};

// 계좌 삭제 함수
const deleteAccount = (accountToDelete) => {
  const index = accounts.value.findIndex(
    (account) => account.id === accountToDelete.id
  );
  if (index > -1) {
    // 대표 계좌를 삭제하는 경우
    if (
      accountToDelete.id === mainAccountId.value &&
      accounts.value.length > 1
    ) {
      accounts.value.splice(index, 1);
      // 첫 번째 계좌를 새로운 대표 계좌로 설정
      if (accounts.value.length > 0) {
        mainAccountId.value = accounts.value[0].id;
        localStorage.setItem('mainAccountId', accounts.value[0].id.toString());
      }
    } else {
      accounts.value.splice(index, 1);
      // 마지막 계좌였다면 대표 계좌 ID 초기화
      if (accounts.value.length === 0) {
        mainAccountId.value = null;
        localStorage.removeItem('mainAccountId');
      }
    }
  }
};

// 계좌 추가
const onAddAccount = () => {
  // 계좌 추가 로직 구현
  console.log('계좌 추가 모달 열기');
};
</script>

<style scoped>
.account-tab {
  padding: 1rem;
}
</style>
