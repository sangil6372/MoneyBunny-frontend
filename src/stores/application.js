import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { policyInteractionAPI } from "@/api/policyInteraction";

export const useApplicationStore = defineStore("application", () => {
  // 신청 정책 관련 상태 관리
  const applications = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // 계산된 속성들
  const applicationCount = computed(() => applications.value.length);
  const completedApplications = computed(() => 
    applications.value.filter(app => app.isApplied)
  );
  const pendingApplications = computed(() => 
    applications.value.filter(app => !app.isApplied)
  );

  // 날짜 포맷팅 유틸리티 함수
  const formatApplicationDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // 텍스트 말줄임 유틸리티 함수
  const truncateText = (text, maxLength = 80) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // 마감일 포맷팅 함수
  const formatDeadline = (applyPeriod) => {
    if (!applyPeriod) {
      return "상시";
    }

    const originalValue = applyPeriod.toString();

    // YYYYMMDD 형식 패턴
    const patterns = [
      /(\d{4})(\d{2})(\d{2})/g,
      /(\d{4})-(\d{2})-(\d{2})/g,
      /(\d{4})\.(\d{2})\.(\d{2})/g,
      /(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/g,
      /(\d{4})\/(\d{2})\/(\d{2})/g,
    ];

    for (const pattern of patterns) {
      const dates = [...originalValue.matchAll(pattern)];

      if (dates.length > 0) {
        const lastDate = dates[dates.length - 1];
        const year = lastDate[1];
        const month = lastDate[2].padStart(2, "0");
        const day = lastDate[3].padStart(2, "0");
        const formatted = `${year}.${month}.${day}`;

        return formatted;
      }
    }

    return originalValue;
  };

  // 신청 정책 목록 조회
  const fetchApplications = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await policyInteractionAPI.getApplications();

      // API 응답을 컴포넌트가 기대하는 형태로 변환
      const transformedData = response.data.map((application) => {
        const formattedDeadline = formatDeadline(application.applyPeriod);

        return {
          // 신청 정보
          applicationId: application.applicationId,
          policyId: application.policyId,
          isApplied: application.isApplied,
          benefitStatus: application.benefitStatus,
          appliedAt: application.appliedAt,

          // 정책 정보 (ApplicationCard에서 사용하는 필드명으로 매핑)
          policyTitle: truncateText(application.title, 50),
          policyDescription: truncateText(application.description, 80),
          policyBenefitAmount: application.policyBenefitAmount,
          applyPeriod: formattedDeadline,
        };
      });

      applications.value = transformedData;
    } catch (err) {
      error.value = err.message;
      console.error("신청 정책 조회 실패:", err);
    } finally {
      loading.value = false;
    }
  };

  // 정책 신청 등록
  const addApplication = async (policyId) => {
    try {
      await policyInteractionAPI.addApplication(policyId);
      // 성공 시 목록 새로고침
      await fetchApplications();
      return true;
    } catch (err) {
      console.error("정책 신청 등록 실패:", err);
      error.value = err.message;
      return false;
    }
  };

  // 신청 완료 처리
  const completeApplication = async (policyId) => {
    try {
      await policyInteractionAPI.completeApplication(policyId);
      
      // 즉시 로컬 상태 업데이트
      const application = applications.value.find(app => app.policyId === policyId);
      if (application) {
        application.isApplied = true;
      }

      return true;
    } catch (err) {
      console.error("신청 완료 처리 실패:", err);
      error.value = err.message;
      return false;
    }
  };

  // 신청 기록 삭제
  const removeApplication = async (policyId) => {
    try {
      await policyInteractionAPI.removeApplication(policyId);

      // 즉시 로컬 상태에서 제거
      applications.value = applications.value.filter(
        (application) => application.policyId !== policyId
      );

      return true;
    } catch (err) {
      console.error("신청 기록 삭제 실패:", err);
      error.value = err.message;
      return false;
    }
  };

  // 혜택 수령 상태 업데이트
  const updateBenefitStatus = async (policyId, benefitStatus) => {
    try {
      await policyInteractionAPI.updateBenefitStatus(policyId, benefitStatus);
      
      // 즉시 로컬 상태 업데이트
      const application = applications.value.find(app => app.policyId === policyId);
      if (application) {
        application.benefitStatus = benefitStatus;
      }

      return true;
    } catch (err) {
      console.error("혜택 수령 상태 업데이트 실패:", err);
      error.value = err.message;
      return false;
    }
  };

  // 미완료 신청 정책 조회
  const getIncompleteApplication = async () => {
    try {
      const response = await policyInteractionAPI.getIncompleteApplication();
      return response.data;
    } catch (err) {
      console.error("미완료 신청 정책 조회 실패:", err);
      error.value = err.message;
      return null;
    }
  };

  // 특정 정책이 신청되어 있는지 확인
  const isApplied = (policyId) => {
    return applications.value.some((application) => application.policyId === policyId);
  };

  return {
    // 상태
    applications,
    loading,
    error,

    // 계산된 속성
    applicationCount,
    completedApplications,
    pendingApplications,

    // 액션
    fetchApplications,
    addApplication,
    completeApplication,
    removeApplication,
    updateBenefitStatus,
    getIncompleteApplication,
    isApplied,
  };
});