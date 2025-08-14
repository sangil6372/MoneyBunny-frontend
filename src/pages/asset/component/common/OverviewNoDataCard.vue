<template>
  <div class="overview-no-data-card">
    <!-- 아이콘 영역 -->
    <div class="icon-container">
      <div class="icon-circle">
        {{ iconText }}
      </div>
    </div>

    <!-- 컨텐츠 영역 -->
    <div class="content">
      <h3 class="title">{{ title }}</h3>
      <p class="description">{{ description }}</p>

      <!-- 버튼 영역 -->
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '데이터가 없습니다',
  },
  description: {
    type: String,
    default: '새로운 항목을 추가해보세요',
  },
  buttonText: {
    type: String,
    default: '추가하기',
  },
  showButton: {
    type: Boolean,
    default: true,
  },
  iconText: {
    type: String,
    default: '+',
  },
});

const emit = defineEmits(['button-click']);

const handleButtonClick = () => {
  emit('button-click');
};
</script>

<style scoped>
.overview-no-data-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  background-color: var(--input-bg-2);
  border-radius: 0.75rem;
  text-align: center;
  min-height: 120px;
  gap: 0.75rem;
}

/* 아이콘 영역 */
.icon-container {
  margin-bottom: 0.25rem;
}

.icon-circle {
  width: 48px;
  height: 48px;
  background-color: var(--base-blue-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  color: var(--base-blue-dark);
  margin: 0 auto;
}

/* 컨텐츠 영역 */
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-login);
  margin: 0;
  line-height: 1.3;
  font-family: 'NanumSquareNeo', sans-serif;
}

.description {
  font-size: 0.8125rem;
  color: var(--text-lightgray);
  margin: 0;
  line-height: 1.4;
  font-family: 'NanumSquareNeo', sans-serif;
}

/* 버튼 */
.action-button {
  padding: 0.5rem 1rem;
  background-color: var(--base-blue-dark);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'NanumSquareNeo', sans-serif;
  margin-top: 0.25rem;
}

.action-button:active {
  background-color: var(--base-lavender);
  transform: scale(0.98);
}

/* 작은 화면에서 더 컴팩트하게 */
@media (max-width: 480px) {
  .overview-no-data-card {
    padding: 1.25rem 0.75rem;
    min-height: 100px;
    gap: 0.5rem;
  }

  .icon-circle {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .title {
    font-size: 0.875rem;
  }

  .description {
    font-size: 0.75rem;
  }

  .action-button {
    padding: 0.4375rem 0.875rem;
    font-size: 0.75rem;
  }
}
</style>
