<template>
  <div class="home-total-tab">
    <!--오늘의 한마디-->
    <DailyMessageCard
      title="오늘의 한마디!"
      message="오늘 커피값이 많이 나갔네요!"
      cta="내일은 집에서 커피 어때요?
      ? 🐰"
    />

    <!--계좌 현황-->
    <AccountOverviewCard :accounts="accountList" @switchTab="onTabChange" />

    <!--최근 지출 카드-->
    <RecentSpendingCard :spendingList="spendingList" @switchTab="onTabChange" />

    <!--일정-->
    <UpcomingScheduleCard :scheduleList="scheduleList" />
  </div>
</template>

<script setup>
import AssetSummaryCard from '../common/AssetSummaryCard.vue';
import DailyMessageCard from '../total/DailyMessageCard.vue';
import AccountOverviewCard from '../total/AccountOverviewCard.vue';
import RecentSpendingCard from '../total/RecentSpendingCard.vue';
import UpcomingScheduleCard from '../total/UpcomingScheduleCard.vue';
import TotalSummaryCard from '../total/TotalSummaryCard.vue';

//탭 이동(계좌, 최근 지출)
const emit = defineEmits(['switchTab']);

function onTabChange(tab) {
  emit('switchTab', tab); // 상위로 전달
}
</script>

<style scoped>
.home-total-tab {
  display: flex;
  flex-direction: column;
  gap: 1.25rem; /* ✅ 요약 카드와 탭 사이 포함 모든 요소 간 20px 간격 */
  padding: 1.25rem;
}
</style>
