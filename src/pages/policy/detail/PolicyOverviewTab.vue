<!-- src/components/policy/detail/PolicyOverviewTab.vue -->
<script setup>
const props = defineProps({
  policy: Object,
  period: String, // "20250220 ~ 20251015" 형태
});

const formatPeriod = (periodStr) => {
  if (!periodStr) return '상시';
  const match = periodStr.match(/^(\d{8})\s*~\s*(\d{8})$/);
  if (!match) return periodStr;
  const [_, start, end] = match;
  const s = `${start.slice(0, 4)}.${start.slice(4, 6)}.${start.slice(6, 8)}`;
  const e = `${end.slice(0, 4)}.${end.slice(4, 6)}.${end.slice(6, 8)}`;
  return `${s} ~ ${e}`;
};
</script>

<template>
  <div class="tabContent">
    <div class="font-bold font-18 mb-2">정책 설명</div>
    <p class="font-14 text-bluegray mb-4">{{ policy.objective }}</p>

    <div class="font-bold font-18 mb-2">지원 내용</div>
    <div
      class="supportBox"
      v-for="(item, index) in policy.supportDetails"
      :key="index"
    >
      <div class="supportTitle font-bold font-14 mb-1">{{ item.title }}</div>
      <p class="font-13 text-bluegray">{{ item.desc }}</p>
    </div>

    <div class="font-18 font-bold mb-2 mt-4">신청 기간</div>
    <div class="periodBox">
      <img
        src="@/assets/images/icons/policy/calendar.png"
        alt="달력"
        class="calendarIcon"
      />
      <div class="periodContent">
        <div class="periodText font-14 font-bold">
          {{ formatPeriod(period) }}
        </div>
        <span class="periodSub font-12">
          연중 상시 접수 (예산 소진 시 조기 마감)
        </span>
      </div>
    </div>
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
  margin-bottom: 8px;
  min-height: 50px;
}
.supportTitle {
  margin-bottom: 8px;
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
.mb-4 {
  margin-bottom: 16px;
}
.mt-4 {
  margin-top: 24px;
}
.periodBox {
  display: flex;
  align-items: flex-start;
  background-color: var(--input-bg-2);
  border-radius: 8px;
  padding: 16px;
  gap: 12px;
}
.calendarIcon {
  width: 22px;
  height: 22px;
  margin-top: 3px;
  flex-shrink: 0;
}
.periodContent {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.periodText {
  line-height: 2;
  color: var(--text-default);
  margin-bottom: 4px;
}
.periodSub {
  display: block;
  color: var(--text-bluegray);
  line-height: 1.6;
  margin-left: 0;
}
</style>
