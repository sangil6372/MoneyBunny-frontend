<template>
  <div class="home-account-tab">
    <div class="account-section">
      <AccountList />
    </div>
  </div>
</template>

<script setup>
import AddItemButton from '../common/AddItemButton.vue';
import AccountList from '../account/AccountList.vue';

const onAddAccountClick = () => {
  alert('계좌 추가 클릭됨');
};
</script>

<style scoped>
.home-account-tab {
  margin-top: 1rem;
}

.account-section {
  margin-top: 0.75rem;
}

.add-button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}
</style>
