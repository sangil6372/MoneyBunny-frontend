<script setup>
import { computed } from 'vue';
import siteIcon from '@/assets/images/icons/policy/worknet.png';

const props = defineProps({
  policy: Object,
});

// 화면 출력용 파싱 함수 (줄바꿈 기준 분리)
const splitLines = (str) =>
  str ? str.split('\n').filter((s) => s.trim() !== '') : [];

const getSiteIcon = (url) => {
  return siteIcon;
};

const applicationMethod = computed(() => props.policy?.applicationMethod || '');
const submitDocuments = computed(() => props.policy?.submitDocuments || '');
const screeningMethod = computed(() => props.policy?.screeningMethod || '');
const refUrl1 = computed(() => props.policy?.refUrl1 || '');
const refUrl2 = computed(() => props.policy?.refUrl2 || '');
const etcNotes = computed(() => props.policy?.etcNotes || '');
</script>

<template>
  <div class="applyTab">
    <!-- 신청 절차 -->
    <div v-if="applicationMethod" class="font-16 font-bold mb-3">신청 절차</div>
    <ul v-if="applicationMethod" class="stepsBox">
      <li
        v-for="(step, idx) in splitLines(applicationMethod)"
        :key="idx"
        class="stepsItem"
      >
        {{ step }}
      </li>
    </ul>

    <!-- 제출 서류 -->
    <div v-if="submitDocuments" class="font-16 font-bold mb-2 mt-4">
      제출 서류
    </div>
    <ul v-if="submitDocuments" class="docsBox font-11">
      <li v-for="(doc, idx) in splitLines(submitDocuments)" :key="idx">
        {{ doc }}
      </li>
    </ul>

    <!-- 심사 및 발표 -->
    <div v-if="screeningMethod" class="font-16 font-bold mt-4 mb-2">
      심사 및 발표
    </div>
    <ul v-if="screeningMethod" class="reviewBox">
      <li v-for="(review, idx) in splitLines(screeningMethod)" :key="idx">
        {{ review }}
      </li>
    </ul>

    <!-- 참고 사이트 -->
    <div v-if="refUrl1 || refUrl2" class="font-16 font-bold mt-4 mb-2">
      참고 사이트
    </div>
    <div v-if="refUrl1 || refUrl2" class="siteBadgeColumn">
      <a
        v-if="refUrl1"
        class="siteBadge"
        :href="refUrl1"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img :src="getSiteIcon(refUrl1)" alt="siteIcon" class="badgeImage" />
        {{ refUrl1.replace(/^https?:\/\//, '').replace(/\/.*/, '') }}
      </a>
      <a
        v-if="refUrl2"
        class="siteBadge"
        :href="refUrl2"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img :src="getSiteIcon(refUrl2)" alt="siteIcon" class="badgeImage" />
        {{ refUrl2.replace(/^https?:\/\//, '').replace(/\/.*/, '') }}
      </a>
    </div>

    <!-- 기타 정보 -->
    <div v-if="etcNotes" class="font-16 font-bold mt-4 mb-2">기타 정보</div>
    <div v-if="etcNotes" class="etcBox font-11">
      {{ etcNotes }}
    </div>
  </div>
</template>

<style scoped>
.applyTab {
  background-color: white;
  border-radius: 16px;
  padding: 20px;
}
.stepsBox,
.reviewBox {
  background-color: var(--input-bg-2);
  border-radius: 8px;
  padding: 16px 20px;
  list-style-type: disc;
}
.stepsBox li,
.reviewBox li {
  color: var(--text-bluegray);
  font-size: 12px;
  margin-bottom: 7px;
}
.stepsBox li:last-child,
.reviewBox li:last-child {
  margin-bottom: 0;
}
.docsBox {
  background-color: var(--input-bg-2);
  border-radius: 8px;
  padding: 16px 24px;
  list-style-type: disc;
}
.docsBox li {
  color: var(--text-bluegray);
  font-size: 11px;
  margin-bottom: 6px;
}
.docsBox li:last-child {
  margin-bottom: 0;
}
.siteBadgeColumn {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 6px;
}

.siteBadge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: 8px;
  color: var(--base-blue-dark);
  font-size: 12px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  background-color: var(--input-bg-2);
  justify-content: left;
}
.badgeImage {
  width: 18px;
  height: 18px;
  object-fit: contain;
  margin-right: 2px;
  flex-shrink: 0;
  vertical-align: middle;
}

.etcBox {
  background-color: var(--input-bg-2);
  border-radius: 8px;
  padding: 16px 18px;
  color: var(--text-bluegray);
  min-height: 36px;
  margin-bottom: 6px;
}
.mb-2 {
  margin-bottom: 8px;
}
.mb-3 {
  margin-bottom: 12px;
}
.mt-4 {
  margin-top: 18px;
}
</style>
