<!-- src/components/policy/detail/PolicyOverviewTab.vue -->
<script setup>
import { ref, onMounted, watch } from 'vue';
import { fetchCardTransportationFees } from '@/api/assetApi';

const props = defineProps({
  description: String,
  supportContent: String,
  applyPeriod: String,
  policyId: Number,
});

// policyId 로그 한 번만 출력
onMounted(() => {
  console.log('PolicyOverviewTab에서 받은 policyId:', props.policyId);
  if (props.policyId === 3167) {
    loadKpassBenefit();
  }
});

const formatPeriod = (periodStr) => {
  if (!periodStr) return '상시';
  const match = periodStr.match(/^(\d{8})\s*~\s*(\d{8})$/);
  if (!match) return periodStr;
  const [_, start, end] = match;
  const s = `${start.slice(0, 4)}.${start.slice(4, 6)}.${start.slice(6, 8)}`;
  const e = `${end.slice(0, 4)}.${end.slice(4, 6)}.${end.slice(6, 8)}`;
  return `${s} ~ ${e}`;
};

// 줄바꿈 분리 함수
const splitLines = (str) =>
  str ? str.split('\n').filter((s) => s.trim() !== '') : [];

// K패스 혜택 금액 관련 상태
const kpassBenefit = ref(null);
const kpassLoading = ref(false);

const calcKpassBenefit = (amount) => {
  if (amount < 23250) return 0;
  return Math.floor(amount * 0.3);
};

// 월별로 거래내역을 합산하는 함수
function groupByMonth(transactions) {
  const result = {};
  transactions.forEach((tx) => {
    const date = new Date(tx.transactionDate);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}`;
    if (!result[month]) result[month] = 0;
    result[month] += tx.amount;
  });
  return Object.entries(result).map(([month, amount]) => ({
    month,
    amount,
    benefit: calcKpassBenefit(amount),
  }));
}

const loadKpassBenefit = async () => {
  kpassLoading.value = true;
  try {
    const res = await fetchCardTransportationFees();
    const transactions = res.data || [];
    kpassBenefit.value = groupByMonth(transactions);
  } catch (e) {
    kpassBenefit.value = [];
  }
  kpassLoading.value = false;
};

onMounted(() => {
  if (props.policyId === 3167) {
    loadKpassBenefit();
  }
});

watch(
  () => props.policyId,
  (val) => {
    if (val === 3167) {
      loadKpassBenefit();
    }
  }
);
</script>

<template>
  <div class="tabContent">
    <div class="font-bold font-15 mb-2">정책 설명</div>
    <div class="font-12 text-bluegray mb-4">
      <template v-for="(line, idx) in splitLines(description)" :key="idx">
        <span>{{ line }}</span
        ><br v-if="idx !== splitLines(description).length - 1" />
      </template>
    </div>

    <div class="font-bold font-15 mb-2">지원 내용</div>
    <div class="supportBox">
      <template v-for="(line, idx) in splitLines(supportContent)" :key="idx">
        <span class="font-11 text-bluegray">{{ line }}</span
        ><br v-if="idx !== splitLines(supportContent).length - 1" />
      </template>
    </div>

    <div class="font-15 font-bold mb-2 mt-4">신청 기간</div>
    <div class="periodBox">
      <img
        src="@/assets/images/icons/policy/calendar.png"
        alt="달력"
        class="calendarIcon"
      />
      <div class="periodContent">
        <div class="periodText font-12 font-bold">
          {{ formatPeriod(applyPeriod) }}
        </div>
        <span v-if="!applyPeriod" class="periodSub font-11">
          연중 상시 접수 (예산 소진 시 조기 마감)
        </span>
      </div>
    </div>

    <!-- K패스 혜택 금액 카드 (policyId가 3167일 때만 표시) -->
    <div v-if="policyId === 3167" class="kpassBenefitBox mb-4">
      <div class="font-bold font-15 mb-2">K패스 월별 혜택 금액</div>
      <div v-if="kpassLoading" class="font-12 text-bluegray">
        불러오는 중...
      </div>
      <div v-else>
        <template v-if="kpassBenefit && kpassBenefit.length">
          <div
            v-for="item in kpassBenefit"
            :key="item.month"
            class="kpassBenefitItem"
          >
            <span class="font-12">{{ item.month }}</span>
            <span class="font-12 ml-2"
              >총 이용금액: {{ item.amount.toLocaleString() }}원</span
            >
            <span class="font-12 ml-2 font-bold text-green">
              혜택금액: {{ item.benefit.toLocaleString() }}원
            </span>
          </div>
        </template>
        <div v-else class="font-12 text-bluegray">교통 사용 내역 없음</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tabContent {
  background-color: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 80px;
}
.supportBox {
  background-color: var(--input-bg-2);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  min-height: 50px;
}
.supportTitle {
  margin-bottom: 8px;
}
.text-bluegray {
  color: var(--text-bluegray);
}
.mb-1 {
  margin-top: 3px;
  margin-bottom: 8px;
}
.mb-2 {
  margin-bottom: 10px;
}
.mb-4 {
  margin-bottom: 16px;
}
.mt-4 {
  margin-top: 24px;
}
.periodBox {
  display: flex;
  align-items: flex-start;
  background-color: var(--input-bg-2);
  border-radius: 6px;
  padding: 12px;
  gap: 10px;
}
.calendarIcon {
  width: 16px;
  height: 16px;
  /* margin-top: 3px; */
  flex-shrink: 0;
}
.periodContent {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.periodText {
  /* line-height: 2; */
  color: var(--text-default);
  margin-bottom: 4px;
}
.periodSub {
  display: block;
  color: var(--text-bluegray);
  /* line-height: 1.6; */
  margin-left: 0;
}
.kpassBenefitBox {
  background: #f7f9fa;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
}
.kpassBenefitItem {
  margin-bottom: 8px;
}
.text-green {
  color: #2db400;
}
.ml-2 {
  margin-left: 8px;
}
</style>
