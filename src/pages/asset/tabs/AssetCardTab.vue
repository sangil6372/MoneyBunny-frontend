<template>
  <div class="card-tab">
    <!-- 상단 요약 카드 -->
    <CardSummaryCard :totalUsage="totalUsage" :cardCount="cards.length" />

    <!-- 카드 유무에 따른 조건부 표시 -->
    <div v-if="cards.length > 0">
      <!-- 카드 리스트 -->
      <CardList
        :cards="processedCards"
        :mainCardId="mainCardId"
        @delete-card="deleteCard"
        @set-main="setMainCard"
      />
    </div>
    <div v-else>
      <!-- 카드 없음 -->
      <NoDataCard type="card" @add="onAddCard" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import CardSummaryCard from '../card/CardSummaryCard.vue';
import CardList from '../card/CardList.vue';
import NoDataCard from '../common/NoDataCard.vue';
import cardsData from '@/assets/data/cards.json';

const cards = ref([]);
const mainCardId = ref(null); // 대표 카드 ID

onMounted(() => {
  cards.value = cardsData;

  // 첫 번째 카드를 기본 대표 카드로 설정
  if (cards.value.length > 0) {
    mainCardId.value = cards.value[0].id;
  }

  // 저장된 대표 카드 ID 복원
  const savedMainCardId = localStorage.getItem('mainCardId');
  if (savedMainCardId) {
    const id = Number(savedMainCardId); // 숫자 변환
    const exists = cards.value.some((card) => card.id === id);
    if (exists) mainCardId.value = id;
  }
});

// isRepresentative 필드 포함 카드 데이터
const processedCards = computed(() =>
  cards.value.map((card) => ({
    ...card,
    isRepresentative: card.id === mainCardId.value,
  }))
);

// 총 사용액 계산
const totalUsage = computed(() =>
  cards.value.reduce((sum, card) => sum + (card.amount || 0), 0)
);

// ✅ 대표 카드 설정 함수
const setMainCard = (selectedCard) => {
  if (selectedCard.id === mainCardId.value) return; // 이미 대표 카드면 무시
  mainCardId.value = Number(selectedCard.id); // 타입 변환
  localStorage.setItem('mainCardId', String(selectedCard.id));
  console.log(`${selectedCard.cardName} 카드가 대표 카드로 설정되었습니다.`);
};

// ✅ 카드 삭제 함수
const deleteCard = (cardToDelete) => {
  const index = cards.value.findIndex((card) => card.id === cardToDelete.id);
  if (index > -1) {
    if (cardToDelete.id === mainCardId.value && cards.value.length > 1) {
      cards.value.splice(index, 1);
      mainCardId.value = cards.value[0]?.id || null;
      if (mainCardId.value)
        localStorage.setItem('mainCardId', String(mainCardId.value));
    } else {
      cards.value.splice(index, 1);
      if (cards.value.length === 0) {
        mainCardId.value = null;
        localStorage.removeItem('mainCardId');
      }
    }
  }
};

// 카드 추가 함수
const onAddCard = () => {
  console.log('카드 추가 모달 열기');
};
</script>

<style scoped>
.card-tab {
  padding: 1rem;
}
</style>
