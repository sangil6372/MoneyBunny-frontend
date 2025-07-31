<template>
  <div class="container account-detail">
    <!-- 헤더 -->
    <header class="detail-header">
      <button class="back-btn" @click="$router.back()">←</button>
      <h2>거래내역</h2>
    </header>

    <!-- 계좌 정보 카드 -->
    <section v-if="account" class="account-card">
      <div class="account-header">
        <div class="bank-logo">
          <img :src="getBankLogoByCode(account.bankCode)" alt="은행 로고" />
        </div>

        <div class="bank-info">
          <div class="info-top">
            <span class="bank-name">
              {{ account.bankName }} {{ account.accountName }}
            </span>
            <span v-if="account.isMain" class="main-badge">대표</span>
          </div>
          <p class="account-number">
            {{ account.bankName }} • {{ account.accountNumber }}
          </p>
        </div>
      </div>
      <p class="balance">{{ account.balance.toLocaleString() }}원</p>
    </section>

    <!-- 거래 내역 -->
    <section class="transaction-history">
      <div class="history-header">
        <h3>거래내역</h3>
        <div class="filter-buttons">
          <button
            v-for="f in filters"
            :key="f"
            :class="['filter-btn', { active: filter === f }]"
            @click="filter = f"
          >
            {{ f }}
          </button>
        </div>
      </div>

      <ul>
        <li
          v-for="tx in filteredTransactions"
          :key="tx.id"
          class="transaction-item"
        >
          <div class="tx-left">
            <div
              class="tx-icon"
              :class="{ deposit: tx.amount > 0, withdraw: tx.amount < 0 }"
            >
              <span v-if="tx.amount > 0">↑</span>
              <span v-else>↓</span>
            </div>
            <div class="tx-info">
              <p class="tx-title">{{ tx.title }}</p>
              <p class="tx-date">{{ tx.date }}</p>
            </div>
          </div>
          <p
            class="tx-amount"
            :class="{ positive: tx.amount > 0, negative: tx.amount < 0 }"
          >
            {{ formatAmount(tx.amount) }}
          </p>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import accountsData from '@/assets/data/accounts.json';
import { getBankLogoByCode } from '@/assets/utils/bankLogoMap.js';

const route = useRoute();
const account = ref(null);
const transactions = ref([]);
const filter = ref('전체');
const filters = ['전체', '입금', '출금'];

/* ✅ 계좌 데이터 가져오기 */
const fetchAccount = () => {
  const accountId = route.params.id; // 문자열 그대로 사용
  console.log('현재 route.params.id:', accountId);
  console.log(
    'accountsData IDs:',
    accountsData.map((acc) => acc.id)
  );

  account.value =
    accountsData.find((acc) => String(acc.id) === String(accountId)) || null;

  console.log('찾은 계좌:', account.value);
};

/* ✅ 은행 로고 경로 불러오기 (Vite 방식) */
const getBankLogo = (bankCode) => {
  return new URL(
    `@/assets/images/icons/bank/${bankCode.toLowerCase()}_fill.png`,
    import.meta.url
  ).href;
};

/* ✅ 거래 내역 (더미) */
const fetchTransactions = () => {
  transactions.value = [
    { id: 1, title: '급여 입금', date: '2024-01-15 09:30', amount: 500000 },
    { id: 2, title: 'ATM 출금', date: '2024-01-14 14:20', amount: -50000 },
    { id: 3, title: '이체 입금', date: '2024-01-13 11:45', amount: 200000 },
    { id: 4, title: '편의점 결제', date: '2024-01-12 19:30', amount: -35000 },
    { id: 5, title: '온라인 쇼핑', date: '2024-01-11 16:15', amount: -120000 },
  ];
};

/* ✅ 거래 내역 필터 */
const filteredTransactions = computed(() => {
  if (filter.value === '전체') return transactions.value;
  if (filter.value === '입금')
    return transactions.value.filter((tx) => tx.amount > 0);
  if (filter.value === '출금')
    return transactions.value.filter((tx) => tx.amount < 0);
  return transactions.value;
});

/* ✅ 금액 포맷터 */
const formatAmount = (value) => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toLocaleString()}원`;
};

onMounted(() => {
  fetchAccount();
  fetchTransactions();
});
</script>

<style scoped>
/* 헤더 */
.detail-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.back-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

/* 계좌 카드 */
.account-card {
  background: white;
  border-radius: 12px;
  padding: 1.2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}
.account-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.bank-logo img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}
.info-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.bank-name {
  font-size: 1rem;
  font-weight: 600;
}
.main-badge {
  background: var(--text-bluegray);
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: 0.5rem;
}
.account-number {
  font-size: 0.85rem;
  color: var(--text-lightgray);
  margin-top: 0.15rem;
}
.balance {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--base-blue-dark);
  margin-top: 1rem;
}

/* 거래내역 카드 */
.transaction-history {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}
.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}
.filter-buttons {
  display: flex;
  gap: 0.4rem;
}
.filter-btn {
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  padding: 0.3rem 0.8rem;
  font-size: 0.78rem;
  cursor: pointer;
  color: #374151;
}
.filter-btn.active {
  background: var(--base-blue-dark);
  color: white;
}

/* 거래 아이템 */
.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}
.transaction-item:last-child {
  border-bottom: none;
}
.tx-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.tx-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
}
.tx-icon.deposit {
  background: var(--text-green);
}
.tx-icon.withdraw {
  background: var(--alert-red);
}
.tx-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: #111827;
}
.tx-date {
  font-size: 0.75rem;
  color: var(--text-lightgray);
}
.tx-amount {
  font-weight: 700;
  font-size: 0.9rem;
}
.tx-amount.positive {
  color: var(--text-green);
}
.tx-amount.negative {
  color: var(--alert-red);
}
</style>
