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
        <!-- <div class="assetAmount">{{ expectedAssetDisplay }}</div> -->
        <!-- <div class="assetAmount">{{ expectedAnimatedDisplay }}</div> -->
        <div class="assetAmount" aria-live="polite">
          {{ expectedAnimatedDisplay }}
        </div>
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
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue';

// props
const props = defineProps({
  totalAsset: { type: Number, required: true },
  top3TotalAmount: { type: Number, required: true },
});

// 1) 계산 값들 (먼저 선언되어야 함)
const currentAsset = computed(() => props.totalAsset ?? 0);
const expectedAsset = computed(
  () => (props.totalAsset ?? 0) + (props.top3TotalAmount ?? 0)
);

const increaseAmount = computed(() => expectedAsset.value - currentAsset.value);
const increaseRate = computed(() =>
  currentAsset.value > 0
    ? ((increaseAmount.value / currentAsset.value) * 100).toFixed(1)
    : '0.0'
);

// 포맷
const format = (val, suffix = '원') =>
  val != null ? val.toLocaleString() + suffix : '-';

const currentAssetDisplay = computed(() => format(currentAsset.value));
const expectedAssetDisplay = computed(() => format(expectedAsset.value)); // (기존 유지해도 됨)
const increaseAmountDisplay = computed(
  () => '+' + format(increaseAmount.value)
);
// 0원일 때는 '—' 표기로 변경 (기존 한 줄 교체)
const increaseRateDisplay = computed(() =>
  currentAsset.value > 0 ? `${increaseRate.value}%` : '—'
);

// 2) 애니메이션 값 & 함수
const animatedExpected = ref(0);
const expectedAnimatedDisplay = computed(() => format(animatedExpected.value));
// rAF 아이디 보관 (추가)
let rafId = null;

// 애니메이션 함수 수정 (기존 함수 대체: 누수 방지 + 2초 기본)
function animateNumber(from, to, duration = 1500) {
  const reduce = window.matchMedia?.(
    '(prefers-reduced-motion: reduce)'
  )?.matches;
  if (reduce) {
    animatedExpected.value = to;
    return;
  }

  // 이전 애니메이션 있으면 취소
  if (rafId) cancelAnimationFrame(rafId);

  const start = performance.now();
  const diff = to - from;
  const ease = (t) => 1 - Math.pow(1 - t, 3);

  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    animatedExpected.value = Math.round(from + diff * ease(t));
    if (t < 1) {
      rafId = requestAnimationFrame(frame);
    }
  }
  rafId = requestAnimationFrame(frame);
}

// 컴포넌트 언마운트 시 rAF 정리 (추가)
onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId);
});

// 3) 마운트 시 1회
onMounted(() => {
  animatedExpected.value = currentAsset.value ?? 0;
  animateNumber(animatedExpected.value, expectedAsset.value, 1500);
});

// 4) expectedAsset 변경 감지 (※ 반드시 expectedAsset 선언 이후에 위치!)
watch(
  expectedAsset,
  (newVal, oldVal) => {
    const from =
      Number.isFinite(oldVal) && oldVal !== undefined
        ? oldVal
        : animatedExpected.value ?? 0;
    const to = Number.isFinite(newVal) ? newVal : 0;

    if (from === to) {
      animatedExpected.value = to;
      return;
    }
    animateNumber(from, to, 1500);
  },
  { immediate: false }
);
</script>

<style scoped>
.assetCompareCard {
  background: #fff;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.325rem;
  margin-bottom: 1rem;
}

.compareTitle {
  padding-left: 0.125rem;
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--base-blue-dark);
}

.assetRow {
  display: flex;
  gap: 0.6rem;
  margin-bottom: 0.15rem;
}

.assetBlock {
  flex: 1;
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  min-height: 70px;
  align-items: center;
}

.nowAsset {
  background: #f8fafd;
  /* border: 1.5px solid #e3e7f1; */
  color: #2a3557;
}

.expectedAsset {
  background: var(--base-blue-dark);
  color: #fff;
  /* border: 1.5px solid #dde0ec; */
}

.assetLabel {
  font-size: 0.7rem;
  margin-bottom: 0.1em;
}

.assetAmount {
  font-size: 1rem;
  font-weight: bold;
  word-break: break-all;
}

.growthRow {
  background: #f3f6fd;
  border-radius: 0.5rem;
  padding: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.growthLeft {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.growthIcon {
  width: 1rem;
  height: 1rem;
  margin-top: 0.25rem;
}

.growthTitle {
  font-size: 0.85rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--base-blue-dark);
}

.growthDesc {
  font-size: 0.65rem;
  color: #222c42;
  margin-left: -25px;
}

.growthRate {
  font-size: 1.2rem;
  font-weight: bold;
  /* color: #3a57e8; */
  /* color: #6a7de7; */
  /* color: #34c759; */
  color: #25b486;
  min-width: 4.5rem;
  text-align: right;
  margin-right: 0.55rem;
  margin-bottom: 0.25rem;
}

/* 추가 */
.assetAmount,
.growthRate {
  font-variant-numeric: tabular-nums;
}
</style>
