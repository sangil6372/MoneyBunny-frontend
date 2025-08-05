<template>
  <div v-if="visible" class="modal-overlay" @click.self="onClose">
    <div class="modal-content">
      <!-- 상단 제목과 닫기 버튼 -->
      <div class="modal-header">
        <h2 class="modal-title">{{ title || '삭제 확인' }}</h2>
        <button class="close-btn" @click="onClose">
          <img src="@/assets/images/icons/common/x.png" alt="닫기" />
        </button>
      </div>

      <!-- 중앙 아이콘 -->
      <img
        src="@/assets/images/icons/bunny/delete_bunny.png"
        alt="토끼 아이콘"
        class="bunny-icon"
      />

      <!-- 안내 문구 -->
      <p class="modal-text">{{ message }}</p>
      <p v-if="subtitle" class="modal-subtitle">{{ subtitle }}</p>
      <p v-if="warning" class="warning-text">{{ warning }}</p>

      <!-- 하단 버튼 -->
      <div class="modal-actions">
        <button class="cancel-btn" @click.stop="onClose">취소</button>
        <button class="delete-btn" @click.stop="onConfirm">삭제</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeleteConfirmModal',
  props: {
    visible: { type: Boolean, required: true },
    title: { type: String, default: '삭제 확인' }, // 모달 제목
    message: { type: String, default: '정말 삭제하시겠습니까?' }, // 안내 문구
    subtitle: { type: String, default: '' }, // 추가 정보 (계좌명 등)
    warning: { type: String, default: '삭제된 항목은 복구할 수 없습니다.' }, // 경고 문구
  },
  emits: ['close', 'confirm'],
  methods: {
    // 닫기 이벤트
    onClose(event) {
      event?.stopPropagation();
      this.$emit('close');
    },
    // 삭제 확인 이벤트 (버블링 차단)
    onConfirm(event) {
      event?.stopPropagation();
      event?.preventDefault();
      this.$emit('confirm');
    },
  },
};
</script>

<style scoped>
@import '@/assets/styles/colors.css';
@import '@/assets/styles/main.css';

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-login);
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
}

.close-btn img {
  width: 20px;
  height: 20px;
}

.bunny-icon {
  display: block;
  margin: 0 auto 1rem auto;
  width: 5rem;
  height: 5rem;
}

.modal-text {
  font-size: 1rem;
  color: var(--text-darkgray);
  margin-bottom: 0.5rem;
}

.modal-subtitle {
  font-size: 0.95rem;
  color: var(--text-bluegray);
  margin-bottom: 0.5rem;
}

.warning-text {
  font-size: 0.85rem;
  color: var(--alert-strong);
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.cancel-btn,
.delete-btn {
  flex: 1;
  padding: 0.75rem 0;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.cancel-btn {
  background: var(--input-bg-3);
  color: var(--text-bluegray);
}

.delete-btn {
  background: var(--alert-strong);
}
</style>
