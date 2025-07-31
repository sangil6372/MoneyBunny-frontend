<template>
  <div class="account-card" :class="{ main: account.isMain }">
    <!-- 삭제 아이콘 우측 상단 -->
    <!-- 삭제 아이콘 우측 상단 -->
    <button class="delete-icon" @click="$emit('delete', account.id)">
      <img src="@/assets/images/icons/common/Trash.png" alt="삭제" />
    </button>

    <div class="content">
      <!-- 좌측: 로고 + 정보 -->
      <div class="info-left">
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

      <!-- 하단: 잔액 및 대표 표시 -->
      <div class="bottom">
        <div class="balance">{{ formatPrice(account.balance) }}원</div>
        <div class="main-section">
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
  position: relative;
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 0.75rem;
}

.delete-icon {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
}

.delete-icon img {
  width: 1rem;
  height: 1rem;
  opacity: 0.5;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-left {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.bank-logo {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: white;
  object-fit: contain;
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
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
}

.badge {
  background-color: var(--base-blue-dark);
  color: white;
  font-size: 0.6875rem;
  padding: 0.125rem 0.5rem;
  border-radius: 0.375rem;
}

.account-meta {
  font-size: 0.8125rem;
  color: #94a3b8;
}

.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.balance {
  font-size: 1.0625rem;
  font-weight: bold;
  color: #0f172a;
}

.main-section {
  font-size: 0.875rem;
}

.main-btn {
  background-color: #f1f5f9;
  color: #475569;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  cursor: pointer;
}

.main-label {
  color: #334155;
  font-weight: 500;
}
</style>
