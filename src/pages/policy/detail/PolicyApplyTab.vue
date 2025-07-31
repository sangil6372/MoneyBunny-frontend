<script setup>
import phoneIcon from '@/assets/images/icons/policy/phone.png';
import onlineIcon from '@/assets/images/icons/policy/online.png';
import locationIcon from '@/assets/images/icons/policy/location_mark.png';

const steps = [
  {
    title: '온라인 신청',
    desc: '워크넷 또는 고용24 홈페이지에서 신청서 작성',
  },
  {
    title: '서류 제출',
    desc: '신분증, 재직증명서, 통장사본 등 필요서류 제출',
  },
  {
    title: '심사 및 승인',
    desc: '고용센터에서 자격 요건 심사 후 승인 여부 결정',
  },
  {
    title: '계좌 개설',
    desc: '지정 금융기관에서 내일채움공제 전용 계좌 개설',
  },
];

const submitDocuments = [
  '신분증 사본',
  '재직증명서',
  '통장 사본',
  '근로계약서 사본',
  '기타 자격 증빙서류',
];

const bizStartDate = [2024, 1, 1];
const bizEndDate = [2024, 12, 31];

const contactList = [
  {
    icon: phoneIcon,
    alt: '전화 문의',
    title: '전화 문의',
    desc: [
      '고용노동부 고객상담센터 : 1350',
      '평일 09:00 ~ 18:00 (점심시간 12:00 ~ 13:00 제외)',
    ],
  },
  {
    icon: onlineIcon,
    alt: '온라인 문의',
    title: '온라인 문의',
    desc: ['워크넷 고객센터 또는 고용24 문의게시판'],
  },
  {
    icon: locationIcon,
    alt: '방문 문의',
    title: '방문 문의',
    desc: ['전국 고용센터 (평일 09:00 ~ 18:00)'],
  },
];
</script>

<template>
  <div class="applyTab">
    <div class="font-20 font-bold mb-3">신청 절차</div>

    <div v-for="(step, idx) in steps" :key="idx" class="step">
      <div class="stepNum">{{ idx + 1 }}</div>
      <div class="stepContent">
        <div class="font-15 font-bold">{{ step.title }}</div>
        <div class="font-13 text-bluegray">{{ step.desc }}</div>
      </div>
    </div>

    <div class="font-20 font-bold mb-3 mt-4">필요 서류</div>
    <ul class="docsBox font-14">
      <li v-for="(doc, idx) in submitDocuments" :key="idx">{{ doc }}</li>
    </ul>

    <div class="font-20 font-bold mb-3 mt-4">신청 기간</div>
    <div class="periodBox">
      <img
        src="@/assets/images/icons/policy/calendar.png"
        alt="달력"
        class="calendarIcon"
      />
      <div class="periodContent">
        <div class="periodText font-16 font-bold">
          {{ bizStartDate[0] }}년 {{ bizStartDate[1] }}월
          {{ bizStartDate[2] }}일 ~ {{ bizEndDate[0] }}년 {{ bizEndDate[1] }}월
          {{ bizEndDate[2] }}일
        </div>
        <span class="periodSub font-14">
          연중 상시 접수 (예산 소진 시 조기 마감)
        </span>
      </div>
    </div>

    <div class="font-20 font-bold mt-3 mb-3">문의처</div>
    <div class="contactBox">
      <div v-for="(item, idx) in contactList" :key="idx" class="contactItem">
        <img :src="item.icon" :alt="item.alt" />
        <div class="contactContent">
          <div class="contactTitle font-bold">{{ item.title }}</div>
          <div class="contactDesc">
            <div v-for="(line, i) in item.desc" :key="i">{{ line }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.applyTab {
  background-color: white;
  border-radius: 16px;
  padding: 20px;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.stepNum {
  min-width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: var(--base-blue-dark);
  color: white;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.stepContent {
  flex: 1;
}

.docsBox {
  background-color: var(--input-bg-2);
  border-radius: 8px;
  padding: 16px 32px;
  list-style-type: disc;
}
.docsBox li {
  margin-bottom: 7px;
  color: var(--text-bluegray);
}

.periodBox {
  display: flex;
  align-items: flex-start;
  background-color: var(--input-bg-2);
  border-radius: 8px;
  padding: 16px;
  gap: 12px;
}

.calendarIcon {
  width: 24px;
  height: 24px;
  margin-top: 3px;
  flex-shrink: 0;
}

.periodContent {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0px;
}

.periodText {
  line-height: 2;
  color: var(--text-default);
  margin-bottom: 4px;
}

.periodSub {
  display: block;
  color: var(--text-bluegray);
  line-height: 1.6;
  margin-left: 0;
}

.text-bluegray {
  color: var(--text-bluegray);
}
.contactContent {
  padding: 0 3px;
}
.contactItem {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 20px;
}

.contactItem img {
  width: 24px;
  height: 24px;
  margin-top: 12px;
  flex-shrink: 0;
}

.contactContent {
  flex: 1;
}

.contactTitle {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 2px;
}

.contactDesc {
  font-size: 14px;
  color: var(--text-bluegray);
  line-height: 1.6;
}

.mb-2 {
  margin-bottom: 8px;
}
.mb-3 {
  margin-bottom: 12px;
}

.mt-4 {
  margin-top: 16px;
}

.mt-5 {
  margin-top: 20px;
}
</style>
