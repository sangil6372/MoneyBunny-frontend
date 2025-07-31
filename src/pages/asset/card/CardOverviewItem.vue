<template>
  <div class="card-item">
    <div class="left">
      <img :src="card.cardImage" class="bank-logo" alt="카드 이미지" />
      <div class="card-info">
        <div class="bank-name">
          {{ getCardIssuerName(card.issuerCode) }} {{ card.cardName }}
        </div>
        <div class="card-number">{{ card.cardMaskedNumber }}</div>
      </div>
    </div>
    <div class="right">
      <div class="balance">{{ formatWon(card.amount) }}</div>
    </div>
  </div>
</template>

<script setup>
import cardCodeMap from '@/assets/utils/cardCodeMap.js'; // 카드사 코드 매핑

const props = defineProps({
  card: Object,
  isRepresentative: Boolean,
});

// 카드사 코드 → 카드사 이름 변환 함수
const getCardIssuerName = (issuerCode) => {
  return cardCodeMap[issuerCode] || '알 수 없는 카드사';
};

// 금액 포맷 함수
const formatWon = (value) => {
  return `${value.toLocaleString()}원`;
};
</script>

<style scoped>
.card-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.bank-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.card-info {
  display: flex;
  flex-direction: column;
}
.bank-name {
  font-size: 0.875rem;
  font-weight: bold;
  color: var(--base-blue-dark);
}
.card-number {
  font-size: 0.75rem;
  color: var(--text-lightgray);
}
.right {
  text-align: right;
}
.balance {
  font-size: 0.875rem;
  font-weight: bold;
  color: var(--base-blue-dark);
}
</style>
