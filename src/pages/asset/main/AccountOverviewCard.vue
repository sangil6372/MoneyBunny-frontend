<template>
  <div class="overview-card">
    <!-- 타이틀 -->
    <div class="title-row" @click="goToAccountTab">
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
import { ref, onMounted } from 'vue';
import AccountList from '../account/AccountOverviewList.vue';
import rawAccounts from '@/assets/data/accounts.json';

const emit = defineEmits(['switchTab']);
const accounts = ref([]);

// 내부 탭 전환: 계좌탭 이동
const goToAccountTab = () => {
  emit('switchTab', '계좌');
};

onMounted(() => {
  accounts.value = rawAccounts;
});
</script>

<style scoped>
.overview-card {
  background-color: #fff;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: var(--shadow-sm, 0 2px 6px rgba(0, 0, 0, 0.05));
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: 1rem;
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
