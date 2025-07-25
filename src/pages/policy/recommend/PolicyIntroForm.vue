<template>
  <header class="introHeader">
    <div class="headerCard">
      <h1 class="title font-20 font-bold">정책 추천을 위한 기본 정보</h1>
      <p class="subtitle font-15 font-regular">개인 맞춤 분석</p>
    </div>
  </header>

  <div class="introContainer" style="font-family: 'NanumSquareNeo'">
    <section class="formSection">
      <label class="label font-20 font-regular">생년월일을 입력해주세요</label>
      <div class="birthSelects">
        <select v-model="birth.year" class="selectBox">
          <option disabled value="">년도</option>
          <option v-for="year in years" :key="year">{{ year }}</option>
        </select>
        <select v-model="birth.month" class="selectBox">
          <option disabled value="">월</option>
          <option v-for="month in 12" :key="month">{{ month }}</option>
        </select>
        <select v-model="birth.day" class="selectBox">
          <option disabled value="">일</option>
          <option v-for="day in 31" :key="day">{{ day }}</option>
        </select>
      </div>

      <label class="label font-20 font-regular">주소를 입력해주세요</label>
      <div class="addressInput">
        <input
          v-model="address"
          type="text"
          placeholder="주소를 검색해주세요"
          class="addressField font-15 font-regular"
        />
        <button class="searchButton font-14 font-regular">주소찾기</button>
      </div>

      <input
        v-model="detailAddress"
        type="text"
        placeholder="상세주소 (선택사항)"
        class="detailAddress font-15 font-regular"
      />

      <p class="disclaimer font-12 font-regular">
        입력하신 정보는 맞춤형 정책 추천을 위해서만 사용되며, 안전하게
        보호됩니다.
      </p>
    </section>
  </div>
  <div class="footer">
    <button
      class="nextButton font-18 font-bold"
      :disabled="!isFormValid"
      :class="{ disabled: !isFormValid }"
      @click="goToPolicyQuiz1"
    >
      다음
    </button>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'PolicyIntroForm',
  setup() {
    const router = useRouter();

    const birth = ref({ year: '', month: '', day: '' });
    const address = ref('');
    const detailAddress = ref('');

    const years = computed(() => {
      const currentYear = new Date().getFullYear();
      return Array.from({ length: 100 }, (_, i) => currentYear - i);
    });

    const isFormValid = computed(() => {
      return (
        birth.value.year &&
        birth.value.month &&
        birth.value.day &&
        address.value
      );
    });

    const goToPolicyQuiz1 = () => {
      if (!isFormValid.value) return;
      router.push({ name: 'policyQuizStep1' });
    };

    return {
      birth,
      address,
      detailAddress,
      years,
      goToPolicyQuiz1,
      isFormValid,
    };
  },
};
</script>

<style scoped>
.introContainer {
  padding: 24px;
  background-color: #fff;
  border-radius: 12px;
  max-width: 390px;
  margin: 0 42px;
}

.introHeader {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.headerCard {
  margin-top: 10px;
  text-align: center;
  background-color: var(--base-blue-dark);
  border-radius: 12px;
  padding: 19px;
  color: white;
  max-width: 390px;
  height: 90px;
  width: 100%;
}

.label {
  margin-bottom: 16px;
  display: block;
  color: var(--text-login);
}

.birthSelects {
  display: flex;
  gap: 10px;
  margin-bottom: 35px;
}

.selectBox,
.addressField,
.detailAddress {
  flex: 1;
  padding: 10px 15px;
  border: 1.5px solid var(--input-outline);
  border-radius: 8px;
  appearance: none;
  background-position: calc(100% - 10px) center;
  background-repeat: no-repeat;
  background-size: 20px;
}

.selectBox {
  background-image: url('@/assets/images/icons/policy/select_down.png');
}

.addressInput {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
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
  margin-top: 15px;
}

.footer {
  margin-top: 50px;
  text-align: center;
}

.nextButton {
  width: 267px;
  height: 47px;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 10px 32px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
}

.nextButton.disabled {
  background-color: var(--input-disabled-1);
  color: var(--text1);
  cursor: default;
}
</style>
