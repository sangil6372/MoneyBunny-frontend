<template>
  <!-- 카테고리 거래 상세 모달 오버레이 -->
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <!-- 헤더 영역 - 전체 가로폭 사용 -->
      <div class="modal-header">
        <DetailHeader :title="'거래 상세'" @back="closeModal" />
      </div>

      <!-- 컨텐츠 영역 - 패딩 적용, 스크롤 가능 -->
      <div class="modal-content">
        <!-- 거래 정보 카드 -->
        <div class="info-card">
          <!-- 카테고리 태그 -->
          <div v-if="transaction.category" class="category-tag">
            #{{ transaction.category }}
          </div>

          <!-- 거래 제목 -->
          <h2 class="transaction-title">{{ getTransactionTitle() }}</h2>

          <!-- 상세 정보 리스트 -->
          <div class="detail-grid">
            <!-- 거래 시각 -->
            <div class="detail-item">
              <span class="detail-label">거래시각</span>
              <span class="detail-value">{{ formatTransactionDate() }}</span>
            </div>

            <!-- 거래 구분 -->
            <div class="detail-item">
              <span class="detail-label">거래구분</span>
              <span class="detail-value transaction-type negative">지출</span>
            </div>

            <!-- 거래 금액 -->
            <div class="detail-item amount-item">
              <span class="detail-label">거래금액</span>
              <span class="detail-value transaction-amount-detail negative">
                -{{ formatAmount(getTransactionAmount()) }}원
              </span>
            </div>

            <!-- 카테고리 (수정 가능) -->
            <div class="detail-item" v-if="transaction.category">
              <span class="detail-label">카테고리</span>
              <div class="category-edit-section">
                <span class="category-tag">{{ transaction.category }}</span>
                <button
                  class="edit-category-btn"
                  @click="openCategoryEditModal"
                >
                  <img
                    src="@/assets/images/icons/mypage/edit.png"
                    alt="편집"
                    class="edit-icon"
                  />
                </button>
              </div>
            </div>

            <!-- 상점 유형 (있는 경우) -->
            <div class="detail-item" v-if="transaction.storeType">
              <span class="detail-label">상점유형</span>
              <span class="detail-value">{{ transaction.storeType }}</span>
            </div>

            <!-- 결제 수단 (있는 경우) -->
            <div class="detail-item" v-if="transaction.paymentMethod">
              <span class="detail-label">결제수단</span>
              <span class="detail-value">{{ transaction.paymentMethod }}</span>
            </div>

            <!-- 추가 정보 (메모 등이 있는 경우) -->
            <div class="detail-item" v-if="transaction.memo">
              <span class="detail-label">메모</span>
              <span class="detail-value">{{ transaction.memo }}</span>
            </div>
          </div>
        </div>

        <!-- 거래 메모 카드 -->
        <div class="memo-card">
          <h3>메모</h3>
          <!-- 메모 입력 필드 -->
          <input
            type="text"
            v-model="memoText"
            maxlength="20"
            placeholder="메모를 입력하세요 (최대 20자)"
            class="memo-input"
            @input="updateMemoCount"
          />
          <!-- 메모 하단: 글자수 카운터와 저장 버튼 -->
          <div class="memo-footer">
            <span class="memo-count">{{ memoText.length }}/20</span>
            <button
              class="memo-save"
              :class="{ active: isSaveActive }"
              :disabled="!isSaveActive"
              @click="saveMemo"
            >
              저장
            </button>
          </div>
        </div>

        <!-- 확인 버튼 -->
        <button class="confirm-btn" @click="closeModal">확인</button>
      </div>
    </div>

    <!-- 카테고리 수정 모달 -->
    <CategoryEditModal
      :show="showCategoryEditModal"
      :category-data="categoryEditData"
      @close="closeCategoryEditModal"
      @save="handleCategorySave"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import DetailHeader from './DetailHeader.vue';
import CategoryEditModal from './CategoryEditModal.vue';

// Props 정의
const props = defineProps({
  show: Boolean, // 모달 표시 여부
  transaction: { type: Object, required: true }, // 카테고리 거래 데이터
});
const emit = defineEmits(['close', 'category-updated']);

// 메모 관련 상태
const memoText = ref('');

// 카테고리 수정 모달 상태
const showCategoryEditModal = ref(false);
const categoryEditData = ref({});

// Computed 속성들
const isSaveActive = computed(() => memoText.value.trim().length > 0); // 저장 버튼 활성화 여부

// 금액 포맷팅
const formatAmount = (value) => {
  if (typeof value !== 'number' || isNaN(value)) return '0';
  return value.toLocaleString();
};

// 거래 제목 가져오기
const getTransactionTitle = () => {
  return (
    props.transaction.merchant ||
    props.transaction.description ||
    props.transaction.storeName ||
    props.transaction.title ||
    props.transaction.memo ||
    '거래'
  );
};

// 거래 금액 가져오기
const getTransactionAmount = () => {
  return props.transaction.amount || props.transaction.price || 0;
};

// 거래 날짜 포맷팅
const formatTransactionDate = () => {
  try {
    if (!props.transaction.date) return '';

    // 날짜 문자열 정규화 (점을 대시로 변경)
    let dateStr = props.transaction.date;
    if (typeof dateStr === 'string') {
      dateStr = dateStr.replace(/\./g, '-');
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return props.transaction.date;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // 시간 정보가 있으면 추가
    let timeStr = '';
    if (props.transaction.time) {
      timeStr = ` ${props.transaction.time}`;
    }

    return `${year}-${month}-${day}${timeStr}`;
  } catch (error) {
    return props.transaction.date || '';
  }
};

// 모달 닫기 함수
const closeModal = () => {
  memoText.value = ''; // 모달 닫을 때 메모 초기화
  emit('close');
};

// 메모 입력 이벤트 핸들러 (실제로는 v-model이 자동 처리)
const updateMemoCount = () => {
  // input 이벤트에서 자동으로 v-model이 업데이트됨
};

// 메모 저장 함수
const saveMemo = () => {
  if (memoText.value.trim()) {
    // TODO: API 호출하여 메모 저장
    console.log('카테고리 거래 메모 저장:', memoText.value);
    // 저장 후 초기화하거나 성공 메시지 표시
  }
};

// 카테고리 수정 모달 열기
const openCategoryEditModal = () => {
  console.log('🔥 카테고리 수정 모달 열기 시작');
  console.log('현재 transaction:', props.transaction);

  // 현재 거래의 카테고리 정보로 모달 데이터 설정
  categoryEditData.value = {
    name: props.transaction.category || '',
    color: '#6366f1', // 기본 색상 (실제로는 카테고리별 색상을 가져와야 함)
    id: props.transaction.category, // 카테고리 식별용
  };

  console.log('설정된 categoryEditData:', categoryEditData.value);

  showCategoryEditModal.value = true;

  console.log(
    '모달 열림 상태 변경 후 showCategoryEditModal.value:',
    showCategoryEditModal.value
  );
};

// 카테고리 수정 모달 닫기
const closeCategoryEditModal = () => {
  console.log('카테고리 수정 모달 닫기');
  showCategoryEditModal.value = false;
  categoryEditData.value = {};
};

// 카테고리 저장 처리
const handleCategorySave = (updatedCategory) => {
  console.log('카테고리 저장:', updatedCategory);

  // 부모 컴포넌트에 카테고리 변경 알림
  emit('category-updated', {
    transactionId: props.transaction.transactionId || props.transaction.id,
    category: updatedCategory.name,
    oldCategory: props.transaction.category,
  });

  // 모달 닫기
  closeCategoryEditModal();
};

// 모달이 열릴 때마다 메모 초기화
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      memoText.value = '';
    }
  }
);
</script>

<style scoped>
/* 모달 오버레이 - 전체 화면 덮는 반투명 배경 */
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

/* 모달 컨테이너 - 실제 모달 내용을 담는 영역 */
.modal-container {
  width: 100%;
  max-width: 474px;
  background: var(--input-bg-2);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* 헤더 영역 - 전체 가로폭 사용, 높이 고정 */
.modal-header {
  width: 100%;
  background: var(--input-bg-2);
  flex-shrink: 0;
}

/* 헤더 내부 컴포넌트 스타일 강제 적용 (deep selector 사용) */
.modal-header :deep(.detail-header),
.modal-header :deep(.header-container),
.modal-header :deep(.fixed-header) {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding-left: 1rem !important;
  padding-right: 1rem !important;
  box-sizing: border-box !important;
}

/* 컨텐츠 영역 - 스크롤 가능, 패딩 적용 */
.modal-content {
  flex: 1;
  padding: 0 1rem 2rem;
  overflow-y: auto;
  box-sizing: border-box;
}

/* 거래 정보 카드 스타일 */
.info-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-top: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 카테고리 태그 스타일 */
.category-tag {
  display: inline-block;
  background: var(--base-blue-light);
  color: var(--base-blue-dark);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
}

/* 거래 제목 (상점명 등) - 크기 증가 */
.transaction-title {
  font-size: 1.7rem;
  font-weight: 500;
  color: var(--text-login);
  margin: 0.75rem 0 1.5rem 0; /* 상단, 하단 마진 증가 */
  line-height: 1.3;
  word-break: break-all;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--input-bg-1);
}

/* 상세 정보 그리드 */
.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 상세 정보 아이템 */
.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--input-bg-1);
}

/* 마지막 아이템은 하단 구분선 제거 */
.detail-item:last-child {
  border-bottom: none;
}

/* 상세 정보 라벨 */
.detail-label {
  font-size: 0.9rem;
  color: var(--text-darkgray);
  font-weight: 500;
}

/* 상세 정보 값 */
.detail-value {
  font-size: 0.9rem;
  color: var(--text-login);
  font-weight: 600;
  text-align: right;
}

/* 거래금액 아이템 강조 */
.amount-item .detail-value {
  font-size: 1.125rem;
  font-weight: 700;
}

/* 거래금액 색상 - 카테고리는 항상 지출이므로 빨간색 */
.transaction-amount-detail.negative {
  color: var(--alert-red);
}

/* 거래구분 지출 색상 */
.transaction-type.negative {
  color: var(--alert-red);
}

/* 메모 카드 스타일 */
.memo-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-top: 1rem;
}

/* 메모 카드 제목 */
.memo-card h3 {
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: var(--base-blue-dark);
  font-weight: 600;
}

/* 메모 입력 필드 */
.memo-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--input-bg-3);
  border-radius: 0.75rem;
  margin-top: 0.25rem;
  font-size: 0.9rem;
  box-sizing: border-box;
}

/* 메모 입력 필드 포커스 시 */
.memo-input:focus {
  outline: none;
  border-color: var(--base-blue-dark);
}

/* 메모 하단 영역 - 글자수와 저장 버튼 */
.memo-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
}

/* 글자수 카운터 */
.memo-count {
  font-size: 0.8rem;
  color: var(--text-lightgray);
}

/* 메모 저장 버튼 기본 상태 */
.memo-save {
  background: var(--input-disabled-1);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
}

/* 메모 저장 버튼 활성화 상태 */
.memo-save.active {
  background: var(--base-blue-dark);
}

/* 메모 저장 버튼 터치 시 피드백 */
.memo-save:active {
  transform: scale(0.98);
}

.category-edit-section {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
}

.edit-category-btn {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-category-btn:active {
  background: var(--input-bg-1);
  transform: scale(0.95);
}

.edit-icon {
  width: 1rem;
  height: 1rem;
}

/* 확인 버튼 */
.confirm-btn {
  background: var(--base-blue-dark);
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 1rem;
  font-size: 1.05rem;
  font-weight: 600;
  margin-top: 1.5rem;
  width: 100%;
}

/* 확인 버튼 터치 시 피드백 */
.confirm-btn:active {
  background: #263952;
  transform: scale(0.98);
}
</style>
