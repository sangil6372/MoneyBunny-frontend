import axios, { codefInstance } from '@/api/index'; // 공통 axios 인스턴스

console.log('🍀 assetApi.js에서 import된 axios:', axios);

// 자산 요약 불러오기
export async function fetchAssetSummary() {
  console.log('fetchAssetSummary 진입!');
  return await axios.get('/api/asset/summary');
}

// 특정 계좌의 거래내역 페이징 조회
export async function fetchAccountTransactions(
  accountId,
  page = 0,
  size = 20,
  txType = ''
) {
  const params = { page, size };
  if (txType) params.txType = txType; // 한글 X, 영어 그대로!
  return axios.get(`/api/asset/accounts/${accountId}/transactions`, { params });
}

export async function fetchCardTransactions(
  cardId,
  page = 0,
  size = 20,
  txType = '' // 카드도 income/expense/cancel 등 확장 가능
) {
  const params = { page, size };
  if (txType) params.txType = txType;
  return axios.get(`/api/asset/cards/${cardId}/transactions`, { params });
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
