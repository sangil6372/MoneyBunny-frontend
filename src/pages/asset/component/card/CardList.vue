<template>
  <div class="card-list-wrapper">
    <div class="card-header">
      <h3 class="header-title">내 카드</h3>
      <div class="header-actions">
        <AddItemButton type="card" @click="isCardModalOpen = true" />
        <AddItemModal
          v-if="isCardModalOpen"
          :isOpen="isCardModalOpen"
          type="card"
          @close="isCardModalOpen = false"
          @update-data="handleCardAdded"
        />
        <span class="drag-text">드래그로 순서 변경</span>
      </div>
    </div>

    <div class="card-list">
      <CardItem
        v-for="card in visibleCards"
        :key="card.id"
        :card="card"
        :isRepresentative="card.isRepresentative"
        @delete="$emit('delete-card', card)"
        @set-main="setMainItem"
      />
    </div>

    <!--전체보기-->
    <button
      v-if="!showAll && cards.length > 3"
      class="view-all-btn"
      @click="showAll = true"
    >
      전체 보기
    </button>
  </div>
</template>

<script setup>
import { ref, computed, toRef } from 'vue';
import CardItem from './CardItem.vue';
import AddItemButton from '@/pages/asset/component/common/AddItemButton.vue';
import AddItemModal from '@/pages/asset/component/common/AddItemModal.vue';
import { useMainItem } from '../utils/useMainItem';

const props = defineProps({ cards: Array });
const emit = defineEmits(['delete-card', 'update-cards']);

const showAll = ref(false);
const isCardModalOpen = ref(false);

// 대표 카드 관리 composable 사용
const { processedItems: processedCards, setMainItem } = useMainItem({
  type: 'card',
  items: toRef(props, 'cards'),
  onUpdate: (reorderedCards) => emit('update-cards', reorderedCards),
});

// 보여질 카드 목록
const visibleCards = computed(() =>
  showAll.value ? processedCards.value : processedCards.value.slice(0, 3)
);

// 카드 추가
const handleCardAdded = (newCard) => {
  emit('update-cards', [...props.cards, newCard]);
};
</script>

<style scoped>
/* 전체 컨테이너 */
.card-list-wrapper {
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  margin-top: 1rem;
}

/* 상단 헤더 */
.card-header {
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

.add-btn {
  background: var(--base-blue-dark);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
  cursor: pointer;
}

.drag-text {
  font-size: 0.75rem;
  color: var(--text-lightgray);
}

/* 카드 리스트 */
.card-list {
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
