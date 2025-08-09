<template>
  <!-- 💪(상일) iOS Safari 안내 모달 -->
  <div v-if="modelValue" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>더 나은 환경에서 이용하세요!</h3>
      </div>
      
      <div class="modal-body">
        <div class="safari-icon">🌐</div>
        <p>Safari에서 더 나은 환경을<br>체험하세요.</p>
        <div class="guide-steps">
          <div class="step">
            <span class="step-number">1</span>
            <span class="step-text">우하단 공유 버튼 터치</span>
          </div>
          <div class="step">
            <span class="step-number">2</span>
            <span class="step-text">'Safari에서 열기' 선택</span>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="closeModal" class="btn-confirm">
          확인
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 💪(상일) 모달 표시 상태
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

// 💪(상일) 모달 닫기
const closeModal = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
/* 💪(상일) 모달 오버레이 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 20px;
}

/* 💪(상일) 모달 콘텐츠 */
.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 320px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* 💪(상일) 모달 헤더 */
.modal-header {
  padding: 24px 24px 16px 24px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: var(--base-blue-dark);
}

/* 💪(상일) 모달 바디 */
.modal-body {
  padding: 24px;
  text-align: center;
}

.safari-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.modal-body p {
  font-size: 16px;
  color: #666;
  margin: 0 0 24px 0;
  line-height: 1.5;
}

/* 💪(상일) 가이드 스텝 */
.guide-steps {
  text-align: left;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
}

.step {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.step:last-child {
  margin-bottom: 0;
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--base-blue-dark);
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
  margin-right: 12px;
  flex-shrink: 0;
}

.step-text {
  font-size: 14px;
  color: #333;
}

/* 💪(상일) 모달 푸터 */
.modal-footer {
  padding: 16px 24px 24px 24px;
}

.btn-confirm {
  width: 100%;
  background: var(--base-blue-dark);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px 0;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-confirm:hover {
  background: var(--base-blue);
}

.btn-confirm:active {
  background: var(--base-blue-darker);
}
</style>