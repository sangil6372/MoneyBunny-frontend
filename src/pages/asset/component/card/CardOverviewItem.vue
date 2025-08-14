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
  padding: 12px 16px;
  background-color: var(--input-bg-2);
  border-radius: 12px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
}

.card-image {
  width: 36px;
  height: 23px;
  border-radius: 4px;
  margin-right: 12px;
  object-fit: cover;
  border: 1px solid var(--input-outline);
  flex-shrink: 0; /* 이미지 크기 고정 */
}

.info {
  flex: 1;
  min-width: 0; /* flex item이 축소될 수 있도록 */
  overflow: hidden; /* 넘치는 내용 숨김 */
}

.name {
  font-family: 'NanumSquareNeo', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-login);
  margin: 0 0 3px 0;
  line-height: 1.3;
  /* 긴 이름 말줄임표 처리 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.number {
  font-family: 'NanumSquareNeo', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--text-darkgray);
  margin: 0;
  line-height: 1.3;
  /* 카드 번호도 말줄임표 처리 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>
