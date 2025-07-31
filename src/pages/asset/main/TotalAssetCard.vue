<template>
  <div class="home-card">
    <div class="home-card-section">
      <div class="home-card-label">내 자산 (계좌 + 카드 사용 금액)</div>
      <div class="home-card-value">{{ totalAssetDisplay }}</div>
    </div>
    <div class="home-card-section">
      <div class="home-card-label">이번달 카드 사용 금액</div>
      <div class="home-card-value">{{ cardUsageDisplay }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 초기값:  9999999로 설정
const totalAsset = ref(9999999);
const cardUsage = ref(9999999);

// 연결 시 API 값으로 자동 갱신
const totalAssetDisplay = computed(
  () => totalAsset.value.toLocaleString() + '원'
);
const cardUsageDisplay = computed(
  () => cardUsage.value.toLocaleString() + '원'
);
</script>

<style scoped>
@import '@/assets/styles/homecard.css';
</style>
