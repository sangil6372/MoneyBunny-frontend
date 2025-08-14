<template>
  <div class="card-overview-card" @click="goToCardTab">
    <!-- 헤더 -->
    <div class="card-header">
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
import CardOverviewList from '../card/CardOverviewList.vue';

const props = defineProps({
  cards: { type: Array, required: true },
});

const emit = defineEmits(['switchTab']);

// 카드 탭으로 이동
const goToCardTab = () => {
  emit('switchTab', '카드');
};
</script>

<style scoped>
.card-overview-card {
  background-color: white;
  border-radius: 1rem;
  padding: 1.25rem;
  /* box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05); */
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
  cursor: pointer; /* 커서 포인터로 변경 */
  transition: transform 0.2s ease, box-shadow 0.2s ease; /* 부드러운 애니메이션 */

  /* 모바일 터치 최적화 */
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* 카드 터치 시 시각적 피드백 */
.card-overview-card:active {
  transform: scale(0.98); /* 살짝 축소 효과 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* cursor 제거 - 상위 카드에서 처리 */
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
