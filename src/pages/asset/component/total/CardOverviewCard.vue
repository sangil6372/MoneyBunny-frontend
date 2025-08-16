<template>
  <div class="card-overview-card" @click="goToCardTab">
    <!-- 헤더 -->
    <div class="title-row" @click="goToCardTab">
      <!-- <div class="card-title">카드 현황</div>
      <img
        src="@/assets/images/icons/common/arrow_right.png"
        class="arrow-icon"
        alt="이동"
      /> -->
      <div>카드 현황</div>
      <div class="arrow">
        <img
          src="@/assets/images/icons/common/arrow_right.png"
          alt="계좌이동 아이콘"
          class="arrow-icon"
        />
      </div>
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
  background-color: #fff;
  border-radius: 6px;
  padding: 1rem;
}
.title-row {
  padding: 0 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: 1rem;
  font-weight: bold;
  font-size: 0.9rem;
  color: var(--base-blue-dark);
}

.arrow-icon {
  width: 16px;
  height: 16px;
}
</style>
