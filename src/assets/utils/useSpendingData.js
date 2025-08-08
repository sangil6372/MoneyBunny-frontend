// src/assets/utils/useSpendingData.js (수정된 버전)
import { ref, computed } from 'vue';
import cardsData from '@/assets/data/cards.json'; // 🥕 더미데이터
import { normalizeCard } from './dataAdapter';

// ✅ CSS 변수에서 색상 추출 함수
function getCssVar(hexVarName) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(hexVarName)
    .trim();
}

// ✅ 카테고리별 색상 매핑 (CSS 변수 기반)
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
  '취미/여가': getCssVar('--orange-1'),
  교통비: getCssVar('--yellow-2'),
  '건강/의료': getCssVar('--green-2'),
  '카테고리 미지정': getCssVar('--gray-2'),
  기타: getCssVar('--gray-2'),
};

export function useSpendingData() {
  const currentDate = ref(new Date());

  const currentMonthText = computed(() => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth() + 1;
    return `${month}월 ${year}년`;
  });

  // 🔄 유연한 데이터 처리 - 어떤 형태든 대응
  const getSpendingTransactions = computed(() => {
    const transactions = [];

    try {
      // 데이터가 배열인지 확인
      const dataArray = Array.isArray(cardsData) ? cardsData : [cardsData];

      dataArray.forEach((card) => {
        // 데이터 정규화
        const normalizedCard = normalizeCard(card);

        // 정규화된 거래내역 추가
        if (normalizedCard.transactions) {
          transactions.push(...normalizedCard.transactions);
        }
      });
    } catch (error) {
      console.warn('데이터 처리 중 오류:', error);
      // 오류 발생 시 빈 배열 반환
    }

    return transactions;
  });

  // 현재 월의 지출 거래내역 필터링
  const currentMonthTransactions = computed(() => {
    const targetYear = currentDate.value.getFullYear();
    const targetMonth = currentDate.value.getMonth() + 1;

    return getSpendingTransactions.value.filter((transaction) => {
      try {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate.getFullYear() === targetYear &&
          transactionDate.getMonth() + 1 === targetMonth
        );
      } catch {
        return false; // 날짜 파싱 실패 시 제외
      }
    });
  });

  // 카테고리별 지출 집계
  const categorySpending = computed(() => {
    const categoryMap = {};

    currentMonthTransactions.value.forEach((transaction) => {
      const category = transaction.category;

      if (!categoryMap[category]) {
        categoryMap[category] = {
          name: category,
          amount: 0,
          transactions: [],
          color:
            CATEGORY_COLORS[category] || CATEGORY_COLORS['카테고리 미지정'],
        };
      }

      categoryMap[category].amount += transaction.amount;
      categoryMap[category].transactions.push(transaction);
    });

    return Object.values(categoryMap).sort((a, b) => b.amount - a.amount);
  });

  // 총 지출액
  const totalSpending = computed(() => {
    return currentMonthTransactions.value.reduce((sum, transaction) => {
      return sum + transaction.amount;
    }, 0);
  });

  // 전월 지출액
  const previousMonthSpending = computed(() => {
    const prevDate = new Date(currentDate.value);
    prevDate.setMonth(prevDate.getMonth() - 1);

    const prevYear = prevDate.getFullYear();
    const prevMonth = prevDate.getMonth() + 1;

    const prevTransactions = getSpendingTransactions.value.filter(
      (transaction) => {
        try {
          const transactionDate = new Date(transaction.date);
          return (
            transactionDate.getFullYear() === prevYear &&
            transactionDate.getMonth() + 1 === prevMonth
          );
        } catch {
          return false;
        }
      }
    );

    return prevTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
  });

  // 전월 대비 증감액 및 증감률
  const monthComparison = computed(() => {
    const current = totalSpending.value;
    const previous = previousMonthSpending.value;

    const difference = current - previous;
    const rate = previous > 0 ? Math.round((difference / previous) * 100) : 0;

    return {
      difference,
      rate,
      isIncrease: difference >= 0,
    };
  });

  // 카테고리별 비율 계산
  const categoryList = computed(() => {
    const total = totalSpending.value;

    return categorySpending.value.map((category) => ({
      ...category,
      percentage: total > 0 ? Math.round((category.amount / total) * 100) : 0,
    }));
  });

  // 도넛 차트용 데이터
  const chartData = computed(() => {
    const categories = categorySpending.value;

    return {
      labels: categories.map((cat) => cat.name),
      datasets: [
        {
          data: categories.map((cat) => cat.amount),
          backgroundColor: categories.map((cat) => cat.color),
          borderWidth: 0,
        },
      ],
    };
  });

  // 월별 지출 추이 데이터 (최근 6개월)
  const monthlyTrendData = computed(() => {
    const months = [];
    const amounts = [];

    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(currentDate.value);
      targetDate.setMonth(targetDate.getMonth() - i);

      const year = targetDate.getFullYear();
      const month = targetDate.getMonth() + 1;

      const monthTransactions = getSpendingTransactions.value.filter(
        (transaction) => {
          try {
            const transactionDate = new Date(transaction.date);
            return (
              transactionDate.getFullYear() === year &&
              transactionDate.getMonth() + 1 === month
            );
          } catch {
            return false;
          }
        }
      );

      const monthTotal = monthTransactions.reduce(
        (sum, t) => sum + t.amount,
        0
      );

      months.push(`${month}월`);
      amounts.push(monthTotal);
    }

    return { months, amounts };
  });

  // 월 이동 함수들
  const previousMonth = () => {
    const newDate = new Date(currentDate.value);
    newDate.setMonth(newDate.getMonth() - 1);
    currentDate.value = newDate;
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate.value);
    newDate.setMonth(newDate.getMonth() + 1);
    currentDate.value = newDate;
  };

  // 특정 카테고리의 상세 데이터 가져오기
  const getCategoryDetail = (categoryName) => {
    return (
      categorySpending.value.find((cat) => cat.name === categoryName) || null
    );
  };

  return {
    currentDate,
    currentMonthText,
    totalSpending,
    monthComparison,
    categoryList,
    categorySpending,
    chartData,
    monthlyTrendData,
    currentMonthTransactions,
    previousMonth,
    nextMonth,
    getCategoryDetail,
  };
}
