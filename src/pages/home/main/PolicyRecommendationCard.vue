<template>
  <div class="recommendation-section">
    <template v-if="policyList.length > 0">
      <div class="header">
        <h2>맞춤정책 추천 Top3</h2>
        <span class="more" @click="goToPolicy">더보기</span>
      </div>
      <div class="card-list">
        <PolicyCardItem
          v-for="(item, i) in policyList"
          :key="i"
          :rank="i + 1"
          :title="item.title"
          :description="item.description"
          :amount="item.amount"
          :highlighted="i === 1"
        />
      </div>
    </template>

    <!-- 정책이 없을 경우 -->
    <NoPolicyCard v-else @start-quiz="goToQuiz" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import PolicyCardItem from './PolicyCardItem.vue';
import NoPolicyCard from './NoPolicyCard.vue'; // 정책이 없을 떼

const router = useRouter();

const goToPolicy = () => {
  router.push('/policy'); //정책 탭으로 이동
};

const goToQuiz = () => {
  router.push('/policy/taps/PolicyMainTab'); // 예: 유형 검사 시작
};

//정책 있는 경우
const policyList = [
  {
    title: '청년도약계좌',
    description: '연 5% 이자 + 정부지원금',
    amount: 1200000,
  },
  {
    title: '청년희망적금',
    description: '연 4.5% 이자 + 세제혜택',
    amount: 980000,
  },
  {
    title: '주택청약종합저축',
    description: '연 3.5% 이자 + 청약가점',
    amount: 750000,
  },
];

/*정책 없는 경우
const policyList = [];
*/
</script>

<style scoped>
.recommendation-section {
  background-color: white;
  border-radius: 1rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h2 {
  font-size: 1.125rem; /* 18px */
  font-weight: 700;
  color: var(--text-login);
  margin: 0;
}

.more {
  font-size: 0.875rem; /* 14px */
  font-weight: 400;
  color: var(--text-lightgray);
  cursor: pointer;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
