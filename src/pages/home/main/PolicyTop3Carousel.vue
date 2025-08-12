<template>
  <div class="carousel">
    <!-- 스크롤 컨테이너 -->
    <div class="track" ref="trackRef" @scroll.passive="onScroll">
      <div v-for="(p, i) in slides" :key="p.key" class="slide">
        <!-- 인트로 -->
        <article
          v-if="p.type === 'intro'"
          class="bannerCard intro"
          role="button"
          @click="go(1)"
        >
          <div class="introRow">
            <img :src="bunnyIcon" alt="MoneyBunny" class="introBunny" />
            <div class="introText">
              <div class="introTitle">맞춤 정책 TOP3</div>
              <p class="introSub">조건에 맞는 혜택만 골라 모았어요!</p>
              <p class="introMeta">+{{ currency(total) }}</p>
            </div>
          </div>
        </article>

        <!-- 정책 -->
        <article
          v-else
          class="bannerCard policy"
          role="button"
          @click="goDetail(p)"
        >
          <header class="headRow">
            <h4 class="title" :title="p.title">{{ p.title }}</h4>
            <strong class="amount" :style="{ color: rankColor(i) }"
              >+{{ currency(p.amount) }}</strong
            >
          </header>
          <p v-if="p.description" class="subtitle">{{ p.description }}</p>
        </article>
      </div>
    </div>

    <!-- 도트 -->
    <div class="dotsWrap">
      <button
        v-for="(p, i) in slides"
        :key="i"
        class="dot"
        :class="{ active: i === index }"
        @click="go(i)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { policyAPI } from '@/api/policy';
import bunnyIcon from '@/assets/images/icons/bunny/moneybunny.png';

const router = useRouter();

// 데이터
const slides = ref([]);
const total = ref(0);

const fetchTop3 = async () => {
  const res = await policyAPI.getUserPolicySearch();
  const top3 = (res?.data || []).slice(0, 3).map((x, k) => ({
    key: `p-${x.policyId}`,
    type: 'policy',
    policyId: String(x.policyId),
    title: x.title,
    description: x.policyBenefitDescription,
    amount: Number(x.policyBenefitAmount) || 0,
    rank: k + 1,
  }));
  total.value = top3.reduce((s, x) => s + x.amount, 0);
  slides.value = [{ key: 'intro', type: 'intro' }, ...top3];
};
onMounted(fetchTop3);

// 색상
const palette = { 1: '#2c3e50', 2: '#20bba0', 3: '#5fa3e0' };
const rankColor = (idx) => palette[Math.max(1, idx)] || palette[2];
const currency = (v) =>
  new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 }).format(v || 0);

// 스크롤 스냅 인덱스
const index = ref(0);
const trackRef = ref(null);

const slideWidth = () => trackRef.value?.clientWidth || 1;
const scrollToIndex = (i) => {
  const el = trackRef.value;
  if (!el) return;
  el.scrollTo({ left: i * slideWidth(), behavior: 'smooth' });
};
const go = (i) => {
  index.value = i;
  scrollToIndex(i);
};
const onScroll = () => {
  const el = trackRef.value;
  if (!el) return;
  index.value = Math.round(el.scrollLeft / slideWidth());
};

// 탭 전환 시 스냅 고정(옵션)
const onResize = () => scrollToIndex(index.value);
onMounted(() => window.addEventListener('resize', onResize));
onBeforeUnmount(() => window.removeEventListener('resize', onResize));

const goDetail = (p) =>
  router.push({ name: 'policyDetail', params: { id: p.policyId } });
</script>

<style scoped>
.carousel {
  position: relative;
  border-radius: 12px;
  padding: 8px 0 10px;
  /* background: #f4f7fb; */
  margin-bottom: 20px;
}

/* 수평 스크롤 + 스냅 */
.track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  gap: 0;
}
.track::-webkit-scrollbar {
  display: none;
}

.slide {
  scroll-snap-align: center;
  min-width: 100%;
  padding: 0 8px; /* 좌우 여백 */
  box-sizing: border-box;
}

/* 카드 공통 */
.bannerCard {
  position: relative;
  margin: 0 auto;
  background: #fff;
  border: 1px solid rgba(44, 62, 80, 0.06);
  border-radius: 12px;
  padding: 12px;
}

.bannerCard.intro {
  display: flex;
  /* flex-direction: column; */
  align-items: center;
  /* gap: 6px; */
  min-height: 140px;
  display: flex;
  /* flex-direction: column; */
  justify-content: center; /* 세로 중앙 */
  /* align-items: center; */
}
.introRow {
  display: flex;
  align-items: center;
  gap: 12px;
}
.introBunny {
  width: 68px;
  height: 68px;
  object-fit: contain;
}
.introText {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.introTitle {
  font-size: 16px;
  font-weight: bold;
  color: #223149;
}
.introSub {
  font-size: 12px;
  color: #6b7c93;
}
.introMeta {
  font-size: 12px;
  font-weight: 700;
  color: #20bba0;
}

/* 정책 카드 */
.bannerCard.policy {
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.headRow {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.title {
  font-size: 15px;
  color: #223149;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.amount {
  font-size: 16px;
  font-weight: 800;
  white-space: nowrap;
}
.subtitle {
  margin-top: 6px;
  font-size: 12px;
  color: #6b7c93;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 도트 */
.dotsWrap {
  display: flex;
  gap: 4px;
  justify-content: center;
  padding: 8px 0 2px;
}
.dot {
  width: 10px;
  height: 4px;
  border-radius: 999px;
  background: #cfd6e2;
  border: 1px solid transparent;
}
.dot.active {
  background: #223149;
  border-color: #223149;
}
</style>
