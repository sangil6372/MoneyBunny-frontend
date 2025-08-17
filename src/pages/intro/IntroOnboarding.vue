<template>
  <div class="onboarding">
    <button class="skip" @click="emit('skip')">건너뛰기</button>

    <div class="slides" ref="slidesEl" @scroll.passive="onScroll">
      <section class="slide" v-for="(s, i) in slides" :key="i">
        <div class="copy">
          <img :src="bunny" alt="머니버니" class="bunny-img" />

          <div class="title" v-html="s.title"></div>
          <p class="desc" v-for="(line, li) in s.desc" :key="li">{{ line }}</p>
        </div>

        <div class="preview">
          <img
            v-if="shots[i]"
            :src="shots[i]"
            :alt="`앱 미리보기 ${i + 1}`"
            class="preview-img"
          />
          <div v-else class="preview-placeholder">스크린샷을 연결해주세요</div>
        </div>
      </section>
    </div>

    <div class="dots">
      <span
        v-for="(s, i) in slides"
        :key="i"
        class="dot"
        :class="{ active: i === index }"
        @click="go(i)"
      />
    </div>
    <button class="cta" @click="onCta()">{{ ctaLabel }}</button>
    <!-- <button
      v-if="index === slides.length - 1"
      class="cta"
      @click="emit('done')"
    >
      시작하기
    </button> -->
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';

import screenshot1 from '@/assets/images/icons/intro/screenshot1.png';
import screenshot2 from '@/assets/images/icons/intro/screenshot2.png';
import screenshot3 from '@/assets/images/icons/intro/screenshot3.png';

import bunny from '@/assets/images/icons/bunny/glasses_bunny.png';
// import bunny from '@/assets/images/icons/bunny/main_bunny.png';

const props = defineProps({
  screenshots: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['skip', 'done', 'change']);

const shots = computed(() => {
  const fallback = [screenshot1, screenshot2, screenshot3];
  if (!props.screenshots?.length) return fallback;
  return [0, 1, 2].map((i) => props.screenshots[i] || fallback[i]);
});

const slides = [
  {
    title: '숨은 자산과 정책,<br/>MoneyBunny 가 정확히 찾아드립니다',
    desc: ['개인 맞춤형 자산 관리와 정책 추천 서비스'],
  },
  {
    title: '흩어진 내 자산과 놓친 혜택<br/>MoneyBunny 에서 한 번에 확인하세요',
    desc: ['자산 통합 관리 & 정부 혜택 알림'],
  },
  {
    title: '청년 맞춤 정책부터<br/>개인화된 금융 솔루션까지',
    desc: ['나만의 스마트 자산 관리 서비스'],
  },
];

const slidesEl = ref(null);
const index = ref(0);

const onScroll = () => {
  const el = slidesEl.value;
  if (!el) return;
  const i = Math.round(el.scrollLeft / el.clientWidth);
  if (i !== index.value) {
    index.value = i;
    emit('change', i);
  }
};

const go = async (i) => {
  const el = slidesEl.value;
  if (!el) return;
  el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
};

onMounted(() => {
  nextTick(() => go(0));
});

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => go(index.value), 120);
});

const ctaLabel = computed(() =>
  index.value < slides.length - 1 ? '다음' : '시작하기'
);

const onCta = () => {
  if (index.value < slides.length - 1) {
    go(index.value + 1);
  } else {
    emit('done');
  }
};
</script>

<style scoped>
.onboarding {
  position: fixed;
  inset: 0;
  height: 100dvh;
  background: var(--base-blue-dark);
  color: #fff;
  overflow: hidden;
  overscroll-behavior: none;
}

.skip {
  position: absolute;
  right: 16px;
  top: 14px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  background: transparent;
  border: 0;
  padding: 8px 6px;
}

/* 슬라이더 */
.slides {
  height: 100%;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.slides::-webkit-scrollbar {
  display: none;
}

.slide {
  scroll-snap-align: start;
  display: grid;
  grid-template-rows: auto auto;
  padding: 65px 0 90px;
  box-sizing: border-box;
}

.copy {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  text-align: center;
}
.bunny-img {
  width: 75px;
  height: 75px;
  object-fit: contain;
  /* margin-bottom: 5px; */
}

.title {
  font-size: 15px;
  line-height: 1.35;
  font-weight: bold;
  letter-spacing: -0.2px;
  margin-bottom: 7px;
}
.desc {
  opacity: 0.85;
  font-size: 13px;
  margin-top: 0;
  margin-bottom: 10px;
}

.preview {
  min-height: 420px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
}

.preview-img,
.preview-placeholder {
  width: 100vh;
  height: 100%;
  object-fit: cover;
  max-width: 390px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.preview-img {
  object-fit: contain;
  object-position: top;
}

.dots {
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.45);
  transition: width 0.18s ease, background 0.18s ease;
}
.dot.active {
  width: 18px;
  background: #fff;
}

/* CTA */
.cta {
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: max(16px, env(safe-area-inset-bottom));
  height: 55px;
  border-radius: 6px;
  border: 0;
  color: #fff;
  background: #24374d;
}
.onboarding::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 120px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.3));
  pointer-events: none;
}
</style>
