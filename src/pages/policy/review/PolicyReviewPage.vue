<template>
  <div class="reviewPage">
    <!-- 헤더는 레이아웃에서 렌더됨 -->

    <main class="content">
      <!-- 요약 카드 -->
      <section class="summaryCard card">
        <div class="summaryTitle font-14 font-bold">전체 리뷰</div>
        <div class="totalCount font-11">총 {{ filteredCount }}개</div>
      </section>

      <!-- 혜택 상태 탭 (알림 센터 스타일) -->
      <div class="tab-switcher">
        <button
          :class="['tab-button', { active: benefitFilter === 'all' }]"
          @click="setBenefitFilter('all')"
        >
          전체
        </button>
        <button
          :class="['tab-button', { active: benefitFilter === 'received' }]"
          @click="setBenefitFilter('received')"
        >
          혜택자
        </button>
        <button
          :class="['tab-button', { active: benefitFilter === 'not_eligible' }]"
          @click="setBenefitFilter('not_eligible')"
        >
          미혜택자
        </button>
      </div>

      <!-- 정렬 필터 텍스트 -->
      <div class="sortTextRow">
        <span
          :class="['sortText', { active: sortOrder === 'recommended' }]"
          @click="setSortOrder('recommended')"
        >
          추천순
        </span>
        <span class="divider">·</span>
        <span
          :class="['sortText', { active: sortOrder === 'latest' }]"
          @click="setSortOrder('latest')"
        >
          최신순
        </span>
      </div>

      <PolicyReviewEmpty
        v-if="isEmpty"
        :policyTitle="policyTitle"
      />

      <template v-else>
        <section
          v-for="r in filteredReviews"
          :key="r.id"
          class="reviewCard card"
        >
          <div class="reviewHeader">
            <!-- 프로필 이미지로 변경 -->
            <div class="avatar">
              <img
                :src="getProfileImage(r.profileImageId)"
                :alt="r.nickname"
                class="avatarImage"
              />
            </div>
            <div class="meta">
              <div class="nameRow">
                <span class="name font-12 font-bold">{{ r.nickname }}</span>
                <!-- 혜택 상태 뱃지 추가 -->
                <span
                  v-if="r.benefitStatus"
                  :class="getBenefitClass(r.benefitStatus)"
                  class="benefitBadge"
                >
                  {{ getBenefitText(r.benefitStatus) }}
                </span>
              </div>
              <div class="date font-11 text-gray">{{ r.date }}</div>
            </div>
          </div>

          <p class="body font-12">{{ r.content }}</p>

          <div class="actionRow">
            <button class="chip" @click="toggleHelpful(r)">
              <img
                :src="likeIcon"
                alt="like"
                :class="['chipIcon', { liked: r.helped }]"
              />
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
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useAuthStore } from "@/stores/auth"; // 비로그인
import { useRoute, useRouter } from "vue-router";
import likeIcon from "@/assets/images/icons/policy/like.png";
import PolicyReviewEmpty from "./PolicyReviewEmpty.vue";
// 정책 리뷰 API 추가
import { policyInteractionAPI } from "@/api/policyInteraction";
// 프로필 이미지 imports
import imgSprout from "@/assets/images/icons/profile/profile_edit_sprout.png";
import imgBeard from "@/assets/images/icons/profile/profile_edit_beard.png";
import imgEyelash from "@/assets/images/icons/profile/profile_edit_eyelash.png";
import imgCarrot from "@/assets/images/icons/profile/profile_edit_carrot.png";

const authStore = useAuthStore(); // 비로그인

const route = useRoute();
const router = useRouter();
const policyId = computed(() => Number(route.params.policyId)); // id → policyId로 수정
const policyTitle = ref("");

// 프로필 이미지 배열 (마이페이지와 동일)
const profileImages = [imgSprout, imgBeard, imgEyelash, imgCarrot];

// 페이지네이션 & 상태
const page = ref(1);
const pageSize = 6;
const loading = ref(false);
const hasMore = ref(true);

const reviews = ref([]);
const totalCount = ref(0);

// 필터 상태
const sortOrder = ref("latest"); // 'recommended' | 'latest'
const benefitFilter = ref("all"); // 'all' | 'received' | 'not_eligible'

// 필터링된 리뷰 계산
const filteredReviews = computed(() => {
  let filtered = [...reviews.value];

  // 혜택 상태 필터링
  if (benefitFilter.value !== "all") {
    const statusMap = {
      received: "RECEIVED",
      not_eligible: "NOT_ELIGIBLE",
    };
    filtered = filtered.filter(
      (r) => r.benefitStatus === statusMap[benefitFilter.value]
    );
  }

  // 정렬
  if (sortOrder.value === "recommended") {
    // 좋아요 수 내림차순
    filtered.sort((a, b) => (b.helpCount || 0) - (a.helpCount || 0));
  } else {
    // 최신순 (날짜 내림차순)
    filtered.sort(
      (a, b) =>
        new Date(b.date.replace(/\./g, "-")) -
        new Date(a.date.replace(/\./g, "-"))
    );
  }

  return filtered;
});

const filteredCount = computed(() => filteredReviews.value.length);
const isEmpty = computed(() => totalCount.value === 0);

const goBack = () => router.back();

// 백엔드 API 데이터를 저장할 전체 리뷰 목록
const allReviews = ref([]);

// 날짜 포맷팅 함수
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

// 실제 API 호출 및 페이지네이션 처리
async function fetchReviews({ page, size }) {
  try {
    // 첫 페이지일 때만 API 호출
    if (page === 1 && allReviews.value.length === 0) {
      // const response =
      //   await policyInteractionAPI.getPolicyReviewsWithLikeStatus(
      //     policyId.value
      //   );
      let response;
      if (authStore.isLogin) {
        // 로그인: 좋아요 상태 포함 버전
        response = await policyInteractionAPI.getPolicyReviewsWithLikeStatus(
          policyId.value
        );
      } else {
        // 게스트: 공개 리스트 호출
        response = await policyInteractionAPI.getPolicyReviewsPublic(
          policyId.value
        );
      }

      // 백엔드 데이터를 프론트엔드 형식으로 변환
      allReviews.value = response.data.map((review) => ({
        id: review.reviewId,
        nickname: review.userName || "익명",
        date: formatDate(review.createdAt),
        content: review.content,
        helpCount: review.likeCount || 0,
        // helped: review.isLikedByCurrentUser || false, // 백엔드에서 받은 좋아요 상태
        // 게스트는 isLikedByCurrentUser 없음 → false 처리
        helped: Boolean(review.isLikedByCurrentUser) && authStore.isLogin,
        benefitStatus: review.benefitStatus,
        userId: review.userId,
        profileImageId: review.profileImageId,
        reviewId: review.reviewId, // 좋아요 API용 reviewId 추가
        isLoading: false, // 좋아요 로딩 상태
      }));

    }

    // 클라이언트 사이드 페이지네이션
    const start = (page - 1) * size;
    const end = start + size;

    return {
      items: allReviews.value.slice(start, end),
      total: allReviews.value.length,
      policyTitle: "정책 리뷰",
    };
  } catch (error) {
    console.error("리뷰 조회 실패:", error);
    console.error("에러 상세 정보:", {
      message: error.message,
      response: error.response,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
    });

    // 인터셉터 때문에 error.response가 비어있을 수도 있어서,
    // 게스트라면 공개 API로 한 번 더 재시도
    if (!authStore.isLogin) {
      try {
        const response = await policyInteractionAPI.getPolicyReviewsPublic(
          policyId.value
        );
        allReviews.value = response.data.map((review) => ({
          id: review.reviewId,
          nickname: review.userName || "익명",
          date: formatDate(review.createdAt),
          content: review.content,
          helpCount: review.likeCount || 0,
          helped: false,
          benefitStatus: review.benefitStatus,
          userId: review.userId,
          profileImageId: review.profileImageId,
          reviewId: review.reviewId,
          isLoading: false,
        }));
        const start = (page - 1) * size;
        const end = start + size;
        return {
          items: allReviews.value.slice(start, end),
          total: allReviews.value.length,
          policyTitle: "정책 리뷰",
        };
      } catch (e) {
        console.warn("게스트 공개 엔드포인트 재시도도 실패:", e);
      }
    }

    // 에러 타입별 처리
    if (error.response?.status === 500) {
      console.warn(
        "서버 내부 오류 - 리뷰 데이터를 불러올 수 없습니다."
      );
      // TODO: 백엔드 테이블 확인 필요
    } else if (error.response?.status === 404) {
      console.warn("정책을 찾을 수 없습니다.");
    }

    // 에러 시 빈 배열 반환하여 빈 상태 표시
    return {
      items: [],
      total: 0,
      policyTitle: "정책 리뷰",
    };
  }
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

// 혜택 상태 텍스트 반환
function getBenefitText(benefitStatus) {
  const statusMap = {
    RECEIVED: "수령완료",
    PENDING: "처리중",
    NOT_ELIGIBLE: "수령불가",
  };
  return statusMap[benefitStatus] || benefitStatus;
}

// 혜택 상태별 CSS 클래스 반환
function getBenefitClass(benefitStatus) {
  const classMap = {
    RECEIVED: "benefit-received",
    PENDING: "benefit-pending",
    NOT_ELIGIBLE: "benefit-not-eligible",
  };
  return classMap[benefitStatus] || "benefit-default";
}

// 프로필 이미지 반환 함수 (마이페이지와 동일)
function getProfileImage(profileImageId) {
  // profileImageId가 null/undefined이면 기본값 0 사용
  const safeIdx = profileImageId ?? 0;
  // 범위 체크: 0~3 범위를 벗어나면 기본값 0 사용
  const validIdx = safeIdx >= 0 && safeIdx < profileImages.length ? safeIdx : 0;
  return profileImages[validIdx];
}

// 실제 API를 통한 좋아요 처리
async function toggleHelpful(review) {
  // 로딩 상태 및 중복 클릭 방지
  if (review.isLoading) return;

  const originalHelpCount = review.helpCount;
  const originalHelped = review.helped;

  // 낙관적 업데이트 (UI 즉시 반영)
  review.helped = !review.helped;
  review.helpCount = Math.max(
    0,
    (review.helpCount || 0) + (review.helped ? 1 : -1)
  );
  review.isLoading = true;

  try {
    if (review.helped) {
      // 좋아요 추가
      await policyInteractionAPI.addReviewLike(review.reviewId);
    } else {
      // 좋아요 취소
      await policyInteractionAPI.removeReviewLike(review.reviewId);
    }

    // API 성공 시 실제 좋아요 수 업데이트
    const response = await policyInteractionAPI.getReviewLikeCount(
      review.reviewId
    );
    review.helpCount = response.data;
  } catch (error) {
    console.error("좋아요 처리 실패:", error);
    // 에러 시 원래 상태로 롤백
    review.helped = originalHelped;
    review.helpCount = originalHelpCount;

    // 에러 메시지 표시 (선택적)
    if (error.response?.status === 400) {
      // 400: 이미 좋아요한 상태 또는 좋아요하지 않은 상태
      console.warn("좋아요 상태 또는 이미 좋아요한 상태입니다.");
    }
  } finally {
    review.isLoading = false;
  }
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


// 필터 변경 함수들
const setSortOrder = (order) => {
  sortOrder.value = order;
};

const setBenefitFilter = (filter) => {
  benefitFilter.value = filter;
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
  overflow: hidden; /* 이미지 오버플로우 숨김 */
}

/* 프로필 이미지 스타일 */
.avatarImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
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
  filter: grayscale(1);
  opacity: 0.6;
  transition: all 0.2s;
}

.chipIcon.liked {
  filter: grayscale(0);
  opacity: 1;
}

.text-gray {
  color: var(--text-bluegray);
}
.loading {
  text-align: center;
  padding: 8px 0 20px;
}

/* 혜택 상태 뱃지 스타일 */
.benefitBadge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.benefit-received {
  background: #e6faf2;
  color: #18b184;
}

.benefit-pending {
  background: #fff4e6;
  color: #f59e0b;
}

.benefit-not-eligible {
  background: #fff0f4;
  color: #e3456d;
}

.benefit-default {
  background: #f3f4f6;
  color: #6b7280;
}

/* 알림 센터 스타일 탭 스위처 */
.tab-switcher {
  display: flex;
  justify-content: space-around;
  background-color: #ffffff;
  border-radius: 6px;
  padding: 6px;
  margin-bottom: 12px;
}

.tab-button {
  flex: 1;
  background: none;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  color: #777;
  cursor: pointer;
  position: relative;
  font-size: 13px;
}

.tab-button.active {
  background-color: var(--base-blue-dark);
  color: white;
}

/* 정렬 필터 텍스트 */
.sortTextRow {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-bluegray);
  margin: 10px 0;
  padding: 0 10px;
}

.sortText {
  cursor: pointer;
  font-weight: bold;
}

.sortText:hover {
  color: var(--base-blue-dark);
}

.sortText.active {
  color: var(--base-blue-dark);
  font-weight: bold;
}

.divider {
  color: var(--text-bluegray);
  opacity: 0.5;
  font-weight: bold;
  user-select: none;
}
</style>
