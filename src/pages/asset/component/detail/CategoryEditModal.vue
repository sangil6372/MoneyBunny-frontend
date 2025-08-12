<template>
  <!-- 카테고리 선택 모달 -->
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <!-- 헤더 -->
      <div class="modal-header">
        <DetailHeader :title="'카테고리 변경'" @back="closeModal" />
      </div>

      <!-- 내용 -->
      <div class="modal-content">
        <!-- 미리 정의된 카테고리 -->
        <div class="category-section">
          <h3 class="section-title">카테고리 목록</h3>
          <div class="category-grid">
            <div
              v-for="cat in categories"
              :key="cat.id"
              class="category-item"
              :class="{ selected: selectedCategory?.id === cat.id }"
              @click="selectCategory(cat)"
            >
              <div
                class="category-icon"
                :style="{ backgroundColor: cat.color + '20' }"
              >
                <div
                  class="category-dot"
                  :style="{ backgroundColor: cat.color }"
                ></div>
              </div>
              <span class="category-name">{{ cat.name }}</span>
            </div>
          </div>
        </div>

        <!-- 선택된 카테고리 미리보기 -->
        <div v-if="selectedCategory" class="selected-preview">
          <h3 class="section-title">선택된 카테고리</h3>
          <div class="preview-card">
            <div
              class="preview-icon"
              :style="{ backgroundColor: selectedCategory.color + '20' }"
            >
              <div
                class="preview-dot"
                :style="{ backgroundColor: selectedCategory.color }"
              ></div>
            </div>
            <div class="preview-info">
              <p class="preview-name">{{ selectedCategory.name }}</p>
              <p class="preview-type">기본 카테고리</p>
            </div>
          </div>
        </div>

        <!-- 확인 버튼 -->
        <div class="button-section">
          <button class="cancel-btn" @click="closeModal">취소</button>
          <button
            class="save-btn"
            :class="{ active: !!selectedCategory }"
            :disabled="!selectedCategory"
            @click="saveCategory"
          >
            변경
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import DetailHeader from './DetailHeader.vue';

const props = defineProps({
  show: Boolean,
  categoryData: {
    type: Object,
    required: true,
    default: () => ({ id: null, name: '', color: 'var(--gray-2)' }),
  },
});

const emit = defineEmits(['close', 'save']);

const categories = ref([
  { id: 12, name: '건강과 의료', color: 'var(--green-2)' },
  { id: 13, name: '교육', color: 'var(--blue-1)' },
  { id: 1, name: '교통/자동차', color: 'var(--yellow-2)' },
  { id: 3, name: '레저와 여가생활', color: 'var(--orange-1)' },
  { id: 4, name: '마트', color: 'var(--yellow-1)' },
  { id: 11, name: '보험과 금융', color: 'var(--purple-2)' },
  { id: 9, name: '뷰티', color: 'var(--purple-1)' },
  { id: 2, name: '생활', color: 'var(--gray-1)' },
  { id: 6, name: '쇼핑', color: 'var(--red-2)' },
  { id: 10, name: '식비', color: 'var(--red-1)' },
  { id: 14, name: '여행', color: 'var(--navy-1)' },
  { id: 7, name: '온라인 쇼핑', color: 'var(--gray-2)' },
  { id: 15, name: '주류', color: 'var(--red-2)' },
  { id: 16, name: '카테고리 미지정', color: 'var(--gray-2)' },
  { id: 8, name: '커피와 디저트', color: 'var(--orange-2)' },
  { id: 5, name: '편의점', color: 'var(--green-1)' },
]);

const selectedCategory = ref(null);

const selectCategory = (category) => {
  selectedCategory.value = category;
};

const saveCategory = () => {
  if (!selectedCategory.value) return;
  const { id, name, color } = selectedCategory.value;
  emit('save', { id, name, color });
  closeModal();
};

const closeModal = () => {
  emit('close');
};

/**
 * 모달 열릴 때 현재 카테고리로 초기 선택
 * - id가 있으면 id로 매칭
 * - id가 없으면 name으로 매칭
 */
watch(
  () => props.show,
  (open) => {
    if (!open) return;
    const byId =
      props.categoryData?.id != null
        ? categories.value.find((c) => c.id === props.categoryData.id)
        : null;

    const byName =
      !byId && props.categoryData?.name
        ? categories.value.find((c) => c.name === props.categoryData.name)
        : null;

    selectedCategory.value = byId || byName || null;
  },
  { immediate: true }
);
</script>

<style scoped>
/* 모달 오버레이 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 2000;
}

/* 모달 전체 영역 */
.modal-container {
  width: 100%;
  max-width: 474px;
  height: 92vh;
  background: var(--input-bg-2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

/* 헤더 */
.modal-header {
  width: 100%;
  background: var(--input-bg-2);
  flex-shrink: 0;
}

.modal-header :deep(.detail-header) {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding-left: 1rem !important;
  padding-right: 1rem !important;
  box-sizing: border-box !important;
}

/* 내용 영역 */
.modal-content {
  flex: 1;
  padding: 0.75rem 1rem 1.25rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}

/* 섹션 */
.category-section {
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  margin-top: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-login);
  margin-bottom: 0.75rem;
}

/* 카테고리 그리드 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 0.625rem;
  border: 2px solid var(--input-bg-3);
  border-radius: 0.625rem;
  cursor: pointer;
  position: relative;
}

.category-item.selected {
  border-color: var(--base-blue-dark);
  background: var(--base-blue-light);
}

.category-icon {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.category-dot {
  width: 0.875rem;
  height: 0.875rem;
  border-radius: 50%;
}

.category-name {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-login);
  flex: 1;
}

.check-icon {
  color: var(--base-blue-dark);
  font-size: 0.875rem;
  font-weight: bold;
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
}

/* 선택된 카테고리 미리보기 */
.selected-preview {
  background: white;
  border-radius: 1rem;
  padding: 1.25rem;
  margin-top: 0.75rem;
}

.preview-card {
  display: flex;
  align-items: center;
  padding: 0.875rem;
  background: var(--input-bg-1);
  border-radius: 0.75rem;
}

.preview-icon {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
}

.preview-dot {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
}

.preview-info {
  flex: 1;
}

.preview-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-login);
  margin: 0 0 0.25rem 0;
}

.preview-type {
  font-size: 0.75rem;
  color: var(--text-bluegray);
  margin: 0;
}

/* 하단 버튼 */
.button-section {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.25rem;
}

.cancel-btn,
.save-btn {
  flex: 1;
  padding: 0.875rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
}

.cancel-btn {
  border: 2px solid var(--input-bg-3);
  background: white;
  color: var(--text-darkgray);
}

.save-btn {
  background: var(--input-disabled-1);
  color: white;
}

.save-btn.active {
  background: var(--base-blue-dark);
}
</style>
