<template>
  <div class="policyHeader">
    <div class="headerTop">
      <div class="title font-bold font-18">{{ title || policy.title }}</div>
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

    <div class="tags">
      <span v-for="(tag, i) in policy.tags" :key="i" class="tag">{{
        tag
      }}</span>
    </div>

    <p class="supportAmount font-bold font-17">
      {{ policy.supportAmount }}
    </p>

    <div class="actions">
      <button class="applyButton font-13" @click="openApplyModal(policy)">
        바로 신청하기
      </button>
      <button class="shareButton font-13" @click="toggleShareModal">
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
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { bookmarkAPI } from "@/api/policyInteraction";

import ShareModal from './ShareModal.vue';
import PolicyApplyModal from '../component/PolicyApplyModal.vue';
import bookmarkBefore from '@/assets/images/icons/policy/bookmark_before.png';
import bookmarkAfter from '@/assets/images/icons/policy/bookmark_after.png';
import shareIcon from '@/assets/images/icons/policy/share.png';

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
});

// 💪(상일) 부모 컴포넌트로 이벤트 전달용
const emit = defineEmits(['showStatusModal']);

const showApplyModal = ref(false);
const selectedPolicy = ref(null);
const bookmark = ref(false);
const showModal = ref(false);

const policyId = props.policy?.id || props.policy?.policyId;

const authStore = useAuthStore();

// 북마크 상태 조회 (로그인 한 경우에만)
async function fetchBookmarkStatus() {
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

function openApplyModal(policy) {
  // applyUrl 이 www.xxx 로 시작하면 프로토콜 붙이고, 아니면 그대로
  const fixedUrl = normalizeUrl(policy.applyUrl);
  selectedPolicy.value = { 
    ...policy, 
    applyUrl: fixedUrl,
    policyId: policy.policyId || policy.id // 💪(상일) policyId 확실히 전달
  };
  showApplyModal.value = true;
}

function closeApplyModal() {
  showApplyModal.value = false;
}

// 💪(상일) 신청 후 즉시 상태 모달 표시 - 부모 컴포넌트로 전달
const handleShowStatusModal = (applicationData) => {
  // 신청 모달 닫기
  showApplyModal.value = false;
  selectedPolicy.value = null;
  
  // 부모 컴포넌트(PolicyDetailPage)로 이벤트 전달
  emit('showStatusModal', applicationData);
};
</script>

<style scoped>
.policyHeader {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
}

.headerTop {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 10px;
}

.headerIcon {
  width: 28px;
  height: 28px;
  cursor: pointer;
}

.desc {
  color: var(--text-bluegray);
  margin-bottom: 12px;
}

.tags {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.tag {
  background-color: var(--input-outline);
  color: var(--text-bluegray);
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 4px;
}

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
  border-radius: 8px;
  margin-right: 5px;
}

.shareButton {
  display: flex;
  align-items: center;
  gap: 7px;
  background-color: var(--input-bg-2);
  color: var(--text-bluegray);
  border: none;
  padding: 10px;
  border-radius: 8px;
}

.shareIcon {
  width: 18px;
  height: 18px;
}
</style>
