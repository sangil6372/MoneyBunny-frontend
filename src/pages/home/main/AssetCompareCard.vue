<template>
  <div class="asset-compare-card">
    <h2 class="title">정책 적용 후 자산비교</h2>

    <!-- 자산 비교 -->
    <div class="asset-box">
      <div class="block light">
        <div class="label">현재 자산</div>
        <div class="amount">{{ currentAssetDisplay }}</div>
      </div>
      <div class="block dark">
        <div class="label">예상 자산</div>
        <div class="amount">{{ expectedAssetDisplay }}</div>
      </div>
    </div>

    <!-- 자산 증가율 -->
    <div class="growth-box">
      <div class="growth-left">
        <img
          src="@/assets/images/icons/common/increase.png"
          alt="자산 증가 아이콘"
          class="icon"
        />
        <span class="text">
          <strong>자산 증가율</strong><br />
          예상 증가금액: {{ increaseAmountDisplay }}
        </span>
      </div>
      <div class="growth-rate">{{ increaseRateDisplay }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

// 자산 관련 상태 선언
const currentAsset = ref(null);
const expectedAsset = ref(null);
const increaseAmount = ref(null);
const increaseRate = ref(null);

//컴포넌트 마운트 시 화면
// onMounted(async () => {
// try {
//백엔드 서버에서 계좌 정보 가져오기
// const res = await axios.get('http://localhost:3000/accounts?userId=1');
// const accounts = res.data;
// const total = accounts.reduce((sum, acc) => sum + acc.balance, 0);

//   //계좌 잔액 총합
//   currentAsset.value = total;
//   //변경 예정: 정책 적용 시 자산 증가
//   expectedAsset.value = Math.round(total * 1.1);

//   //증가 금액과 증가율 계산
//   increaseAmount.value = expectedAsset.value - total;
//   increaseRate.value = ((increaseAmount.value / total) * 100).toFixed(1);
// } catch (e) {
//   //오류 발생시
//   console.error('자산 불러오기 실패', e);
// }
// });

// fallback display용
const format = (val, suffix = '원') =>
  val ? val.toLocaleString() + suffix : '9,999' + suffix;

const currentAssetDisplay = computed(() => format(currentAsset.value));
const expectedAssetDisplay = computed(() => format(expectedAsset.value));
const increaseAmountDisplay = computed(
  () => '+' + format(increaseAmount.value)
);
const increaseRateDisplay = computed(() =>
  increaseRate.value ? `${increaseRate.value}%` : '9.9%'
);
</script>

<style scoped>
.asset-compare-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.title {
  font-size: 1.125rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

/* 자산 박스 */
.asset-box {
  display: flex;
  gap: 1rem;
}

.block {
  flex: 1;
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.light {
  background-color: #f9fafb;
  color: var(--text-login);
}

.dark {
  background-color: var(--base-blue-dark);
  color: white;
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
}

.amount {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

/* 자산 증가율 */
.growth-box {
  background: #eef2ff;
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.growth-left .icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.4rem;
  object-fit: contain;
}

.growth-rate {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-green);
}
</style>
