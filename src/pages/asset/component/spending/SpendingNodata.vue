<template>
  <div class="spending-no-data">
    <img
      src="@/assets/images/icons/bunny/nodata_bunny.png"
      alt="지출 내역 없음"
      class="no-data-icon"
    />
    <p class="no-data-text">아직 지출 내역이 없습니다</p>
  </div>
</template>

<script setup>
// props나 emit이 필요하면 나중에 추가
</script>

<style scoped>
.spending-no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 1rem;
  padding: 4rem 1.5rem;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
}

.no-data-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 2rem;
}

.no-data-text {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--text-darkgray);
  line-height: 1.4;
}
</style>
