// src/assets/utils/dataAdapter.js
// 다양한 데이터 형태를 통일된 형태로 변환하는 어댑터

/**
 * 다양한 형태의 거래 데이터를 표준 형태로 변환
 * @param {Object} transaction - 원본 거래 데이터
 * @param {string} cardName - 카드명
 * @returns {Object} 표준화된 거래 데이터
 */
export function normalizeTransaction(transaction, cardName = '') {
  // 더미 데이터 형태 (현재)
  if (
    transaction.transactionId &&
    transaction.date &&
    typeof transaction.date === 'string'
  ) {
    return {
      id: transaction.transactionId,
      date: transaction.date,
      time: transaction.time || '',
      merchant: transaction.merchant || transaction.storeName || '',
      category: transaction.category || '기타',
      amount: transaction.amount || 0,
      cardName: cardName,
      status: transaction.status || '승인',
      originalData: transaction, // 원본 데이터 보관
    };
  }

  // API 데이터 형태 (예상)
  if (transaction.id && transaction.transactionDate) {
    return {
      id: transaction.id.toString(),
      date: timestampToDate(transaction.transactionDate),
      time: timestampToTime(transaction.transactionDate),
      merchant: transaction.storeName || transaction.storeName1 || '',
      category: mapCategory(transaction.categoryId, transaction.storeType),
      amount: transaction.amount || 0,
      cardName: cardName,
      status: transaction.cancelStatus === '' ? '승인' : '취소',
      originalData: transaction, // 원본 데이터 보관
    };
  }

  // 알 수 없는 형태의 데이터 - 최대한 추측해서 변환
  return {
    id: transaction.id || transaction.transactionId || Math.random().toString(),
    date: extractDate(transaction),
    time: extractTime(transaction),
    merchant: extractMerchant(transaction),
    category: extractCategory(transaction),
    amount: extractAmount(transaction),
    cardName: cardName,
    status: '승인',
    originalData: transaction,
  };
}

/**
 * 카드 데이터를 표준 형태로 변환
 * @param {Object} card - 원본 카드 데이터
 * @returns {Object} 표준화된 카드 데이터
 */
export function normalizeCard(card) {
  // 더미 데이터 형태
  if (card.cardTransactions && Array.isArray(card.cardTransactions)) {
    return {
      ...card,
      transactions: card.cardTransactions.map((t) =>
        normalizeTransaction(t, card.cardName)
      ),
    };
  }

  // API 데이터 형태 (예상)
  if (card.transactions && Array.isArray(card.transactions)) {
    return {
      ...card,
      transactions: card.transactions.map((t) =>
        normalizeTransaction(t, card.cardName)
      ),
    };
  }

  // 거래내역이 다른 필드에 있을 수 있음
  const transactionFields = [
    'cardTransactions',
    'transactions',
    'transactionList',
    'history',
  ];
  for (const field of transactionFields) {
    if (card[field] && Array.isArray(card[field])) {
      return {
        ...card,
        transactions: card[field].map((t) =>
          normalizeTransaction(t, card.cardName)
        ),
      };
    }
  }

  // 거래내역이 없는 경우
  return {
    ...card,
    transactions: [],
  };
}

// === 유틸리티 함수들 ===

function timestampToDate(timestamp) {
  try {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

function timestampToTime(timestamp) {
  try {
    const date = new Date(timestamp);
    return date.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
  } catch {
    return '';
  }
}

function mapCategory(categoryId, storeType) {
  // categoryId 우선 매핑
  if (categoryId) {
    const CATEGORY_MAP = {
      1: '식비',
      2: '교통비',
      3: '쇼핑',
      4: '취미/여가',
      5: '생활',
      6: '건강/의료',
      // 필요시 추가
    };
    return CATEGORY_MAP[categoryId] || '기타';
  }

  // storeType 기반 매핑
  if (storeType) {
    const STORE_TYPE_MAP = {
      대형할인점: '쇼핑',
      편의점: '편의점',
      주유소: '교통비',
      병원: '건강/의료',
      약국: '건강/의료',
      카페: '식비',
      음식점: '식비',
      // 필요시 추가
    };
    return STORE_TYPE_MAP[storeType] || '쇼핑';
  }

  return '기타';
}

// 알 수 없는 데이터에서 정보 추출하는 함수들
function extractDate(transaction) {
  const dateFields = ['date', 'transactionDate', 'paymentDate', 'approvalDate'];

  for (const field of dateFields) {
    if (transaction[field]) {
      const value = transaction[field];

      // 문자열 날짜
      if (typeof value === 'string') {
        return value;
      }

      // 타임스탬프
      if (typeof value === 'number') {
        return timestampToDate(value);
      }
    }
  }

  return new Date().toISOString().split('T')[0];
}

function extractTime(transaction) {
  const timeFields = ['time', 'transactionTime', 'approvalTime'];

  for (const field of timeFields) {
    if (transaction[field]) {
      return transaction[field];
    }
  }

  // 날짜에서 시간 추출 시도
  if (
    transaction.transactionDate &&
    typeof transaction.transactionDate === 'number'
  ) {
    return timestampToTime(transaction.transactionDate);
  }

  return '';
}

function extractMerchant(transaction) {
  const merchantFields = [
    'merchant',
    'storeName',
    'storeName1',
    'shopName',
    'merchantName',
  ];

  for (const field of merchantFields) {
    if (transaction[field]) {
      return transaction[field];
    }
  }

  return '알 수 없는 가맹점';
}

function extractCategory(transaction) {
  if (transaction.category) {
    return transaction.category;
  }

  return mapCategory(transaction.categoryId, transaction.storeType);
}

function extractAmount(transaction) {
  const amountFields = ['amount', 'price', 'paymentAmount', 'approvalAmount'];

  for (const field of amountFields) {
    if (transaction[field] && typeof transaction[field] === 'number') {
      return transaction[field];
    }
  }

  return 0;
}
