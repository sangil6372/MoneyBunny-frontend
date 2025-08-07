<script setup>
import { ref, computed, onMounted } from 'vue';
import AreaSelectModal from './AreaSelectModal.vue';
import {
  maritalCodeToLabel,
  maritalLabelToCode,
} from '@/assets/utils/maritalMap';
import { educationLevelCodeMap } from '@/assets/utils/educationLevelCodeMap.js';
import { majorCodeMap } from '@/assets/utils/majorCodeMap.js';
import { employmentStatusCodeMap } from '@/assets/utils/employmentStatusCodeMap.js';
import { specialConditionCodeMap } from '@/assets/utils/specialConditionCodeMap.js';
import { regionCodeMap } from '@/assets/utils/regionCodeMap.js';

// 코드→라벨 역매핑 생성
const educationLevelLabelMap = Object.fromEntries(
  Object.entries(educationLevelCodeMap).map(([k, v]) => [v, k])
);
const majorLabelMap = Object.fromEntries(
  Object.entries(majorCodeMap).map(([k, v]) => [v, k])
);
const employmentStatusLabelMap = Object.fromEntries(
  Object.entries(employmentStatusCodeMap).map(([k, v]) => [v, k])
);
const specialConditionLabelMap = Object.fromEntries(
  Object.entries(specialConditionCodeMap).map(([k, v]) => [v, k])
);

const props = defineProps({
  initialMarital: { type: Array, default: () => [] },
  initialRegion: { type: Array, default: () => [] },
  initialAge: { type: [String, Number], default: '' },
  initialIncome: { type: [String, Number], default: '' },
  initialEducation: { type: Array, default: () => [] },
  initialMajor: { type: Array, default: () => [] },
  initialJobStatus: { type: Array, default: () => [] },
  initialSpecialty: { type: Array, default: () => [] },
});

const page = ref('main');
const maritalOptions = ['기혼', '미혼', '제한없음'];
const selectedMarital = ref([]);
const selectedRegion = ref([]);
const showRegionModal = ref(false);
const age = ref('');
const income = ref('');

const needsSi = [
  '서울',
  '부산',
  '대구',
  '인천',
  '광주',
  '대전',
  '울산',
  '세종',
];
const formatFull = (item) => {
  const [sido, gugun] = item.split(' ');
  const s = needsSi.includes(sido) ? `${sido}시` : sido;
  return gugun ? `${s} ${gugun}` : s;
};

const MAX_DISPLAY = 3;

const displayRegionText = computed(() => {
  const items = selectedRegion.value.map(formatFull);
  if (items.length <= MAX_DISPLAY) {
    return items.join(', ');
  }
  return (
    items.slice(0, MAX_DISPLAY).join(', ') +
    ` 외 ${items.length - MAX_DISPLAY}곳`
  );
});

const displayEducationText = computed(() => {
  const items = selectedEducation.value;
  if (items.length <= MAX_DISPLAY) return items.join(', ');
  return (
    items.slice(0, MAX_DISPLAY).join(', ') +
    ` 외 ${items.length - MAX_DISPLAY}개`
  );
});
const displayMajorText = computed(() => {
  const items = selectedMajor.value;
  if (items.length <= MAX_DISPLAY) return items.join(', ');
  return (
    items.slice(0, MAX_DISPLAY).join(', ') +
    ` 외 ${items.length - MAX_DISPLAY}개`
  );
});
const displayJobStatusText = computed(() => {
  const items = selectedJobStatus.value;
  if (items.length <= MAX_DISPLAY) return items.join(', ');
  return (
    items.slice(0, MAX_DISPLAY).join(', ') +
    ` 외 ${items.length - MAX_DISPLAY}개`
  );
});
const displaySpecialtyText = computed(() => {
  const items = selectedSpecialty.value;
  if (items.length <= MAX_DISPLAY) return items.join(', ');
  return (
    items.slice(0, MAX_DISPLAY).join(', ') +
    ` 외 ${items.length - MAX_DISPLAY}개`
  );
});
const educationOptions = [
  '제한없음',
  '고졸 미만',
  '고교 재학',
  '고졸 예정',
  '고교 졸업',
  '대학 재학',
  '대졸 예정',
  '대학 졸업',
  '석·박사',
  '기타',
];
const selectedEducation = ref([]);

const majorOptions = [
  '제한없음',
  '인문계열',
  '사회계열',
  '상경계열',
  '이학계열',
  '공학계열',
  '예체능계열',
  '농산업계열',
  '기타',
];
const selectedMajor = ref([]);

const jobStatusOptions = [
  '제한없음',
  '재직자',
  '자영업자',
  '미취업자',
  '프리랜서',
  '일용근로자',
  '(예비)창업자',
  '단기근로자',
  '영농종사자',
  '기타',
];
const selectedJobStatus = ref([]);

const specialtyOptions = [
  '제한없음',
  '중소기업',
  '여성',
  '기초생활수급자',
  '한부모가정',
  '장애인',
  '농업인',
  '군인',
  '지역인재',
  '기타',
];
const selectedSpecialty = ref([]);

const isAgeFocus = ref(false);
const isIncomeFocus = ref(false);

const reset = () => {
  selectedRegion.value = '';
  selectedMarital.value = [];
  age.value = '';
  income.value = '';
  selectedEducation.value = [];
  selectedMajor.value = [];
  selectedJobStatus.value = [];
  selectedSpecialty.value = [];
};
const emit = defineEmits(['close', 'confirm', 'reset']);
const confirm = () => {
  emit('confirm', {
    region:
      selectedRegion.value && selectedRegion.value.length > 0
        ? selectedRegion.value.map(regionNameToCode)
        : [],
    marital:
      selectedMarital.value && selectedMarital.value.length > 0
        ? selectedMarital.value.map((label) => maritalLabelToCode[label])
        : [],
    age: age.value || '',
    income: income.value || '',
    education:
      selectedEducation.value && selectedEducation.value.length > 0
        ? selectedEducation.value.map(
            (label) => educationLevelCodeMap[label] || label
          )
        : [],
    major:
      selectedMajor.value && selectedMajor.value.length > 0
        ? selectedMajor.value.map((label) => majorCodeMap[label] || label)
        : [],
    jobStatus:
      selectedJobStatus.value && selectedJobStatus.value.length > 0
        ? selectedJobStatus.value.map(
            (label) => employmentStatusCodeMap[label] || label
          )
        : [],
    specialty:
      selectedSpecialty.value && selectedSpecialty.value.length > 0
        ? selectedSpecialty.value.map(
            (label) => specialConditionCodeMap[label] || label
          )
        : [],
  });
};
const close = () => emit('close');
const handleRegionSelected = (value) => {
  selectedRegion.value = value;
  showRegionModal.value = false;
};
// 개별 지역 제거
const removeRegionTag = (idx) => {
  selectedRegion.value.splice(idx, 1);
};
function getSelectedList(page) {
  if (page === 'education') return selectedEducation;
  if (page === 'major') return selectedMajor;
  if (page === 'jobStatus') return selectedJobStatus;
  return selectedSpecialty;
}
function toggleMarital(option) {
  if (option === '제한없음') {
    selectedMarital.value = ['제한없음'];
  } else {
    if (selectedMarital.value.includes(option)) {
      selectedMarital.value = selectedMarital.value.filter(
        (item) => item !== option
      );
    } else {
      selectedMarital.value = selectedMarital.value.filter(
        (item) => item !== '제한없음'
      );
      selectedMarital.value.push(option);
    }
  }
}

// ✔️ 복수선택 + '제한없음' 단일 선택
function toggleMulti(listRef, option) {
  if (option === '제한없음') listRef.value = ['제한없음'];
  else {
    if (listRef.value.includes(option)) {
      listRef.value = listRef.value.filter((item) => item !== option);
    } else {
      listRef.value = listRef.value.filter((item) => item !== '제한없음');
      listRef.value.push(option);
    }
  }
}

// 코드 → 지역명 변환 함수 (배열 코드도 지원)
function codeToRegionName(code) {
  for (const [sido, guguns] of Object.entries(regionCodeMap)) {
    for (const [gugun, gugunCode] of Object.entries(guguns)) {
      if (Array.isArray(gugunCode) && gugunCode.includes(code)) {
        return gugun === '전체' ? sido : `${sido} ${gugun}`;
      }
      if (gugunCode === code) {
        return gugun === '전체' ? sido : `${sido} ${gugun}`;
      }
    }
  }
  return code; // fallback: 코드 그대로
}

// 지역명 → 코드 변환 함수 (필터링 시 사용)
function regionNameToCode(name) {
  name = name.trim();
  for (const [sido, guguns] of Object.entries(regionCodeMap)) {
    for (const [gugun, gugunCode] of Object.entries(guguns)) {
      // name이 "시도 구군" 또는 "시도" 형태일 수 있음
      if (
        `${sido} ${gugun}`.trim() === name ||
        sido === name ||
        gugun === name
      ) {
        // 여러 코드가 있을 경우 첫 번째 코드 반환
        if (Array.isArray(gugunCode)) return gugunCode[0];
        return gugunCode;
      }
    }
  }
  return name;
}

onMounted(() => {
  // 혼인여부 코드 → 라벨
  if (props.initialMarital && props.initialMarital.length > 0) {
    selectedMarital.value = props.initialMarital
      .map((code) => maritalCodeToLabel[code])
      .filter(Boolean);
  }
  // 지역 코드 → 지역명 변환
  if (props.initialRegion && props.initialRegion.length > 0) {
    selectedRegion.value = props.initialRegion
      .map((code) => codeToRegionName(code))
      .filter(Boolean);
  }
  if (props.initialAge) age.value = props.initialAge;
  if (props.initialIncome) income.value = props.initialIncome;
  // 학력 코드 → 라벨
  if (props.initialEducation && props.initialEducation.length > 0) {
    selectedEducation.value = props.initialEducation
      .map((code) => educationLevelLabelMap[code])
      .filter(Boolean);
  }
  // 전공 코드 → 라벨
  if (props.initialMajor && props.initialMajor.length > 0) {
    selectedMajor.value = props.initialMajor
      .map((code) => majorLabelMap[code])
      .filter(Boolean);
  }
  // 취업상태 코드 → 라벨
  if (props.initialJobStatus && props.initialJobStatus.length > 0) {
    selectedJobStatus.value = props.initialJobStatus
      .map((code) => employmentStatusLabelMap[code])
      .filter(Boolean);
  }
  // 특화분야 코드 → 라벨
  if (props.initialSpecialty && props.initialSpecialty.length > 0) {
    selectedSpecialty.value = props.initialSpecialty
      .map((code) => specialConditionLabelMap[code])
      .filter(Boolean);
  }
});

// AreaSelectModal에 지역 코드값을 넘겨서, 사용자가 이전에 선택한 지역이 선택된 상태로 보이게 함
const areaSelectModalProps = computed(() => ({
  initialRegionCodes:
    props.initialRegion && props.initialRegion.length > 0
      ? props.initialRegion
      : [],
}));
</script>
<template>
  <div class="policyFilterModal" @click.self="close">
    <div class="modalContent">
      <!-- 헤더 -->
      <div class="modalHeader">
        <button v-if="page !== 'main'" class="backBtn" @click="page = 'main'">
          <img
            src="@/assets/images/icons/policy/left_arrow.png"
            alt="뒤로가기"
            class="iconBack"
          />
        </button>
        <div class="modalTitle font-18 font-bold">
          {{
            page === 'main'
              ? '정책 필터 설정'
              : page === 'education'
              ? '학력 선택'
              : page === 'major'
              ? '전공 요건 선택'
              : page === 'jobStatus'
              ? '취업 상태 선택'
              : page === 'specialty'
              ? '특화 분야 선택'
              : ''
          }}
        </div>
        <button class="closeBtn" @click="close">
          <span aria-label="close">✕</span>
        </button>
      </div>
      <hr class="divider" />

      <div v-if="page === 'main'" class="modalBody">
        <div class="fieldLabel font-15 font-bold">지역</div>
        <div class="selectOpenInput" @click="showRegionModal = true">
          <span v-if="selectedRegion.length">{{ displayRegionText }}</span>
          <span v-else class="placeholder">지역 선택</span>
          <img
            src="@/assets/images/icons/policy/select_down.png"
            class="selectDownIcon"
          />
        </div>
        <!-- 혼인여부 -->
        <div class="fieldLabel font-15 font-bold">혼인 여부</div>
        <div class="selectGroup">
          <button
            v-for="s in maritalOptions"
            :key="s"
            class="selectBtn font-14"
            :class="{ active: selectedMarital.includes(s) }"
            @click="toggleMarital(s)"
            type="button"
          >
            {{ s }}
          </button>
        </div>

        <!-- 연령 -->
        <div class="fieldLabel font-15 font-bold">연령</div>
        <div class="inputRow font-14">
          <span class="font-14">만</span>
          <input
            type="number"
            v-model="age"
            :placeholder="isAgeFocus ? '' : '나이'"
            @focus="isAgeFocus = true"
            @blur="isAgeFocus = false"
            class="miniInput"
          />
          <span class="font-14">세</span>
        </div>
        <!-- 연소득 -->
        <div class="fieldLabel font-15 font-bold">연소득</div>
        <div class="inputRow">
          <span class="font-14">약</span>
          <input
            type="number"
            class="longInput font-14"
            :placeholder="isIncomeFocus ? '' : '0'"
            v-model="income"
            @focus="isIncomeFocus = true"
            @blur="isIncomeFocus = false"
          />
          <span class="font-14">만원</span>
        </div>
        <!-- 학력 -->
        <div class="fieldLabel font-15 font-bold">학력</div>
        <div class="selectOpenInput" @click="page = 'education'">
          <span v-if="selectedEducation.length">
            {{ displayEducationText }}
          </span>
          <span v-else class="placeholder">제한없음</span>
          <img
            src="@/assets/images/icons/policy/select_down.png"
            class="selectDownIcon"
          />
        </div>
        <!-- 전공 요건 -->
        <div class="fieldLabel font-15 font-bold">전공 요건</div>
        <div class="selectOpenInput" @click="page = 'major'">
          <span v-if="selectedMajor.length">
            {{ displayMajorText }}
          </span>
          <span v-else class="placeholder">제한없음</span>
          <img
            src="@/assets/images/icons/policy/select_down.png"
            class="selectDownIcon"
          />
        </div>
        <!-- 취업 상태 -->
        <div class="fieldLabel font-15 font-bold">취업 상태</div>
        <div class="selectOpenInput" @click="page = 'jobStatus'">
          <span v-if="selectedJobStatus.length">
            {{ displayJobStatusText }}
          </span>
          <span v-else class="placeholder">제한없음</span>
          <img
            src="@/assets/images/icons/policy/select_down.png"
            class="selectDownIcon"
          />
        </div>
        <!-- 특화 분야 -->
        <div class="fieldLabel font-15 font-bold">특화 분야</div>
        <div class="selectOpenInput" @click="page = 'specialty'">
          <span v-if="selectedSpecialty.length">
            {{ displaySpecialtyText }}
          </span>
          <span v-else class="placeholder">제한없음</span>
          <img
            src="@/assets/images/icons/policy/select_down.png"
            class="selectDownIcon"
          />
        </div>
      </div>

      <div
        v-if="['education', 'major', 'jobStatus', 'specialty'].includes(page)"
        class="optionPage"
      >
        <div class="optionList">
          <button
            v-for="item in page === 'education'
              ? educationOptions
              : page === 'major'
              ? majorOptions
              : page === 'jobStatus'
              ? jobStatusOptions
              : specialtyOptions"
            :key="item"
            class="optionBtn"
            :class="{ selected: getSelectedList(page).value.includes(item) }"
            @click.stop="toggleMulti(getSelectedList(page), item)"
            type="button"
          >
            <span>{{ item }}</span>
          </button>
        </div>
      </div>

      <div class="modalFooter">
        <button class="autoFillBtn font-16" @click="$emit('autoFill')">
          내 정보 자동입력
        </button>
        <div class="footerBtnRow">
          <button class="resetBtn font-16" @click="reset">초기화</button>
          <button
            class="saveBtn font-16"
            @click="page === 'main' ? confirm() : (page = 'main')"
          >
            {{ page === 'main' ? '저장' : '적용' }}
          </button>
        </div>
      </div>

      <AreaSelectModal
        v-if="showRegionModal"
        v-bind="areaSelectModalProps"
        @close="showRegionModal = false"
        @selected="handleRegionSelected"
      />
    </div>
  </div>
</template>

<style scoped>
.policyFilterModal {
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: rgba(30, 40, 60, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modalContent {
  width: 95vw;
  max-width: 350px;
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
  max-height: 96vh;
  padding: 5px;
}

.modalHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px 0 12px;
}
.modalTitle {
  color: var(--base-blue-dark);
}
.iconBack {
  width: 24px;
  height: 24px;
  object-fit: contain;
  margin-right: 4px;
  vertical-align: middle;
  background: none;
  border: none;
  padding: 0;
}
.backBtn {
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.closeBtn {
  background: none;
  border: none;
  font-size: 20px;
  color: #222;
  cursor: pointer;
}
.divider {
  border: none;
  border-top: 1.5px solid var(--input-outline-2);
}
.modalBody {
  padding: 0 12px;
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.modalBody::-webkit-scrollbar {
  width: 3px;
  background: transparent;
  display: none;
}
.modalBody::-webkit-scrollbar-thumb {
  background: var(--input-outline-2);
  border-radius: 3px;
}

.fieldLabel {
  margin-bottom: 8px;
}

.selectDownIcon {
  width: 18px;
  height: 18px;
  pointer-events: none;
  vertical-align: middle;
}
.regionField .selectDownIcon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
}
.regionField {
  width: 100%;
  height: 35px;
  border: 1px solid var(--input-outline-2);
  border-radius: 6px;
  padding: 13px 18px;
  color: var(--text-bluegray);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  margin-bottom: 16px;
  position: relative;
}
.regionField:active,
.regionField:focus {
  border: 1.5px solid var(--base-blue-dark);
}
.regionPlaceholder {
  color: var(--text-lightgray);
}

.selectGroup {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.selectBtn {
  padding: 5px 8px;
  border-radius: 6px;
  background: var(--input-bg-1);
  color: var(--text-bluegray);
  border: none;
  font-size: 13px;
  cursor: pointer;
  height: 30px;
}
.selectBtn.active,
.selectBtn:active {
  background: var(--base-blue-dark);
  color: #fff;
}

.inputRow {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 12px;
}

.miniInput {
  width: 50px;
  height: 30px;
  border: 1px solid var(--input-outline-2);
  border-radius: 8px;
  padding: 5px 8px;
  text-align: center;
}
.longInput {
  width: 80px;
  height: 30px;
  border: 1px solid var(--input-outline-2);
  border-radius: 8px;
  padding: 5px 8px;
  text-align: center;
}

.miniInput::-webkit-outer-spin-button,
.miniInput::-webkit-inner-spin-button,
.longInput::-webkit-outer-spin-button,
.longInput::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.miniInput[type='number'],
.longInput[type='number'] {
  -moz-appearance: textfield;
}

.modalFooter {
  display: flex;
  flex-direction: column;
  gap: 0px;
  padding: 0 16px 16px 16px;
  margin-top: 10px;
}

.resetBtn,
.saveBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 45px;
  font-size: 18px;
  border-radius: 8px;
  box-sizing: border-box;
}
.resetBtn {
  height: 45px;
  flex: 1;
  padding: 12px 0;
  border-radius: 8px;
  border: 1.5px solid var(--input-outline-2);
  background: var(--input-outline-2);
  color: var(--text-bluegray);
  cursor: pointer;
}
.saveBtn {
  height: 45px;
  flex: 2;
  padding: 12px 0;
  border-radius: 8px;
  background: var(--base-blue-dark);
  color: white;
  border: none;
  cursor: pointer;
}

.selectOpenInput {
  max-height: 90vh;
  width: 100%;
  min-height: 32px;
  border: 1px solid var(--input-outline-2);
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  margin-bottom: 12px;
  color: var(--text-bluegray);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}
.selectOpenInput span,
.selectOpenInput .placeholder {
  background: transparent !important;
}

.selectOpenInput .selectDownIcon {
  width: 18px;
  height: 18px;
  margin-left: 10px;
}

.optionPage {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  max-height: 100%;
}

.optionHeader {
  text-align: left;
  margin: 10px 0 10px 10px;
  color: var(--base-blue-dark);
}

.optionList {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 0 16px 20px 16px;
  min-height: 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.optionBtn {
  width: 100%;
  height: 45px;
  border: 1px solid var(--input-outline-2);
  background: #fff;
  color: var(--text-bluegray);
  border-radius: 8px;
  font-size: 14px;
  padding: 16px 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  gap: 3px;
  cursor: pointer;
  outline: none;
}

.optionBtn.selected {
  border: 1px solid var(--base-blue-dark);
  background: var(--base-blue-dark);
  color: #fff;
}

.optionList::-webkit-scrollbar {
  width: 3px;
  display: none;
}

.optionList::-webkit-scrollbar-thumb {
  background: var(--input-outline-2);
  border-radius: 6px;
}

.regionTag {
  background: var(--input-bg-2);
  color: var(--text-login);
  border-radius: 12px;
  padding: 4px 13px 4px 12px;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-right: 4px;
}
.removeBtn {
  background: none;
  border: none;
  color: var(--text-lightgray);
  font-size: 13px;
  cursor: pointer;
  padding: 0 0 0 2px;
}
.autoFillBtn {
  width: 100%;
  height: 42px;
  margin-bottom: 10px;
  border: none;
  border-radius: 10px;
  background: #f4f5fb; /* 연한 회색 느낌 */
  color: var(--base-blue-dark);
  cursor: pointer;
  text-align: center;
}

.footerBtnRow {
  display: flex;
  gap: 4px;
}
</style>
