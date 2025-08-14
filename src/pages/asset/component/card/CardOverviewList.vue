<template>
  <div class="card-list">
    <!-- 카드가 있을 때 -->
    <template v-if="cards && cards.length > 0">
      <CardOverviewItem
        v-for="(card, index) in cards"
        :key="card.id || index"
        :card="card"
      />
    </template>

    <!-- 카드가 없을 때 작은 NoData 카드 표시 -->
    <OverviewNoDataCard
      v-else
      :icon-src="coinIconSrc"
      title="연동된 카드가 없습니다"
      description="카드를 연동해보세요"
      button-text="연동하기"
      @button-click="handleAddCard"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import CardOverviewItem from './CardOverviewItem.vue';
import OverviewNoDataCard from '../common/OverviewNoDataCard.vue';

const props = defineProps({
  cards: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits(['add-card']);

// 카드 추가 버튼 클릭 핸들러
const handleAddCard = () => {
  emit('add-card');
};
</script>

<style scoped>
.card-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
