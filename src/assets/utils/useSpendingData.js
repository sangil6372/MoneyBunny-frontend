// src/assets/utils/useSpendingData.js
import { ref, computed } from 'vue';
import cardsData from '@/assets/data/cards.json';

// 카테고리별 색상 매핑 (추후 변경 예정)
const CATEGORY_COLORS = {
  식비: '#304663', // 어두운 색 (base-blue-dark)
  교통비: '#a3c6df', // 파란색 (sub-skyblue)
  쇼핑: '#a5d6d3', // 초록색 (sub-mint)
  '취미/여가': '#a1a6c6', // 라벤더 (base-lavender)
  생활: '#cbd1e8', // 연한 파랑 (base-blue-light)
  기타: '#ffe6eb', // 핑크 (base-pink)
};

export function useSpendingData() {
  // 현재 선택된 날짜 (월별 네비게이션용)
  const currentDate = ref(new Date());

  // 현재 월 텍스트 포맷
  const currentMonthText = computed(() => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth() + 1;
    return `${month}월 ${year}년`;
  });

  // 카드 거래내역을 지출 데이터로 변환
  const getSpendingTransactions = computed(() => {
    const transactions = [];

    cardsData.forEach((card) => {
      card.cardTransactions.forEach((transaction) => {
        transactions.push({
          id: transaction.transactionId,
          date: transaction.date,
          time: transaction.time,
          merchant: transaction.merchant,
          category: transaction.category,
          amount: transaction.amount,
          cardName: card.cardName,
          status: transaction.status,
        });
      });
    });

    return transactions;
  });

  // 현재 월의 지출 거래내역 필터링
  const currentMonthTransactions = computed(() => {
    const targetYear = currentDate.value.getFullYear();
    const targetMonth = currentDate.value.getMonth() + 1;

    return getSpendingTransactions.value.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getFullYear() === targetYear &&
        transactionDate.getMonth() + 1 === targetMonth
      );
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
          color: CATEGORY_COLORS[category] || CATEGORY_COLORS['기타'],
        };
      }

      categoryMap[category].amount += transaction.amount;
      categoryMap[category].transactions.push(transaction);
    });

    // 금액순으로 정렬
    return Object.values(categoryMap).sort((a, b) => b.amount - a.amount);
  });

  // 총 지출액
  const totalSpending = computed(() => {
    return currentMonthTransactions.value.reduce((sum, transaction) => {
      return sum + transaction.amount;
    }, 0);
  });

  // 전월 지출액 (전월 대비 계산용)
  const previousMonthSpending = computed(() => {
    const prevDate = new Date(currentDate.value);
    prevDate.setMonth(prevDate.getMonth() - 1);

    const prevYear = prevDate.getFullYear();
    const prevMonth = prevDate.getMonth() + 1;

    const prevTransactions = getSpendingTransactions.value.filter(
      (transaction) => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate.getFullYear() === prevYear &&
          transactionDate.getMonth() + 1 === prevMonth
        );
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

  // 카테고리별 비율 계산 (리스트용)
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

      // 해당 월의 거래내역 필터링
      const monthTransactions = getSpendingTransactions.value.filter(
        (transaction) => {
          const transactionDate = new Date(transaction.date);
          return (
            transactionDate.getFullYear() === year &&
            transactionDate.getMonth() + 1 === month
          );
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
    // 상태
    currentDate,
    currentMonthText,

    // 계산된 데이터
    totalSpending,
    monthComparison,
    categoryList,
    categorySpending,
    chartData,
    monthlyTrendData,
    currentMonthTransactions,

    // 메서드
    previousMonth,
    nextMonth,
    getCategoryDetail,
  };
}
