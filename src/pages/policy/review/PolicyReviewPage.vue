<template>
  <div class="reviewPage">
    <!-- 헤더는 레이아웃에서 렌더됨 -->

    <main class="content">
      <!-- 요약 카드 -->
      <section class="summaryCard card">
        <div class="summaryTitle font-14 font-bold">전체 리뷰</div>
        <div class="totalCount font-11">총 {{ totalCount }}개</div>
      </section>

      <PolicyReviewEmpty
        v-if="isEmpty"
        :policyTitle="policyTitle"
        @write="goWriteReview"
      />

      <template v-else>
        <section v-for="r in reviews" :key="r.id" class="reviewCard card">
          <div class="reviewHeader">
            <div class="avatar">{{ r.nickname.slice(0, 1) }}</div>
            <div class="meta">
              <div class="nameRow">
                <span class="name font-12 font-bold">{{ r.nickname }}</span>
              </div>
              <div class="date font-11 text-gray">{{ r.date }}</div>
            </div>
          </div>

          <p class="body font-12">{{ r.content }}</p>

          <div class="actionRow">
            <button
              class="chip"
              :class="{ active: r.helped }"
              @click="toggleHelpful(r)"
            >
              <img :src="likeIcon" alt="like" class="chipIcon" />
              <span class="count">{{ r.helpCount || 0 }}</span>
            </button>
          </div>
        </section>

        <div v-if="loading" class="loading font-11 text-gray">불러오는 중…</div>
        <div v-if="hasMore" ref="sentinel" style="height: 1px"></div>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import likeIcon from '@/assets/images/icons/policy/like.png';
import PolicyReviewEmpty from './PolicyReviewEmpty.vue';

const route = useRoute();
const router = useRouter();
const policyId = computed(() => Number(route.params.id));
const policyTitle = ref('');

// 페이지네이션 & 상태
const page = ref(1);
const pageSize = 4;
const loading = ref(false);
const hasMore = ref(true);

const reviews = ref([]);
const totalCount = ref(0);
const isEmpty = computed(() => totalCount.value === 0);

const goBack = () => router.back();

async function fetchReviews({ page, size }) {
  const ALL = [
    {
      id: 1,
      nickname: '취업성공자123',
      date: '2024.01.15',
      content:
        '정말 좋은 정책이에요! 덕분에 안정적으로 취업할 수 있었고, 회사에서도 적극적으로 지원해줘서 수월하게 진행할 수 있었어요.',
      helpCount: 12,
      helped: false,
    },
    {
      id: 2,
      nickname: '청년직장인',
      date: '2024.01.10',
      content:
        '신청 과정이 생각보다 복잡하지 않았고 안내가 친절했어요. 2년 근무 조건이 있지만 그만한 가치가 있다고 생각해요.',
      helpCount: 12,
      helped: false,
    },
    {
      id: 3,
      nickname: '새출발화이팅',
      date: '2024.01.08',
      content:
        '처음엔 반신반의했는데 실제로 지원금을 받고 나니 도움이 많이 됐어요. 회사도 안정적이고 좋습니다.',
      helpCount: 0,
      helped: false,
    },
  ];
  const start = (page - 1) * size;
  const end = start + size;
  return {
    items: ALL.slice(start, end),
    total: ALL.length,
    policyTitle: '청년 내일채움공제',
  };
}

async function loadMore() {
  if (loading.value || !hasMore.value) return;
  loading.value = true;
  try {
    const {
      items,
      total,
      policyTitle: title,
    } = await fetchReviews({
      page: page.value,
      size: pageSize,
    });
    totalCount.value = total;
    policyTitle.value = title || policyTitle.value;

    if (items.length) {
      reviews.value.push(...items);
      page.value += 1;
      if (items.length < pageSize) hasMore.value = false;
    } else {
      hasMore.value = false;
    }
  } finally {
    loading.value = false;
  }
}

function toggleHelpful(r) {
  r.helped = !r.helped;
  r.helpCount = Math.max(0, (r.helpCount || 0) + (r.helped ? 1 : -1));
}

// 첫 로드 + 무한스크롤
const sentinel = ref(null);
let observer;
onMounted(() => {
  loadMore(); // 초기 로드
  observer = new IntersectionObserver(
    (entries) => entries[0].isIntersecting && loadMore(),
    { root: null, threshold: 0.1 }
  );
  if (sentinel.value) observer.observe(sentinel.value);
});
onBeforeUnmount(() => {
  if (observer && sentinel.value) observer.unobserve(sentinel.value);
});

const goWriteReview = () => {
  router.push({ name: 'policyReviewWrite', params: { id: policyId.value } });
};
</script>

<style scoped>
.reviewPage {
  min-height: 100vh;
}

.card {
  background: #fff;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
}
.row.between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.summaryCard {
  position: relative;
  padding: 12px;
  padding-right: 56px;
}

.summaryTitle {
  line-height: 1;
}

.totalCount {
  position: absolute;
  top: 12px;
  right: 12px;
  color: var(--text-bluegray);
}
.reviewCard {
  padding: 12px;
}
.reviewHeader {
  display: flex;
  gap: 8px;
  align-items: center;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--base-blue-dark);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.meta {
  flex: 1;
  min-width: 0;
}
.nameRow {
  display: flex;
  align-items: center;
  gap: 6px;
}
.name {
  color: var(--base-blue-dark);
}
.date {
  margin-top: 2px;
}
.body {
  margin: 8px 0 10px;
  color: #111827;
  line-height: 1.55;
}

/* 칩 */
.actionRow {
  display: flex;
  gap: 6px;
  font-size: 12px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  border: 1px solid var(--input-outline, #e5e7eb);
  background: #fff;
  color: var(--text-bluegray);
  border-radius: 6px;
  padding: 2px 6px;
  cursor: pointer;
}
.chipIcon {
  width: 12px;
  height: 12px;
}
.chip.active {
  background: var(--input-bg-2);
  border-color: var(--base-blue-dark);
  color: var(--base-blue-dark);
}

.text-gray {
  color: var(--text-bluegray);
}
.loading {
  text-align: center;
  padding: 8px 0 20px;
}
</style>
