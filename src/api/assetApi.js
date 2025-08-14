import axios, { codefInstance } from '@/api/index'; // 공통 axios 인스턴스

console.log('🍀 assetApi.js에서 import된 axios:', axios);

// 자산 요약 불러오기
export async function fetchAssetSummary() {
  console.log('fetchAssetSummary 진입!');
  return await axios.get('/api/asset/summary');
}

/** 계좌 거래내역: 서버 필터링 */
export async function fetchAccountTransactions(
  accountId,
  { page = 0, size = 20, startDate, endDate, q, txType, sort = 'DESC' } = {}
) {
  const params = { page, size, sort };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (q) params.q = q;
  if (txType) params.txType = txType;
  return axios.get(`/api/asset/accounts/${accountId}/transactions`, { params });
}

/** 카드 거래내역: 서버 필터링 */
export async function fetchCardTransactions(
  cardId,
  { page = 0, size = 20, startDate, endDate, q, txType, sort = 'DESC' } = {}
) {
  const params = { page, size, sort };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (q) params.q = q;
  if (txType) params.txType = txType;
  return axios.get(`/api/asset/cards/${cardId}/transactions`, { params });
}

/**
 * 최근 6개월 후불교통대금 거래내역 조회
 */
export async function fetchCardTransportationFees() {
  return axios.get('/api/asset/cards/transportation-fees');
}

// **CODEF 연동만 codefInstance로**
export async function connectAccount({ organization, loginId, password }) {
  return codefInstance.post('/api/codef/connect-account', {
    organization,
    loginId,
    password,
  });
}
export async function registerAccounts(accounts) {
  return codefInstance.post('/api/codef/register-accounts', accounts);
}
export async function connectCard({ organization, loginId, password }) {
  return codefInstance.post('/api/codef/connect-card', {
    organization,
    loginId,
    password,
  });
}
export async function registerCards(cards) {
  return codefInstance.post('/api/codef/register-cards', cards);
}

/** 계좌 동기화 (비동기, 202 Accepted) */
export async function syncAccounts() {
  return codefInstance.post('/api/codef/sync/accounts');
}

/** 카드 동기화 (비동기, 202 Accepted) */
export async function syncCards() {
  return codefInstance.post('/api/codef/sync/cards');
}

// 계좌 거래 메모 업데이트
export function updateAccountTransactionMemo(transactionId, memo) {
  return axios.post(`/api/asset/accounts/${transactionId}/memo`, { memo });
}
// 카드 거래 메모 업데이트
export function updateCardTransactionMemo(transactionId, memo) {
  return axios.post(`/api/asset/cards/${transactionId}/memo`, { memo });
}

// 지출 개요
export async function fetchSpendingOverview({ year, month, trendMonths = 6 }) {
  return axios.get('/api/asset/spending/overview', {
    params: { year, month, trendMonths },
  });
}

// 카테고리별 거래 전체 조회
export async function fetchCategoryTransactions({ categoryId, year, month }) {
  return axios.get(`/api/asset/spending/category/${categoryId}`, {
    params: { year, month },
  });
}

// 카테고리 변경
export function updateTransactionCategory(transactionId, categoryId) {
  return axios.patch(`/api/asset/transactions/${transactionId}/category`, {
    categoryId,
  });
}

// 한국산업인력공단 카드 결제내역 존재 여부
export async function fetchHrdkoreaCardExists() {
  return axios.get('/api/asset/cards/hrdkorea-exists');
}

// 월세 거래내역 존재 여부
export async function fetchRentAccountExists() {
  return axios.get('/api/asset/accounts/rent-exists');
}
