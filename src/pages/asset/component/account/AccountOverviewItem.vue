<template>
  <div class="overview-item-simple">
    <!-- 은행 로고 -->
    <img
      :src="getBankLogoByCode(account.bankCode)"
      :alt="`${getBankName(account.bankCode)} 로고`"
      class="bank-logo"
    />

    <!-- 계좌 정보 -->
    <div class="info">
      <p class="name">
        {{ getBankName(account.bankCode) }} {{ account.accountName }}
      </p>
      <p class="number">{{ formatAccountNumber(account.accountNumber) }}</p>
    </div>
  </div>
</template>

<script setup>
import { getBankLogoByCode } from '@/assets/utils/bankLogoMap.js';
import { getBankName } from '@/assets/utils/bankCodeMap.js';

const props = defineProps({
  account: { type: Object, required: true },
});

// 계좌번호 포맷팅 함수 (마스킹 처리)
const formatAccountNumber = (number) => {
  if (!number) return '-';
  // 계좌번호를 앞 3자리-중간 마스킹-뒤 4자리 형태로 표시
  if (number.length > 7) {
    const front = number.slice(0, 3);
    const back = number.slice(-4);
    const middle = '*'.repeat(Math.max(0, number.length - 7));
    return `${front}-${middle}-${back}`;
  }
  return number.replace(/(\d{3})(\d{3})(\d{3,4})/, '$1-$2-$3');
};
</script>

<style scoped>
.overview-item-simple {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: var(--input-bg-2);
  border-radius: 12px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
}

.bank-logo {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  margin-right: 12px;
  object-fit: contain;
  flex-shrink: 0; /* 로고 크기 고정 */
}

.info {
  flex: 1;
  min-width: 0; /* flex item이 축소될 수 있도록 */
  overflow: hidden; /* 넘치는 내용 숨김 */
}

.name {
  font-family: 'NanumSquareNeo', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-login);
  margin: 0 0 3px 0;
  line-height: 1.3;
  /* 긴 이름 말줄임표 처리 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.number {
  font-family: 'NanumSquareNeo', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: var(--text-darkgray);
  margin: 0;
  line-height: 1.3;
  /* 계좌 번호도 말줄임표 처리 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>
