<template>
  <div class="policyWrapper">
    <!-- 정책 검색창 -->
    <div class="searchBar" @click="goToSearchPage" style="cursor: pointer">
      <img
        src="@/assets/images/icons/policy/search.png"
        alt="search icon"
        class="searchIconImage"
      />
      <input
        type="text"
        placeholder="정책 검색"
        @focus="goToSearchPage"
        @click="goToSearchPage"
        class="fakeInput"
        readonly
      />
    </div>

    <!-- 정책 카드 리스트 -->
    <template v-if="visiblePolicies.length > 0">
      <div
        v-for="(policy, index) in visiblePolicies"
        :key="policy.policyId"
        class="policyCard"
        @click="goToDetail(policy.policyId)"
      >
        <div class="cardHeader">
          <span v-if="index < 3" class="topRank" :class="`rank${index + 1}`">
            TOP {{ index + 1 }}
          </span>
          <div class="titleTagRow">
            <span class="cardTitle font-bold font-13">{{ policy.title }}</span>
            <!-- 대분류 태그 중복 제거 후 표시 -->
            <template v-if="getUniqueLargeCategories(policy).length">
              <span
                v-for="tag in getUniqueLargeCategories(policy)"
                :key="tag"
                class="cardTag font-10"
                >{{ tag }}</span
              >
            </template>
          </div>
        </div>
        <p class="cardDesc font-12">{{ policy.policyBenefitDescription }}</p>
        <p class="cardDeadline font-10">
          <span class="label">신청기간 : </span>
          <span class="date font-bold">
            {{ policy.endDate ? formatPeriod(policy.endDate) : '상시' }}
          </span>
        </p>
        <div class="cardActions">
          <button
            class="buttonSecondary font-12"
            @click.stop="goToDetail(policy.policyId)"
          >
            자세히 보기
          </button>
          <button
            class="buttonPrimary font-12"
            @click.stop="openApplyModal(policy)"
          >
            신청하기
          </button>
        </div>
      </div>
    </template>
    <template v-else>
      <PolicyNoResult @retry="goPolicyTypeTest" @showAll="goAllPolicy" />
    </template>

    <!-- 더 많은 정책 보기 버튼 -->
    <button
      v-if="showMoreBtn"
      class="moreButton font-bold font-14"
      @click="loadMore"
    >
      더 많은 정책 보기
    </button>
    <BottomNav />
  </div>

  <!-- 신청 모달 -->
  <PolicyApplyModal
    v-if="showApplyModal"
    :policyTitle="selectedPolicy?.title"
    :applyUrl="selectedPolicy?.applyUrl"
    :policyId="selectedPolicy?.policyId"
    @close="closeApplyModal"
    @showStatusModal="handleShowStatusModal"
  />

  <!-- 정책신청현황 모달 -->
  <PolicyApplyStatusModal
    v-model="showStatusModal"
    :policyTitle="currentApplication?.title || ''"
    @submit="handleStatusSubmit"
    @later="
      () => {
        showStatusModal = false;
      }
    "
  />
  
  <!-- 조건 미충족 시 리뷰 작성 모달 -->
  <ReviewModal
    v-if="showReviewModal"
    :policy-id="reviewPolicyInfo?.policyId"
    :policy-title="reviewPolicyInfo?.policyTitle"
    :benefit-status="reviewPolicyInfo?.benefitStatus"
    :is-edit="false"
    @close="showReviewModal = false"
    @save="handleReviewSave"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BottomNav from '@/components/layouts/NavBar.vue';
import PolicyApplyModal from './component/PolicyApplyModal.vue';
import { usePolicyMatchingStore } from '@/stores/policyMatchingStore';
import { policyAPI } from '@/api/policy';
// 정책 신청 기능
import { policyInteractionAPI } from '@/api/policyInteraction';
import PolicyApplyStatusModal from './component/PolicyApplyStatusModal.vue';
// 조건 미충족 시 리뷰 작성용 모달
import ReviewModal from '@/pages/mypage/application/ReviewModal.vue';
const showStatusModal = ref(false);
const currentApplication = ref(null); // 현재 처리 중인 신청
// 리뷰 모달 상태
const showReviewModal = ref(false);
const reviewPolicyInfo = ref(null);

const router = useRouter();
const policyMatchingStore = usePolicyMatchingStore();

const showApplyModal = ref(false);
const selectedPolicy = ref(null);

const goToDetail = (policyId) => {
  router.push({ name: 'policyDetail', params: { policyId } });
};

const goToSearchPage = () => {
  router.push({ name: 'policySearch' });
};

// 신청 모달 열기
const openApplyModal = (policy) => {
  selectedPolicy.value = policy;
  showApplyModal.value = true;
};

const closeApplyModal = () => {
  showApplyModal.value = false;
  selectedPolicy.value = null;
};

// 신청 후 즉시 상태 모달 표시
const handleShowStatusModal = (applicationData) => {
  // 신청 모달 닫고 상태 모달 표시
  showApplyModal.value = false;
  selectedPolicy.value = null;

  // 현재 신청 정보 설정
  currentApplication.value = applicationData;
  showStatusModal.value = true;
};

const formatPeriod = (periodStr) => {
  if (!periodStr) return '상시';
  const match = periodStr.match(/^(\d{8})\s*~\s*(\d{8})$/);
  if (!match) return periodStr;
  const [_, start, end] = match;
  const s = `${start.slice(0, 4)}.${start.slice(4, 6)}.${start.slice(6, 8)}`;
  const e = `${end.slice(0, 4)}.${end.slice(4, 6)}.${end.slice(6, 8)}`;
  return `${s} ~ ${e}`;
};

// 정책 데이터를 computed로 관리하여 store 변경 즉시 반영
const ALL_POLICIES = computed(() => policyMatchingStore.recommendedPolicies);

// 미완료 신청 체크
const checkIncompleteApplication = async () => {
  try {
    const response = await policyInteractionAPI.getIncompleteApplication();
    if (response.data) {
      currentApplication.value = response.data;
      showStatusModal.value = true;
    }
  } catch (error) {
    // 404는 미완료 신청이 없는 정상 상황
    if (error.response?.status !== 404) {
      console.error('미완료 신청 조회 실패:', error);
    }
  }
};

// 모달 응답 처리
const handleStatusSubmit = async (status) => {
  if (!currentApplication.value) return;

  try {
    switch (status) {
      case 'applied':
        // 신청 완료 처리
        await policyInteractionAPI.completeApplication(
          currentApplication.value.policyId
        );
        // 신청 완료된 정책을 추천 목록에서 즉시 제거
        policyMatchingStore.removePolicyById(currentApplication.value.policyId);
        break;

      case 'notYet':
        // 신청 기록 삭제
        await policyInteractionAPI.removeApplication(
          currentApplication.value.policyId
        );
        break;

      case 'notEligible':
        // 조건 미충족으로 신청 불가한 경우 신청 기록 삭제 후 리뷰 작성
        await policyInteractionAPI.removeApplication(
          currentApplication.value.policyId
        );
        // 즉시 리뷰 모달 표시
        reviewPolicyInfo.value = {
          policyId: currentApplication.value.policyId,
          policyTitle: currentApplication.value.title,
          benefitStatus: 'NOT_ELIGIBLE'
        };
        showReviewModal.value = true;
        break;
    }
  } catch (error) {
    console.error('신청 상태 처리 실패:', error);
  } finally {
    currentApplication.value = null;
    showStatusModal.value = false;
  }
};

onMounted(async () => {
  try {
    const res = await policyAPI.getUserPolicySearch(); // 항상 요청
    policyMatchingStore.setRecommendedPolicies(res.data);
  } catch (e) {
    policyMatchingStore.clearRecommendedPolicies();
  }

  // 미완료 신청 체크
  await checkIncompleteApplication();
});

const policiesToShow = ref(3);
const visiblePolicies = computed(() =>
  ALL_POLICIES.value.slice(0, policiesToShow.value)
);
const showMoreBtn = computed(
  () => policiesToShow.value < ALL_POLICIES.value.length
);

const loadMore = () => {
  policiesToShow.value = Math.min(
    policiesToShow.value + 5,
    ALL_POLICIES.value.length
  );
};

// 대분류 중복 제거 함수
function getUniqueLargeCategories(policy) {
  // largeCategory가 배열이든, 문자열이든, 중복 없이 문자열 배열로 반환
  if (!policy.largeCategory) return [];
  if (Array.isArray(policy.largeCategory)) {
    // 배열 내 중복/공백 제거
    return Array.from(
      new Set(policy.largeCategory.filter((v) => !!v && v !== ''))
    );
  }
  // 문자열(콤마로 구분된 경우 포함) 처리
  if (typeof policy.largeCategory === 'string') {
    // 콤마로 구분된 문자열이면 분리
    const arr = policy.largeCategory
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
    return Array.from(new Set(arr));
  }
  return [];
}

// 리뷰 저장 처리
const handleReviewSave = async (reviewData) => {
  try {
    await policyInteractionAPI.addReview(reviewPolicyInfo.value.policyId, reviewData);
    alert('후기 작성이 완료되었습니다!');
    showReviewModal.value = false;
    reviewPolicyInfo.value = null;
  } catch (error) {
    console.error('리뷰 저장 실패:', error);
    alert('후기 작성에 실패했습니다. 다시 시도해주세요.');
  }
};

const goPolicyTypeTest = () => {
  router.push({ name: 'policyIntroForm' });
};
const goAllPolicy = () => {
  router.push({ name: 'policySearch' });
};
</script>

<style scoped>
.policyWrapper {
  background-color: var(--input-bg-2);
}
.searchBar {
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid var(--input-outline-2);
  border-radius: 6px;
  padding: 7px 14px;
  margin-bottom: 15px;
  gap: 6px;
}
.searchBar input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 13px;
  background-color: transparent;
}
.searchIconImage {
  width: 16px;
  height: 16px;
}
.policyCard {
  background-color: white;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
  cursor: pointer;
}
.cardHeader {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 6px;
  width: 100%;
  min-width: 0;
}
.titleTagRow {
  display: flex;
  align-items: center;
  min-width: 0;
  flex: 1;
  gap: 4px;
}

.topRank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  border-radius: 999px;
  width: 40px;
  height: 22px;
  color: #fff;
  letter-spacing: -0.5px;
  margin-right: 2px;
  flex-shrink: 0;
}
.rank1 {
  background: var(--top-rank-1);
}
.rank2 {
  background: var(--top-rank-2);
}
.rank3 {
  background: var(--top-rank-3);
}
.cardTitle {
  color: var(--text-login);
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  vertical-align: middle;
  max-width: calc(100% - 60px);
}
.cardTag {
  display: inline-block;
  background-color: var(--input-outline);
  color: var(--text-bluegray);
  padding: 1px 5px;
  border-radius: 6px;
  margin-left: 1px;
  font-size: 10px;
  vertical-align: middle;
  white-space: nowrap;
  flex-shrink: 0;
}
.cardDesc {
  color: var(--text-bluegray);
  margin: 4px 0;
}
.cardDeadline {
  margin-bottom: 11px;
}
.cardDeadline .label {
  color: var(--text-bluegray);
  margin-right: 3px;
}
.cardDeadline .date {
  color: var(--base-blue-dark);
  font-size: 11px;
}
.cardActions {
  display: flex;
  gap: 6px;
}
.buttonSecondary,
.buttonPrimary {
  flex: 1;
}
.buttonSecondary {
  width: 170px;
  background-color: var(--input-bg-2);
  border: none;
  padding: 10px;
  border-radius: 6px;
  color: var(--text-bluegray);
}
.buttonPrimary {
  width: 170px;
  background-color: var(--base-blue-dark);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
}
.moreButton {
  width: 100%;
  height: 45px;
  padding: 10px;
  background-color: white;
  border: none;
  color: var(--base-blue-dark);
  border-radius: 6px;
  border: 1px solid var(--input-outline);
  /* margin-top: 15px */
}
.fakeInput {
  pointer-events: auto;
}
</style>
