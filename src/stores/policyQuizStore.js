// src/stores/policyQuizStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { regionCodeMap } from '@/assets/utils/regionCodeMap';
import { educationLevelCodeMap } from '@/assets/utils/educationLevelCodeMap';
import { majorCodeMap } from '@/assets/utils/majorCodeMap';
import { employmentStatusCodeMap } from '@/assets/utils/employmentStatusCodeMap';
import { specialConditionCodeMap } from '@/assets/utils/specialConditionCodeMap';

export const usePolicyQuizStore = defineStore('policyQuiz', () => {
  const age = ref(0);
  const educationLevels = ref(''); // 단일 선택이므로 문자열로 변경
  const educationLevelCode = ref(''); // 코드값 추가
  const employmentStatuses = ref(''); // 단일 선택이므로 문자열로 변경
  const employmentStatusCode = ref(''); // 코드값 추가
  const income = ref(0);
  const keywords = ref([]);
  const majors = ref(''); // 단일 선택이므로 문자열로 변경
  const majorCode = ref(''); // 코드값 추가
  const marriage = ref('');
  const moneyRank = ref(0);
  const periodRank = ref(0);
  const popularityRank = ref(0);
  const regions = ref('');
  const regionName = ref(''); // 지역명 저장
  const specialConditions = ref([]);
  const specialConditionCodes = ref([]); // 코드값 추가

  // birthYear, birthMonth, birthDay는 age 계산에만 사용하고 스토어에 직접 저장하지 않음
  // 필요하다면 별도의 state로 추가 가능
  const birthYear = ref('');
  const birthMonth = ref('');
  const birthDay = ref('');

  function setBasicInfo({ year, month, day, region }) {
    birthYear.value = year;
    birthMonth.value = month;
    birthDay.value = day;

    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    age.value = calculatedAge;

    // 지역명 저장
    regionName.value = region;

    // region: "시/도 구/군" 또는 "시/도 전체" 형태로 들어온다고 가정
    let regionCode = '';
    if (region) {
      const [sido, sigungu] = region.split(' ');
      if (regionCodeMap[sido]) {
        if (sigungu && regionCodeMap[sido][sigungu]) {
          regionCode = regionCodeMap[sido][sigungu];
        } else if (regionCodeMap[sido]['전체']) {
          regionCode = regionCodeMap[sido]['전체'];
        }
      }
    }
    regions.value = regionCode; // 단일 문자열로 저장
  }

  function setEducationLevels(levels) {
    educationLevels.value = levels;
    educationLevelCode.value = educationLevelCodeMap[levels] || '';
  }

  function setEmploymentStatuses(statuses) {
    employmentStatuses.value = statuses;
    employmentStatusCode.value = employmentStatusCodeMap[statuses] || '';
  }

  function setIncome(val) {
    // 숫자면 그대로 저장, 문자열이면 숫자만 추출해서 저장
    if (typeof val === 'number') {
      income.value = val;
    } else if (typeof val === 'string') {
      const num = parseInt(val.replace(/[^0-9]/g, ''), 10);
      income.value = isNaN(num) ? 0 : num;
    } else {
      income.value = 0;
    }
  }

  function setKeywords(words) {
    keywords.value = words;
  }

  function setMajors(list) {
    majors.value = list;
    majorCode.value = majorCodeMap[list] || '';
  }

  function setMarriage(status) {
    marriage.value = status;
  }

  function setMoneyRank(rank) {
    moneyRank.value = rank;
  }

  function setPeriodRank(rank) {
    periodRank.value = rank;
  }

  function setPopularityRank(rank) {
    popularityRank.value = rank;
  }

  function setSpecialConditions(list) {
    specialConditions.value = list;
    specialConditionCodes.value = Array.isArray(list)
      ? list.map((item) => specialConditionCodeMap[item] || '').filter(Boolean)
      : [];
  }

  function getRequestPayload() {
    // 성별 코드 자동 추가
    let specialCodes = [...specialConditionCodes.value];
    // regionName에 '남성' 또는 '여성'이 포함되어 있으면 해당 코드 추가
    if (regionName.value) {
      if (
        regionName.value.includes('남성') &&
        !specialCodes.includes('0014007')
      ) {
        specialCodes.push('0014007');
      }
      if (
        regionName.value.includes('여성') &&
        !specialCodes.includes('0014002')
      ) {
        specialCodes.push('0014002');
      }
    }
    return {
      age: age.value,
      educationLevels: educationLevelCode.value
        ? [educationLevelCode.value]
        : [],
      employmentStatuses: employmentStatusCode.value
        ? [employmentStatusCode.value]
        : [],
      income: income.value,
      keywords: keywords.value,
      majors: majorCode.value ? [majorCode.value] : [],
      marriage: marriage.value,
      moneyRank: moneyRank.value,
      periodRank: periodRank.value,
      popularityRank: popularityRank.value,
      regions: [regions.value],
      specialConditions: specialCodes,
    };
  }

  function resetQuiz() {
    educationLevels.value = '';
    majors.value = '';
    employmentStatuses.value = '';
    income.value = '';
    moneyRank.value = 0;
    popularityRank.value = 0;
    periodRank.value = 0;
    birthYear.value = '';
    birthMonth.value = '';
    birthDay.value = '';
    regionName.value = '';
    regions.value = '';
    // ...필요시 추가 필드...
  }

  return {
    // state
    age,
    educationLevels,
    educationLevelCode,
    employmentStatuses,
    employmentStatusCode,
    income,
    keywords,
    majors,
    majorCode,
    marriage,
    moneyRank,
    periodRank,
    popularityRank,
    regions,
    regionName,
    specialConditions,
    specialConditionCodes,
    birthYear,
    birthMonth,
    birthDay,

    // actions
    setBasicInfo,
    setEducationLevels,
    setEmploymentStatuses,
    setIncome,
    setKeywords,
    setMajors,
    setMarriage,
    setMoneyRank,
    setPeriodRank,
    setPopularityRank,
    setSpecialConditions,
    getRequestPayload,
    resetQuiz,
  };
});
