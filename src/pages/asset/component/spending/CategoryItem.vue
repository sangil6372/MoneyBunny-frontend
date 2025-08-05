<template>
  <!-- 개별 카테고리 아이템 -->
  <div class="category-item" @click="handleClick">
    <div class="category-info">
      <!-- 색상 점 -->
      <div
        class="category-color-dot"
        :style="{ backgroundColor: category.color }"
      ></div>

      <!-- 카테고리명 -->
      <span class="category-name">{{ category.name }}</span>
    </div>

    <div class="category-amount-info">
      <!-- 금액 -->
      <span class="category-amount">{{ formatAmount(category.amount) }}</span>

      <!-- 비율 -->
      <span class="category-percentage">{{ category.percentage }}%</span>
    </div>
  </div>
</template>

<script setup>
// Props 정의
const props = defineProps({
  category: {
    type: Object,
    required: true,
  },
});

// Emits 정의
const emit = defineEmits(['click']);

// 금액 포맷 함수
const formatAmount = (amount) => {
  return `${amount.toLocaleString()}원`;
};

// 클릭 핸들러
const handleClick = () => {
  emit('click', props.category);
};
</script>

<style scoped>
.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--input-outline);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.category-item:last-child {
  border-bottom: none;
}

.category-item:active {
  background-color: var(--input-bg-1);
}

.category-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.category-color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 12px;
  flex-shrink: 0;
}

.category-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-login);
  margin-right: 8px;
}

.category-amount-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
}

.category-amount {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-login);
  margin-bottom: 2px;
}

.category-percentage {
  font-size: 12px;
  color: var(--text-bluegray);
}
</style>
