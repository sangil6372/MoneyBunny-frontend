<template>
  <div class="home-card summary-card" :class="`summary-card--${variant}`">
    <div class="summary-content">
      <!-- 메인 정보 -->
      <div class="summary-main">
        <p class="home-card-label">{{ title }}</p>
        <p class="home-card-value">{{ formatAmount(mainAmount) }}</p>
      </div>

      <!-- 서브 정보 (선택적) -->
      <div v-if="subInfo" class="summary-sub">
        <p class="home-card-label">{{ subInfo.label }}</p>
        <p
          class="home-card-value sub-value"
          :class="{
            positive: subInfo.value >= 0 && subInfo.showSign,
            negative: subInfo.value < 0 && subInfo.showSign,
          }"
        >
          {{ formatSubValue(subInfo) }}
        </p>
      </div>
    </div>

    <!-- 우측 정보 -->
    <div class="summary-right">
      <p class="home-card-rate">{{ rightLabel }}</p>
      <p class="summary-right-value">{{ rightValue }}{{ rightUnit }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // 메인 제목
  title: { type: String, required: true },
  // 메인 금액
  mainAmount: { type: Number, required: true },
  // 서브 정보 (선택적)
  subInfo: {
    type: Object,
    default: null,
    // 예시: { label: '이번 달 순입출금', value: 2500000, showSign: true }
  },
  // 우측 라벨
  rightLabel: { type: String, required: true },
  // 우측 값
  rightValue: { type: [Number, String], required: true },
  // 우측 단위
  rightUnit: { type: String, default: '개' },
  // 카드 타입 (account, card, investment 등)
  variant: { type: String, default: 'account' },
});

const formatAmount = (amount) => {
  return `${amount.toLocaleString()}원`;
};

const formatSubValue = (subInfo) => {
  if (!subInfo) return '';

  const prefix = subInfo.showSign && subInfo.value >= 0 ? '+' : '';
  return `${prefix}${subInfo.value.toLocaleString()}원`;
};
</script>

<style scoped>
@import '@/assets/styles/homecard.css';

/* SummaryCard 전용 스타일 */
.summary-card {
  display: flex;
  flex-direction: row;
  align-items: center; /* 중앙 정렬 */
  justify-content: space-between;
  height: 120px; /* 카드 높이 축소 */
  padding: 1.25rem 1.5rem; /* 내부 여백 조정 */
  gap: 0.5rem;
}

/* 좌측 메인 정보 영역 */
.summary-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
}

/* 메인 금액 라벨 */
.summary-main .home-card-label {
  margin-bottom: 0.5rem;
}

/* 메인 금액 값 */
.summary-main .home-card-value {
  font-size: 1.5rem; /* 폰트 확대 */
  font-weight: 700;
  margin: 0;
}

.summary-right {
  display: flex;
  flex-direction: column; /* 세로 정렬 */
  align-items: flex-end; /* 우측 정렬 */
  justify-content: center;
  text-align: right;
  gap: 0.25rem; /* 라벨과 값 간격 */
}

/* 우측 라벨 (예: 카드 수) */
.summary-right .home-card-rate {
  font-size: 0.875rem; /* 라벨 크기 */
  font-weight: 500;
  color: var(--text-rate);
  margin: 0;
}

/* 우측 값 (예: 3개) */
.summary-right-value {
  font-size: 1rem; /* 메인 금액 크기와 유사 */
  font-weight: 700;

  color: white;
  margin: 0;
}
</style>
