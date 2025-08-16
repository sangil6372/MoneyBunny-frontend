<template>
  <div class="card-list-simple">
    <!-- 카드 아이템들 -->
    <CardItem
      v-for="card in visibleCards"
      :key="card.id"
      :card="card"
      @delete="$emit('delete-card', card)"
      @set-main="setMainItem"
      @toggle-amount="toggleCardAmount"
    />

    <!-- 전체보기 버튼: 3개 이상인 경우에만 -->
    <button
      v-if="!showAll && cards.length > 3"
      class="view-all-btn"
      @click="showAll = true"
    >
      전체 보기
    </button>

    <!-- 추가 버튼 -->
    <AddItemButton type="card" @click="isCardModalOpen = true" />

    <!-- 카드 추가 모달 -->
    <AddItemModal
      v-if="isCardModalOpen"
      :isOpen="isCardModalOpen"
      type="card"
      @close="isCardModalOpen = false"
      @update-data="handleCardAdded"
    />
  </div>
</template>

<script setup>
import { ref, computed, toRef, onMounted } from 'vue';
import { useAccountSettingsStore } from '@/stores/assetSettings';
import CardItem from './CardItem.vue';
import AddItemButton from '@/pages/asset/component/common/AddItemButton.vue';
import AddItemModal from '@/pages/asset/component/common/AddItemModal.vue';
import { useMainItem } from '../utils/useMainItem';

const props = defineProps({
  cards: { type: Array, required: true },
});

const emit = defineEmits(['delete-card', 'update-cards']);

// Pinia store 사용
const assetSettings = useAccountSettingsStore();

const showAll = ref(false);
const isCardModalOpen = ref(false);

// 컴포넌트 마운트 시 로컬스토리지에서 설정 불러오기
onMounted(() => {
  assetSettings.loadFromLocalStorage();
});

// 설정이 적용된 카드 목록
const processedCardsWithSettings = computed(() => {
  return assetSettings.applySettingsToCards(props.cards);
});

// 대표 카드 관리 composable 사용 (설정이 적용된 카드 목록 사용)
const { processedItems: processedCards, setMainItem } = useMainItem({
  type: 'card',
  items: processedCardsWithSettings,
  onUpdate: (reorderedCards) => {
    // 대표 카드 변경 시 store에도 반영
    const mainCard = reorderedCards.find((card) => card.isRepresentative);
    if (mainCard) {
      assetSettings.setMainCard(mainCard.id);
    }
    emit('update-cards', reorderedCards);
  },
});

// 보여질 카드 목록
const visibleCards = computed(() =>
  showAll.value ? processedCards.value : processedCards.value.slice(0, 3)
);

// 금액 숨기기 토글 (store를 통해 이미 처리됨)
const toggleCardAmount = (cardId, isHidden) => {
  console.log(`카드 ${cardId} 금액 숨기기: ${isHidden} (store에서 처리됨)`);
  // store에서 이미 처리되었으므로 추가 작업 불필요
};

// 카드 추가
const handleCardAdded = (newCard) => {
  emit('update-cards', [...props.cards, newCard]);
};
</script>

<style scoped>
.card-list-simple {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* 전체보기 버튼 */
.view-all-btn {
  width: 100%;
  padding: 1rem;
  background: none;
  border: 1px solid var(--base-blue-dark);
  border-radius: 6px;
  color: var(--base-blue-dark);
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  margin: 0.5rem 0;
}

/* .view-all-btn:hover {
  background: var(--base-blue-dark);
  color: white;
} */
</style>
