<template>
  <div class="policyHeader">
    <div class="headerTop">
      <div class="title font-bold font-17">{{ title || policy.title }}</div>
      <!-- 로그인한 경우에만 북마크 아이콘 -->
      <img
        v-if="authStore.isLogin"
        :src="bookmark ? bookmarkAfter : bookmarkBefore"
        alt="bookmark icon"
        class="headerIcon"
        @click="toggleBookmark"
      />
    </div>
    <p class="desc font-13">
      {{ description || policy.description }}
    </p>

    <div class="reviewRow">
      <!-- <span class="stars" aria-label="평점 별">★★★★★</span> -->
      <!-- <span class="rating">{{ Number(rating).toFixed(1) }}</span> -->
      <button class="reviewLink font-11" @click="goToReviews">
        리뷰<span v-if="reviewCount"> {{ reviewCount }}개</span> 보기
      </button>
    </div>
    <div class="tags">
      <span v-for="(tag, i) in policy.tags" :key="i" class="tag">{{
        tag
      }}</span>
    </div>

    <p class="supportAmount font-bold font-16">
      {{ policy.supportAmount }}
    </p>

    <div class="actions">
      <button class="applyButton font-12" @click="openApplyModal(policy)">
        바로 신청하기
      </button>
      <button class="shareButton font-12" @click="toggleShareModal">
        <img :src="shareIcon" alt="공유" class="shareIcon" />
        공유하기
      </button>
    </div>

    <ShareModal
      v-if="showModal"
      :policyId="policy.policyId"
      @close="showModal = false"
    />
  </div>
  <PolicyApplyModal
    v-if="showApplyModal"
    :policyTitle="selectedPolicy?.title"
    :applyUrl="selectedPolicy?.applyUrl"
    :policyId="selectedPolicy?.policyId"
    @close="closeApplyModal"
    @showStatusModal="handleShowStatusModal"
  />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { bookmarkAPI } from '@/api/policyInteraction';

import ShareModal from './ShareModal.vue';
import PolicyApplyModal from '../component/PolicyApplyModal.vue';
import bookmarkBefore from '@/assets/images/icons/policy/bookmark_before.png';
import bookmarkAfter from '@/assets/images/icons/policy/bookmark_after.png';
import shareIcon from '@/assets/images/icons/policy/share.png';
import PolicyReviewPage from '../review/PolicyReviewPage.vue';

const props = defineProps({
  policy: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  // 리뷰 값 전달받기 (추가)
  reviewCount: { type: Number, default: 0 },
  reviewRouteName: { type: String, default: 'policyReviewPage' },
});

// 부모 컴포넌트로 이벤트 전달용
const emit = defineEmits(['showStatusModal']);

const showApplyModal = ref(false);
const selectedPolicy = ref(null);
const bookmark = ref(false);
const showModal = ref(false);

const authStore = useAuthStore();
const router = useRouter();

// 북마크 상태 조회 (로그인 한 경우에만)
async function fetchBookmarkStatus() {
  const policyId = props.policy?.id || props.policy?.policyId;
  if (!policyId) return;
  try {
    const res = await bookmarkAPI.getBookmarks();
    const list = res.data || [];
    bookmark.value = list.some(
      (item) => item.id === policyId || item.policyId === policyId
    );
  } catch (e) {
    console.warn('북마크 상태 조회 실패:', e);
  }
}

onMounted(() => {
  if (authStore.isLogin) {
    fetchBookmarkStatus();
  }
});

const toggleBookmark = async () => {
  const policyId = props.policy?.id || props.policy?.policyId;
  if (!policyId) return;
  try {
    if (!bookmark.value) {
      await bookmarkAPI.addBookmark(policyId);
      bookmark.value = true;
    } else {
      await bookmarkAPI.removeBookmark(policyId);
      bookmark.value = false;
    }
  } catch (e) {
    console.warn('북마크 토글 실패:', e);
  }
};

const toggleShareModal = () => {
  showModal.value = true;
};

// helper: www로 시작하면 https:// 붙여주는 함수
const normalizeUrl = (url) => {
  if (typeof url === 'string' && url.startsWith('www')) {
    return `https://${url}`;
  }
  return url;
};

// 바로 신청하기 버튼 클릭 시 신청 URL 우선순위(refUrl1 → refUrl2 → applyUrl)
function openApplyModal(policy) {
  let url = policy.applyUrl;
  if (!url) {
    url = policy.refUrl1 || policy.refUrl2 || '';
  }
  const fixedUrl = normalizeUrl(url);
  selectedPolicy.value = {
    ...policy,
    applyUrl: fixedUrl,
    policyId: policy.policyId || policy.id, // policyId 확실히 전달
  };
  showApplyModal.value = true;
}

function closeApplyModal() {
  showApplyModal.value = false;
}

// 신청 후 즉시 상태 모달 표시 - 부모 컴포넌트로 전달
const handleShowStatusModal = (applicationData) => {
  // 신청 모달 닫기
  showApplyModal.value = false;
  selectedPolicy.value = null;

  // 부모 컴포넌트(PolicyDetailPage)로 이벤트 전달
  emit('showStatusModal', applicationData);
};

// 리뷰 페이지 이동
const goToReviews = () => {
  const policyId = props.policy?.id || props.policy?.policyId;
  if (!policyId) {
    console.warn('goToReviews: policyId is not available');
    return;
  }
  router.push({
    name: props.reviewRouteName,
    params: { policyId: String(policyId) },
  });
};
</script>

<style scoped>
.policyHeader {
  background-color: white;
  border-radius: 6px;
  padding: 20px;
}

.headerTop {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 5px;
}

.headerIcon {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.desc {
  color: var(--text-bluegray);
  margin-bottom: 6px;
}

/* .tags {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
}

.tag {
  background-color: var(--input-outline);
  color: var(--text-bluegray);
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 4px;
} */

.supportAmount {
  color: var(--base-blue-dark);
  margin-bottom: 15px;
}

.actions {
  display: flex;
  gap: 8px;
}

.applyButton {
  flex: 1;
  background-color: var(--base-blue-dark);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  /* margin-right: 5px; */
}

.shareButton {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: var(--input-bg-2);
  color: var(--text-bluegray);
  border: none;
  padding: 12px;
  border-radius: 6px;
}

.shareIcon {
  width: 16px;
  height: 16px;
}

/* 리뷰 안내 (추가) */
.reviewRow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 6px 0 10px;
}

.reviewLink {
  background: transparent;
  border: none;
  padding: 0;
  text-decoration: underline;
  cursor: pointer;
  color: var(--text-bluegray);
}
</style>
