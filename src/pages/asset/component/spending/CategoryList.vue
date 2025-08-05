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

    <!-- 더보기 버튼 (5개 초과 시에만 표시) -->
    <div
      v-if="categories.length > 5 && categories.length > 0"
      class="show-more-section"
    >
      <button class="show-more-button" @click="toggleShowAll">
        {{ showAll ? '접기' : `더 많은 내역 보기 ↓` }}
      </button>
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
const emit = defineEmits(['toggle-show-all', 'category-click']);

// 표시할 카테고리 계산
const displayedCategories = computed(() => {
  if (props.showAll || props.categories.length <= 5) {
    return props.categories;
  }
  return props.categories.slice(0, 5);
});

// 더보기/접기 토글
const toggleShowAll = () => {
  emit('toggle-show-all');
};

// 카테고리 클릭 핸들러
const handleCategoryClick = (category) => {
  emit('category-click', category);
};
</script>

<style scoped>
.category-list-container {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  margin-top: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
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
