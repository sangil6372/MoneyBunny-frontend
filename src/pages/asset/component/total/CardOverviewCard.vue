<template>
  <div class="card-overview-card">
    <!-- 헤더 -->
    <div class="card-header" @click="goToCardTab">
      <div class="card-title">카드 현황</div>
      <img
        src="@/assets/images/icons/common/arrow_right.png"
        class="arrow-icon"
        alt="이동"
      />
    </div>

    <!-- 카드 리스트 -->
    <CardOverviewList :cards="cards.slice(0, 3)" />
  </div>
</template>

<script setup>
// import { ref } from 'vue';
// import CardOverviewList from '../card/CardOverviewList.vue';
// import cardsData from '@/assets/data/cards.json'; // json 파일 불러오기

// const emit = defineEmits(['switchTab']);

// // 내부 탭 전환
// const goToCardTab = () => {
//   emit('switchTab', '카드');
// };

// // 더미 카드 데이터 (JSON 파일에서 로드)
// const cards = ref(cardsData);
import CardOverviewList from '../card/CardOverviewList.vue';
const props = defineProps({
  cards: { type: Array, required: true },
});
const emit = defineEmits(['switchTab']);
const goToCardTab = () => emit('switchTab', '카드');
</script>

<style scoped>
.card-overview-card {
  background-color: white;
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--base-blue-dark);
}
.arrow-icon {
  width: 16px;
  height: 16px;
}
</style>
