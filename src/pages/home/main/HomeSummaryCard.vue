<!-- HomeSummaryCard.vue -->
<template>
  <div class="homeSummaryCard">
    <!-- <AssetConnectCallout
      v-if="!isConnected"
      @connectAccount="onConnectAccount"
      @connectCard="onConnectCard"
    /> -->
    <!-- Row 1: KPI -->
    <!-- <template v-else> -->
    <div class="kpiRow">
      <div class="kpi">
        <div class="kpiLabel">현재 자산</div>
        <div class="kpiValue">{{ totalAssetDisplay }}</div>
      </div>
      <div class="kpi right">
        <div class="kpiLabel">이번 달 지출</div>
        <div class="kpiValue">{{ monthlyExpenseDisplay }}</div>
        <!-- <div class="kpiLabel">예상 쟈산</div>
        <div class="kpiValue">{{ expectedAnimatedDisplay }}</div> -->
        <!-- <div
          v-if="momRate !== null"
          class="delta"
          :class="{ up: momRate > 0, down: momRate < 0 }"
        >
          {{ momArrow }} {{ Math.abs(momRate) }}%
        </div> -->
      </div>
    </div>

    <!-- <div v-if="showCompare" class="divider"></div> -->

    <!-- Row 2: 정책 적용 후 비교 -->
    <!-- <div v-if="showCompare" class="compareRow">
      <div class="chip light">
        <div class="chipLabel">현재 자산</div>
        <div class="chipValue">{{ currentAssetDisplay }}</div>
      </div>
      <div class="chip dark">
        <div class="chipLabel">예상 자산</div>
        <div class="chipValue" aria-live="polite">
          {{ expectedAnimatedDisplay }}
        </div>
      </div>
    </div> -->

    <!-- 기존 compareRow 2칩 + growthRow 제거하고 아래로 교체 -->
    <div v-if="showCompare" class="compareRow one">
      <div class="chip dark wide">
        <div class="chipHeader">
          <span class="chipLabel">예상 자산</span>
        </div>
        <div class="chipValue" aria-live="polite">
          {{ expectedAnimatedDisplay }}
        </div>
      </div>
    </div>

    <div v-if="showCompare" class="growthRow">
      <div class="growthLeft">
        <img
          src="@/assets/images/icons/common/increase.png"
          alt=""
          class="growthIcon"
        />
        <div>
          <div class="growthTitle">자산 증가율</div>
          <div class="growthDesc">
            예상 증가금액 : {{ increaseAmountDisplay }}
          </div>
        </div>
      </div>
      <div class="growthRate">{{ increaseRateDisplay }}</div>
    </div>

    <div v-if="assetStore.loading" class="hint">불러오는 중...</div>
    <div v-if="assetStore.error" class="err">{{ assetStore.error }}</div>
    <!-- </template> -->
  </div>
</template>

<script setup>
import {
  computed,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from 'vue';
import { useAssetStore } from '@/stores/asset';
import AssetConnectCallout from './AssetConnectCallout.vue';

const props = defineProps({
  // 정책 TOP3로 기대되는 합산 금액 (없으면 0)
  top3TotalAmount: { type: Number, default: 0 },
});

const assetStore = useAssetStore();
onMounted(() => assetStore.loadSummary());

const summary = computed(() => assetStore.summary ?? {});

// --- KPI ---
const fmt = (n, suffix = '원') =>
  typeof n === 'number' ? n.toLocaleString('ko-KR') + suffix : '-';
const totalAsset = computed(() => summary.value.totalAsset ?? 0);
const totalAssetDisplay = computed(() => fmt(summary.value.totalAsset));
const monthlyExpenseDisplay = computed(() =>
  fmt(summary.value.thisMonthCardUsed)
);

// 전월 대비(있으면만 표시)
const momRate = computed(() =>
  typeof summary.value?.monthOverMonthRate === 'number'
    ? summary.value.monthOverMonthRate
    : null
);
const momArrow = computed(() =>
  momRate.value > 0 ? '▲' : momRate.value < 0 ? '▼' : '—'
);

// --- 비교/증가 ---
const currentAsset = computed(() => totalAsset.value);
const expectedAsset = computed(
  () => totalAsset.value + (props.top3TotalAmount ?? 0)
);
const increaseAmount = computed(() => expectedAsset.value - currentAsset.value);
const increaseRate = computed(() =>
  currentAsset.value > 0 ? (increaseAmount.value / currentAsset.value) * 100 : 0
);

const currentAssetDisplay = computed(() => fmt(currentAsset.value));
const increaseAmountDisplay = computed(() => '+' + fmt(increaseAmount.value));
const increaseRateDisplay = computed(() =>
  currentAsset.value > 0 ? `${increaseRate.value.toFixed(1)}%` : '—'
);
const showCompare = computed(
  () => expectedAsset.value > 0 || increaseAmount.value > 0
);

// --- 예상 자산 애니메이션 ---
const animatedExpected = ref(0);
const expectedAnimatedDisplay = computed(() => fmt(animatedExpected.value));
let rafId = null;

function animateNumber(from, to, duration = 1500) {
  const reduce = window.matchMedia?.(
    '(prefers-reduced-motion: reduce)'
  )?.matches;
  if (reduce) {
    animatedExpected.value = to;
    return;
  }

  if (rafId) cancelAnimationFrame(rafId);
  const start = performance.now();
  const diff = to - from;
  const ease = (t) => 1 - Math.pow(1 - t, 3);

  const frame = (now) => {
    const t = Math.min(1, (now - start) / duration);
    animatedExpected.value = Math.round(from + diff * ease(t));
    if (t < 1) rafId = requestAnimationFrame(frame);
  };
  rafId = requestAnimationFrame(frame);
}

onMounted(async () => {
  animatedExpected.value = currentAsset.value;
  await nextTick();
  animateNumber(animatedExpected.value, expectedAsset.value, 1500);
});
onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId);
});
watch(expectedAsset, (n, o) => {
  const from = Number.isFinite(o) ? o : animatedExpected.value;
  const to = Number.isFinite(n) ? n : 0;
  if (from === to) {
    animatedExpected.value = to;
    return;
  }
  animateNumber(from, to, 1500);
});
</script>

<style scoped>
.homeSummaryCard {
  --card-radius: 6px;
  --chip-radius: 6px;
  --gap: 10px;
  --pad: 16px;
}

.homeSummaryCard {
  background: #fff;
  /* background: var(--base-blue-dark); */
  border-radius: var(--card-radius);
  padding: var(--pad);
  color: var(--base-blue-dark);
  margin-bottom: 16px;
}

.homeSummaryCard .kpiRow {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--gap);
  align-items: end;
}

.homeSummaryCard .kpi {
  text-align: center;
}

.homeSummaryCard .kpiLabel {
  font-size: 13px;
  font-weight: bold;
  color: var(--base-blue-dark);
  margin-bottom: 5px;
}

.homeSummaryCard .kpiValue {
  font-size: 17px;
  margin-bottom: 5px;
  font-weight: bold;
  color: var(--base-blue-dark);
  font-variant-numeric: tabular-nums;
}

.homeSummaryCard .delta {
  margin-top: 4px;
  font-size: 11px;
}
.homeSummaryCard .delta.up {
  color: #25b486;
}
.homeSummaryCard .delta.down {
  color: #c0392b;
}

/* Divider */
/* .homeSummaryCard .divider {
  height: 1px;
  background: var(--input-outline-2);
  margin: 14px 0;
} */

.homeSummaryCard .compareRow.one {
  display: block;
  margin-top: 10px;
}

.homeSummaryCard .chip {
  border-radius: var(--chip-radius);
  padding: 12px;
}

.homeSummaryCard .chip.dark {
  background: var(--base-blue-dark);
  color: #fff;
}

.homeSummaryCard .compareRow.one .chip.dark {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.homeSummaryCard .compareRow.one .chipHeader {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;
}

.homeSummaryCard .chipLabel {
  font-size: 12px;
  opacity: 0.9;
}

.homeSummaryCard .chipValue {
  font-size: 17px;
  font-weight: bold;
  font-variant-numeric: tabular-nums;
}

.homeSummaryCard .chipSub {
  margin-top: 6px;
  font-size: 11px;
  opacity: 0.85;
}

.homeSummaryCard .growthRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--input-bg-2);

  border-radius: var(--chip-radius);
  padding: 12px 14px;
  margin-top: 12px;
}

.homeSummaryCard .growthLeft {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.homeSummaryCard .growthIcon {
  width: 16px;
  height: 16px;
  margin-top: 2px;
}

.homeSummaryCard .growthTitle {
  font-size: 14px;
  font-weight: bold;
  color: var(--base-blue-dark);
  margin-bottom: 4px;
}

.homeSummaryCard .growthDesc {
  font-size: 12px;
  color: var(--text-bluegray);
  margin-left: -22px;
}

.homeSummaryCard .growthRate {
  font-size: 18px;
  font-weight: bold;
  color: #25b486;
  font-variant-numeric: tabular-nums;
  text-align: right;
  min-width: 4rem;
}

.homeSummaryCard .hint {
  font-size: 11px;
  color: gray;
  margin-top: 6px;
}
.homeSummaryCard .err {
  color: tomato;
  margin-top: 6px;
}
</style>
