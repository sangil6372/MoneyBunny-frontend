<script setup>
// const props = defineProps({ policy: Object });
import siteIcon from '@/assets/images/icons/policy/worknet.png';
// 더미 데이터 (화면 테스트용)
const policy = {
  application_method: [
    '온라인 신청: 워크넷 또는 고용24 홈페이지에서 신청서 작성',
    '서류 제출: 필요 서류를 온라인 또는 방문 제출',
    '심사 및 승인: 고용센터에서 자격 요건 심사 후 승인 여부 결정',
    '계좌 개설: 지정 금융기관에서 내일채움공제 전용 계좌 개설',
  ].join('\n'), // 여러 줄로
  screening_method: [
    '1차 서류 심사: 제출된 서류를 바탕으로 기본 자격 요건 확인',
    '2차 현장 확인: 필요시 사업장 방문을 통한 근무 실태 확인',
    '최종 승인: 심사 완료 후 승인 여부 통보 (신청일로부터 7~14일 소요)',
  ].join('\n'),
  apply_url: 'https://www.work.go.kr',
  submit_documents: [
    '신분증 사본',
    '재직증명서',
    '통장 사본',
    '근로계약서 사본',
    '기타 자격 증빙서류',
    '졸업증명서 또는 재학증명서',
    '건강보험자격득실확인서',
  ].join('\n'),
  etcNotes: '※ 모든 서류는 최근 3개월 이내 발급분만 인정됩니다.',
  refUrl1: 'https://www.work.go.kr',
  refUrl2: 'https://www.gov.kr/portal/service/serviceInfo/PTR000050681',
};

// 화면 출력용 파싱 함수 (줄바꿈 기준 분리)
const splitLines = (str) =>
  str ? str.split('\n').filter((s) => s.trim() !== '') : [];

const getSiteIcon = (url) => {
  return siteIcon;
};
</script>

<template>
  <div class="applyTab">
    <!-- 신청 절차 -->
    <div class="font-18 font-bold mb-3">신청 절차</div>
    <ul class="stepsBox">
      <li
        v-for="(step, idx) in splitLines(policy.application_method)"
        :key="idx"
        class="stepsItem"
      >
        {{ step }}
      </li>
    </ul>

    <!-- 제출 서류 -->
    <div class="font-18 font-bold mb-2 mt-4">제출 서류</div>
    <ul class="docsBox font-12">
      <li v-for="(doc, idx) in splitLines(policy.submit_documents)" :key="idx">
        {{ doc }}
      </li>
    </ul>

    <!-- 심사 및 발표 -->
    <div class="font-18 font-bold mt-4 mb-2">심사 및 발표</div>
    <ul class="reviewBox">
      <li
        v-for="(review, idx) in splitLines(policy.screening_method)"
        :key="idx"
      >
        {{ review }}
      </li>
    </ul>

    <div class="font-18 font-bold mt-4 mb-2">참고 사이트</div>
    <div class="siteBadgeColumn">
      <a
        v-if="policy.refUrl1"
        class="siteBadge"
        :href="policy.refUrl1"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          :src="getSiteIcon(policy.refUrl1)"
          alt="siteIcon"
          class="badgeImage"
        />
        {{ policy.refUrl1.replace(/^https?:\/\//, '').replace(/\/.*/, '') }}
      </a>
      <a
        v-if="policy.refUrl2"
        class="siteBadge"
        :href="policy.refUrl2"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          :src="getSiteIcon(policy.refUrl2)"
          alt="siteIcon"
          class="badgeImage"
        />
        {{ policy.refUrl2.replace(/^https?:\/\//, '').replace(/\/.*/, '') }}
      </a>
    </div>

    <!-- 기타 정보 -->
    <div class="font-18 font-bold mt-4 mb-2">기타 정보</div>
    <div class="etcBox font-12">
      {{ policy.etcNotes || '해당사항 없음' }}
    </div>
  </div>
</template>

<style scoped>
.applyTab {
  background-color: white;
  border-radius: 16px;
  padding: 20px;
}
.stepsBox,
.reviewBox {
  background-color: var(--input-bg-2);
  border-radius: 8px;
  padding: 16px 20px;
  list-style-type: disc;
}
.stepsBox li,
.reviewBox li {
  color: var(--text-bluegray);
  font-size: 13px;
  margin-bottom: 7px;
}
.stepsBox li:last-child,
.reviewBox li:last-child {
  margin-bottom: 0;
}
.docsBox {
  background-color: var(--input-bg-2);
  border-radius: 8px;
  padding: 16px 24px;
  list-style-type: disc;
}
.docsBox li {
  color: var(--text-bluegray);
  font-size: 12px;
  margin-bottom: 6px;
}
.docsBox li:last-child {
  margin-bottom: 0;
}
.siteBadgeColumn {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 6px;
}

.siteBadge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: 8px;
  color: var(--base-blue-dark);
  font-size: 13px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  background-color: var(--input-bg-2);
  justify-content: left;
}
.badgeImage {
  width: 18px;
  height: 18px;
  object-fit: contain;
  margin-right: 2px;
  flex-shrink: 0;
  vertical-align: middle;
}

.etcBox {
  background-color: var(--input-bg-2);
  border-radius: 8px;
  padding: 16px 18px;
  color: var(--text-bluegray);
  min-height: 36px;
  margin-bottom: 6px;
}
.mb-2 {
  margin-bottom: 8px;
}
.mb-3 {
  margin-bottom: 12px;
}
.mt-4 {
  margin-top: 18px;
}
</style>
