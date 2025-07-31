<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'PolicyQuizStep5',
  setup() {
    const router = useRouter();

    const options = ['금액', '조회수', '만료일'];
    const selectedOptions = ref([]);

    const handleClick = (option) => {
      const index = selectedOptions.value.indexOf(option);

      if (index > -1) {
        selectedOptions.value.splice(index, 1); // 선택 해제
      } else if (selectedOptions.value.length < 3) {
        selectedOptions.value.push(option); // 선택 추가
      }
    };

    const getPriority = (option) => {
      const index = selectedOptions.value.indexOf(option);
      return index > -1 ? index + 1 : 0;
    };

    const getPriorityText = (option) => {
      const index = selectedOptions.value.indexOf(option);
      if (index === 0) return '1순위';
      if (index === 1) return '2순위';
      if (index === 2) return '3순위';
      return '';
    };

    const goToPrevStep = () => {
      router.push({ name: 'policyQuizStep4' });
    };

    const goToNextStep = () => {
      router.push({ name: 'policyResultSummary' });
    };

    return {
      options,
      selectedOptions,
      handleClick,
      getPriority,
      getPriorityText,
      goToPrevStep,
      goToNextStep,
    };
  },
};
</script>

<template>
  <header class="introHeader">
    <div class="quizHeader">
      <div class="font-20 font-bold">맞춤 정책 추천을 위한 간단한 질문</div>
    </div>
  </header>

  <div class="quizContainer" style="font-family: 'NanumSquareNeo'">
    <section class="quizContent">
      <div class="question font-18 font-bold mb-4">
        정책을 신청할 때 중요하게 여기는 순서대로 클릭해주세요
      </div>

      <ul class="priorityOptions">
        <li
          v-for="option in options"
          :key="option"
          class="optionItem"
          :class="{ selected: getPriority(option) !== 0 }"
          @click="handleClick(option)"
        >
          {{ option }}
          <!-- <span v-if="getPriority(option) !== 0" class="priorityBadge">
            {{ getPriority(option) }}
          </span> -->
          <span v-if="getPriority(option) !== 0" class="priorityBadge">
            {{ getPriorityText(option) }}
          </span>
        </li>
      </ul>
    </section>

    <footer class="quizFooter">
      <button class="prevButton font-20" @click="goToPrevStep">이전</button>
      <button
        class="nextButton font-20"
        :disabled="selectedOptions.length !== 3"
        @click="goToNextStep"
      >
        결과 보기
      </button>
    </footer>
  </div>
</template>

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

.priorityOptions {
  display: flex;
  flex-direction: column;
  gap: 14px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.optionItem {
  position: relative;
  padding: 14px 16px;
  border: 1px solid var(--input-outline);
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  font-size: 16px;
}

.optionItem.selected {
  background-color: var(--input-bg-2);
}
.priorityBadge {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--base-blue-dark);
  color: white;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 999px;
  line-height: 1;
  white-space: nowrap;
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
  cursor: not-allowed;
}

.mb-2 {
  margin-bottom: 8px;
}
.mb-4 {
  margin-bottom: 16px;
}
</style>
