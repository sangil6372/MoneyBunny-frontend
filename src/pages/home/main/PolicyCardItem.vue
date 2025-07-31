<template>
  <div class="policy-top3-card">
    <div class="content-row">
      <div class="left">
        <div class="rank-circle">{{ rank }}</div>
        <div class="title">{{ title }}</div>
      </div>
      <div class="right">
        <div class="amount">+{{ amount.toLocaleString() }}원</div>
        <button class="apply-btn">신청하기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  rank: Number,
  title: String,
  amount: Number,
  highlighted: Boolean,
});
</script>

<style scoped>
.policy-top3-card {
  background-color: var(--input-bg-2);
  border-radius: 0.75rem;
  padding: 0.875rem 1rem;
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
}

.content-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rank-circle {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  background-color: var(--base-blue-dark);
  color: white;
  text-align: center;
  line-height: 1.5rem;
  font-size: 0.875rem;
  font-weight: bold;
}

.title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-login);
}

.right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.amount {
  font-size: 1rem;
  font-weight: bold;
  color: var(--base-blue-dark);
  white-space: nowrap;
}

.apply-btn {
  background-color: var(--base-blue-dark);
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
}
</style>
