<template>
  <div class="recommendationSection">
    <template v-if="policyList.length">
      <div class="header">
        <div class="titleWrap">
          <div class="title">맞춤정책 추천 TOP3</div>
        </div>
        <button class="moreBtn" @click="goToPolicy">더보기</button>
      </div>

      <div class="cardList">
        <PolicyCardItem
          v-for="(item, i) in policyList"
          :key="item.policyId"
          :rank="i + 1"
          :title="item.title"
          :description="item.description"
          :amount="item.amount"
          :total="top3TotalAmount"
          :policyId="item.policyId"
        />
      </div>
    </template>

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
const policyList = ref([]);
const top3TotalAmount = ref(0);

const goToPolicy = () => router.push('/policy');
const goToQuiz = () => router.push('/policy/taps/PolicyMainTab');

const asCurrency = (v) =>
  new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(v || 0);

onMounted(async () => {
  try {
    const res = await policyAPI.getUserPolicySearch();
    const top3 = (res.data || []).slice(0, 3).map((item) => ({
      policyId: String(item.policyId),
      title: item.title,
      description: item.policyBenefitDescription,
      amount: Number(item.policyBenefitAmount) || 0,
    }));
    policyList.value = top3;
    top3TotalAmount.value = top3.reduce((sum, i) => sum + i.amount, 0);
  } catch {
    policyList.value = [];
    top3TotalAmount.value = 0;
  }
});
</script>

<style scoped>
.recommendationSection {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.titleWrap {
  display: flex;
  align-items: center;
  gap: 8px;
}
.title {
  font-size: 14px;
  font-weight: bold;
  color: var(--base-blue-dark);
}

.moreBtn {
  font-size: 10px;
  color: var(--text-lightgray);
  background: transparent;
  border: 0;
  cursor: pointer;
}

.cardList {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}
</style>
