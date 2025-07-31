<template>
  <div class="card-item">
    <!-- 카드 이미지 -->
    <img
      :src="card.cardImage"
      :alt="`${card.cardName} 이미지`"
      class="card-logo"
    />

    <!-- 카드 정보 -->
    <div class="card-info">
      <div class="info-top">
        <p class="card-name">{{ card.cardName }}</p>
        <span v-if="isRepresentative" class="main-badge">대표</span>
      </div>
      <p class="card-number">{{ card.cardMaskedNumber }}</p>
      <p class="card-amount">{{ formatWon(card.amount) }}</p>
    </div>

    <!-- 카드 컨트롤 영역 -->
    <div class="card-control" @click.stop>
      <!-- 대표 카드 라벨 -->
      <button v-if="isRepresentative" class="main-label" disabled>
        대표 카드
      </button>
      <!-- 대표 카드 설정 버튼 -->
      <button v-else class="set-main-btn" @click.stop="$emit('set-main', card)">
        대표 설정
      </button>
      <!-- 삭제 버튼 -->
      <button class="delete-btn" @click.stop="isDeleteModalOpen = true">
        <img src="@/assets/images/icons/common/Trash.png" alt="삭제" />
      </button>
    </div>

    <!-- 삭제 확인 모달 -->
    <DeleteConfirmModal
      :visible="isDeleteModalOpen"
      title="카드 삭제"
      message="카드를 삭제하시겠습니까?"
      :subtitle="`${card.cardName} • ${card.cardMaskedNumber}`"
      warning="삭제된 카드는 복구할 수 없습니다."
      @close="isDeleteModalOpen = false"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DeleteConfirmModal from '@/pages/asset/common/DeleteConfirmModal.vue';

const props = defineProps({
  card: { type: Object, required: true },
  isRepresentative: { type: Boolean, default: false }, // 대표 카드 여부
});
const emit = defineEmits(['set-main', 'delete']); // 상위 이벤트 전달

const isDeleteModalOpen = ref(false);

// 금액 포맷
const formatWon = (value) => `${value.toLocaleString()}원`;

// 삭제 처리 (버블링 차단 후 상위로 이벤트 전달)
const handleDelete = (event) => {
  event?.stopPropagation();
  emit('delete', props.card);
  isDeleteModalOpen.value = false;
};
</script>

<style scoped>
.card-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--input-bg-2);
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
}

.card-logo {
  width: 3rem; /* 반응형 단위(rem) 사용 */
  height: 3rem;
  margin-right: 0.8rem;
  flex-shrink: 0;
  object-fit: contain; /* 비율 유지하면서 잘림 방지 */
  object-position: center; /* 이미지 중앙 정렬 */
  background-color: var(--input-bg-1); /* 배경색 (투명 PNG 대비) */
  border-radius: 0.25rem; /* 필요 시 살짝 둥글림 */
}

.card-info {
  flex: 1;
  cursor: default;
}

.info-top {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.card-name {
  font-size: 1rem;
  font-weight: 600;
}

.main-badge {
  background: var(--text-bluegray);
  color: white;
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;
}

.card-number {
  font-size: 0.9rem;
  color: var(--text-lightgray);
  margin-top: 0.2rem;
}

.card-amount {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--base-blue-dark);
  margin-top: 0.5rem;
}

.card-control {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.main-label {
  font-size: 0.8rem;
  color: var(--base-blue-dark);
  background: none;
  border: none;
}

.set-main-btn {
  font-size: 0.8rem;
  color: var(--base-blue-dark);
  background: #f5f7fa;
  border: 1px solid #e0e0e0;
  padding: 0.25rem 0.6rem;
  border-radius: 1rem;
  cursor: pointer;
}

.set-main-btn:hover {
  background: var(--sub-skyblue);
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
}

.delete-btn img {
  width: 24px;
  height: 24px;
  opacity: 0.5;
}
</style>
