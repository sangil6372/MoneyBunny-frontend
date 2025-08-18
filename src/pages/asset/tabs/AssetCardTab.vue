<template>
  <div class="asset-card-tab">
    <!-- 카드 탭 컨텐츠 -->
    <div class="tab-content">
      <!-- 카드가 있을 때 -->
      <div v-if="cards.length > 0">
        <CardList
          :cards="cards"
          @delete-card="deleteCard"
          @update-cards="onUpdateCards"
        />
      </div>

      <!-- 카드가 없을 때 -->
      <div v-else>
        <NoDataCard type="card" @add="onAddCard" />
      </div>
    </div>
  </div>
</template>

<script setup>
import CardList from '../component/card/CardList.vue';
import NoDataCard from '../component/common/NoDataCard.vue';

const props = defineProps({
  cards: { type: Array, required: true },
});

const emit = defineEmits(['update:cards']);

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
};
</script>

<style scoped>
.asset-card-tab {
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
