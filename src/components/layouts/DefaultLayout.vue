<template>
  <div class="layout">
    <!--조건부: 알림 센터 헤더-->
    <component :is="activeHeader" />
    <main class="main">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </main>
    <NavBar />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

import Header from '@/components/layouts/Header.vue';
import NavBar from '@/components/layouts/NavBar.vue';
import NotificationHeader from '@/pages/notification/common/NotificationHeader.vue';
import PolicySearchHeader from '@/pages/policy/search/PolicySearchHeader.vue';
import PolicyDetailHeader from '@/pages/policy/detail/PolicyDetailHeader.vue';
import PolicyReviewHeader from '@/pages/policy/review/PolicyReviewHeader.vue';

//현재 라우트 정보 가져오기
const route = useRoute();

//알림센터 페이지 여부 계산
const isNotificationPage = computed(
  () =>
    route.name === 'NotificationCenter' ||
    route.path.startsWith('/notification')
);

// ★ 검색페이지 조건 추가!
const isSearchPage = computed(
  () =>
    route.name === 'policySearchPage' || route.path.startsWith('/policy/search')
);

// 정책 상세 헤더 (policyDetail만!)
const isPolicyDetailPage = computed(
  () => route.name === 'policyDetail' // name이 정확히 'policyDetail'인 경우만
);

//  리뷰 페이지 여부
const isPolicyReviewPage = computed(
  () => route.name === 'policyReview' || route.path.includes('/reviews')
);

const activeHeader = computed(() => {
  if (isNotificationPage.value) return NotificationHeader;
  if (isSearchPage.value) return PolicySearchHeader;
  // 정책 상세일 때만 PolicyHeader 사용!
  if (isPolicyDetailPage.value) return PolicyDetailHeader;
  if (isPolicyReviewPage.value) return PolicyReviewHeader;
  return Header;
});
</script>

<style scoped>
/* 💪(상일) 전체 페이지 스크롤 방식 - pull-to-refresh 정상 동작 */
.layout {
  width: 100%;
  min-height: 100vh;
  position: relative;
  /* 하단 네비바 영역 확보 */
  padding-bottom: calc(60px + env(safe-area-inset-bottom));
}
.main {
  /* 💪(상일) 헤더 높이 + 상태바 영역 고려 */
  padding-top: calc(70px + env(safe-area-inset-top));
  position: relative;
  /* 본문 영역 독립 스크롤 제거 - 전체 페이지에서 스크롤 */
}

/* 💪(상일) iOS 전체 페이지 스크롤 최적화 */
@supports (-webkit-touch-callout: none) {
  .layout {
    -webkit-overflow-scrolling: touch;
  }
}
</style>
