<template>
  <div class="noResultContainer">
    <div class="noResultBox">
      <img
        src="@/assets/images/icons/bunny/crying_bunny.png"
        alt="검색결과 없음"
        class="noResultImage"
      />
      <div class="noResultTitle font-17 font-bold">검색 결과가 없습니다</div>
      <div class="noResultDesc font-12">
        입력하신 <span class="font-bold">{{ searchKeyword }}</span> 에 대한
        정책을 찾을 수 없습니다.
      </div>
    </div>

    <div class="popularBox">
      <div class="popularTitle font-16 font-bold">인기 검색어</div>
      <div class="popularRankGrid">
        <div class="rankCol">
          <div
            class="popularItem"
            v-for="(item, i) in popularKeywords.slice(
              0,
              Math.ceil(popularKeywords.length / 2)
            )"
            :key="i"
            @click="$emit('search', item)"
          >
            <span class="number">{{ i + 1 }}</span>
            <span class="text font-13">{{ item }}</span>
          </div>
        </div>
        <div class="rankCol">
          <div
            class="popularItem"
            v-for="(item, i) in popularKeywords.slice(
              Math.ceil(popularKeywords.length / 2),
              popularKeywords.length
            )"
            :key="i + Math.ceil(popularKeywords.length / 2)"
            @click="$emit('search', item)"
          >
            <span class="number">{{
              i + 1 + Math.ceil(popularKeywords.length / 2)
            }}</span>
            <span class="text font-13">{{ item }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="recommendBox" v-if="recommendedPolicies.length">
      <div class="recommendTitle font-16 font-bold">이런 정책은 어떠세요?</div>
      <div class="recList">
        <article
          v-for="p in recommendedPolicies"
          :key="p.id ?? p.policyId ?? p.title"
          class="recCard"
          role="button"
          @click="goToPolicyDetail(p)"
        >
          <div class="recBadge">
            {{ getFirstLargeCategory(p) }}
          </div>
          <div class="recTitle font-13 font-bold">{{ p.title }}</div>
          <div class="recSubtitle font-11">
            {{ p.policyBenefitDescription || p.benefitSummary || '' }}
          </div>
          <div class="recMeta font-11">
            신청기간 :
            <span class="recLink">
              {{ getPolicyPeriod(p) }}
            </span>
          </div>
        </article>
      </div>
    </div>

    <!-- <div class="tipBox">
      <div class="tipTitle font-16 font-bold">검색 팁</div>
      <div class="tipList">
        <div class="tipItem">
          <div class="tipRow">
            <span class="tipNum">1</span>
            <span class="tipMain font-bold font-13"
              >다른 키워드로 검색해보세요</span
            >
          </div>
          <div class="tipDesc font-11 tipDescIndent">
            유사한 의미의 다른 단어를 사용해보세요
          </div>
        </div>
        <div class="tipItem">
          <div class="tipRow">
            <span class="tipNum">2</span>
            <span class="tipMain font-bold font-13">검색어를 줄여보세요</span>
          </div>
          <div class="tipDesc font-11 tipDescIndent">
            너무 구체적인 검색어보다 간단한 키워드 사용
          </div>
        </div>
        <div class="tipItem">
          <div class="tipRow">
            <span class="tipNum">3</span>
            <span class="tipMain font-bold font-13">맞춤법을 확인해보세요</span>
          </div>
          <div class="tipDesc font-11 tipDescIndent">
            오타나 띄어쓰기를 다시 한번 확인해주세요
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { policyAPI } from '@/api/policy';

const props = defineProps({
  searchKeyword: { type: String, default: '검색어' },
});

const router = useRouter();
const popularKeywords = ref([]);
const recommendedPolicies = ref([]);

// 대분류 코드(여러 개면 첫 번째) 추출 함수
function getFirstLargeCategory(policy) {
  if (!policy.largeCategory) return '';
  if (Array.isArray(policy.largeCategory)) {
    return policy.largeCategory[0] || '';
  }
  if (typeof policy.largeCategory === 'string') {
    return policy.largeCategory.split(',')[0]?.trim() || '';
  }
  return '';
}

// 신청기간 추출 및 포맷 함수
function getPolicyPeriod(policy) {
  // endDate 또는 applyPeriod 우선순위
  if (policy.endDate) return formatPeriod(policy.endDate);
  if (policy.applyPeriod) return formatPeriod(policy.applyPeriod);
  return '상시';
}

// 인기 검색어, 인기 정책 fetch
onMounted(async () => {
  try {
    const [keywordsRes, policiesRes] = await Promise.all([
      policyAPI.getUserPolicyPopularKeywords(),
      policyAPI.getTop3ViewsAll(),
    ]);
    popularKeywords.value = keywordsRes.data?.slice(0, 6) || [];
    // 인기 정책 2개만 노출
    recommendedPolicies.value = (policiesRes.data || []).slice(0, 2);
  } catch (e) {
    popularKeywords.value = [];
    recommendedPolicies.value = [];
  }
});

/** '상시'는 그대로, 그 외 'YYYYMMDD~YYYYMMDD' 형식만 사람이 읽기 좋게 */
const formatPeriod = (period) => {
  if (!period || period === '상시') return '상시';
  const match = String(period).match(/^(\d{8})\s*~\s*(\d{8})$/);
  if (!match) return period;
  const fmt = (s) => `${s.slice(0, 4)}.${s.slice(4, 6)}.${s.slice(6, 8)}`;
  return `${fmt(match[1])} ~ ${fmt(match[2])}`;
};

function goToPolicyDetail(policy) {
  const id = policy.policyId ?? policy.id;
  if (id) {
    router.push({ name: 'policyDetail', params: { policyId: id } });
  }
}
</script>

<style scoped>
.noResultContainer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  width: 100%;
}
.noResultBox {
  background: var(--white, #fff);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  margin-bottom: 12px;
}
.noResultImage {
  width: 55px;
  height: 70px;
  margin-bottom: 7px;
}
.noResultTitle {
  color: var(--text-login);
  margin-bottom: 6px;
  text-align: center;
}
.noResultDesc {
  color: var(--text-bluegray);
  text-align: center;
}
.tipBox,
.popularBox,
.recommendBox {
  background: var(--white, #fff);
  border-radius: 12px;
  padding: 20px;
  width: 100%;
}
.tipBox {
  margin-bottom: 12px;
}
.tipTitle,
.popularTitle,
.recommendTitle {
  color: var(--text-title, #232a3a);
  margin-bottom: 12px;
}
.tipList {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.tipItem {
  margin-bottom: 4px;
}
.tipRow {
  display: flex;
  align-items: center;
  gap: 8px;
}
.tipNum {
  color: var(--text-bluegray);
  display: flex;
  align-items: center;
  justify-content: center;
}
.tipMain {
  margin-right: 5px;
  color: var(--text-login);
}
.tipDesc {
  color: var(--text-bluegray);
  margin-top: 2px;
}

.popularGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.popularItem {
  background-color: var(--input-bg-1);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
  max-width: 110px;
  overflow: hidden;
}
.number {
  font-weight: bold;
  color: var(--base-blue-dark);
}
.text {
  display: inline-block;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}
.popularRankGrid {
  display: flex;
  gap: 10px;
}
.rankCol {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recList {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recCard {
  border: 1px solid var(--input-bg-1);
  background: #fff;
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
}

.recBadge {
  display: inline-block;
  background: var(--input-bg-2);
  color: var(--text-bluegray);
  border-radius: 6px;
  padding: 2px 6px;
  font-size: 10px;
  margin-bottom: 8px;
}
.recTitle {
  color: var(--text-title);
  margin-bottom: 6px;
  line-height: 1.3;
}
.recSubtitle {
  color: var(--text-bluegray);
  margin-bottom: 8px;
}
.recMeta {
  color: var(--text-bluegray);
}
.recLink {
  color: var(--base-blue-dark);
}
</style>
