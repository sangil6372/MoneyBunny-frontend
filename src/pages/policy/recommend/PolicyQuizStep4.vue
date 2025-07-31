<template>
  <header class="introHeader">
    <div class="quizHeader">
      <h2 class="font-20 font-bold">맞춤 정책 추천을 위한 간단한 질문</h2>
    </div>
  </header>

  <div class="quizContainer" style="font-family: 'NanumSquareNeo'">
    <section class="quizContent">
      <div class="progressBarWrapper">
        <span class="font-13 font-regular">질문 4 / 4</span>
        <div class="progressBar">
          <div class="progress" :style="{ width: '100%' }"></div>
        </div>
      </div>

      <h3 class="question font-22 font-bold">현재 본인의 소득은?</h3>

      <ul class="options">
        <li
          v-for="option in options"
          :key="option"
          class="optionItem"
          :class="{ selected: selectedOption === option }"
          @click="selectOption(option)"
        >
          <template
            v-if="option === '직접 입력' && selectedOption === '직접 입력'"
          >
            <input
              v-model="customIncome"
              type="text"
              placeholder="직접 입력"
              class="inlineInput"
              @click.stop
            />
          </template>
          <template v-else>
            {{ option }}
          </template>
        </li>
      </ul>
    </section>

    <footer class="quizFooter">
      <button class="prevButton font-20" @click="goToPrevStep">이전</button>
      <button
        class="nextButton font-20"
        :disabled="!isFormValid"
        @click="goToNextStep"
      >
        다음
      </button>
    </footer>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'PolicyQuizStep4',
  setup() {
    const router = useRouter();
    const options = [
      '2천만원 미만',
      '2천만원~4천만원 미만',
      '4천만원~6천만원 미만',
      '6천만원 이상',
      '모르겠어요',
      '직접 입력',
    ];
    const selectedOption = ref('');
    const customIncome = ref('');

    const isFormValid = computed(() => {
      return (
        selectedOption.value !== '' &&
        (selectedOption.value !== '직접 입력' ||
          customIncome.value.trim() !== '')
      );
    });

    const selectOption = (option) => {
      selectedOption.value = option;
      if (option !== '직접 입력') {
        customIncome.value = '';
      }
    };

    const goToPrevStep = () => {
      router.push({ name: 'policyQuizStep3' });
    };

    const goToNextStep = () => {
      if (!isFormValid.value) return;
      // 추후 저장 로직 필요 시 여기에
      router.push({ name: 'policyQuizStep5' });
    };

    return {
      options,
      selectedOption,
      customIncome,
      isFormValid,
      selectOption,
      goToNextStep,
      goToPrevStep,
    };
  },
};
</script>

<style scoped>
.introHeader {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.quizHeader {
  margin-top: 10px;
  text-align: center;
  background-color: var(--base-blue-dark);
  border-radius: 12px;
  padding: 19px;
  color: white;
  max-width: 390px;
  width: 100%;
}

.quizContainer {
  max-width: 390px;
  margin: 0 auto;
  padding: 24px;
  background-color: #fff;
  border-radius: 16px;
}

.progressBarWrapper {
  margin-bottom: 24px;
}

.progressBar {
  height: 4px;
  background-color: var(--input-bg-1);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 17px;
}

.progress {
  height: 100%;
  background-color: var(--base-blue-dark);
  transition: width 0.3s ease;
}

.question {
  margin-bottom: 20px;
  color: var(--text-login);
}

.options {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.optionItem {
  padding: 12px 16px;
  border: 1px solid var(--input-outline);
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
}

.optionItem.selected {
  border-color: var(--input-outline);
  background-color: var(--input-bg-2);
}

.quizFooter {
  margin-top: 32px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.prevButton,
.nextButton {
  flex: 1;
  padding: 12px 0;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}

.prevButton {
  background-color: var(--input-bg-1);
  color: var(--text-login);
}

.nextButton {
  background-color: var(--base-blue-dark);
  color: white;
}

.nextButton:disabled {
  background-color: var(--input-disabled-1);
  cursor: default;
}

.inlineInput {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  font-family: inherit;
  color: var(--text-login);
  padding: 0;
}
</style>
