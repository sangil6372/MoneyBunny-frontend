<script setup>
import { ref, computed } from 'vue';
import AreaSelectModal from './AreaSelectModal.vue';

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
  '고교 예정',
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
    region: selectedRegion.value,
    marital: selectedMarital.value,
    age: age.value,
    income: income.value,
    education: selectedEducation.value,
    major: selectedMajor.value,
    jobStatus: selectedJobStatus.value,
    specialty: selectedSpecialty.value,
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
        <div class="modalTitle font-20 font-bold">
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
        <div class="fieldLabel">지역</div>
        <div class="selectOpenInput" @click="showRegionModal = true">
          <span v-if="selectedRegion.length">{{ displayRegionText }}</span>
          <span v-else class="placeholder">지역 선택</span>
          <img
            src="@/assets/images/icons/policy/select_down.png"
            class="selectDownIcon"
          />
        </div>
        <!-- 혼인여부 -->
        <div class="fieldLabel font-16 font-bold">혼인 여부</div>
        <div class="selectGroup">
          <button
            v-for="s in maritalOptions"
            :key="s"
            class="selectBtn font-15"
            :class="{ active: selectedMarital.includes(s) }"
            @click="toggleMarital(s)"
            type="button"
          >
            {{ s }}
          </button>
        </div>

        <!-- 연령 -->
        <div class="fieldLabel font-16 font-bold">연령</div>
        <div class="inputRow">
          <span class="font-15">만</span>
          <input
            type="number"
            v-model="age"
            :placeholder="isAgeFocus ? '' : '나이'"
            @focus="isAgeFocus = true"
            @blur="isAgeFocus = false"
            class="miniInput"
          />
          <span class="font-15">세</span>
        </div>
        <!-- 연소득 -->
        <div class="fieldLabel font-16 font-bold">연소득</div>
        <div class="inputRow">
          <span class="font-15">약</span>
          <input
            type="number"
            class="longInput font-15"
            :placeholder="isIncomeFocus ? '' : '0'"
            v-model="income"
            @focus="isIncomeFocus = true"
            @blur="isIncomeFocus = false"
          />
          <span class="font-15">만원</span>
        </div>
        <!-- 학력 -->
        <div class="fieldLabel font-16 font-bold">학력</div>
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
        <div class="fieldLabel font-16 font-bold">전공 요건</div>
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
        <div class="fieldLabel font-16 font-bold">취업 상태</div>
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
        <div class="fieldLabel font-16 font-bold">특화 분야</div>
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
        <button class="resetBtn font-18" @click="reset">초기화</button>
        <button
          class="saveBtn font-18"
          @click="page === 'main' ? confirm() : (page = 'main')"
        >
          {{ page === 'main' ? '저장' : '적용' }}
        </button>
      </div>
    </div>

    <AreaSelectModal
      v-if="showRegionModal"
      @close="showRegionModal = false"
      @selected="handleRegionSelected"
    />
  </div>
</template>

<style scoped>
.policyFilterModal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1200;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}
.modalContent {
  background: #fff;
  border-radius: 10px;
  width: 100%;
  max-width: 430px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  padding: 0 5px;
}

.modalHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0 24px;
}
.modalTitle {
  color: var(--base-blue-dark);
}
.iconBack {
  width: 34px;
  height: 34px;
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
  font-size: 25px;
  color: #222;
  cursor: pointer;
}
.divider {
  border: none;
  border-top: 2px solid var(--input-outline-2);
}
.modalBody {
  padding: 0 24px;
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
  margin-bottom: 10px;
}

.selectDownIcon {
  width: 24px;
  height: 24px;
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
  height: 40px;
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
  font-size: 14px;
  cursor: pointer;
  height: 35px;
}
.selectBtn.active,
.selectBtn:active {
  background: var(--base-blue-dark);
  color: #fff;
}

.inputRow {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
}

.miniInput {
  width: 60px;
  height: 35px;
  border: 1px solid var(--input-outline-2);
  border-radius: 8px;
  padding: 7px 10px;
  text-align: center;
}
.longInput {
  width: 100px;
  height: 35px;
  border: 1px solid var(--input-outline-2);
  border-radius: 8px;
  padding: 7px 10px;
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
  gap: 8px;
  padding: 0 14px 14px 14px;
  margin-top: 12px;
}

.resetBtn,
.saveBtn {
  display: flex;
  align-items: center;
  justify-content: center;
}

.resetBtn {
  height: 50px;
  flex: 1;
  padding: 14px 0;
  border-radius: 8px;
  border: 1.5px solid var(--input-outline-2);
  background: var(--reset-button);
  color: var(--text-bluegray);
  cursor: pointer;
}
.saveBtn {
  height: 50px;
  flex: 2;
  padding: 14px 0;
  border-radius: 8px;
  background: var(--base-blue-dark);
  color: white;
  border: none;
  cursor: pointer;
}

.selectOpenInput {
  max-height: 90vh;
  width: 100%;
  min-height: 38px;
  border: 1px solid var(--input-outline-2);
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 15px;
  margin-bottom: 16px;
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
  width: 22px;
  height: 22px;
  margin-left: 8px;
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
  font-size: 15px;
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
  font-size: 15px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-right: 4px;
}
.removeBtn {
  background: none;
  border: none;
  color: var(--text-lightgray);
  font-size: 14px;
  cursor: pointer;
  padding: 0 0 0 2px;
}
</style>
