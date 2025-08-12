<template>
  <div class="policyTop3Card" @click="goDetail">
    <div class="contentRow">
      <div class="left">
        <div class="rankCircle">{{ rank }}</div>
        <div class="title">{{ title }}</div>
      </div>
      <div class="right">
        <div class="amount">+{{ amount.toLocaleString() }}원</div>
        <img
          class="nextIcon"
          src="@/assets/images/icons/home/next.png"
          alt="다음"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  rank: Number,
  title: String,
  amount: Number,
  highlighted: Boolean,
  policyId: [String, Number], // String 또는 Number 허용
});

const router = useRouter();

// 👸🏻(은잔) : 상세페이지로 연결해줘야함
function goDetail() {
  if (!props.policyId) return;
  router.push({ name: 'policyDetail', params: { policyId: props.policyId } });
}
</script>

<style scoped>
.policyTop3Card {
  background-color: var(--input-bg-2);
  border-radius: 0.5rem;
  padding: 0.8rem;
  /* border: 1px solid transparent; */
  display: flex;
  flex-direction: column;
}

.contentRow {
  /* padding: 5px; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.2rem;
  flex-wrap: nowrap;
}

.left {
  margin-left: -5px;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  flex-wrap: nowrap;
}

.rankCircle {
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 9999px;
  background-color: var(--base-blue-dark);
  color: white;
  text-align: center;
  line-height: 1rem;
  font-size: 0.6rem;
  margin-right: 0.1rem;
}

.title {
  font-size: 0.7rem;
  font-weight: bold;
  color: var(--text-login);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 10rem;
  display: block;
}

.right {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-right: -3px;
}

.amount {
  font-size: 0.65rem;
  font-weight: bold;
  color: var(--base-blue-dark);
  white-space: nowrap;
}

.nextIcon {
  width: 13px;
  height: 13px;
  object-fit: contain;

  margin: 0 1px;
  cursor: pointer;
  display: inline-block;
}
</style>
