<template>
  <div class="overview-card" @click="goToAccountTab">
    <!-- 타이틀 -->
    <div class="title-row" @click="goToAccountTab">
      <div>계좌 현황</div>
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
  border-radius: 6px;
  padding: 1rem;
}

.title-row {
  padding: 0 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: bold;
  font-size: 0.9rem;
  color: var(--base-blue-dark);
}

.arrow-icon {
  width: 1rem;
  height: 1rem;
}
</style>
