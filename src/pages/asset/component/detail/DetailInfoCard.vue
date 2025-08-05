<template>
  <div class="info-card">
    <div class="info-left">
      <img
        v-if="type === 'card'"
        :src="data.cardImage"
        alt="카드 이미지"
        class="card-img"
      />
      <img v-else :src="bankLogo" alt="은행 로고" class="bank-logo" />
    </div>
    <div class="info-right">
      <p class="info-name">{{ displayName }}</p>
      <p class="info-number">{{ displayNumber }}</p>
      <p class="info-balance">
        {{ formattedBalance }}
        <span class="unit">{{
          type === 'card' ? '원 (이번 달 사용)' : '원'
        }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getBankLogoByCode } from '@/assets/utils/bankLogoMap';

const props = defineProps({
  type: { type: String, required: true }, // 'card' | 'account'
  data: { type: Object, required: true },
});

const bankLogo = computed(() =>
  props.type === 'account' ? getBankLogoByCode(props.data.bankCode) : ''
);

const displayName = computed(() =>
  props.type === 'card' ? props.data.cardName : props.data.accountName
);

const displayNumber = computed(() =>
  props.type === 'card' ? props.data.cardMaskedNumber : props.data.accountNumber
);

const formattedBalance = computed(() => {
  // 카드면 thisMonthUsed → 없으면 amount → 없으면 0
  if (props.type === 'card') {
    const used = props.data.thisMonthUsed ?? props.data.amount ?? 0;
    return used.toLocaleString();
  }
  // 계좌면 balance → 없으면 amount → 없으면 0
  const bal = props.data.balance ?? props.data.amount ?? 0;
  return bal.toLocaleString();
});
</script>

<style scoped>
.info-card {
  display: flex;
  align-items: center;
  background-color: #ffffff; /* 화이트 배경 */
  border-radius: 0.75rem;
  padding: 1.25rem 1.5rem; /* 여백 확대 */
  margin: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04); /* 자연스러운 그림자 */
  border: 1px solid var(--input-bg-3); /* 은은한 경계선 */
}

.info-left {
  margin-right: 1rem;
  display: flex;
  align-items: center;
}

.card-img {
  width: 3.25rem;
  height: auto;
  border-radius: 0.5rem;
}

.bank-logo {
  width: 2.75rem;
  height: 2.75rem;
  object-fit: contain;
  border-radius: 50%;
  background: white;
  padding: 0.25rem;
}

.info-right {
  flex: 1;
}

.info-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--base-blue-dark);
}

.info-number {
  font-size: 0.8125rem;
  color: var(--text-bluegray);
  margin: 0.25rem 0 0.5rem;
}

.info-balance {
  font-size: 1.375rem;
  font-weight: 700;
  margin: 0;
  color: var(--base-blue-dark);
}

.unit {
  font-size: 0.75rem;
  font-weight: 400;
  margin-left: 0.25rem;
  color: var(--text-lightgray);
}
</style>
