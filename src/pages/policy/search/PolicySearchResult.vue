<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api';
import PolicySearchHeader from './PolicySearchHeader.vue';

const route = useRoute();
const policies = ref([]);

function buildSearchPayload(filter, query = '') {
  return {
    age: filter.age || 0,
    educationLevels: filter.education || [],
    employmentStatuses: filter.jobStatus || [],
    income: filter.income || 0,
    keywords: [],
    majors: filter.major || [],
    marriage:
      filter.marital && filter.marital.length > 0 ? filter.marital[0] : '',
    regions: filter.region || [],
    searchTexts: query ? [query] : [],
    specialConditions: filter.specialty || [],
  };
}

async function fetchPolicies() {
  let filter = {};
  let query = '';
  try {
    query = route.query.q || '';
    filter = route.query.filter
      ? JSON.parse(decodeURIComponent(route.query.filter))
      : {};
  } catch (e) {
    filter = {};
  }
  const payload = buildSearchPayload(filter, query);
  try {
    const res = await api.post('/api/userPolicy/search', payload);
    policies.value = Array.isArray(res.data) ? res.data : [];
  } catch (e) {
    policies.value = [];
  }
}

onMounted(fetchPolicies);
watch(() => [route.query.q, route.query.filter], fetchPolicies);

function formatPeriod(periodStr) {
  if (!periodStr) return '상시';
  const match = periodStr.match(/^(\d{8})\s*~\s*(\d{8})$/);
  if (!match) return periodStr;
  const [_, start, end] = match;
  const s = `${start.slice(0, 4)}.${start.slice(4, 6)}.${start.slice(6, 8)}`;
  const e = `${end.slice(0, 4)}.${end.slice(4, 6)}.${end.slice(6, 8)}`;
  return `${s} ~ ${e}`;
}

const goToApplyPage = (url) => {
  if (url) {
    window.open(url, '_blank');
  }
};

// 대분류 중복 제거 함수 (PolicyMainTab과 동일)
function getUniqueLargeCategories(policy) {
  if (!policy.largeCategory) return [];
  if (Array.isArray(policy.largeCategory)) {
    return Array.from(
      new Set(policy.largeCategory.filter((v) => !!v && v !== ''))
    );
  }
  if (typeof policy.largeCategory === 'string') {
    const arr = policy.largeCategory
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
    return Array.from(new Set(arr));
  }
  return [];
}
</script>

<template>
  <div>
    <PolicySearchHeader />
    <div v-if="policies.length">
      <div
        v-for="(policy, index) in policies"
        :key="policy.policyId"
        class="policyCard"
      >
        <div class="cardHeader">
          <span v-if="index < 3" class="topRank" :class="`rank${index + 1}`">
            TOP {{ index + 1 }}
          </span>
          <div class="titleTagRow">
            <span class="cardTitle font-bold font-15">{{ policy.title }}</span>
            <!-- 대분류 태그 중복 제거 후 표시 -->
            <template v-if="getUniqueLargeCategories(policy).length">
              <span
                v-for="tag in getUniqueLargeCategories(policy)"
                :key="tag"
                class="cardTag font-12"
                >{{ tag }}</span
              >
            </template>
          </div>
        </div>
        <p class="cardDesc font-14">{{ policy.policyBenefitDescription }}</p>
        <p class="cardDeadline font-12">
          <span class="label font-regular">신청기간 : </span>
          <span class="date font-bold">
            {{ policy.endDate ? formatPeriod(policy.endDate) : '상시' }}
          </span>
        </p>
        <div class="cardActions">
          <button
            class="buttonSecondary font-14"
            @click="
              $router.push({
                name: 'policyDetail',
                params: { policyId: policy.policyId },
              })
            "
          >
            자세히 보기
          </button>
          <button
            class="buttonPrimary font-14"
            @click="goToApplyPage(policy.applyUrl)"
          >
            신청하기
          </button>
        </div>
      </div>
    </div>
    <div v-else>
      <p>검색 결과가 없습니다.</p>
    </div>
  </div>
</template>

<style scoped>
.policyCard {
  background-color: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.05);
}
.cardHeader {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  width: 100%;
  min-width: 0;
}
.titleTagRow {
  display: flex;
  align-items: center;
  min-width: 0;
  flex: 1;
  gap: 6px;
}
.topRank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  border-radius: 999px;
  width: 50px;
  height: 24px;
  color: #fff;
  letter-spacing: -0.5px;
  margin-right: 2px;
  flex-shrink: 0;
}
.rank1 {
  background: var(--top-rank-1);
}
.rank2 {
  background: var(--top-rank-2);
}
.rank3 {
  background: var(--top-rank-3);
}
.cardTitle {
  color: var(--text-login);
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  vertical-align: middle;
  max-width: calc(100% - 60px);
}
.cardTag {
  display: inline-block;
  background-color: var(--input-outline);
  color: var(--text-bluegray);
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 2px;
  font-size: 13px;
  vertical-align: middle;
  white-space: nowrap;
  flex-shrink: 0;
}
.cardDesc {
  color: var(--text-bluegray);
  margin: 6px 0;
}
.cardDeadline {
  margin-bottom: 12px;
}
.cardDeadline .label {
  color: var(--text-bluegray);
  margin-right: 4px;
}
.cardDeadline .date {
  color: var(--base-blue-dark);
}
.cardActions {
  display: flex;
  gap: 8px;
}
.buttonSecondary,
.buttonPrimary {
  flex: 1;
}
.buttonSecondary {
  width: 185px;
  background-color: var(--input-bg-2);
  border: none;
  padding: 10px;
  border-radius: 8px;
  color: var(--text-bluegray);
}
.buttonPrimary {
  width: 185px;
  background-color: var(--base-blue-dark);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
}
</style>
