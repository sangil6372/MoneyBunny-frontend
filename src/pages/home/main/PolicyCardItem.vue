<template>
  <div class="policyTop3Card">
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
defineProps({
  rank: Number,
  title: String,
  amount: Number,
  highlighted: Boolean,
});
</script>

<style scoped>
.policyTop3Card {
  background-color: var(--input-bg-2);
  border-radius: 0.5rem;
  padding: 0.5rem;
  /* border: 1px solid transparent; */
  display: flex;
  flex-direction: column;
}

.contentRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.2rem;
  flex-wrap: nowrap;
}

.left {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  flex-wrap: nowrap;
}

.rankCircle {
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
  background-color: var(--base-blue-dark);
  color: white;
  text-align: center;
  line-height: 1rem;
  font-size: 0.7rem;
  margin-left: 0.05rem;
  margin-right: 0.25rem;
}

.title {
  font-size: 0.75rem;
  font-weight: bold;
  color: var(--text-login);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 8.8rem;
  display: block;
}

.right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.amount {
  font-size: 0.75rem;
  font-weight: bold;
  color: var(--base-blue-dark);
  white-space: nowrap;
}

.nextIcon {
  width: 16px;
  height: 16px;
  object-fit: contain;

  margin: 0 1.5px;
  cursor: pointer;
  display: inline-block;
}
</style>
