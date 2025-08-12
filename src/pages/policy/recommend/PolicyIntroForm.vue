<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import RegionSelectModal from './RegionSelectModal.vue';
import rightArrow from '@/assets/images/icons/policy/right_arrow.png';
import Dropdown from '../component/CustomDropdown.vue';
import { usePolicyQuizStore } from '@/stores/policyQuizStore';

const router = useRouter();
const policyQuizStore = usePolicyQuizStore();

const birth = ref({ year: '', month: '', day: '' });
const address = ref('');
const openDropdown = ref(null); // 열려 있는 드롭다운 id 저장

const years = Array.from({ length: 2025 - 1990 + 1 }, (_, i) => 2025 - i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const showRegionModal = ref(false);

const handleRegionSelected = (value) => {
  address.value = value;
  showRegionModal.value = false;
};

onMounted(() => {
  if (policyQuizStore.birthYear) birth.value.year = policyQuizStore.birthYear;
  if (policyQuizStore.birthMonth)
    birth.value.month = policyQuizStore.birthMonth;
  if (policyQuizStore.birthDay) birth.value.day = policyQuizStore.birthDay;
  // regionName이 있으면 address에 복원
  if (policyQuizStore.regionName) {
    address.value = policyQuizStore.regionName;
  }
});

const isFormValid = computed(() => {
  return (
    birth.value.year && birth.value.month && birth.value.day && address.value
  );
});

const goToPolicyQuiz1 = () => {
  if (!isFormValid.value) return;
  policyQuizStore.setBasicInfo({
    year: birth.value.year,
    month: birth.value.month,
    day: birth.value.day,
    region: address.value,
  });
  router.push({ name: 'policyQuizStep1' });
};

// 열려 있는 드롭다운 ID만 유지
const handleDropdownOpen = (id) => {
  openDropdown.value = id;
};

// 스토어에 값이 있으면 초기값 세팅
onMounted(() => {
  if (policyQuizStore.birthYear) birth.value.year = policyQuizStore.birthYear;
  if (policyQuizStore.birthMonth)
    birth.value.month = policyQuizStore.birthMonth;
  if (policyQuizStore.birthDay) birth.value.day = policyQuizStore.birthDay;

  const hasBirthInfo =
    policyQuizStore.birthYear &&
    policyQuizStore.birthMonth &&
    policyQuizStore.birthDay;
  const hasRegion = policyQuizStore.regions && policyQuizStore.regions !== '';

  if (hasBirthInfo && hasRegion) {
    address.value = policyQuizStore.regionName;
  }
});
</script>

<template>
  <header class="introHeader">
    <div class="headerCard">
      <div class="title font-18">정책 추천을 위한 기본 정보</div>
      <p class="subtitle font-14">개인 맞춤 분석</p>
    </div>
  </header>

  <div class="introContainer">
    <section class="formSection">
      <label class="label font-16">생년월일을 입력해주세요</label>
      <div class="birthSelects">
        <Dropdown
          v-model="birth.year"
          placeholder="년도"
          :options="years"
          id="year"
          @open="handleDropdownOpen"
        />
        <Dropdown
          v-model="birth.month"
          placeholder="월"
          :options="months"
          id="month"
          @open="handleDropdownOpen"
        />
        <Dropdown
          v-model="birth.day"
          placeholder="일"
          :options="days"
          id="day"
          @open="handleDropdownOpen"
        />
      </div>

      <label class="label font-16 regionLabel">
        지역을 선택해주세요
        <img
          :src="rightArrow"
          alt="지역 선택"
          class="arrowIcon"
          @click="showRegionModal = true"
        />
      </label>

      <!-- 선택된 주소 미리보기 -->
      <p v-if="address" class="selectedAddress font-14">
        {{ address }}
      </p>

      <!-- 지역 선택 모달 -->
      <RegionSelectModal
        v-if="showRegionModal"
        @close="showRegionModal = false"
        @selected="handleRegionSelected"
      />
    </section>
  </div>

  <div class="footer">
    <button
      class="nextButton font-15"
      :disabled="!isFormValid"
      :class="{ disabled: !isFormValid }"
      @click="goToPolicyQuiz1"
    >
      다음
    </button>
  </div>
</template>

<style scoped>
.introContainer {
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  max-width: 360px;
  margin-bottom: 20px;
}

.introHeader {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
}

.headerCard {
  text-align: center;
  background-color: var(--base-blue-dark);
  border-radius: 12px;
  padding: 16px;
  color: white;
  max-width: 360px;
  height: 100px;
  width: 100%;
}
.title {
  margin: 5px 0 7px 0;
}

.label {
  margin-bottom: 12px;
  display: block;
  color: var(--text-login);
}

.birthSelects {
  display: flex;
  gap: 6px;
  margin-bottom: 30px;
}

.addressInput {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}

.searchButton {
  background-color: var(--base-blue-dark);
  color: white;
  padding: 8px 13px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.disclaimer {
  color: var(--text-bluegray);
  margin-top: 10px;
}

.footer {
  margin-top: 25px;
  text-align: center;
}

.nextButton {
  width: 100%;
  height: 50px;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 8px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.nextButton.disabled {
  background-color: var(--input-disabled-1);
  color: var(--text1);
  cursor: default;
}
.regionLabel {
  display: flex;
  align-items: center;
  gap: 4px;
}

.arrowIcon {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.selectedAddress {
  margin-top: 6px;
  color: var(--text-bluegray);
}
</style>
