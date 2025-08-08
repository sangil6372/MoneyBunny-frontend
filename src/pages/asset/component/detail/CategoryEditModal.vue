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
              v-for="category in predefinedCategories"
              :key="category.name"
              class="category-item"
              :class="{ selected: selectedCategory?.name === category.name }"
              @click="selectCategory(category)"
            >
              <div
                class="category-icon"
                :style="{ backgroundColor: category.color + '20' }"
              >
                <div
                  class="category-dot"
                  :style="{ backgroundColor: category.color }"
                ></div>
              </div>
              <span class="category-name">{{ category.name }}</span>
            </div>
          </div>
        </div>

        <!-- 사용자 정의 카테고리 -->
        <!--
        <div class="category-section" v-if="userDefinedCategories.length">
          <h3 class="section-title">사용자 정의 카테고리</h3>
          <div class="category-grid">
            <div
              v-for="category in userDefinedCategories"
              :key="category.name"
              class="category-item"
              :class="{ selected: selectedCategory?.name === category.name }"
              @click="selectCategory(category)"
            >
              <div class="category-icon" :style="{ backgroundColor: category.color + '20' }">
                <div class="category-dot" :style="{ backgroundColor: category.color }"></div>
              </div>
              <span class="category-name">{{ category.name }}</span>
              <div v-if="selectedCategory?.name === category.name" class="check-icon">✓</div>
            </div>
          </div>
        </div>
        -->

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
              <p class="preview-type">
                {{
                  selectedCategory.isUserDefined
                    ? '사용자 정의'
                    : '기본 카테고리'
                }}
              </p>
            </div>
          </div>
        </div>

        <!-- 확인 버튼 -->
        <div class="button-section">
          <button class="cancel-btn" @click="closeModal">취소</button>
          <button
            class="save-btn"
            :class="{ active: selectedCategory }"
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
import { ref, computed, watch } from 'vue';
import DetailHeader from './DetailHeader.vue';

const props = defineProps({
  show: Boolean,
  categoryData: {
    type: Object,
    required: true,
    default: () => ({ name: '', color: '#6366f1' }),
  },
});

const emit = defineEmits(['close', 'save']);

const predefinedCategories = ref([
  { name: '식비/외식', color: 'var(--red-1)', isUserDefined: false },
  { name: '쇼핑/잡화', color: 'var(--orange-1)', isUserDefined: false },
  { name: '교통/자동차', color: 'var(--yellow-2)', isUserDefined: false },
  { name: '취미/여가', color: 'var(--green-1)', isUserDefined: false },
  { name: '의료/건강', color: 'var(--green-2)', isUserDefined: false },
  { name: '교육/학습', color: 'var(--blue-1)', isUserDefined: false },
  { name: '주거/통신', color: 'var(--navy-1)', isUserDefined: false },
  { name: '금융/보험', color: 'var(--purple-2)', isUserDefined: false },
  { name: '기타', color: 'var(--gray-2)', isUserDefined: false },
]);

// 사용자 정의 카테고리들
const userDefinedCategories = ref([
  { name: '애완동물', color: '#8b5cf6', isUserDefined: true },
  { name: '부모님용돈', color: '#ec4899', isUserDefined: true },
]);

// 상태 관리
const selectedCategory = ref(null);
const showNewCategoryForm = ref(false);
const newCategoryName = ref('');
const newCategoryColor = ref('#6366f1');
const nameError = ref('');

// 색상 옵션들
const colorOptions = [
  'var(--red-1)',
  'var(--red-2)',
  'var(--orange-1)',
  'var(--orange-2)',
  'var(--yellow-1)',
  'var(--yellow-2)',
  'var(--green-1)',
  'var(--green-2)',
  'var(--blue-1)',
  'var(--blue-2)',
  'var(--navy-1)',
  'var(--navy-2)',
  'var(--purple-1)',
  'var(--purple-2)',
  'var(--gray-1)',
  'var(--gray-2)',
];

// 새 카테고리 생성 가능 여부
const canCreateCategory = computed(() => {
  const name = newCategoryName.value.trim();
  return name.length > 0 && name.length <= 10 && !nameError.value;
});

// 카테고리 선택
const selectCategory = (category) => {
  selectedCategory.value = category;
  showNewCategoryForm.value = false;
};

// 색상 선택
const selectColor = (color) => {
  newCategoryColor.value = color;
};

// 새 카테고리 폼 토글
const toggleNewCategoryForm = () => {
  showNewCategoryForm.value = !showNewCategoryForm.value;
  if (showNewCategoryForm.value) {
    selectedCategory.value = null;
  }
};

// 새 카테고리 생성
const createNewCategory = () => {
  if (!canCreateCategory.value) return;

  const newCategory = {
    name: newCategoryName.value.trim(),
    color: newCategoryColor.value,
    isUserDefined: true,
  };

  userDefinedCategories.value.push(newCategory);
  selectedCategory.value = newCategory;
  cancelNewCategory();
};

// 새 카테고리 취소
const cancelNewCategory = () => {
  newCategoryName.value = '';
  newCategoryColor.value = '#6366f1';
  nameError.value = '';
  showNewCategoryForm.value = false;
};

// 이름 유효성 검사
const validateName = () => {
  const name = newCategoryName.value.trim();

  if (name.length === 0) {
    nameError.value = '';
  } else if (name.length > 10) {
    nameError.value = '최대 10자까지 입력 가능합니다';
  } else {
    const allCategories = [
      ...predefinedCategories.value,
      ...userDefinedCategories.value,
    ];
    const isDuplicate = allCategories.some((cat) => cat.name === name);

    if (isDuplicate) {
      nameError.value = '이미 존재하는 카테고리입니다';
    } else {
      nameError.value = '';
    }
  }
};

// 카테고리 저장
const saveCategory = () => {
  if (!selectedCategory.value) return;
  emit('save', selectedCategory.value);
  closeModal();
};

// 모달 닫기
const closeModal = () => {
  selectedCategory.value = null;
  cancelNewCategory();
  emit('close');
};

// 모달이 열릴 때 현재 카테고리 선택
watch(
  () => props.show,
  (newVal) => {
    if (newVal && props.categoryData?.name) {
      const allCategories = [
        ...predefinedCategories.value,
        ...userDefinedCategories.value,
      ];
      const currentCategory = allCategories.find(
        (cat) => cat.name === props.categoryData.name
      );

      if (currentCategory) {
        selectedCategory.value = currentCategory;
      }
    }
  }
);

watch(newCategoryName, validateName);
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

/* 새 카테고리 추가 버튼 */
.add-category-btn {
  width: 100%;
  padding: 0.625rem;
  border: 2px dashed var(--input-bg-3);
  border-radius: 0.625rem;
  background: none;
  color: var(--text-darkgray);
  font-size: 0.8125rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
}

.plus-icon {
  font-size: 1.125rem;
  font-weight: bold;
}

/* 새 카테고리 폼 */
.new-category-form {
  margin-top: 0.75rem;
  padding: 0.875rem;
  background: var(--input-bg-1);
  border-radius: 0.75rem;
}

.input-section {
  margin-bottom: 0.75rem;
}

.input-label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-login);
  margin-bottom: 0.5rem;
}

.name-input {
  width: 100%;
  padding: 0.625rem;
  border: 2px solid var(--input-bg-3);
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  box-sizing: border-box;
}

.name-input:focus {
  outline: none;
  border-color: var(--base-blue-dark);
}

.name-input.error {
  border-color: var(--alert-red);
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.25rem;
}

.char-count {
  font-size: 0.75rem;
  color: var(--text-lightgray);
}

.error-text {
  font-size: 0.75rem;
  color: var(--alert-red);
}

/* 색상 선택 */
.color-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
}

.color-option {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.color-option.selected {
  transform: scale(1.05);
  box-shadow: 0 0 0 2px var(--base-blue-dark);
}

.color-option .check-icon {
  color: white;
  font-size: 0.75rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  position: static;
}

/* 폼 버튼 */
.form-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.cancel-form-btn,
.create-btn {
  flex: 1;
  padding: 0.625rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
}

.cancel-form-btn {
  background: var(--input-bg-3);
  color: var(--text-darkgray);
}

.create-btn {
  background: var(--input-disabled-1);
  color: white;
}

.create-btn.active {
  background: var(--base-blue-dark);
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
