<!-- SummaryCard.vue 수정 버전 -->
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
        :class="{
          'comparison-text': isComparisonText,
          'count-text': !isComparisonText,
        }"
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
  align-items: center;
  justify-content: space-between;
  height: 120px;
  padding: 1.25rem 1.5rem;
  gap: 0.5rem;
}

.summary-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
}

.summary-main .home-card-label {
  margin-bottom: 0.5rem;
}

.summary-main .home-card-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.summary-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  text-align: right;
  gap: 0.25rem;
}

.summary-right .home-card-rate {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-rate);
  margin: 0;
}

/* 기본 우측 값 스타일 */
.summary-right-value {
  font-weight: 700;
  margin: 0;
}

/* 개수 표시용 (3개, 15건 등) */
.summary-right-value.count-text {
  font-size: 1rem;
  color: white;
}

/* 비교 텍스트용 (+417,500원(+20%) 등) */
.summary-right-value.comparison-text {
  font-size: 0.875rem;
  color: var(--text-green); /* 기본값, variant별로 override 가능 */
}
</style>
