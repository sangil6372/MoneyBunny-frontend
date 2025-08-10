<template>
  <div class="assetCompareCard">
    <div class="compareTitle">정책 적용 후 자산비교</div>
    <div class="assetRow">
      <div class="assetBlock nowAsset">
        <div class="assetLabel">현재 자산</div>
        <div class="assetAmount">{{ currentAssetDisplay }}</div>
      </div>
      <div class="assetBlock expectedAsset">
        <div class="assetLabel">예상 자산</div>
        <div class="assetAmount">{{ expectedAssetDisplay }}</div>
      </div>
    </div>
    <div class="growthRow">
      <div class="growthLeft">
        <img
          src="@/assets/images/icons/common/increase.png"
          alt="자산 증가 아이콘"
          class="growthIcon"
        />
        <span>
          <span class="growthTitle">자산 증가율</span><br />
          <span class="growthDesc"
            >예상 증가금액 : {{ increaseAmountDisplay }}</span
          >
        </span>
      </div>
      <span class="growthRate">{{ increaseRateDisplay }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// props로 총 자산과 정책 혜택 총합 전달받음
const props = defineProps({
  totalAsset: {
    type: Number,
    required: true,
  },
  top3TotalAmount: {
    type: Number,
    required: true,
  },
});

// 현재 자산: 총 자산
const currentAsset = computed(() => props.totalAsset ?? 0);
// 예상 자산: 총 자산 + 정책 혜택 총합
const expectedAsset = computed(
  () => (props.totalAsset ?? 0) + (props.top3TotalAmount ?? 0)
);
// 증가 금액
const increaseAmount = computed(() => expectedAsset.value - currentAsset.value);
// 증가율
const increaseRate = computed(() =>
  currentAsset.value > 0
    ? ((increaseAmount.value / currentAsset.value) * 100).toFixed(1)
    : '0.0'
);

// 표시용 포맷 함수
const format = (val, suffix = '원') =>
  val != null ? val.toLocaleString() + suffix : '-';

const currentAssetDisplay = computed(() => format(currentAsset.value));
const expectedAssetDisplay = computed(() => format(expectedAsset.value));
const increaseAmountDisplay = computed(
  () => '+' + format(increaseAmount.value)
);
const increaseRateDisplay = computed(() =>
  increaseRate.value ? `${increaseRate.value}%` : '-'
);
</script>

<style scoped>
.assetCompareCard {
  background: #fff;
  border-radius: 1rem;
  padding: 1.35rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.compareTitle {
  padding-left: 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--base-blue-dark, #2a3557);
}

.assetRow {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.assetBlock {
  flex: 1;
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  min-height: 80px;
  align-items: center;
}

.nowAsset {
  background: #f8fafd;
  /* border: 1.5px solid #e3e7f1; */
  color: #2a3557;
}

.expectedAsset {
  background: var(--base-blue-dark, #2a3557);
  color: #fff;
  /* border: 1.5px solid #dde0ec; */
}

.assetLabel {
  font-size: 0.8rem;
  margin-bottom: 0.2em;
}

.assetAmount {
  font-size: 1.15rem;
  font-weight: 600;
  word-break: break-all;
}

.growthRow {
  background: #f3f6fd;
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.growthLeft {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
}

.growthIcon {
  width: 1.1rem;
  height: 1.1rem;
  margin-top: 0.275rem;
}

.growthTitle {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--base-blue-dark, #2a3557);
}

.growthDesc {
  font-size: 0.75rem;
  color: #222c42;
  margin-left: -25px;
}

.growthRate {
  font-size: 1.3rem;
  font-weight: bold;
  /* color: #3a57e8; */
  /* color: #6a7de7; */
  /* color: #34c759; */
  color: #25b486;
  min-width: 4.6rem;
  text-align: right;
  margin-right: 0.45rem;
}
</style>
