<template>
  <header class="introHeader">
    <div class="quizHeader">
      <div class="font-18">맞춤 정책 추천을 위한 간단한 질문</div>
    </div>
  </header>

  <div class="quizContainer">
    <section class="quizContent">
      <div class="progressBarWrapper">
        <span class="font-13">질문 1 / 4</span>
        <div class="progressBar">
          <div class="progress" :style="{ width: '25%' }"></div>
        </div>
      </div>

      <div class="question font-18">최종 학력을 선택해주세요</div>

      <ul class="options">
        <li
          v-for="option in options"
          :key="option"
          class="optionItem"
          :class="{ selected: selectedOption === option }"
          @click="selectedOption = option"
        >
          {{ option }}
        </li>
      </ul>
    </section>

    <footer class="quizFooter">
      <button class="prevButton font-15" @click="goToPrevStep">이전</button>
      <button
        class="nextButton font-15"
        :disabled="!selectedOption"
        @click="goToNextStep"
      >
        다음
      </button>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { usePolicyQuizStore } from '@/stores/policyQuizStore';

export default {
  name: 'PolicyQuizStep1',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const selectedOption = ref('');
    const options = [
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

    const policyQuizStore = usePolicyQuizStore(); // 스토어 인스턴스 생성

    onMounted(() => {
      // 스토어에서 이전에 저장된 값 불러오기
      if (policyQuizStore.educationLevels) {
        selectedOption.value = policyQuizStore.educationLevels;
      }
    });

    const goToPrevStep = () => {
      policyQuizStore.setEducationLevels(selectedOption.value); // 현재 선택값 저장
      router.push({ name: 'policyIntroForm' });
    };

    const goToNextStep = () => {
      if (selectedOption.value) {
        policyQuizStore.setEducationLevels(selectedOption.value); // 스토어에 저장
        router.push({
          name: 'policyQuizStep2',
        });
      }
    };

    return {
      options,
      selectedOption,
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
  text-align: center;
  background-color: var(--base-blue-dark);
  border-radius: 8px;
  padding: 20px;
  color: white;
  /* max-width: 390px; */
  width: 100%;
}
.quizContainer {
  /* max-width: 396px; */
  margin: 0 auto;
  padding: 24px;
  background-color: #fff;
  border-radius: 12px;
}

.progressBarWrapper {
  margin-bottom: 24px;
}

.progressBar {
  height: 4px;
  background-color: var(--input-bg-1);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 15px;
}

.progress {
  height: 100%;
  background-color: var(--base-blue-dark);
}

.question {
  margin-bottom: 15px;
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
  padding: 11px 15px;
  border: 1px solid var(--input-outline-2);
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  font-size: 14px;
}

.optionItem.selected {
  border-color: var(--input-bg-3);
  /* background-color: var(--input-bg-3); */
  /* color: #28417a;
  background-color: rgba(62, 89, 189, 0.12); */
  /* background-color: #e8efff;
  color: #243570; */
  background-color: #f0f6ff;
  color: #1d3557;
}

.quizFooter {
  margin-top: 16px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.prevButton,
.nextButton {
  flex: 1;
  padding: 12px 0;
  border-radius: 8px;
  border: none;
}

.prevButton {
  background-color: var(--input-bg-2);
  color: var(--text-login);
}

.nextButton {
  background-color: var(--base-blue-dark);
  color: white;
  cursor: pointer;
}

.nextButton:disabled {
  background-color: var(--input-disabled-1);
  cursor: default;
}
</style>
