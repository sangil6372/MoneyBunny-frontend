<template>
  <div
    class="policyTop3Card"
    @click="goDetail"
    role="button"
    :aria-label="`${rank}위 ${title} 혜택 ${amount.toLocaleString()}원`"
  >
    <!-- 1줄: 순위 + 제목 -->
    <div class="topRow">
      <div class="left">
        <div class="rankCircle">{{ rank }}</div>
        <div class="title">{{ title }}</div>
      </div>
    </div>

    <!-- 2줄: 설명(좌) + 금액(우) -->
    <div class="bottomRow">
      <div class="desc">{{ description }}</div>
      <div class="amount">+{{ amount.toLocaleString() }}원</div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  rank: Number,
  title: String,
  description: String,
  amount: Number,
  highlighted: Boolean,
  policyId: [String, Number],
});

const router = useRouter();

// 상세페이지로 연결해줘야함
function goDetail() {
  if (!props.policyId) return;
  router.push({ name: 'policyDetail', params: { policyId: props.policyId } });
}
</script>
<style scoped>
.policyTop3Card {
  background: var(--input-bg-2);
  border-radius: 6px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
}

/* 1줄: 순위 + 제목 */
.topRow {
  display: flex;
  align-items: center;
}
.left {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.rankCircle {
  width: 17px;
  height: 17px;
  border-radius: 9999px;
  background: var(--base-blue-dark);
  color: #fff;
  font-size: 11px;
  line-height: 17px;
  text-align: center;
  flex: 0 0 17px;
}
.title {
  font-size: 13px;
  font-weight: bold;
  color: var(--text-login);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* 2줄: 설명(좌) + 금액(우) */
.bottomRow {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.desc {
  flex: 1 1 auto;
  min-width: 64px;
  font-size: 11px;
  color: var(--text-bluegray);
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.amount {
  flex: 0 0 auto;
  font-size: 12px;
  font-weight: bold;
  color: var(--base-blue-dark);
  white-space: nowrap;
  margin-left: 8px;
  flex-shrink: 0;
  white-space: nowrap;
}
</style>
