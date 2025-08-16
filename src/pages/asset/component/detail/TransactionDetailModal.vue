<template>
  <!-- 거래 상세(상세보기의 상세보기) 모달 오버레이 -->
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
          <!-- 카테고리 태그 (카드인 경우만) -->
          <div
            v-if="type === 'card' && transaction.category"
            class="category-tag"
          >
            #{{ transaction.category }}
          </div>

          <!-- 거래 제목 -->
          <div class="transaction-title">{{ transaction.description }}</div>

          <!-- 상세 정보 리스트 -->
          <div class="detail-grid">
            <!-- 거래 시각 -->
            <div class="detail-item">
              <span class="detail-label">거래시각</span>
              <span class="detail-value"
                >{{ transaction.date }} {{ transaction.time }}</span
              >
            </div>

            <!-- 거래 구분 (계좌: 입금/출금, 카드: 환불/지출) -->
            <div class="detail-item">
              <span class="detail-label">거래구분</span>
              <span :class="['detail-value', 'transaction-type', amountClass]">
                {{ getTransactionType() }}
              </span>
            </div>

            <!-- 거래 금액 -->
            <div class="detail-item amount-item">
              <span class="detail-label">거래금액</span>
              <span
                :class="[
                  'detail-value',
                  'transaction-amount-detail',
                  amountClass,
                ]"
              >
                {{ amountSign }}{{ formatAmount(transaction.amount) }}원
              </span>
            </div>

            <!-- 거래후 잔액 (계좌인 경우) -->
            <div class="detail-item" v-if="type === 'account'">
              <span class="detail-label">거래 후 잔액</span>
              <span class="detail-value balance">
                {{ formatAmount(transaction.balanceAfter) }}원
              </span>
            </div>

            <!-- 카드정보 (카드인 경우) -->
            <div class="detail-item" v-if="type === 'card'">
              <span class="detail-label">카드정보</span>
              <span class="detail-value">{{
                getPaymentType(transaction.paymentType)
              }}</span>
            </div>

            <!-- 사용처 (매장유형이 있는 경우) -->
            <div
              class="detail-item"
              v-if="type === 'card' && transaction.storeType"
            >
              <span class="detail-label">사용처</span>
              <span class="detail-value">{{ transaction.storeType }}</span>
            </div>

            <!-- 카드 전용: 환불 정보 (환불인 경우만 표시) -->
            <div
              class="detail-item"
              v-if="
                type === 'card' &&
                transaction.isCancel &&
                transaction.cancelAmount
              "
            >
              <span class="detail-label">환불금액</span>
              <span class="detail-value positive"
                >+{{ formatAmount(transaction.cancelAmount) }}원</span
              >
            </div>
          </div>
        </div>

        <!-- 거래 메모 카드 -->
        <div class="memo-card">
          <div>메모</div>
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
    <div
      v-if="toast.show"
      class="mbToast"
      :class="toast.type"
      role="status"
      aria-live="polite"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { onBeforeUnmount } from 'vue';
import DetailHeader from './DetailHeader.vue';
import {
  updateCardTransactionMemo,
  updateAccountTransactionMemo,
} from '@/api/assetApi';

//👸🏻(은진) : 저장 토스트
const toast = ref({ show: false, message: '', type: 'success' }); // type: 'success' | 'error'
let toastTimer = null;
function showToast(message, type = 'success', ms = 1800) {
  toast.value = { show: true, message, type };
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.value.show = false), ms);
}
onBeforeUnmount(() => clearTimeout(toastTimer));

// Props 정의
const props = defineProps({
  show: Boolean, // 모달 표시 여부
  transaction: { type: Object, required: true }, // 거래 데이터
  type: { type: String, required: true }, // 'account' | 'card'
});
const emit = defineEmits(['close', 'memo-updated']);

// 메모 관련 상태
const isSaving = ref(false); // 저장 중 상태
const memoText = ref('');

// Computed 속성들
const isSaveActive = computed(() => memoText.value.trim().length > 0); // 저장 버튼 활성화 여부
const formatAmount = (value) => value?.toLocaleString() ?? '0'; // 금액 포맷팅

// 금액 색상 클래스 결정 (입금/환불: 초록색, 출금/지출: 빨간색)
const amountClass = computed(() => {
  if (props.type === 'card')
    return props.transaction.isCancel ? 'positive' : 'negative';
  return props.transaction.type === '입금' ? 'positive' : 'negative';
});

// 금액 부호 결정 (+/-)
const amountSign = computed(() => {
  if (props.type === 'card') return props.transaction.isCancel ? '+' : '-';
  return props.transaction.type === '입금' ? '+' : '-';
});

// 결제방식 텍스트 변환 (카드 전용)
const getPaymentType = (paymentType) => {
  if (paymentType === 'single') return '일시불';
  return paymentType || '일시불';
};

// 거래구분 텍스트 결정 (계좌: 입금/출금, 카드: 환불/지출)
const getTransactionType = () => {
  if (props.type === 'account') {
    return props.transaction.type; // 입금/출금
  } else if (props.type === 'card') {
    return props.transaction.isCancel ? '환불' : '지출';
  }
  return '';
};

// 모달 닫기 함수
const closeModal = () => {
  emit('close');
};

// 메모 입력 이벤트 핸들러 (실제로는 v-model이 자동 처리)
const updateMemoCount = () => {
  // input 이벤트에서 자동으로 v-model이 업데이트됨
};

console.log(props.transaction);

// 메모 저장 함수
const saveMemo = async () => {
  if (!memoText.value.trim()) return;
  try {
    isSaving.value = true;
    const txId = props.transaction.id ?? props.transaction.transactionId;
    let res;
    if (props.type === 'account') {
      res = await updateAccountTransactionMemo(txId, memoText.value);
    } else {
      res = await updateCardTransactionMemo(txId, memoText.value);
    }
    const newMemo = res.data;
    memoText.value = newMemo;
    props.transaction.memo = newMemo;
    emit('memo-updated', { id: txId, memo: newMemo });
    showToast('메모가 저장되었습니다.', 'success');
  } catch (e) {
    showToast('메모 저장에 실패했어요.', 'error');
  } finally {
    isSaving.value = false;
  }
};

watch(
  () => props.transaction.memo,
  (newVal) => {
    memoText.value = newVal || '';
  },
  { immediate: true }
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
  max-width: 390px;
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
  padding: 1rem;
  overflow-y: auto;
  box-sizing: border-box;
}

/* 거래 정보 카드 스타일 */
.info-card {
  background: white;
  border-radius: 6px;
  padding: 16px;
}

.info-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--input-bg-1);
  gap: 1rem;
}

/* 좌측 영역 - 텍스트만 */
.info-left {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0; /* flex 아이템이 줄어들 수 있도록 */
}

/* 텍스트 영역 */
.info-text {
  flex: 1;
  min-width: 0; /* 텍스트가 줄어들 수 있도록 */
}

/* 거래 제목 (상점명 등) - 크기 증가 */
.transaction-title {
  font-size: 1rem;
  color: var(--text-login);
  line-height: 1.3;
  word-break: break-all;
  margin: 0;
  padding: 8px 0 12px;
  border-bottom: 1px solid var(--input-bg-1);
}

/* 거래 부제목 */
.transaction-sub {
  font-size: 0.7rem;
  color: var(--text-bluegray);
  margin: 0;
}

/* 금액 표시 영역 */
.amount-section {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  flex-shrink: 0; /* 금액 영역은 줄어들지 않도록 */
  min-width: fit-content; /* 내용에 맞는 최소 너비 확보 */
}

/* 거래 금액 텍스트 */
.transaction-amount {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
}

/* 입금/환불 금액 색상 (초록색) */
.transaction-amount.positive {
  color: var(--text-green);
}

/* 출금/지출 금액 색상 (빨간색) */
.transaction-amount.negative {
  color: var(--alert-red);
}

/* 금액 라벨 */
.amount-label {
  font-size: 0.65rem;
  color: var(--text-lightgray);
}

/* 상세 정보 그리드 */
.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 0rem;
  margin-top: 0;
}

/* 상세 정보 아이템 */
.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--input-bg-1);
}

detail-item:first-child {
  padding-top: 10px;
}
.detail-item:last-child {
  padding-bottom: 0; /* 마지막 행 아래 과한 공백 제거 */
  border-bottom: none;
}

/* 상세 정보 라벨 */
.detail-label {
  line-height: 1.35;
  font-size: 0.8rem;
  color: var(--text-darkgray);
}

/* 상세 정보 값 */
.detail-value {
  font-size: 0.8rem;
  color: var(--text-login);
  font-variant-numeric: tabular-nums;
  line-height: 1.35;
}

/* 잔액 표시 색상 */
.detail-value.balance {
  color: var(--base-blue-dark);
  font-weight: bold;
}

/* 거래구분 입금/환불 색상 */
.transaction-type.positive {
  color: var(--text-green);
}

/* 거래구분 출금/지출 색상 */
.transaction-type.negative {
  color: var(--alert-red);
}

/* 메모 카드 스타일 */
.memo-card {
  background: white;
  border-radius: 6px;
  padding: 1.5rem;
  margin-top: 1rem;
}

/* 메모 카드 제목 */
.memo-card {
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  color: var(--base-blue-dark);
  font-weight: bold;
}

/* 메모 입력 필드 */
.memo-input {
  width: 100%;
  padding: 0.5rem;
  border: 1.5px solid var(--input-outline);
  border-radius: 6px;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  box-sizing: border-box;
}

/* 메모 입력 필드 포커스 시 */
.memo-input:focus {
  outline: none;
  border-color: var(--input-bg-3);
}

.memo-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.memo-count {
  font-size: 0.7rem;
  color: var(--text-lightgray);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.1px;
}

/* 메모 저장 버튼 기본 상태 */
.memo-save {
  height: 34px;
  background: var(--input-disabled-1);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0 12px;
  font-size: 0.75rem;
}

/* 메모 저장 버튼 활성화 상태 */
.memo-save.active {
  background: var(--base-blue-dark);
}

/* 메모 저장 버튼 터치 시 피드백 */
.memo-save:active {
  transform: scale(0.98);
}

/* 확인 버튼 */
.confirm-btn {
  background: var(--base-blue-dark);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.8rem;
  font-size: 1rem;
  margin-top: 1rem;
}

.mbToast {
  position: fixed;
  left: 50%;
  top: 40%;
  transform: translateX(-50%);
  padding: 8px 12px;
  border-radius: 6px;
  color: #fff;
  font-size: 0.75rem;
  z-index: 3000;
  animation: mbToastIn 0.12s ease-out, mbToastOut 0.2s ease-in forwards;
  animation-delay: 0s, 1.6s;
}
.mbToast.success {
  background: var(--base-blue-dark);
}
.mbToast.error {
  background: var(--alert-red);
}
</style>
