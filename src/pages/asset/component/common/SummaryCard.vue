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

      <!-- 우측 값 타입에 따라 다른 스타일 적용 -->
      <p
        class="summary-right-value"
        :class="[
          isComparisonText ? 'comparison-text' : 'count-text',
          isComparisonText && rightValueSign === 'plus' ? 'positive' : '',
          isComparisonText && rightValueSign === 'minus' ? 'negative' : '',
        ]"
      >
        {{ rightValue }}{{ rightUnit }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // 메인 제목
  title: { type: String, required: true },
  // 메인 금액
  mainAmount: { type: Number, required: true },
  // 서브 정보 (선택적)
  subInfo: {
    type: Object,
    default: null,
  },
  // 우측 라벨
  rightLabel: { type: String, required: true },
  // 우측 값
  rightValue: { type: [Number, String], required: true },
  // 우측 단위
  rightUnit: { type: String, default: '개' },
  // 카드 타입
  variant: { type: String, default: 'account' },
});

// 우측 값이 비교 텍스트인지 확인 (+417,500원(+20%) 형태)
const isComparisonText = computed(() => {
  return (
    typeof props.rightValue === 'string' &&
    (props.rightValue.includes('+') || props.rightValue.includes('-'))
  );
});

const rightValueSign = computed(() => {
  if (!isComparisonText.value) return 'none';
  const s = String(props.rightValue);
  if (s.includes('+')) return 'plus';
  if (s.includes('-')) return 'minus';
  return 'none';
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

/* 카드 레이아웃 */
.summary-card {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  column-gap: 1.25rem;

  height: 120px;
  padding: 1.25rem;
  border-radius: 6px;

  background: var(--base-blue-dark);
  color: #fff;
  position: relative; /* 구분선용 */
  overflow: hidden;
}

/* 좌측(메인/서브 묶음) */
.summary-content {
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.375rem;
}

.summary-main .home-card-label {
  margin: 0;
  font-size: 0.75rem;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.8);
}

.summary-main .home-card-value {
  margin: 0.15rem 0 0;
  line-height: 1.2;
  font-size: 1.05rem;
  font-weight: bold;
  font-variant-numeric: tabular-nums;
  word-break: keep-all;
}

/* 서브 값 */
.sub-value {
  line-height: 1.25;
  word-break: keep-all;
  color: rgba(255, 255, 255, 0.95);
}

/* 우측 영역 */
.summary-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  row-gap: 0.275rem;
  min-width: 160px;
  text-align: right;
}

.summary-right .home-card-rate {
  margin: 0;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
}

/* 우측 값 */
.summary-right-value {
  margin: 0;
  font-weight: bold;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
  word-break: keep-all;
  text-align: right;
}

/* 개수(2개 등) */
.summary-right-value.count-text {
  font-size: 1rem;
  color: #fff;
}

/* 비교 텍스트(+417,500원 등) */
.summary-right-value.comparison-text {
  font-size: 0.8rem;
  color: #fff;
}

/* 증감 컬러 */
.summary-right-value.positive,
.sub-value.positive {
  color: var(--alert-strong);
}
.summary-right-value.negative,
.sub-value.negative {
  color: var(--text-green);
}

/* 좌/우 얇은 구분선 */
/* .summary-card::after {
  content: '';
  position: absolute;
  right: calc(160px + 1.5rem);
  top: 16px;
  bottom: 16px;
  width: 1px;
  background: rgba(255, 255, 255, 0.14);
  border-radius: 1px;
} */

/* 모바일 */
@media (max-width: 420px) {
  .summary-card {
    column-gap: 1rem;
    height: 120px;
    padding: 1rem 1.1rem;
  }
  .summary-right {
    min-width: 120px;
  }
  /* .summary-card::after {
    right: calc(120px + 1.1rem);
    top: 12px;
    bottom: 12px;
  } */
}
</style>
