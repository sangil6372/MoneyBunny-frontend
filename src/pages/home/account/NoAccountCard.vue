<template>
  <div class="no-account-card">
    <img :src="cryingBunny" alt="계좌 없음" class="illustration" />
    <h3>등록된 계좌가 없습니다</h3>
    <p>첫 번째 계좌를 추가하여 자산 관리를 시작해보세요</p>
    <AddItemButton @click="$emit('add')">계좌 추가</AddItemButton>
  </div>
</template>
<script setup>
import cryingBunny from '@/assets/images/icons/bunny/noaccount_bunny.png';
import AddItemButton from '../common/AddItemButton.vue';
</script>
<style scoped>
.no-account-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 2.5rem 1rem;
  min-height: 25rem;
  text-align: center;

  color: var(--text-login);
  background-color: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.04);
}

.illustration {
  width: 5rem;
  height: 5rem;
  opacity: 0.8;
}

h3 {
  font-size: 1.125rem;
  font-weight: 600;
}

p {
  font-size: 0.875rem;
  color: var(--text-bluegray);
}
</style>
