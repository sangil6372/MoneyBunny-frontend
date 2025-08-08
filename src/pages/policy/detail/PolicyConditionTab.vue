<script setup>
import { regionCodeMap } from '@/assets/utils/regionCodeMap';
import { educationLevelCodeMap } from '@/assets/utils/educationLevelCodeMap';
import { majorCodeMap } from '@/assets/utils/majorCodeMap';
import { employmentStatusCodeMap } from '@/assets/utils/employmentStatusCodeMap';
import { specialConditionCodeMap } from '@/assets/utils/specialConditionCodeMap';

const props = defineProps({
  policy: Object,
});

// 지역코드 → 지역명 변환 함수
function getRegionNameByCode(code) {
  for (const [sido, guguns] of Object.entries(regionCodeMap)) {
    for (const [gugun, gugunCode] of Object.entries(guguns)) {
      // gugunCode가 배열인 경우(중복 코드), 배열 내에 code가 포함되어 있으면 반환
      if (Array.isArray(gugunCode) && gugunCode.includes(code)) {
        return gugun === '전체' ? sido : `${sido} ${gugun}`;
      }
      // 기존 단일 코드 처리
      if (gugunCode === code) {
        return gugun === '전체' ? sido : `${sido} ${gugun}`;
      }
    }
  }
  return code;
}

// 매핑 함수
function getLabelByCode(code, map) {
  if (!code) return null;
  for (const [label, v] of Object.entries(map)) {
    if (v === code) return label;
  }
  return code;
}
function getLabelsByCodes(codes, map) {
  if (!Array.isArray(codes) || codes.length === 0) return [];
  return codes.map((code) => getLabelByCode(code, map)).filter(Boolean);
}

// 연령
let ageText = '제한 없음';
if (props.policy && props.policy.ageLimitYn === false) {
  const minAge = props.policy.minAge;
  const maxAge = props.policy.maxAge;
  if (minAge && maxAge) {
    ageText = `만 ${minAge}세 이상 ${maxAge}세 이하`;
  } else if (minAge) {
    ageText = `만 ${minAge}세 이상`;
  } else if (maxAge) {
    ageText = `만 ${maxAge}세 이하`;
  }
}

// 거주지역
let regionText = '전국 (지역 제한 없음)';
const regions =
  (props.policy && (props.policy.regions || props.policy.regionList)) || [];
if (Array.isArray(regions) && regions.length > 0) {
  if (regions.length >= 250) {
    regionText = '전국 (지역 제한 없음)';
  } else {
    const regionNames = regions
      .map((r) => getRegionNameByCode(r.regionCode || r))
      .filter(Boolean);
    regionText = regionNames.length > 0 ? regionNames.join(', ') : regionText;
  }
}

// 소득조건
let incomeText = '';
const code = props.policy && props.policy.incomeConditionCode;
if (code === '0043002') {
  const min = props.policy.incomeMin;
  const max = props.policy.incomeMax;
  if (min && max) {
    incomeText = `월소득 ${min} ~ ${max}만원`;
  } else if (min) {
    incomeText = `월소득 ${min}만원 이상`;
  } else if (max) {
    incomeText = `월소득 ${max}만원 이하`;
  }
} else if (code === '0043001') {
  incomeText = '제한 없음';
} else if (code === '0043003') {
  incomeText = props.policy.incomeEtc || '';
}

// 학력 (educationLevels 배열의 각 객체에서 educationLevel 값만 추출)
let educationLabels = [];
if (
  props.policy.educationLevels &&
  Array.isArray(props.policy.educationLevels) &&
  props.policy.educationLevels.length > 0
) {
  const codes = props.policy.educationLevels
    .map((e) => e.educationLevel)
    .filter(Boolean);
  educationLabels = getLabelsByCodes(codes, educationLevelCodeMap);
}
const educationText =
  educationLabels.length > 0 ? educationLabels.join(', ') : '제한 없음';

// 전공 (majors 배열의 각 객체에서 major 값만 추출)
let majorLabels = [];
if (
  props.policy.majors &&
  Array.isArray(props.policy.majors) &&
  props.policy.majors.length > 0
) {
  const codes = props.policy.majors.map((m) => m.major).filter(Boolean);
  majorLabels = getLabelsByCodes(codes, majorCodeMap);
}
const majorText = majorLabels.length > 0 ? majorLabels.join(', ') : '제한 없음';

// 취업상태 (employmentStatuses 배열의 각 객체에서 employmentStatus 값만 추출)
let employmentLabels = [];
if (
  props.policy.employmentStatuses &&
  Array.isArray(props.policy.employmentStatuses) &&
  props.policy.employmentStatuses.length > 0
) {
  const codes = props.policy.employmentStatuses
    .map((e) => e.employmentStatus)
    .filter(Boolean);
  employmentLabels = getLabelsByCodes(codes, employmentStatusCodeMap);
}
const employmentText =
  employmentLabels.length > 0 ? employmentLabels.join(', ') : '제한 없음';

// 특화분야 (specialConditions 배열의 각 객체에서 specialCondition 값만 추출)
let specialLabels = [];
if (
  props.policy.specialConditions &&
  Array.isArray(props.policy.specialConditions) &&
  props.policy.specialConditions.length > 0
) {
  const codes = props.policy.specialConditions
    .map((s) => s.specialCondition)
    .filter(Boolean);
  specialLabels = getLabelsByCodes(codes, specialConditionCodeMap);
}
const specialText =
  specialLabels.length > 0 ? specialLabels.join(', ') : '제한 없음';

// undefined/null/빈 desc 모두 필터링
const eligibility = [
  { title: '연령', desc: ageText },
  { title: '거주지역', desc: regionText },
  { title: '소득조건', desc: incomeText },
  { title: '학력', desc: educationText },
  { title: '전공', desc: majorText },
  { title: '취업상태', desc: employmentText },
  { title: '특화분야', desc: specialText },
].filter((item) => item && item.desc);
</script>

<template>
  <div class="conditionTab">
    <div class="font-16 font-bold mb-4">신청 자격</div>
    <div v-for="(item, index) in eligibility" :key="index" class="label mb-4">
      <div class="font-14 font-bold mb-2">
        {{ item.title }}
      </div>
      <p class="font-13 text-bluegray">{{ item.desc }}</p>
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
