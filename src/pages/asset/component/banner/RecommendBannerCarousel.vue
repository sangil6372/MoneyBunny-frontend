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
        v-for="(b, i) in list"
        :key="b.policyId ?? i"
        class="slide"
        aria-roledescription="slide"
        :aria-label="`${i + 1}/${list.length}`"
      >
        <div class="slideInner">
          <RecommendBanner v-bind="b" />
        </div>
      </div>
    </div>

    <!-- 도트 -->
    <div v-if="list.length > 1" class="dots" role="tablist">
      <button
        v-for="(b, i) in list"
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
import RecommendBanner from './RecommendBanner.vue';

const props = defineProps({
  items: { type: Array, required: true },
  autoplay: { type: Boolean, default: true },
  interval: { type: Number, default: 4500 },
  transitionMs: { type: Number, default: 450 },
});

const root = ref(null);
const index = ref(0);
let timer = null;

const list = computed(() => props.items ?? []);
function start() {
  if (!props.autoplay) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!list.value.length) return;
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
  index.value = (index.value + 1) % list.value.length;
}
function prev() {
  index.value = (index.value - 1 + list.value.length) % list.value.length;
}
function go(i) {
  index.value = i;
}

onMounted(() => {
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
    width: `${Math.max(list.value.length, 1) * 100}%`,
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
  bottom: 4px;
  display: flex;
  gap: 4px;
  justify-content: center;
}
.dot {
  width: 3px;
  height: 3px;
  border-radius: 999px;
  border: none;
  background: rgba(31, 59, 97, 0.25);
  cursor: pointer;
}
.dot.active {
  background: var(--base-blue-dark);
}
</style>
