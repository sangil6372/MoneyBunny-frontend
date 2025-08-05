<script setup>
const policy = {
  minAge: 19,
  maxAge: 34,
  regionList: [],
  incomeConditionCode: '',
  incomeEtc: '소득 수준 제한 없음',
  educationLevels: [],
  majorList: [],
  employmentStatuses: [],
  specialConditions: [],
};

const minAge = policy.minAge;
const maxAge = policy.maxAge;
const ageText = minAge && maxAge ? `만 ${minAge}세 이상 ${maxAge}세 이하` : '';

const region = policy.regionList || policy.regions || [];
const regionText =
  region.length > 0 ? '해당 지역 거주자' : '전국 (지역 제한 없음)';

const income =
  policy.incomeConditionCode ||
  policy.incomeMin ||
  policy.incomeMax ||
  policy.incomeEtc ||
  '';
const incomeText = income ? income : '';

const edu =
  (policy.educationLevelList && policy.educationLevelList.length > 0) ||
  (policy.educationLevels && policy.educationLevels.length > 0)
    ? '일부 학력 제한 있음'
    : '학력 제한 없음';
const major =
  (policy.majorList && policy.majorList.length > 0) ||
  (policy.majors && policy.majors.length > 0)
    ? '일부 전공 제한 있음'
    : '전공 제한 없음';
const eduMajorText =
  edu === '학력 제한 없음' && major === '전공 제한 없음'
    ? '제한 없음'
    : `${edu}, ${major}`;

const job =
  (policy.employmentStatusList && policy.employmentStatusList.length > 0) ||
  (policy.employmentStatuses && policy.employmentStatuses.length > 0)
    ? '특정 취업 상태 필요'
    : '제한 없음';
const special =
  (policy.specialConditionList && policy.specialConditionList.length > 0) ||
  (policy.specialConditions && policy.specialConditions.length > 0)
    ? '특정 조건 필요'
    : '제한 없음';

// undefined/null/빈 desc 모두 필터링
const eligibility = [
  { title: '연령', desc: ageText },
  { title: '거주지역', desc: regionText },
  { title: '소득조건', desc: incomeText },
  { title: '학력/전공', desc: eduMajorText },
  { title: '취업상태', desc: job },
  { title: '특화분야', desc: special },
].filter((item) => item && item.desc);
</script>

<template>
  <div class="conditionTab">
    <div class="font-18 font-bold mb-4">신청 자격</div>
    <div v-for="(item, index) in eligibility" :key="index" class="label mb-4">
      <div class="font-15 font-bold mb-2">
        {{ item.title }}
      </div>
      <p class="font-14 text-bluegray">{{ item.desc }}</p>
    </div>
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
