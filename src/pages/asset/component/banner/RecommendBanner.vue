<template>
  <section
    class="recommendBanner"
    role="button"
    :aria-label="ariaLabel"
    tabindex="0"
    @click="goDetail"
    @keydown.enter.prevent="goDetail"
    @keydown.space.prevent="goDetail"
  >
    <div class="left">
      <div class="pillRow">
        <span v-if="tag" class="pill solid">{{ tag }}</span>
        <span v-if="dDayLabel" class="pill outline">{{ dDayLabel }}</span>
      </div>

      <div class="title">{{ title }}</div>
      <p v-if="description" class="desc">{{ description }}</p>

      <div class="ctaRow">
        <span v-if="amount != null" class="amountChip"
          >+{{ amountText }}원</span
        >
      </div>
    </div>

    <div class="right">
      <div class="artWrap">
        <img v-if="image" :src="image" alt="" />
        <div v-else class="artFallback"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  policyId: [String, Number],
  title: { type: String, required: true },
  description: { type: String, default: '' },
  amount: { type: Number, default: null },
  tag: { type: String, default: '추천' },
  deadline: { type: [String, Date, Number], default: null },
  image: { type: String, default: '' },
});

const router = useRouter();

const amountText = computed(() =>
  typeof props.amount === 'number' ? props.amount.toLocaleString('ko-KR') : ''
);

const dDayLabel = computed(() => {
  if (props.deadline == null) return '';
  if (typeof props.deadline === 'number')
    return props.deadline >= 0 ? `D-${props.deadline}` : '마감';
  const d = new Date(props.deadline);
  if (isNaN(d)) return '';
  const today = new Date();
  const diff = Math.ceil(
    (d - new Date(today.getFullYear(), today.getMonth(), today.getDate())) /
      86400000
  );
  return diff >= 0 ? `D-${diff}` : '마감';
});

const ariaLabel = computed(
  () =>
    `${props.title}${props.amount ? ` 혜택 ${amountText.value}원` : ''}${
      dDayLabel.value ? `, ${dDayLabel.value}` : ''
    }`
);

function goDetail() {
  if (!props.policyId) return;
  router.push({ name: 'policyDetail', params: { policyId: props.policyId } });
}
function onCtaClick() {
  goDetail();
}
</script>

<style scoped>
.recommendBanner {
  position: relative;
  background: #fff;
  color: var(--base-blue-dark);
  border-radius: 6px;
  padding: 18px;
  display: flex;
  align-items: center;
  /* gap: 12px; */
  min-height: 130px;
  width: 100%;
  isolation: isolate;
  box-sizing: border-box;
  border: 1.5px solid rgba(44, 62, 80, 0.06);
}

.left {
  min-width: 0;
  width: 230px;
}

.right {
  width: 96px;
  height: 96px;
  pointer-events: none;
  z-index: 3;
  display: grid;
  place-items: center;
}
.pillRow {
  display: flex;
  gap: 3px;
  margin-bottom: 6px;
}
.pill {
  display: inline-flex;
  align-items: center;
  padding: 0 3px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: bold;
}
.pill.solid {
  border: 1px solid var(--input-bg-3);
  color: var(--base-blue-dark);
}
.pill.outline {
  border: 1px solid var(--input-bg-3);
  color: var(--base-blue-dark);
}
.title {
  font-size: 13px;
  font-weight: bold;
  margin: 2px 0 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.desc {
  font-size: 11px;
  line-height: 1.38;
  margin: 0 0 8px;
  color: var(--base-blue-dark);
  display: -webkit-box;
  /* -webkit-line-clamp: 2; */
  -webkit-box-orient: vertical;
  /* overflow: hidden; */
  white-space: pre-line;
}
.ctaRow {
  display: flex;
  align-items: center;
  gap: 8px;
}
.amountChip {
  background: #fff;
  color: var(--base-blue-dark);
  font-size: 11px;
  font-weight: bold;
  white-space: nowrap;
}
.artWrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.artWrap img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
