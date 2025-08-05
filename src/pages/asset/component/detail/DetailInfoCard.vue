<template>
  <div class="info-card">
    <!-- ========== 왼쪽 아이콘 영역 ========== -->
    <div class="info-left">
      <!-- Slot이 있으면 커스텀 아이콘 사용, 없으면 기존 로직 -->
      <slot name="custom-icon">
        <!-- 기존 카드/계좌 아이콘 로직 (기본값) -->
        <img
          v-if="type === 'card'"
          :src="data.cardImage"
          alt="카드 이미지"
          class="card-img"
        />
        <img v-else :src="bankLogo" alt="은행 로고" class="bank-logo" />
      </slot>
    </div>

    <!-- ========== 오른쪽 정보 영역 ========== -->
    <div class="info-right">
      <!-- Slot이 있으면 커스텀 내용 사용, 없으면 기존 로직 -->
      <slot name="custom-content">
        <!-- 기존 카드/계좌 정보 로직 (기본값) -->
        <p class="info-name">{{ displayName }}</p>
        <p class="info-number">{{ displayNumber }}</p>
        <p class="info-balance">
          {{ formattedBalance }}
          <span class="unit">{{
            type === 'card' ? '원 (이번 달 사용)' : '원'
          }}</span>
        </p>
      </slot>
    </div>
  </div>

  <!-- ========== 추가 컨텐츠 영역 (새로 추가) ========== -->
  <!-- 카테고리 상세보기의 거래내역 등을 위한 공간 -->
  <div v-if="$slots.additional" class="additional-content">
    <slot name="additional"></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getBankLogoByCode } from '@/assets/utils/bankLogoMap';

// ========== Props 정의 ==========
// 기존 props는 그대로 유지 (기존 사용법 호환성)
const props = defineProps({
  type: {
    type: String,
    required: false, // slot 사용시에는 필수가 아닐 수 있음
    default: '',
  },
  data: {
    type: Object,
    required: false, // slot 사용시에는 필수가 아닐 수 있음
    default: () => ({}),
  },
});

// ========== 기존 Computed 로직 (기본값용) ==========
// 기존 계좌/카드 탭에서 사용하는 로직들
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
/* ========== 기존 스타일 유지 ========== */
.info-card {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 0.75rem;
  padding: 1.25rem 1.5rem;
  margin: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--input-bg-3);
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

/* ========== 새로 추가된 스타일 ========== */
/* 추가 컨텐츠 영역 (카테고리 상세보기용) */
.additional-content {
  background-color: #ffffff;
  border-radius: 0.75rem;
  margin: 0 1rem 1rem 1rem;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--input-bg-3);
}
</style>
