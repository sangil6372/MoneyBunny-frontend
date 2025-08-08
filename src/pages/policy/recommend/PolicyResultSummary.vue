<template>
  <header class="introHeader">
    <div class="resultHeader font-18">
      <div>맞춤 정책 분석 완료!</div>
      <img
        src="@/assets/images/icons/bunny/personality_done_bunny.png"
        alt="토끼"
        class="bunny"
      />
    </div>
  </header>
  <div class="resultContainer">
    <section class="summarySection">
      <div class="font-16 font-bold">응답 결과</div>
      <div class="summaryRow" v-for="(value, label) in summary" :key="label">
        <span class="summaryLabel">{{ label }}</span>
        <span class="summaryValue">{{ value }}</span>
      </div>
    </section>

    <div class="prioritySection">
      <div class="font-16 font-bold">정책 신청 시 중요하게 여긴 항목</div>
      <ul class="priorityList">
        <li
          v-for="(item, index) in priorityOrder"
          :key="index"
          class="priorityItem"
        >
          <span class="priorityRank"> {{ index + 1 }}순위 </span>
          <span class="priorityLabel"> {{ item }} </span>
        </li>
      </ul>
    </div>

    <section class="recommendSection">
      <h3 class="font-16 font-bold">추천 정책 미리보기</h3>
      <div
        class="policyCard"
        v-for="policy in previewPolicies.slice(0, 2)"
        :key="policy.policyId"
      >
        <!-- 🛠️ 제승 수정: 태그 하드코딩, 추후 API 값으로 대체 예정 -->
        <div class="tag">주택</div>
        <p class="title font-bold">{{ policy.title }}</p>
        <p class="desc">{{ policy.policyBenefitDescription }}</p>
        <p class="match">
          신청기간:
          <template v-if="policy.startDate && policy.endDate">
            {{ formatDate(policy.startDate) }} ~
            {{ formatDate(policy.endDate) }}
          </template>
          <template v-else>
            {{ formatDate(policy.endDate) }}
          </template>
        </p>
        <!--
        <div class="tag">{{ policy.tag }}</div>
        <p class="desc">{{ policy.description }}</p>
        <p class="match">매칭도: {{ policy.match }}</p>
        -->
      </div>
    </section>

    <footer class="buttonGroup">
      <button class="btn-grey" @click="redoQuiz">다시 검사하기</button>
      <button class="btn-blue" @click="goToAllPolicies">
        맞춤 정책 전체 보기
      </button>
    </footer>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePolicyQuizStore } from '@/stores/policyQuizStore';
import { usePolicyMatchingStore } from '@/stores/policyMatchingStore'; // 🛠️ 제승 수정: 정책 매칭 스토어 import
import { policyAPI } from '@/api/policy';

export default {
  name: 'PolicyResultSummary',
  setup() {
    const router = useRouter();
    const policyQuizStore = usePolicyQuizStore();
    const policyMatchingStore = usePolicyMatchingStore(); // 🛠️ 제승 수정: 스토어 사용

    const summary = computed(() => ({
      학력: policyQuizStore.educationLevels || '-',
      '전공 요건': policyQuizStore.majors || '-',
      '현재 상황': policyQuizStore.employmentStatuses || '-',
      소득: policyQuizStore.income || '-',
    }));

    const priorityOrder = computed(() => {
      const arr = [];
      const { moneyRank, popularityRank, periodRank } = policyQuizStore;
      if (moneyRank === 1) arr[0] = '금액';
      if (moneyRank === 2) arr[1] = '금액';
      if (moneyRank === 3) arr[2] = '금액';
      if (popularityRank === 1) arr[0] = '조회수';
      if (popularityRank === 2) arr[1] = '조회수';
      if (popularityRank === 3) arr[2] = '조회수';
      if (periodRank === 1) arr[0] = '만료일';
      if (periodRank === 2) arr[1] = '만료일';
      if (periodRank === 3) arr[2] = '만료일';
      return arr;
    });

    // 🛠️ 제승 수정: 정책 미리보기 API 연동 및 policyMatchingStore 연동
    const previewPolicies = ref([]);

    onMounted(async () => {
      if (policyMatchingStore.recommendedPolicies.length > 0) {
        previewPolicies.value = policyMatchingStore.recommendedPolicies;
        return;
      }
      try {
        const res = await policyAPI.getUserPolicySearch();
        previewPolicies.value = res.data;
        policyMatchingStore.setRecommendedPolicies(res.data);
      } catch (e) {
        previewPolicies.value = [];
      }
    });

    // 🛠️ 제승 수정: 날짜 포맷 함수 개선 (YYYYMMDD → YYYY.MM.DD 또는 "YYYYMMDD ~ YYYYMMDD" 처리)
    function formatDate(dateStr) {
      if (typeof dateStr !== 'string') return dateStr;
      // "YYYYMMDD ~ YYYYMMDD" 형식 처리
      const parts = dateStr.split('~').map((s) => s.trim());
      if (
        parts.length === 2 &&
        /^\d{8}$/.test(parts[0]) &&
        /^\d{8}$/.test(parts[1])
      ) {
        return `${parts[0].slice(0, 4)}.${parts[0].slice(
          4,
          6
        )}.${parts[0].slice(6, 8)} ~ ${parts[1].slice(0, 4)}.${parts[1].slice(
          4,
          6
        )}.${parts[1].slice(6, 8)}`;
      }
      // 단일 날짜 "YYYYMMDD"
      if (parts.length === 1 && /^\d{8}$/.test(parts[0])) {
        return `${parts[0].slice(0, 4)}.${parts[0].slice(
          4,
          6
        )}.${parts[0].slice(6, 8)}`;
      }
      return dateStr;
    }

    const redoQuiz = async () => {
      try {
        await policyAPI.deleteUserPolicy();
        policyQuizStore.resetQuiz(); // 스토어 값 완전 초기화
        localStorage.removeItem('policyQuiz');
        sessionStorage.removeItem('policyQuiz');
        router.push({ name: 'policyIntroForm' });
      } catch (e) {
        policyQuizStore.resetQuiz();
        localStorage.removeItem('policyQuiz');
        sessionStorage.removeItem('policyQuiz');
        router.push({ name: 'policyIntroForm' });
      }
    };

    const goToAllPolicies = () => {
      router.push({ name: 'policyMain' });
    };

    return {
      summary,
      previewPolicies,
      redoQuiz,
      goToAllPolicies,
      priorityOrder,
      formatDate, // 🛠️ 제승 수정: 템플릿에서 사용
    };
  },
};
</script>

<style scoped>
.introHeader {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}
.resultHeader {
  display: flex;
  flex-direction: column; /* 세로 정렬! */
  align-items: center; /* 수평 중앙정렬 */
  justify-content: center; /* 수직 중앙정렬 */
  background-color: var(--base-blue-dark);
  border-radius: 8px;
  padding: 20px;
  color: white;
  width: 100%;
  box-sizing: border-box;
  gap: 5px;
}

.resultHeader .bunny {
  height: 55px;
  flex-shrink: 0;
}

.resultContainer {
  margin: 0 auto;
  padding: 24px;
  background: white;
  border-radius: 12px;
}

.summarySection {
  margin-bottom: 10px;
}

.recommendSection {
  margin-bottom: 20px;
}

.summaryRow {
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  background-color: var(--input-bg-2);
  border-radius: 10px;
  margin: 12px 0;
}

.summaryLabel {
  font-size: 14px;
  color: var(--text-lightgray);
}

.summaryValue {
  font-size: 14px;
  color: var(--text-login);
}

.policyCard {
  padding: 16px 16px 8px 16px;
  border: 1px solid var(--input-outline);
  border-radius: 8px;
  margin-bottom: 8px;
  background-color: white;
}

.policyCard .tag {
  display: inline-block;
  font-size: 11px;
  background: var(--input-outline);
  padding: 2px 8px;
  border-radius: 6px;
  margin-bottom: 8px;
}

.policyCard .title {
  font-size: 13px;
  margin-bottom: 6px;
}

.policyCard .desc {
  font-size: 12px;
  margin-bottom: 8px;
  color: #555;
}

.policyCard .match {
  font-size: 11px;
  font-weight: bold;
  color: var(--base-blue-dark);
}

.buttonGroup {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
}

.btn-grey,
.btn-blue {
  padding: 12px 0;
  font-size: 15px;
  border-radius: 8px;
  width: 100%;
}

.btn-grey {
  background-color: var(--input-bg-1);
  color: var(--text-login);
  border: none;
}

.btn-blue {
  background-color: var(--base-blue-dark);
  color: white;
  border: none;
}

.prioritySection {
  margin-top: 32px;
  margin-bottom: 32px;
}

.priorityList {
  list-style: none;
  padding: 0;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.priorityItem {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-radius: 10px;
  background-color: var(--input-bg-2);
}

.priorityRank {
  background-color: var(--base-blue-dark);
  color: white;
  font-size: 11px;
  border-radius: 10px;
  padding: 4px 8px;
  margin-right: 12px;
}

.priorityLabel {
  font-size: 13px;
  color: var(--text-login);
}
</style>
