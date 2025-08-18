<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <!-- 1단계: 로그인 -->
      <LoginStep
        v-if="currentStep === 'login'"
        :type="type"
        @login-success="handleLoginSuccess"
        @close="closeModal"
      />

      <!-- 2단계: 계좌/카드 선택 -->
      <SelectItemsStep
        v-if="currentStep === 'select'"
        :type="type"
        :institution-info="institutionInfo"
        :preloaded-items="availableItems"
        @items-selected="handleItemsSelected"
        @back="goBackToLogin"
        @close="closeModal"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue';
import LoginStep from './LoginStep.vue';
import SelectItemsStep from './SelectItemsStep.vue';

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['account', 'card'].includes(value),
  },
});

// Emits
const emit = defineEmits(['close', 'update-data']);

// 상태 관리
const currentStep = ref('login');
const institutionInfo = ref(null);
const availableItems = ref([]);

// 메서드
const handleLoginSuccess = async (loginData) => {

  // 기관 정보 저장
  institutionInfo.value = loginData;

  try {
    availableItems.value = loginData.items || [];
    // 2단계로 이동
    currentStep.value = 'select';
  } catch (error) {
    console.error('계좌/카드 목록 로드 실패:', error);
    alert('계좌 정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
  }
};

const handleItemsSelected = async (selectedData) => {

  try {
    // 부모 컴포넌트로 데이터 전달
    emit('update-data', {
      type: props.type,
      institutionCode: selectedData.institutionInfo.institutionCode,
      institutionName: selectedData.institutionInfo.institutionName,
      loginId: selectedData.institutionInfo.loginId,
      items: selectedData.selectedItems,
      addedAt: new Date().toISOString(),
    });

    // 모달 닫기
    closeModal();
  } catch (error) {
    console.error('등록 처리 실패:', error);
    alert('등록 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
};

const goBackToLogin = () => {
  currentStep.value = 'login';
  // 기관 정보는 유지 (사용자 편의를 위해)
  availableItems.value = [];
};

const closeModal = () => {
  emit('close');

  // 상태 초기화 (다음에 열 때 깨끗한 상태로)
  setTimeout(() => {
    if (!props.isOpen) {
      resetModalState();
    }
  }, 300); // 애니메이션 완료 후 초기화
};

const resetModalState = () => {
  currentStep.value = 'login';
  institutionInfo.value = null;
  availableItems.value = [];
};

// 모달이 닫힐 때 상태 초기화
watch(
  () => props.isOpen,
  (newValue) => {
    if (!newValue) {
      // 모달이 닫힐 때 약간의 지연 후 상태 초기화
      setTimeout(() => {
        resetModalState();
      }, 300);
    }
  }
);

// body 스크롤 제어
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }
);

// 컴포넌트 언마운트 시 body 클래스 정리
onUnmounted(() => {
  document.body.classList.remove('modal-open');
});
</script>

<style scoped>
/* 오버레이 */
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
  backdrop-filter: blur(2px);
}

/* 모달 콘텐츠 */
.modal-content {
  background: white;
  border-radius: 6px;
  padding: 20px;
  width: 96%;
  max-width: 360px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

/* 애니메이션 */
@keyframes modalAppear {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 스크롤바 스타일링 */
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: var(--input-bg-2);
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: var(--input-disabled-1);
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: var(--input-disabled-2);
}

/* 반응형 */
@media (max-width: 480px) {
  .modal-content {
    width: 98%;
    max-width: none;
    margin: 1rem;
    padding: 1rem;
    max-height: 95vh;
  }
}

/* 모달 열릴 때 배경 스크롤 방지 */
:global(body.modal-open) {
  overflow: hidden;
  position: fixed;
  width: 100%;
}
</style>
