<template>
  <div class="account-card" :class="{ main: account.isMain }">
    <div class="account-left">
      <img :src="account.logoUrl" class="bank-logo" alt="은행 로고" />
      <div class="info">
        <div class="name-line">
          <span class="account-name"
            >{{ account.bank }} {{ account.name }}</span
          >
          <span v-if="account.isMain" class="badge">대표</span>
        </div>
        <span class="account-meta"
          >{{ account.bank }} · {{ account.number }}</span
        >
      </div>
    </div>

    <div class="account-right">
      <div class="balance">{{ formatPrice(account.balance) }}원</div>

      <div class="buttons">
        <button class="icon-btn" @click="$emit('delete', account.id)">
          🗑️
        </button>
        <button
          v-if="!account.isMain"
          class="main-btn"
          @click="$emit('set-main', account.id)"
        >
          대표 설정
        </button>
        <span v-else class="main-label">대표 계좌</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  account: {
    type: Object,
    required: true,
  },
});

const formatPrice = (price) => price.toLocaleString();
</script>
<style scoped>
.account-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.125rem 1.25rem;
  margin-bottom: 0.75rem;
  transition: box-shadow 0.2s ease;
}

.account-left {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.bank-logo {
  width: 2.25rem;
  height: 2.25rem;
  object-fit: contain;
  border-radius: 50%;
  background-color: white;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.name-line {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.account-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1e293b;
}

.badge {
  background-color: var(--base-blue-dark);
  color: white;
  font-size: 0.6875rem;
  padding: 0.125rem 0.375rem;
  border-radius: 0.375rem;
}

.account-meta {
  font-size: 0.8125rem;
  color: #94a3b8;
}

.account-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.balance {
  font-size: 1.0625rem;
  font-weight: bold;
  color: #0f172a;
}

.buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-btn {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
}

.icon-btn img {
  width: 1rem;
  height: 1rem;
}

.main-btn {
  font-size: 0.75rem;
  color: #475569;
  background-color: #f1f5f9;
  border: none;
  padding: 0.25rem 0.625rem;
  border-radius: 0.375rem;
  cursor: pointer;
}

.main-label {
  font-size: 0.8125rem;
  color: #334155;
  font-weight: 500;
}
</style>
