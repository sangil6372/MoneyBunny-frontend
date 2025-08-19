import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { bookmarkAPI } from "@/api/policyInteraction";

export const useBookmarkStore = defineStore("bookmark", () => {
  // 북마크 관련 상태 관리
  const bookmarks = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // 계산된 속성들 - 실제 북마크된 항목 수만 계산
  const bookmarkCount = computed(() => filteredBookmarks.value.length);

  // 유효한 북마크만 필터링 (bookmarkId가 있고 isBookmarked가 true인 것들)
  const filteredBookmarks = computed(() =>
    bookmarks.value.filter(
      (bookmark) => bookmark.bookmarkId && bookmark.isBookmarked
    )
  );

  // 날짜 포맷팅 유틸리티 함수
  const formatBookmarkDate = (dateString) => {
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

  // 정책 상태 판단 함수 (마감일 기준)
  const getPolicyStatus = (applyPeriod) => {
    if (!applyPeriod) return "신청가능";

    const originalValue = applyPeriod.toString();

    // YYYYMMDD 패턴으로 날짜 추출
    const pattern = /(\d{4})(\d{2})(\d{2})/g;
    const dates = [...originalValue.matchAll(pattern)];

    if (dates.length > 0) {
      // 마지막 날짜를 마감일로 사용
      const lastDate = dates[dates.length - 1];
      const year = parseInt(lastDate[1]);
      const month = parseInt(lastDate[2]) - 1; // Date 객체는 0부터 시작
      const day = parseInt(lastDate[3]);

      const deadlineDate = new Date(year, month, day);
      const today = new Date();

      // 오늘 자정으로 설정하여 날짜만 비교
      today.setHours(0, 0, 0, 0);
      deadlineDate.setHours(23, 59, 59, 999); // 마감일 끝까지

      return today > deadlineDate ? "신청마감" : "신청가능";
    }

    return "신청가능";
  };

  // 마감일 포맷팅 함수 - 다양한 형식 지원
  const formatDeadline = (applyPeriod) => {
    if (!applyPeriod) {
      return "상시";
    }

    const originalValue = applyPeriod.toString();

    // 다양한 날짜 패턴들 시도
    const patterns = [
      // YYYYMMDD 형식 (예: "20241201 ~ 20250228") - 가장 우선순위
      /(\d{4})(\d{2})(\d{2})/g,
      // YYYY-MM-DD 형식
      /(\d{4})-(\d{2})-(\d{2})/g,
      // YYYY.MM.DD 형식
      /(\d{4})\.(\d{2})\.(\d{2})/g,
      // YYYY년 MM월 DD일 형식
      /(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/g,
      // YYYY/MM/DD 형식
      /(\d{4})\/(\d{2})\/(\d{2})/g,
    ];

    for (const pattern of patterns) {
      const dates = [...originalValue.matchAll(pattern)];

      if (dates.length > 0) {
        // 마지막 날짜를 마감일로 사용 (보통 종료일)
        const lastDate = dates[dates.length - 1];
        const year = lastDate[1];
        const month = lastDate[2].padStart(2, "0");
        const day = lastDate[3].padStart(2, "0");
        const formatted = `${year}.${month}.${day}`;

        return formatted;
      }
    }

    // 모든 패턴이 실패하면 원본 텍스트 그대로 반환
    return originalValue;
  };

  // 북마크 목록 조회
  const fetchBookmarks = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await bookmarkAPI.getBookmarks();

      // API 응답을 컴포넌트가 기대하는 형태로 변환
      const transformedData = response.data.map((bookmark) => {
        const formattedDeadline = formatDeadline(bookmark.applyPeriod);
        const policyStatus = getPolicyStatus(bookmark.applyPeriod);

        return {
          // 북마크 정보
          bookmarkId: bookmark.bookmarkId,
          bookmarkedAt: bookmark.bookmarkedAt,
          savedDate: formatBookmarkDate(bookmark.bookmarkedAt),

          // 정책 정보 (BookmarkCard에서 사용하는 필드명으로 매핑)
          policyId: bookmark.policyId,
          title: truncateText(bookmark.title, 50), // 제목 50자 제한
          description: truncateText(bookmark.description, 80), // 설명 80자 제한
          supportAmount: bookmark.policyBenefitAmount
            ? `${bookmark.policyBenefitAmount.toLocaleString()}원`
            : "미정",
          deadline: formattedDeadline, // 마감일 YYYY.MM.DD 형식으로 포맷팅

          // 상태 정보 (마감일 기준으로 동적 계산)
          status: policyStatus, // 신청가능 or 신청마감
          isBookmarked: true, // 북마크 목록에서 가져온 것이므로 항상 true
        };
      });

      bookmarks.value = transformedData;
    } catch (err) {
      error.value = err.message;
      console.error("북마크 조회 실패:", err);
    } finally {
      loading.value = false;
    }
  };

  // 북마크 추가
  const addBookmark = async (policyId) => {
    try {
      await bookmarkAPI.addBookmark(policyId);
      // 성공 시 목록 새로고침
      await fetchBookmarks();
      return true;
    } catch (err) {
      console.error("북마크 추가 실패:", err);
      error.value = err.message;
      return false;
    }
  };

  // 북마크 제거
  const removeBookmark = async (policyId) => {
    try {
      await bookmarkAPI.removeBookmark(policyId);

      // 즉시 로컬 상태 업데이트
      bookmarks.value = bookmarks.value.filter(
        (bookmark) => bookmark.policyId !== policyId
      );

      return true;
    } catch (err) {
      console.error("북마크 제거 실패:", err);
      error.value = err.message;
      return false;
    }
  };

  // 특정 정책이 북마크되어 있는지 확인
  const isBookmarked = (policyId) => {
    return bookmarks.value.some((bookmark) => bookmark.policyId === policyId);
  };

  // 수동 리셋 함수
  const $reset = () => {
    bookmarks.value = [];
    loading.value = false;
    error.value = null;
  };

  return {
    // 상태
    bookmarks,
    loading,
    error,

    // 계산된 속성
    bookmarkCount,
    filteredBookmarks,

    // 액션
    fetchBookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    
    // 수동 리셋
    $reset,
  };
});
