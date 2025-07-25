<template>
  <header class="introHeader">
    <div class="resultHeader">
      <h3>맞춤 정책 분석 완료!</h3>
      <img
        src="@/assets/images/icons/bunny/personality_done_bunny.png"
        alt="토끼"
        class="bunny"
      />
    </div>
  </header>
  <div class="resultContainer" style="font-family: 'NanumSquareNeo'">
    <section class="summarySection">
      <h3 class="font-20 font-bold">당신의 응답 결과</h3>
      <div class="summaryRow" v-for="(value, label) in summary" :key="label">
        <span class="summaryLabel">{{ label }}</span>
        <span class="summaryValue">{{ value }}</span>
      </div>
    </section>

    <section class="recommendSection">
      <h3 class="font-20 font-bold">추천 정책 미리보기</h3>
      <div
        class="policyCard"
        v-for="policy in previewPolicies"
        :key="policy.title"
      >
        <div class="tag">{{ policy.tag }}</div>
        <p class="title font-bold">{{ policy.title }}</p>
        <p class="desc">{{ policy.description }}</p>
        <p class="match">매칭도: {{ policy.match }}</p>
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
import { useRouter } from 'vue-router';

export default {
  name: 'PolicyResultSummary',
  setup() {
    const router = useRouter();

    const summary = {
      '현재 상황': '취업 준비 중',
      '관심 분야': '창업/취업',
      '필요한 지원': '전셋집 보증금 지원',
    };

    const previewPolicies = [
      {
        tag: '주택',
        title: '청년 주택드림 청약통장',
        description: '만 19~34세 청년층을 위한 주택 구입 지원 정책',
        match: '95%',
      },
      {
        tag: '취업',
        title: '청년 내일채움공제',
        description: '중소기업 취업 청년을 위한 장기재직 지원제도',
        match: '88%',
      },
    ];

    const redoQuiz = () => {
      router.push({ name: 'policyQuizStep1' });
    };

    const goToAllPolicies = () => {
      router.push({ name: 'policyMain' });
    };

    return {
      summary,
      previewPolicies,
      redoQuiz,
      goToAllPolicies,
    };
  },
};
</script>

<style scoped>
.introHeader {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.resultHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--base-blue-dark);
  border-radius: 12px;
  padding: 16px 35px;
  color: white;
  max-width: 390px;
  width: 100%;
  box-sizing: border-box;
}

.resultHeader h3 {
  margin: 0;
  flex: 1;
  text-align: center;
}

.resultHeader .bunny {
  height: 60px;
  margin-left: 12px;
  flex-shrink: 0;
}

.resultContainer {
  max-width: 390px;
  margin: 10px auto;
  padding: 24px;
  background: white;
  border-radius: 16px;
}

.summarySection,
.recommendSection {
  max-width: 393px;
}

.summarySection {
  margin-bottom: 32px;
}

.recommendSection {
  margin-top: 32px; /* 위쪽 간격 */
  margin-bottom: 32px; /* 아래쪽 간격 (선택) */
}

.summaryRow {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: var(--input-bg-2);
  border-radius: 10px;
  margin: 12px 0;
}

.summaryLabel {
  color: var(--text-lightgray);
}

.summaryValue {
  color: var(--text-login);
}

.policyCard {
  padding: 16px;
  border: 1px solid var(--input-outline);
  border-radius: 12px;
  margin-bottom: 16px;
  background-color: white;
}

.policyCard .tag {
  display: inline-block;
  font-size: 12px;
  background: var(--input-outline);
  padding: 2px 8px;
  border-radius: 6px;
  margin-bottom: 8px;
}

.policyCard .title {
  font-size: 16px;
  margin-bottom: 6px;
}

.policyCard .desc {
  font-size: 14px;
  margin-bottom: 8px;
  color: #555;
}

.policyCard .match {
  font-size: 13px;
  font-weight: bold;
  color: var(--base-blue-dark);
}

.buttonGroup {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 32px;
}

.btn-grey,
.btn-blue {
  padding: 12px 0;
  font-size: 16px;
  font-weight: bold;
  border-radius: 10px;
  width: 100%;
}

.btn-grey {
  background-color: var(--input-disabled-1);
  color: var(--text-login);
  border: none;
}

.btn-blue {
  background-color: var(--base-blue-dark);
  color: white;
  border: none;
}
</style>
