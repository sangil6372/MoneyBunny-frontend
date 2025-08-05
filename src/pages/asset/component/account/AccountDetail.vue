<template>
  <div class="account-detail">
    <DetailHeader title="계좌 상세" @back="onClose" />
    <DetailInfoCard type="account" :data="accountData" />
    <TransactionFilter v-model="filter" />

    <!-- 거래내역: API에서 직접 받아옴! -->
    <TransactionList
      type="account"
      :accountId="accountData.id"
      :filter="filter"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

import DetailHeader from '../detail/DetailHeader.vue';
import DetailInfoCard from '../detail/DetailInfoCard.vue';
import TransactionFilter from '../detail/TransactionFilter.vue';
import TransactionList from '../detail/TransactionList.vue';

const props = defineProps({
  accountData: { type: Object, required: true },
});
const emit = defineEmits(['close']);
const onClose = () => emit('close');
const filter = ref('전체');
</script>

<style scoped>
.account-detail {
  background-color: var(--input-bg-2);
  min-height: 100vh;
}
</style>
