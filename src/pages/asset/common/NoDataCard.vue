<template>
  <div class="no-data-card">
    <img
      src="@/assets/images/icons/bunny/nodata_bunny.png"
      alt="빈 데이터 아이콘"
      class="no-data-icon"
    />
    <p class="no-data-text">등록된 {{ typeLabel }}가 없습니다</p>
    <p class="no-data-subtext">
      첫 번째 {{ typeLabel }}를 추가하여 자산 관리를 시작해보세요
    </p>
    <button class="add-btn" @click="$emit('add')">
      + {{ addButtonLabel }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'; // 데이터 없는 경우
const props = defineProps({
  type: { type: String, required: true },
  // 'account' 또는 'card'
});

// 문구 매핑
const typeLabel = computed(() => (props.type === 'account' ? '계좌' : '카드'));
const addButtonLabel = computed(() =>
  props.type === 'account' ? '계좌 추가' : '카드 추가'
);
</script>

<style scoped>
.no-data-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 1rem;
  padding: 3rem 1.5rem;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

  margin-top: 1rem;
}

.no-data-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 2rem;
}

.no-data-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-darkgray);
  margin-bottom: 0.3rem;
}

.no-data-subtext {
  font-size: 0.875rem;
  color: var(--text-lightgray);
  margin-bottom: 1rem;
}

.add-btn {
  background-color: var(--base-blue-dark);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  cursor: pointer;
}
</style>
