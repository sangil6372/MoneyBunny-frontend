<template>
  <div class="overview-item-simple">
    <!-- 카드 이미지 -->
    <img
      :src="card.cardImage"
      :alt="`${card.cardName} 이미지`"
      class="card-image"
    />

    <!-- 카드 정보 -->
    <div class="info">
      <p class="name">
        {{ getCardIssuerName(card.issuerCode) }} {{ card.cardName }}
      </p>
      <p class="number">{{ card.cardMaskedNumber }}</p>
    </div>
  </div>
</template>

<script setup>
import cardCodeMap from '@/assets/utils/cardCodeMap.js';

const props = defineProps({
  card: { type: Object, required: true },
});

// 카드사명 가져오기 함수
const getCardIssuerName = (issuerCode) => {
  return cardCodeMap[issuerCode] || '알 수 없는 카드사';
};
</script>

<style scoped>
.overview-item-simple {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: var(--input-bg-2);
  border-radius: 6px;
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
}

.card-image {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  margin-right: 14px;
  object-fit: contain;
  flex-shrink: 0; /* 이미지 크기 고정 */
}

.info {
  flex: 1;
  min-width: 0; /* flex item이 축소될 수 있도록 */
  overflow: hidden; /* 넘치는 내용 숨김 */
}

.name {
  font-size: 13px;
  font-weight: bold;
  color: var(--text-login);
  margin: 0 0 4px 0;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.number {
  font-size: 11px;
  color: var(--text-darkgray);
  margin: 0;
  line-height: 1.3;
  /* 계좌 번호도 말줄임표 처리 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>
