<template>
  <div class="overview-card" @click="goToAccountTab">
    <!-- 타이틀 -->
    <div class="title-row">
      <h3>계좌 현황</h3>
      <div class="arrow">
        <img
          src="@/assets/images/icons/common/arrow_right.png"
          alt="계좌이동 아이콘"
          class="arrow-icon"
        />
      </div>
    </div>

    <!-- 계좌 리스트 (최대 3개 표시) -->
    <AccountList :accounts="accounts.slice(0, 3)" />
  </div>
</template>

<script setup>
import AccountList from '../account/AccountOverviewList.vue';

const props = defineProps({
  accounts: { type: Array, required: true },
});

const emit = defineEmits(['switchTab']);

// 계좌 탭으로 이동
const goToAccountTab = () => {
  emit('switchTab', '계좌');
};
</script>

<style scoped>
.overview-card {
  background-color: #fff;
  border-radius: 1rem;
  padding: 1rem;
  /* box-shadow: var(--shadow-sm, 0 2px 6px rgba(0, 0, 0, 0.05)); */
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  /* cursor 제거 - 상위 카드에서 처리 */
}

.title-row h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-title, #111827);
}

.arrow-icon {
  width: 1rem;
  height: 1rem;
}
</style>
