<template>
  <header class="introHeader">
    <div class="quizHeader">
      <div class="font-18">맞춤 정책 추천을 위한 간단한 질문</div>
    </div>
  </header>

  <div class="quizContainer">
    <section class="quizContent">
      <div class="progressBarWrapper">
        <span class="font-13">질문 3 / 4</span>
        <div class="progressBar">
          <div class="progress" :style="{ width: '75%' }"></div>
        </div>
      </div>

      <div class="question font-20">현재 어떤 상황에 계신가요?</div>

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
      <button class="prevButton font-18" @click="goToPrevStep">이전</button>
      <button
        class="nextButton font-18"
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
  name: 'PolicyQuizStep3',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const selectedOption = ref('');
    const options = [
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

    const policyQuizStore = usePolicyQuizStore(); // 스토어 인스턴스 생성

    onMounted(() => {
      // 스토어에서 이전에 저장된 값 불러오기
      if (policyQuizStore.employmentStatuses) {
        selectedOption.value = policyQuizStore.employmentStatuses;
      }
    });

    const goToPrevStep = () => {
      policyQuizStore.setEmploymentStatuses(selectedOption.value); // 현재 선택값 저장
      router.push({ name: 'policyQuizStep2' });
    };

    const goToNextStep = () => {
      if (selectedOption.value) {
        policyQuizStore.setEmploymentStatuses(selectedOption.value); // 스토어에 저장
        router.push({
          name: 'policyQuizStep4',
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
  font-size: 15px;
}

.optionItem.selected {
  border-color: var(--input-bg-3);
  background-color: var(--input-bg-3);
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
