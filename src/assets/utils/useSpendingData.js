// src/assets/utils/useSpendingData.js
import { ref, computed, watch } from 'vue';
import {
  fetchSpendingOverview,
  fetchCategoryTransactions,
} from '@/api/assetApi';
import { categoryMap } from '@/constants/categoryMap';

/** CSS 변수값을 안전하게 읽기 (없으면 기본값) */
function getCssVar(varName, fallback = '#cccccc') {
  try {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
    return v || fallback;
  } catch {
    return fallback;
  }
}

/** id → 이름 */
const getCategoryName = (id) => categoryMap?.[id] || '기타';

/** 카테고리 이름 → 색상 매핑 */
const CATEGORY_COLORS = {
  '교통/자동차': getCssVar('--yellow-2'),
  생활: getCssVar('--gray-1'),
  '레저와 여가생활': getCssVar('--orange-1'),
  마트: getCssVar('--yellow-1'),
  편의점: getCssVar('--green-1'),
  쇼핑: getCssVar('--red-2'),
  '온라인 쇼핑': getCssVar('--gray-2'),
  '커피와 디저트': getCssVar('--orange-2'),
  뷰티: getCssVar('--purple-1'),
  식비: getCssVar('--red-1'),
  '보험과 금융': getCssVar('--purple-2'),
  '건강과 의료': getCssVar('--green-2'),
  교육: getCssVar('--blue-1'),
  여행: getCssVar('--navy-1'),
  주류: getCssVar('--red-2'),
  '카테고리 미지정': getCssVar('--gray-2'),
  기타: getCssVar('--gray-2'),
};

export function useSpendingData() {
  /** 선택 월 (Date) */
  const currentDate = ref(new Date());

  /** 서버 응답 */
  const overview = ref(null);
  const loading = ref(false);
  const error = ref(null);

  /** 중복 호출 방지 키 */
  const lastKey = ref(null);
  const inFlight = ref(false);

  /** YYYY-MM 라벨 */
  const currentMonthText = computed(() => {
    const y = currentDate.value.getFullYear();
    const m = currentDate.value.getMonth() + 1;
    return `${m}월 ${y}년`;
  });

  /** 개요 API 호출 (중복/동시 호출 방지) */
  async function loadOverview(trendMonths = 6) {
    const y = currentDate.value.getFullYear();
    const m = currentDate.value.getMonth() + 1;
    const key = `${y}-${m}-${trendMonths}`;

    if (key === lastKey.value) return; // 같은 월이면 스킵
    if (inFlight.value) return; // 진행 중이면 스킵

    loading.value = true;
    error.value = null;
    inFlight.value = true;

    try {
      const { data } = await fetchSpendingOverview({
        year: y,
        month: m,
        trendMonths,
      });
      overview.value = data;
      lastKey.value = key;
    } catch (e) {
      error.value =
        e?.response?.data?.message ||
        e?.message ||
        '지출 데이터를 불러오지 못했어요.';
      // 실패 시 키를 고정하지 않아 다음 시도에서 다시 요청되도록 둠
    } finally {
      loading.value = false;
      inFlight.value = false;
    }
  }

  /** 이번 달 총 지출 */
  const totalSpending = computed(() =>
    Number(overview.value?.totalSpending ?? 0)
  );

  /**
   * 전월 대비 (서버 기준)
   * 서버 예시:
   *   momChange: { diff: -252720, percent: -47.5 }
   * diff = (이번달 - 전달)
   */
  const monthComparison = computed(() => {
    // 서버 원본을 '사실상 단일 소스'로 사용 (부호 유지)
    const diffSigned = Number(overview.value?.momChange?.diff ?? 0); // +면 증가, -면 감소
    const percentSigned = overview.value?.momChange?.percent ?? 0; // +/-

    // 동시에 표시용 절대값도 같이 제공 (UI에서 편하게 쓰라고)
    return {
      diffSigned, // 예: -252720
      percentSigned, // 예: -47.5
      absDiff: Math.abs(diffSigned), // 예: 252720
      absPercent: Math.abs(Number(percentSigned) || 0), // 예: 47.5
      isIncrease: diffSigned > 0, // 증가 여부
      isDecrease: diffSigned < 0, // 감소 여부(지출엔 '좋음')
    };
  });

  /** 카테고리 리스트 (이름/색상/비율 포함, 금액 내림차순) */
  const categoryList = computed(() => {
    const cats = overview.value?.categories ?? [];
    const total = totalSpending.value || 1;

    return cats
      .map((c) => {
        const name = getCategoryName(c.categoryId);
        const amount = Number(c.amount ?? 0);
        const pct =
          typeof c.percentage === 'number'
            ? c.percentage
            : Math.round((amount / total) * 100);

        return {
          id: c.categoryId,
          name,
          amount,
          percentage: pct,
          color: CATEGORY_COLORS[name] || CATEGORY_COLORS['기타'],
        };
      })
      .sort((a, b) => b.amount - a.amount);
  });

  /** 도넛 차트 데이터 */
  const chartData = computed(() => {
    const labels = categoryList.value.map((c) => c.name);
    const data = categoryList.value.map((c) => c.amount);
    const colors = categoryList.value.map((c) => c.color);
    return {
      labels,
      datasets: [{ data, backgroundColor: colors, borderWidth: 0 }],
    };
  });

  /** 월별 지출 추이 (서버 trend 사용) */
  const monthlyTrendData = computed(() => {
    const rows = overview.value?.trend ?? [];
    return {
      months: rows.map((r) => `${r.month}월`),
      amounts: rows.map((r) => Number(r.totalAmount ?? 0)),
    };
  });

  /** (옵션) 현재 월 거래 — 개요 API에 없으므로 빈 배열 유지 */
  const currentMonthTransactions = computed(() => []);

  /** 월 이동 */
  const previousMonth = () => {
    const d = new Date(currentDate.value);
    d.setMonth(d.getMonth() - 1);
    currentDate.value = d;
  };
  const nextMonth = () => {
    const d = new Date(currentDate.value);
    d.setMonth(d.getMonth() + 1);
    currentDate.value = d;
  };

  /** 카테고리 상세 거래 조회 */
  async function getCategoryDetail(categoryId) {
    const y = currentDate.value.getFullYear();
    const m = currentDate.value.getMonth() + 1;
    const { data } = await fetchCategoryTransactions({
      categoryId,
      year: y,
      month: m,
    });
    return data; // 서버 VO 배열 그대로 반환 (상위에서 adapt)
  }

  /**
   * 날짜가 바뀌면 재호출.
   * 같은 년/월이면 호출하지 않도록 가드.
   * 초기 1회는 immediate로 호출.
   */
  watch(
    currentDate,
    (nv, ov) => {
      const sameYM =
        ov &&
        nv.getFullYear() === ov.getFullYear() &&
        nv.getMonth() === ov.getMonth();
      if (sameYM) return;
      loadOverview();
    },
    { immediate: true }
  );

  return {
    // state
    currentDate,
    currentMonthText,
    loading,
    error,

    // overview-based
    totalSpending,
    monthComparison,
    categoryList,
    chartData,
    monthlyTrendData,
    currentMonthTransactions,

    // actions
    previousMonth,
    nextMonth,
    loadOverview,
    getCategoryDetail,
  };
}
