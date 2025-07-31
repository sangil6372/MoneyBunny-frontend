<script setup>
const eligibility = [
  { title: '연령 조건', desc: '만 15세 이상 34세 이하 청년' },
  {
    title: '고용 조건',
    desc: '정규직 신규 채용 또는 6개월 이내 정규직 전환 예정자',
  },
  { title: '기업 조건', desc: '우선지원대상기업 또는 중견기업' },
];

const excludedTargets = [
  '동일 사업장 재입사자',
  '타 취업지원 프로그램 참여자',
  '공무원, 교원 등 공공부문 종사자',
  '일용직, 단시간 근로자',
];
</script>

<template>
  <div class="conditionTab">
    <div class="font-20 font-bold mb-4">신청 자격</div>

    <div v-for="(item, index) in eligibility" :key="index" class="label mb-4">
      <div class="font-17 font-bold mb-2">
        {{ item.title }}
      </div>
      <p class="font-14 text-bluegray">{{ item.desc }}</p>
    </div>

    <div class="font-20 font-bold mt-6 mb-3">제외 대상</div>
    <ul class="excludeList font-15">
      <li v-for="(item, index) in excludedTargets" :key="index">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.conditionTab {
  background-color: white;
  border-radius: 16px;
  padding: 20px;
}

.label {
  border-left: 3.5px solid var(--base-blue-dark);
  padding-left: 10px;
}

.excludeList {
  background-color: var(--alert-light-3);
  border-radius: 8px;
  padding: 16px 32px;
  color: var(--alert-red);
  list-style-type: disc;
  width: 370px;
}
.excludeList li {
  margin-bottom: 6px;
}

.mb-1 {
  margin-bottom: 4px;
}
.mb-2 {
  margin-bottom: 8px;
}
.mb-3 {
  margin-bottom: 12px;
}
.mb-4 {
  margin-bottom: 16px;
}

.mt-6 {
  margin-top: 30px;
}

.text-bluegray {
  color: var(--text-bluegray);
}
</style>
