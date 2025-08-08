import { defineStore } from 'pinia';
import { ref } from 'vue';
import { regionCodeMap } from '@/assets/utils/regionCodeMap';
import { educationLevelCodeMap } from '@/assets/utils/educationLevelCodeMap';
import { majorCodeMap } from '@/assets/utils/majorCodeMap';
import { employmentStatusCodeMap } from '@/assets/utils/employmentStatusCodeMap';
import { specialConditionCodeMap } from '@/assets/utils/specialConditionCodeMap';

export const usePolicyFilterStore = defineStore('policyFilter', () => {
  // 필터링 값들
  const marital = ref([]); // 혼인여부(라벨 배열)
  const region = ref([]); // 지역명 배열
  const age = ref(''); // 문자열 또는 숫자
  const income = ref(''); // 문자열 또는 숫자
  const education = ref([]); // 학력(라벨 배열)
  const major = ref([]); // 전공(라벨 배열)
  const jobStatus = ref([]); // 취업상태(라벨 배열)
  const specialty = ref([]); // 특화분야(라벨 배열)

  // actions
  function setFilter({
    marital: m,
    region: r,
    age: a,
    income: i,
    education: e,
    major: mj,
    jobStatus: js,
    specialty: sp,
  }) {
    marital.value = Array.isArray(m) ? [...m] : [];
    region.value = Array.isArray(r) ? [...r] : [];
    age.value = a ?? '';
    income.value = i ?? '';
    education.value = Array.isArray(e) ? [...e] : [];
    major.value = Array.isArray(mj) ? [...mj] : [];
    jobStatus.value = Array.isArray(js) ? [...js] : [];
    specialty.value = Array.isArray(sp) ? [...sp] : [];
  }

  function resetFilter() {
    marital.value = [];
    region.value = [];
    age.value = '';
    income.value = '';
    education.value = [];
    major.value = [];
    jobStatus.value = [];
    specialty.value = [];
  }

  // 코드 변환 유틸 (필요시 사용)
  function getFilterPayload() {
    return {
      marital: marital.value,
      region: region.value,
      age: age.value,
      income: income.value,
      education: education.value,
      major: major.value,
      jobStatus: jobStatus.value,
      specialty: specialty.value,
    };
  }

  return {
    // state
    marital,
    region,
    age,
    income,
    education,
    major,
    jobStatus,
    specialty,

    // actions
    setFilter,
    resetFilter,
    getFilterPayload,
  };
});
