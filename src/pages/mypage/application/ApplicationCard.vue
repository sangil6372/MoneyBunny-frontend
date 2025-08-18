<template>
  <!-- 카드 전체를 클릭 가능하게 수정 (북마크와 동일) -->
  <div class="applicationCard" @click="handleDetailClick">
    <div class="headerRow">
      <span class="title">
        {{ application.policyTitle }}
      </span>
      <button
        class="removeBtn"
        @click.stop="handleRemoveApplication"
        title="신청 기록 삭제"
      >
        <img
          src="@/assets/images/icons/common/x.png"
          alt="신청 기록 삭제"
          class="removeIcon"
        />
      </button>
    </div>

    <div class="desc">{{ application.policyDescription }}</div>

    <div class="infoRow">
      <div>
        <span
          >지원금액 :
          <strong>{{
            formatAmount(application.policyBenefitAmount)
          }}</strong></span
        >
        <span class="divider"></span>
        <!-- 클릭 가능한 상태 뱃지로 변경 -->
        <button
          :class="[
            'statusBadge',
            getBenefitStatusClass(application.benefitStatus),
          ]"
          @click.stop="handleStatusChange"
          title="상태 변경하기"
        >
          {{ getBenefitStatusText(application.benefitStatus) }}
          <img
            src="@/assets/images/icons/mypage/edit.png"
            alt="상태 수정"
            class="editIcon"
          />
        </button>
      </div>
    </div>

    <div class="metaRow">
      <span>신청일 : {{ formatApplicationDate(application.appliedAt) }}</span>
      <div class="buttonGroup">
        <!-- 후기 버튼만 유지 (상태 변경은 뱃지 클릭으로 처리) -->
        <button
          v-if="application.benefitStatus !== 'PENDING'"
          class="reviewBtn"
          :class="{ 'review-edit': hasReview }"
          @click.stop="handleReviewEdit"
        >
          {{ hasReview ? '후기 수정' : '후기 작성' }}
        </button>
      </div>
    </div>

    <!-- 혜택 상태 선택 모달 (클릭 이벤트 전파 차단) -->
    <BenefitStatusSelectModal
      v-if="showBenefitStatusModal"
      :policy-title="application.policyTitle"
      :current-benefit-status="application.benefitStatus"
      @close="closeBenefitStatusModal"
      @select="handleBenefitStatusSelect"
      @click.stop
    />

    <!-- 후기 작성/수정 모달 (클릭 이벤트 전파 차단) -->
    <ReviewModal
      v-if="showReviewModal"
      :policy-id="application.policyId"
      :policy-title="application.policyTitle"
      :benefit-status="selectedBenefitStatus"
      :is-edit="isEditMode"
      :existing-content="existingReviewContent"
      @close="closeReviewModal"
      @save="handleReviewSave"
      @delete="handleReviewDelete"
      @click.stop
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import BenefitStatusSelectModal from './BenefitStatusSelectModal.vue';
import ReviewModal from './ReviewModal.vue';
import { useApplicationStore } from '@/stores/application';
import { policyInteractionAPI } from '@/api/policyInteraction';

const props = defineProps({
  application: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['remove']);

const router = useRouter();
const applicationStore = useApplicationStore();

// 모달 관련 상태
const showBenefitStatusModal = ref(false);
const showReviewModal = ref(false);
const isEditMode = ref(false);
const existingReviewContent = ref('');
const selectedBenefitStatus = ref('');
const hasReview = ref(false);

// 컴포넌트 마운트 시 리뷰 존재 여부 확인
onMounted(async () => {
  if (props.application.benefitStatus !== 'PENDING') {
    try {
      const response = await policyInteractionAPI.getMyReview(
        props.application.policyId,
        props.application.benefitStatus
      );
      hasReview.value = !!response.data;
      if (response.data) {
        existingReviewContent.value = response.data.content || '';
      }
    } catch (error) {
      // 404는 리뷰가 없는 정상 상황이므로 로그 출력 안함
      if (error.response?.status === 404) {
        hasReview.value = false;
      } else {
        // 404가 아닌 다른 에러만 로그 출력
        console.error('리뷰 조회 실패:', error);
      }
    }
  }
});

// 정책 상세 페이지로 이동 (모달 열린 상태에서는 차단)
const handleDetailClick = () => {
  // 모달이 열려있으면 카드 클릭 차단
  if (showBenefitStatusModal.value || showReviewModal.value) {
    return;
  }

  if (props.application.policyId) {
    router.push(`/policy/${props.application.policyId}`);
  }
};

const handleStatusChange = () => {
  selectedBenefitStatus.value = props.application.benefitStatus;
  showBenefitStatusModal.value = true;
};

const handleReviewWrite = () => {
  isEditMode.value = false;
  existingReviewContent.value = '';
  showBenefitStatusModal.value = true;
};

const handleReviewEdit = async () => {
  try {
    const response = await policyInteractionAPI.getMyReview(
      props.application.policyId,
      props.application.benefitStatus
    );

    if (response.data) {
      hasReview.value = true;
      isEditMode.value = true;
      existingReviewContent.value = response.data.content || '';
    } else {
      hasReview.value = false;
      isEditMode.value = false;
      existingReviewContent.value = '';
    }
  } catch (error) {
    // 404는 리뷰가 없는 정상 상황이므로 로그 출력 안함
    if (error.response?.status === 404) {
      hasReview.value = false;
      isEditMode.value = false;
      existingReviewContent.value = '';
    } else {
      // 404가 아닌 다른 에러만 로그 출력
      console.error('리뷰 조회 실패:', error);
      return; // 에러 시 모달 열지 않음
    }
  }

  selectedBenefitStatus.value = props.application.benefitStatus;
  showReviewModal.value = true;
};

const closeBenefitStatusModal = () => {
  showBenefitStatusModal.value = false;
};

const handleBenefitStatusSelect = async (benefitStatus) => {
  try {
    // 혜택 상태 업데이트 API 호출
    const success = await applicationStore.updateBenefitStatus(
      props.application.policyId,
      benefitStatus
    );

    if (success) {
      selectedBenefitStatus.value = benefitStatus;
      showBenefitStatusModal.value = false;

      // 기다리는 중이면 후기 작성 모달 열지 않음
      if (benefitStatus !== 'PENDING') {
        showReviewModal.value = true;
      }
    } else {
      alert('혜택 상태 업데이트에 실패했습니다. 다시 시도해주세요.');
    }
  } catch (error) {
    console.error('혜택 상태 업데이트 실패:', error);
    alert('혜택 상태 업데이트에 실패했습니다. 다시 시도해주세요.');
  }
};

const closeReviewModal = () => {
  showReviewModal.value = false;
};

// 에러 메시지 매핑 함수
const getErrorMessage = (error) => {
  // 백엔드에서 ErrorResponse 형태로 에러를 반환하는 경우 (code 또는 errorCode 확인)
  const errorCode =
    error.response?.data?.code || error.response?.data?.errorCode;
  if (errorCode) {
    const errorMessages = {
      PROFANITY_DETECTED: '부적절한 표현이 포함되어 있어 작성할 수 없습니다.',
      NOT_APPLIED: '신청을 완료한 후에 리뷰를 작성할 수 있습니다.',
      ALREADY_REVIEWED: '이미 해당 혜택 상태로 리뷰를 작성하셨습니다.',
      INVALID_BENEFIT_STATUS: '잘못된 혜택 상태입니다.',
      REVIEW_NOT_FOUND: '수정할 리뷰를 찾을 수 없습니다.',
    };
    return (
      errorMessages[errorCode] ||
      error.response.data.message ||
      '알 수 없는 오류가 발생했습니다.'
    );
  }

  // HTTP 상태 코드별 기본 메시지
  if (error.response?.status === 400) {
    return '입력된 정보를 확인해주세요.';
  } else if (error.response?.status === 401) {
    return '로그인이 필요한 서비스입니다.';
  } else if (error.response?.status === 403) {
    return '권한이 없습니다.';
  }

  return '후기 저장에 실패했습니다. 다시 시도해주세요.';
};

const handleReviewSave = async (reviewData) => {
  try {
    if (hasReview.value) {
      // 리뷰 수정
      await policyInteractionAPI.updateReview(
        props.application.policyId,
        reviewData
      );
      // 수정 완료 알림
      // alert('후기가 수정되었습니다!');
    } else {
      // 리뷰 신규 작성
      await policyInteractionAPI.addReview(
        props.application.policyId,
        reviewData
      );
      // 작성 완료 알림
      // alert('후기 작성이 완료되었습니다!');
    }

    hasReview.value = true; // 저장 성공하면 리뷰 존재 상태로 변경
    showReviewModal.value = false;

    // 저장 후 최신 리뷰 내용 업데이트
    existingReviewContent.value = reviewData.content;
  } catch (error) {
    console.error('후기 저장 실패:', error);
    console.error('에러 상세:', {
      status: error.response?.status,
      data: error.response?.data,
      code: error.response?.data?.code,
      errorCode: error.response?.data?.errorCode,
      message: error.response?.data?.message,
    });

    // 에러 유형별 적절한 메시지 표시
    const errorMessage = getErrorMessage(error);
    alert(errorMessage);
  }
};

// 리뷰 삭제 처리
const handleReviewDelete = async () => {
  try {
    await policyInteractionAPI.deleteReview(
      props.application.policyId,
      props.application.benefitStatus
    );
    alert('후기가 삭제되었습니다.');
    hasReview.value = false;
    existingReviewContent.value = '';
    showReviewModal.value = false;
  } catch (error) {
    console.error('리뷰 삭제 실패:', error);
    alert('리뷰 삭제에 실패했습니다. 다시 시도해주세요.');
  }
};

const handleRemoveApplication = async () => {
  if (confirm('이 정책의 신청 기록을 삭제하시겠습니까?')) {
    emit('remove', props.application.policyId);
  }
};

const getBenefitStatusText = (status) => {
  const statusMap = {
    PENDING: '처리 중',
    RECEIVED: '수령 완료',
    NOT_ELIGIBLE: '수령 불가',
  };
  return statusMap[status] || status;
};

const getBenefitStatusClass = (status) => {
  const classMap = {
    PENDING: 'badgePending',
    RECEIVED: 'badgeReceived',
    NOT_ELIGIBLE: 'badgeNotEligible',
  };
  return classMap[status] || 'badgePending';
};

const formatAmount = (amount) => {
  if (!amount) return '미지정';
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
};

const formatApplicationDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};
</script>

<style scoped>
.applicationCard {
  border: 1px solid var(--input-outline-2);
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 9px;
  background: none;
  position: relative;
  /* 카드 클릭 가능 표시 (북마크와 동일) */
  cursor: pointer;
}

/* 카드 호버 효과 (북마크와 동일) */
/* .applicationCard:hover {
  background-color: #f8f9fa;
} */

.headerRow {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.title {
  font-size: 14px;
  font-weight: bold;
  color: var(--text-login);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 80%;
  min-width: 0;
  cursor: pointer;
}

.title:hover {
  color: var(--base-blue-dark);
}

/* 클릭 가능한 상태 뱃지 스타일 */
.statusBadge {
  font-size: 10px;
  border-radius: 6px;
  padding: 4px 7px;
  /* font-weight: bold; */
  margin-left: 2px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* .statusBadge:hover {
  transform: scale(1.05);
} */

/* 기존 badge 클래스는 유지 (다른 곳에서 사용할 수 있음) */
.badge {
  font-size: 10px;
  border-radius: 6px;
  padding: 5px 8px;
  font-weight: bold;
  margin-left: 2px;
}

.removeBtn {
  background: none;
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.removeIcon {
  width: 16px;
  height: 16px;
}

.badgePending {
  background: #fff4e6;
  color: #f59e0b;
}

.badgeReceived {
  background: #e6faf2;
  color: #18b184;
}

.badgeNotEligible {
  background: #fff0f4;
  color: #e3456d;
}

.desc {
  font-size: 11px;
  color: #5a5a5a;
  margin-bottom: 2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.infoRow {
  font-size: 11px;
  color: #6a7686;
  display: flex;
  align-items: center;
  margin-bottom: 2px;
  gap: 10px;
}

.divider {
  display: inline-block;
  width: 1.5px;
  height: 10px;
  background: #e2e2e2;
  margin: 0 8px;
  vertical-align: middle;
}

.infoRow strong {
  color: #23377a;
  font-weight: bold;
}

.metaRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  color: #9aadc5;
  margin-top: 6px;
  border-top: 1px solid #f0f3fa;
  padding-top: 8px;
}

.buttonGroup {
  display: flex;
  gap: 8px;
  align-items: center;
}

.statusBtn {
  background-color: #5b7bb0;
  color: white;
  border: none;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
}

/* 후기 작성/수정 버튼 색상 차별화 */
.reviewBtn {
  background-color: var(--top-rank-2); /* 기본: 작성 (#5b7bb0) */
  color: white;
  border: none;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
}

.reviewBtn.review-edit {
  background-color: var(--top-rank-3); /* 수정 모드 */
}

.editIcon {
  width: 11px;
  height: 11px;
  /* opacity: 0.7; */
}

.statusBadge:hover .editIcon {
  opacity: 1;
}
</style>
