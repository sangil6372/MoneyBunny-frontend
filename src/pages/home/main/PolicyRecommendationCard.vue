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
import { ref, onMounted } from 'vue';
import { policyAPI } from '@/api/policy';
import PolicyCardItem from './PolicyCardItem.vue';
import NoPolicyCard from './NoPolicyCard.vue';

const router = useRouter();

const goToPolicy = () => {
  router.push('/policy');
};

const goToQuiz = () => {
  router.push('/policy/taps/PolicyMainTab');
};

const policyList = ref([]);
const top3TotalAmount = ref(0);

onMounted(async () => {
  try {
    const res = await policyAPI.getUserPolicySearch();
    const top3 = (res.data || []).slice(0, 3).map((item) => ({
      title: item.title,
      description: item.policyBenefitDescription,
      amount: item.policyBenefitAmount,
    }));
    policyList.value = top3;
    // 혜택금액 총합 저장
    top3TotalAmount.value = top3.reduce(
      (sum, item) => sum + (typeof item.amount === 'number' ? item.amount : 0),
      0
    );
    // 필요하다면 console.log(top3TotalAmount.value);
  } catch (e) {
    policyList.value = [];
    top3TotalAmount.value = 0;
  }
});

// expose top3TotalAmount to parent
defineExpose({
  top3TotalAmount,
});
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
