<script setup>
import { ref } from 'vue';

import ShareModal from './ShareModal.vue';
import bookmarkBefore from '@/assets/images/icons/policy/bookmark_before.png';
import bookmarkAfter from '@/assets/images/icons/policy/bookmark_after.png';
import shareIcon from '@/assets/images/icons/policy/share.png';

const props = defineProps({
  policy: {
    type: Object,
    required: true,
  },
});

const bookmark = ref(false);
const showModal = ref(false);

const toggleBookmark = () => {
  bookmark.value = !bookmark.value;
};

const toggleShareModal = () => {
  showModal.value = true;
};
</script>

<template>
  <div class="policyHeader">
    <div class="headerTop">
      <div class="title font-bold font-22">{{ policy.title }}</div>
      <img
        :src="bookmark ? bookmarkAfter : bookmarkBefore"
        alt="bookmark icon"
        class="headerIcon"
        @click="toggleBookmark"
      />
    </div>
    <p class="desc font-15 font-regular">{{ policy.description }}</p>

    <div class="tags">
      <span v-for="(tag, i) in policy.tags" :key="i" class="tag">{{
        tag
      }}</span>
    </div>

    <p class="supportAmount font-bold font-20">
      {{ policy.supportAmount }} 지원
    </p>

    <div class="actions">
      <button class="applyButton font-15 font-bold">바로 신청하기</button>
      <button class="shareButton font-15 font-bold" @click="toggleShareModal">
        <img :src="shareIcon" alt="공유" class="shareIcon" />
        공유하기
      </button>
    </div>
    <ShareModal v-if="showModal" @close="showModal = false" />
  </div>
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
