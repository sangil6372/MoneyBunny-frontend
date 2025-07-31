<template>
  <div class="card-list-wrapper">
    <!-- 상단 컨트롤 바 -->
    <div class="card-header">
      <h3 class="header-title">내 카드</h3>
      <div class="header-actions">
        <!-- 버튼 -->
        <AddItemButton label="카드 추가" @click="isCardModalOpen = true" />

        <!-- 카드 추가 모달 -->
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

    <!-- 카드 리스트 -->
    <div class="card-list">
      <CardItem
        v-for="(card, index) in visibleCards"
        :key="card.id || index"
        :card="card"
        :isRepresentative="card.isRepresentative"
        @delete="$emit('delete-card', card)"
        @set-main="$emit('set-main', card)"
      />
    </div>

    <!-- 전체보기 버튼 -->
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
import { ref, computed } from 'vue';
import CardItem from './CardItem.vue';
import AddItemButton from '@/pages/asset/common/AddItemButton.vue';
import AddItemModal from '@/pages/asset/common/AddItemModal.vue';

// Props
const props = defineProps({
  cards: { type: Array, required: true },
});

const showAll = ref(false);
const isCardModalOpen = ref(false); //모달 상태 변수

// 카드 리스트
const visibleCards = computed(() =>
  showAll.value ? props.cards : props.cards.slice(0, 3)
);

// 카드 추가 후 리스트 갱신 (부모로 전달된 cards에 push하거나 emit으로 위임)
const handleCardAdded = (newCard) => {
  props.cards.push(newCard); // 단순 로컬 push (실제는 상위 emit 방식 추천)
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
