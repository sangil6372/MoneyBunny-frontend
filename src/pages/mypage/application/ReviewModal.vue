<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  policyId: Number,
  policyTitle: String,
  benefitStatus: String,
  isEdit: {
    type: Boolean,
    default: false,
  },
  existingContent: {
    type: String,
    default: '',
  },
});

//👸🏻(은진) : 토스트
const showToast = ref(false);
const toastText = ref('');
let toastTimer = null;
const DEFAULT_TOAST_MS = 2800;

const showToastMsg = (text, ms = DEFAULT_TOAST_MS) => {
  toastText.value = text;
  showToast.value = true;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    showToast.value = false;
    toastTimer = null;
  }, ms);
};

const emit = defineEmits(['close', 'save', 'delete']);

const reviewContent = ref(props.existingContent || '');

const modalTitle = computed(() => {
  return props.isEdit ? '후기 수정' : '후기 작성';
});

const buttonText = computed(() => {
  return props.isEdit ? '수정' : '작성';
});

const benefitStatusText = computed(() => {
  const statusMap = {
    PENDING: '처리 중',
    RECEIVED: '수령 완료',
    NOT_ELIGIBLE: '수령 불가',
  };
  return statusMap[props.benefitStatus] || props.benefitStatus;
});

// 💪(상일) 혜택 상태별 플레이스홀더 메시지
const placeholderText = computed(() => {
  const placeholderMap = {
    RECEIVED:
      '예: 신청하고 1주 후 지원금을 받았습니다. 절차가 간단해서 좋았어요!',
    PENDING:
      '예: 신청을 완료하고 결과를 기다리고 있습니다. 상담 과정이 친절했어요.',
    NOT_ELIGIBLE: '예: 소득 분위 조건에 걸려서 신청할 수 없었어요.',
  };
  return (
    placeholderMap[props.benefitStatus] ||
    '후기 작성을 통해 추천 정확도를 높여보세요!'
  );
});

const close = () => emit('close');

const save = () => {
  if (!reviewContent.value.trim()) {
    showToastMsg('후기 내용을 입력해주세요.');
    return;
  }

  const reviewData = {
    benefitStatus: props.benefitStatus,
    content: reviewContent.value.trim(),
  };

  emit('save', reviewData);
  showToastMsg(
    props.isEdit
      ? '후기 수정이 완료되었습니다.'
      : '후기 작성이 완료되었습니다.',
    3200
  );
};

// 💪(상일) 리뷰 삭제 처리
const deleteReview = () => {
  if (confirm('후기를 삭제하시겠습니까?')) {
    emit('delete');
  }
};
</script>

<template>
  <div class="modalOverlay" @click.self="close">
    <div class="modalContainer">
      <header class="modalHeader">
        <span class="modalTitle font-16 font-bold">{{ modalTitle }}</span>
        <button class="iconBtn right" @click="close">
          <img src="@/assets/images/icons/common/x.png" alt="닫기" />
        </button>
      </header>

      <div class="modalContent">
        <div class="policyInfo">
          <div class="policyTitle">{{ policyTitle }}</div>
          <div
            class="benefitStatus"
            :class="`status-${benefitStatus?.toLowerCase()}`"
          >
            {{ benefitStatusText }}
          </div>
        </div>

        <div class="reviewSection">
          <div class="reviewHeader">
            <label class="reviewLabel">후기 내용</label>
            <!-- 💪(상일) 수정 모드일 때만 삭제 버튼 표시 -->
            <button v-if="isEdit" class="deleteSmallBtn" @click="deleteReview">
              삭제
            </button>
          </div>
          <textarea
            v-model="reviewContent"
            class="reviewTextarea"
            :placeholder="placeholderText"
            rows="6"
          ></textarea>
          <div class="charCount">{{ reviewContent.length }}/500자</div>
        </div>
      </div>

      <div class="modalFooter">
        <button class="cancelBtn" @click="close">취소</button>
        <button class="applyBtn" @click="save">{{ buttonText }}</button>
      </div>
    </div>
    <transition name="fade">
      <div v-if="showToast" class="toastMsg">{{ toastText }}</div>
    </transition>
  </div>
</template>

<style scoped>
.modalOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modalContainer {
  background: #fff;
  border-radius: 6px;
  width: 340px;
  /* max-width: 90vw; */
  box-sizing: border-box;
  padding: 0 0 20px 0;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
}

.modalHeader {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  position: relative;
  justify-content: center;
}

.modalTitle {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

.modalContent {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.policyInfo {
  margin-bottom: 20px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.policyTitle {
  font-size: 13px;
  font-weight: bold;
  color: var(--text-login);
  margin-bottom: 6px;
  /* line-height: 1.4; */
}

.benefitStatus {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  /* font-weight: bold; */
}

.status-pending {
  background: #fff4e6;
  color: #f59e0b;
}

.status-received {
  background: #e6faf2;
  color: #18b184;
}

.status-not_eligible {
  background: #fff0f4;
  color: #e3456d;
}

.reviewSection {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* 💪(상일) 후기 헤더 - 라벨과 삭제 버튼 */
.reviewHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reviewLabel {
  font-size: 13px;
  font-weight: bold;
  color: var(--text-login);
  /* margin-bottom: 5px; */
}

/* 💪(상일) 작은 삭제 버튼 스타일 */
.deleteSmallBtn {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 13px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
}

/* .deleteSmallBtn:hover {
  background-color: #fee2e2;
  color: #dc2626;
} */

.reviewTextarea {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1.5px solid var(--input-bg-1);
  border-radius: 6px;
  font-size: 12px;
  color: var(--text-login);
  resize: vertical;
  box-sizing: border-box;
}

.reviewTextarea:focus {
  outline: none;
  border-color: var(--input-bg-3);
}

.reviewTextarea::placeholder {
  color: #9ca3af;
}

.charCount {
  text-align: right;
  font-size: 11px;
  color: #6b7280;
}

.modalFooter {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 18px;
  gap: 10px;
}

.cancelBtn {
  flex: 1;
  padding: 10px 0;
  border-radius: 6px;
  background: #f3f4f6;
  color: #6b7280;
  border: none;
  font-size: 13px;
  cursor: pointer;
}

/* 💪(상일) 모달 버튼은 작성/수정 관계없이 동일한 색상 */
.applyBtn {
  flex: 2;
  padding: 10px 0;
  border-radius: 6px;
  background: var(--base-blue-dark);
  color: #fff;
  border: none;
  font-size: 13px;
  cursor: pointer;
}

.applyBtn:disabled {
  background: #bcc7e5;
  color: #fff;
  cursor: not-allowed;
}

.iconBtn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.iconBtn img {
  width: 20px;
  height: 20px;
  display: block;
}

.iconBtn.right {
  margin-left: auto;
}

.toastMsg {
  position: fixed;
  left: 50%;
  top: 40%;
  transform: translateX(-50%);
  padding: 10px 14px;
  border-radius: 6px;
  background: rgba(48, 70, 99, 0.95);
  color: #fff;
  font-size: 12px;
  z-index: 10000;
  pointer-events: none;
}
</style>
