<template>
  <div class="card-tab">
    <!-- 카드 요약 -->
    <SummaryCard
      title="이번 달 총 사용액"
      :mainAmount="totalUsage"
      rightLabel="카드 수"
      :rightValue="cards.length"
      rightUnit="개"
    />

    <!-- 카드가 있을 때 -->
    <div v-if="cards.length > 0">
      <CardList
        :cards="cards"
        @delete-card="deleteCard"
        @update-cards="onUpdateCards"
      />
      <!-- @update-cards="cards = $event" -->
    </div>

    <!-- 카드가 없을 때 -->
    <div v-else>
      <NoDataCard type="card" @add="onAddCard" />
    </div>
  </div>
</template>

<script setup>
//

import { computed } from 'vue';
import SummaryCard from '../component/common/SummaryCard.vue';
import CardList from '../component/card/CardList.vue';
import NoDataCard from '../component/common/NoDataCard.vue';

const props = defineProps({
  cards: { type: Array, required: true },
});

const emit = defineEmits(['update:cards']);

const totalUsage = computed(() =>
  props.cards.reduce((sum, card) => sum + (card.thisMonthUsed || 0), 0)
);

const deleteCard = (cardToDelete) => {
  emit(
    'update:cards',
    props.cards.filter((card) => card.id !== cardToDelete.id)
  );
};

const onUpdateCards = (newCards) => {
  emit('update:cards', newCards);
};

const onAddCard = () => {
  console.log('카드 추가 모달 열기');
};
</script>

<style scoped></style>
