<!-- src/components/policy/detail/PolicyOverviewTab.vue -->
<script setup>
import pointSupportIcon from '@/assets/images/icons/policy/point_support.png';
import interestSupportIcon from '@/assets/images/icons/policy/interest_support.png';
import linkIcon from '@/assets/images/icons/policy/link.png';

const props = defineProps({
  policy: Object,
});

const iconMap = {
  '적립금 지원': pointSupportIcon,
  '이자 지원': interestSupportIcon,
  '취업 연계': linkIcon,
};
</script>

<template>
  <div class="tabContent">
    <!-- ✅ 정책 목적 -->
    <div class="font-bold font-20 mb-2">정책 목적</div>
    <p class="font-15 text-bluegray mb-4">{{ policy.objective }}</p>

    <!-- ✅ 지원 내용 -->
    <div class="font-bold font-20 mb-2">지원 내용</div>
    <div
      class="supportBox"
      v-for="(item, index) in policy.supportDetails"
      :key="index"
    >
      <div class="titleRow">
        <img :src="iconMap[item.title]" alt="icon" class="supportIcon" />
        <div class="font-bold font-15 mb-1">{{ item.title }}</div>
      </div>
      <p class="font-14 text-bluegray">{{ item.desc }}</p>
    </div>

    <!-- ✅ 관련 정책 -->
    <!-- <div v-if="policy.relatedPolicies?.length" class="mt-4">
      <div class="font-bold font-20 mb-2">관련 정책</div>
      <div
        class="relatedItem"
        v-for="(related, index) in policy.relatedPolicies"
        :key="index"
      >
        <div class="info">
          <p class="font-bold font-15 mb-2">{{ related.title }}</p>
          <p class="font-13 text-bluegray">{{ related.desc }}</p>
        </div>
        <button class="viewButton font-13">자세히 보기</button>
      </div>
    </div> -->
  </div>
</template>

<style scoped>
.tabContent {
  background-color: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 80px;
}
.supportBox {
  background-color: var(--input-bg-2);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  height: 90px;
}
.titleRow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.supportIcon {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
}
.text-bluegray {
  color: var(--text-bluegray);
}
.mb-1 {
  margin-top: 3px;
  margin-bottom: 8px;
}
.mb-2 {
  margin-bottom: 10px;
}

.mb-3 {
  margin-top: 6px;
  margin-bottom: 6px;
}
.mb-4 {
  margin-bottom: 16px;
}
.mt-4 {
  margin-top: 24px;
}
.relatedItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 6px;
  border-bottom: 1px solid var(--input-outline);
}
.relatedItem:last-child {
  border-bottom: none;
}
.viewButton {
  background-color: var(--input-bg-2);
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  color: var(--text-bluegray);
  cursor: pointer;
}
</style>
