<template>
  <div class="card-detail">
    <DetailHeader title="카드 상세" @back="onClose" />
    <DetailInfoCard type="card" :data="cardData" />
    <TransactionList
      type="card"
      :cardId="cardData.id"
      @transaction-click="goToDetail"
    />
  </div>
</template>

<script setup>
import DetailHeader from '../detail/DetailHeader.vue';
import DetailInfoCard from '../detail/DetailInfoCard.vue';
import TransactionList from '../detail/TransactionList.vue';

const props = defineProps({ cardData: Object });
const emit = defineEmits(['close']);
const onClose = () => emit('close'); // 부모에게 close 이벤트 전달
</script>

<style scoped>
.card-detail {
  background-color: var(--input-bg-2);
  min-height: 100vh;
}
</style>
