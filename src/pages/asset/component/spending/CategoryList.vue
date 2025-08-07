<template>
  <div class="category-list-container">
    <!-- 데이터가 없을 때 -->
    <div v-if="categories.length === 0" class="no-categories">
      <p class="no-categories-text">지출 내역이 없습니다</p>
    </div>

    <!-- 카테고리 아이템들 -->
    <div v-else class="category-items">
      <CategoryItem
        v-for="(category, index) in displayedCategories"
        :key="`${category.name}-${index}`"
        :category="category"
        @click="handleCategoryClick"
      />
    </div>

    <!-- 더보기 버튼 (3개 초과이고 아직 펼쳐지지 않았을 때만 표시) -->
    <div v-if="categories.length > 3 && !showAll" class="show-more-section">
      <button class="show-more-button" @click="toggleShowAll">더보기 ↓</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import CategoryItem from './CategoryItem.vue';

// Props 정의
const props = defineProps({
  categories: {
    type: Array,
    required: true,
    default: () => [],
  },
  showAll: {
    type: Boolean,
    default: false,
  },
});

// Emits 정의
const emit = defineEmits(['toggleShowAll', 'categoryClick']);

// 표시할 카테고리 계산 (3개까지만 기본 표시)
const displayedCategories = computed(() => {
  if (props.showAll || props.categories.length <= 3) {
    return props.categories;
  }
  return props.categories.slice(0, 3);
});

// 더보기 토글 (한번 누르면 모든 내역 표시)
const toggleShowAll = () => {
  emit('toggleShowAll');
};

// 카테고리 클릭 핸들러
const handleCategoryClick = (category) => {
  emit('categoryClick', category);
};
</script>

<style scoped>
.category-list-container {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  margin-top: 24px;
}

.show-more-section {
  margin-top: 16px;
  text-align: center;
}

.show-more-button {
  width: 100%;
  padding: 12px 0;
  background-color: transparent;
  border: none;
  font-size: 14px;
  color: var(--text-bluegray);
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  /* 모바일 터치 최적화 */
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.show-more-button:active {
  background-color: var(--input-bg-1);
}

.no-categories {
  text-align: center;
  padding: 2rem 0;
}

.no-categories-text {
  font-size: 0.875rem;
  color: var(--text-lightgray);
  margin: 0;
}
</style>
