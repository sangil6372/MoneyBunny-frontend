<template>
  <header class="introHeader">
    <div class="quizHeader">
      <h2 class="font-20 font-bold">맞춤 정책 추천을 위한 간단한 질문</h2>
    </div>
  </header>

  <div class="quizContainer" style="font-family: 'NanumSquareNeo'">
    <section class="quizContent">
      <div class="progressBarWrapper">
        <span class="font-13 font-regular">질문 2 / 3</span>
        <div class="progressBar">
          <div class="progress" :style="{ width: '66%' }"></div>
        </div>
      </div>

      <h3 class="question font-22 font-bold">
        관심 있는 정책 분야를 선택해주세요
      </h3>
      <p class="font-12 font-regular">다중선택 가능</p>

      <div
        v-for="(group, index) in policyGroups"
        :key="index"
        style="margin-bottom: 24px"
      >
        <p class="font-16 font-bold">{{ index + 1 }}. {{ group.title }}</p>
        <ul class="options">
          <li
            v-for="item in group.items"
            :key="item"
            class="optionItem"
            :class="{ selected: selectedOptions.includes(item) }"
            @click="toggleOption(item)"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </section>

    <footer class="quizFooter">
      <button class="prevButton font-20 font-bold" @click="goBack">이전</button>
      <button
        class="nextButton font-20 font-bold"
        :disabled="selectedOptions.length === 0"
        @click="goToNextStep"
      >
        다음
      </button>
    </footer>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'PolicyQuizStep2',
  setup() {
    const router = useRouter();
    const selectedOptions = ref([]);

    const policyGroups = [
      {
        title: '취업 및 창업 지원',
        items: ['교육지원', '인턴', '중소기업', '벤처', '장기미취업청년'],
      },
      {
        title: '금융 지원',
        items: [
          '바우처',
          '보조금',
          '대출',
          '금리혜택',
          '맞춤형상담서비스',
          '신용회복',
        ],
      },
      {
        title: '주거 지원',
        items: ['공공임대주택', '주거지원'],
      },
      {
        title: '가정 및 생계 지원',
        items: ['청년가장', '출산'],
      },
    ];

    const toggleOption = (item) => {
      const index = selectedOptions.value.indexOf(item);
      if (index === -1) {
        selectedOptions.value.push(item);
      } else {
        selectedOptions.value.splice(index, 1);
      }
    };

    const goBack = () => {
      router.back();
    };

    const goToNextStep = () => {
      if (selectedOptions.value.length > 0) {
        router.push({ name: 'policyQuizStep3' });
      }
    };

    return {
      selectedOptions,
      policyGroups,
      toggleOption,
      goToNextStep,
      goBack,
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
  margin-bottom: 16px;
  color: var(--text-login);
}

.options {
  list-style: none;
  padding: 0;
  margin-top: 10px;
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
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.prevButton,
.nextButton {
  flex: 1;
  padding: 12px 0;
  border-radius: 10px;
  border: none;
  font-weight: bold;
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
