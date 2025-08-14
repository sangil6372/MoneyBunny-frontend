<template>
  <div class="recommendation-section">
    <template v-if="policyList.length > 0">
      <div class="header">
        <div>맞춤정책 추천 TOP3</div>
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
          :policyId="item.policyId"
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
      policyId: String(item.policyId), // policyId를 String으로 변환
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
  border-radius: 6px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--text-login);
  margin: 0;
  /* padding-left: 0.25rem; */
}

.more {
  font-size: 0.65rem;
  font-weight: bold;
  margin-right: 0.35rem;
  color: var(--text-lightgray);
  cursor: pointer;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}
</style>
