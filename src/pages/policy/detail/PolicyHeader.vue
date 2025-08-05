<script setup>
import { ref, onMounted } from "vue";
import api from "@/api";

import ShareModal from "./ShareModal.vue";
import PolicyApplyModal from "../component/PolicyApplyModal.vue";
import bookmarkBefore from "@/assets/images/icons/policy/bookmark_before.png";
import bookmarkAfter from "@/assets/images/icons/policy/bookmark_after.png";
import shareIcon from "@/assets/images/icons/policy/share.png";

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

const showApplyModal = ref(false);

const selectedPolicy = ref(null);

const bookmark = ref(false);
const showModal = ref(false);

const policyId = props.policy?.id || props.policy?.policyId;

// 북마크 상태 조회
async function fetchBookmarkStatus() {
  try {
    const res = await api.get("/api/policy-interaction/bookmark/list");
    const list = res.data || [];
    bookmark.value = list.some(
      (item) => item.id === policyId || item.policyId === policyId
    );
  } catch (e) {
    // 필요시 에러 처리
  }
}

onMounted(() => {
  fetchBookmarkStatus();
});

const toggleBookmark = async () => {
  if (!policyId) return;
  try {
    if (!bookmark.value) {
      await api.post(`/api/policy-interaction/bookmark?policyId=${policyId}`);
      bookmark.value = true;
    } else {
      await api.delete(`/api/policy-interaction/bookmark?policyId=${policyId}`);
      bookmark.value = false;
    }
  } catch (e) {
    // 필요시 에러 처리
  }
};

const toggleShareModal = () => {
  showModal.value = true;
};

function openApplyModal(policy) {
  selectedPolicy.value = policy;
  showApplyModal.value = true;
}

function closeApplyModal() {
  showApplyModal.value = false;
}
</script>

<template>
  <div class="policyHeader">
    <div class="headerTop">
      <div class="title font-bold font-20">{{ title || policy.title }}</div>
      <img
        :src="bookmark ? bookmarkAfter : bookmarkBefore"
        alt="bookmark icon"
        class="headerIcon"
        @click="toggleBookmark"
      />
    </div>
    <p class="desc font-14 font-regular">
      {{ description || policy.description }}
    </p>

    <div class="tags">
      <span v-for="(tag, i) in policy.tags" :key="i" class="tag">{{
        tag
      }}</span>
    </div>

    <p class="supportAmount font-bold font-18">
      {{ policy.supportAmount }}
    </p>

    <div class="actions">
      <button class="applyButton font-14" @click="openApplyModal(policy)">
        바로 신청하기
      </button>
      <button class="shareButton font-14" @click="toggleShareModal">
        <img :src="shareIcon" alt="공유" class="shareIcon" />
        공유하기
      </button>
    </div>
    <!-- 공유버튼에 policyId 넘겨주기 -->
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
    @close="closeApplyModal"
  />
</template>

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
  width: 30px;
  height: 30px;
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
  font-size: 13px;
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
  width: 20px;
  height: 20px;
}
</style>
