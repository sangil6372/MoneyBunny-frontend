<template>
  <div
    class="bannerCarousel"
    ref="root"
    @mouseenter="pause"
    @mouseleave="resume"
    v-if="items?.length"
  >
    <div
      class="track"
      :style="trackStyle"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend.passive="onTouchEnd"
    >
      <div
        v-for="(b, i) in items"
        :key="b.policyId ?? i"
        class="slide"
        aria-roledescription="slide"
        :aria-label="`${i + 1}/${items.length}`"
      >
        <div class="slideInner">
          <PolicyBanner v-bind="b" />
        </div>
      </div>
    </div>

    <!-- 도트 -->
    <div v-if="items.length > 1" class="dots" role="tablist">
      <button
        v-for="(b, i) in items"
        :key="`dot-${i}`"
        :class="['dot', { active: i === index }]"
        @click="go(i)"
        :aria-label="`${i + 1}번째 배너`"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import PolicyBanner from './PolicyBanner.vue';
import { policyAPI } from '@/api/policy';

// 이미지 경로 import
import banner1 from '@/assets/images/icons/bunny/banner_bunny1.png';
import banner2 from '@/assets/images/icons/bunny/banner_bunny2.png';
import banner3 from '@/assets/images/icons/bunny/banner_bunny3.png';
import top3bunny from '@/assets/images/icons/bunny/top3_bunny.png';

const items = ref([]);
const props = defineProps({
  items: { type: Array, required: true },
  autoplay: { type: Boolean, default: true },
  interval: { type: Number, default: 4500 },
  transitionMs: { type: Number, default: 450 },
});

const root = ref(null);
const index = ref(0);
let timer = null;

function start() {
  if (!props.autoplay) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!props.items?.length) return;
  stop();
  timer = setInterval(next, props.interval);
}
function stop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
function pause() {
  stop();
}
function resume() {
  start();
}
function next() {
  index.value = (index.value + 1) % props.items.length;
}
function prev() {
  index.value = (index.value - 1 + props.items.length) % props.items.length;
}
function go(i) {
  index.value = i;
}

async function fetchTop3Policies() {
  const res = await policyAPI.getTop3Views();
  const banners = [banner1, banner2, banner3];
  const introBanner = {
    policyId: null,
    title: '이번 주 인기 지원금 TOP3',
    description: '한 주간 가장 관심받은 혜택을 모았어요!',
    tag: '',
    deadline: null,
    amount: null,
    image: top3bunny,
  };
  const apiBanners = (res.data || []).map((p, idx) => {
    // endDate 처리: "20250102 ~ 20251130" 형태 또는 빈 값
    let deadline = null;
    if (!p.endDate || p.endDate.trim() === '') {
      deadline = null; // 상시
    } else {
      // "~" 기준 뒤 날짜 추출
      const match = p.endDate.match(/~\s*(\d{8})$/);
      if (match) {
        deadline = match[1]; // "20251130"
      } else {
        deadline = null;
      }
    }
    return {
      policyId: p.policyId,
      title: p.title,
      description: p.policyBenefitDescription,
      amount: p.policyBenefitAmount,
      tag: '인기', // default
      deadline,
      image: banners[idx] ?? '', // 순서대로 이미지 할당
    };
  });
  items.value = [introBanner, ...apiBanners];
}

onMounted(() => {
  fetchTop3Policies();
  start();
  document.addEventListener('visibilitychange', vis);
});
onBeforeUnmount(() => {
  stop();
  document.removeEventListener('visibilitychange', vis);
});
function vis() {
  document.hidden ? stop() : start();
}
// swipe
let startX = 0,
  deltaX = 0,
  dragging = false;
function onTouchStart(e) {
  dragging = true;
  deltaX = 0;
  startX = e.touches[0].clientX;
  pause();
}
function onTouchMove(e) {
  if (!dragging) return;
  deltaX = e.touches[0].clientX - startX;
}
function onTouchEnd() {
  if (!dragging) return;
  const w = root.value?.clientWidth || 1;
  const th = Math.min(80, w * 0.15);
  if (deltaX > th) prev();
  else if (deltaX < -th) next();
  dragging = false;
  deltaX = 0;
  resume();
}

const trackStyle = computed(() => {
  const w = root.value?.clientWidth || 1;
  const drag = (dragging ? -deltaX / w : 0) * 100;
  const x = -(index.value * 100) + drag;
  return {
    transform: `translateX(${x}%)`,
    transition: dragging ? 'none' : `transform ${props.transitionMs}ms ease`,
    width: `${(props.items?.length || 1) * 100}%`,
  };
});
</script>

<style scoped>
.bannerCarousel {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.slideInner {
  padding: 0;
}

.track {
  display: flex;
  will-change: transform;
}
.slide {
  flex: 0 0 100%;
  min-width: 100%;
  padding: 0;
}
.dots {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 8px;
  display: flex;
  gap: 4px;
  justify-content: center;
}
.dot {
  width: 4px;
  height: 4px;
  border-radius: 999px;
  border: none;
  background: rgba(31, 59, 97, 0.25);
  cursor: pointer;
}
.dot.active {
  background: var(--base-blue-dark);
}
</style>
