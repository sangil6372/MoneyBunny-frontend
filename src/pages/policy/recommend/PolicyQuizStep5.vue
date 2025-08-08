<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { policyAPI } from '@/api/policy';
import { usePolicyQuizStore } from '@/stores/policyQuizStore';

export default {
  name: 'PolicyQuizStep5',
  setup() {
    const router = useRouter();
    const route = useRoute();

    const options = ['금액', '조회수', '만료일'];
    const selectedOptions = ref([]);
    const policyQuizStore = usePolicyQuizStore(); // 스토어 인스턴스 생성

    onMounted(() => {
      // 스토어에서 이전에 저장된 값 불러오기 (선택 사항)
      // 각 랭크 값을 기반으로 selectedOptions를 재구성
      const storedOptions = [];
      if (policyQuizStore.moneyRank) {
        storedOptions[policyQuizStore.moneyRank - 1] = '금액';
      }
      if (policyQuizStore.popularityRank) {
        storedOptions[policyQuizStore.popularityRank - 1] = '조회수';
      }
      if (policyQuizStore.periodRank) {
        storedOptions[policyQuizStore.periodRank - 1] = '만료일';
      }
      selectedOptions.value = storedOptions.filter(Boolean); // null/undefined 제거
    });

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
      // 현재 우선순위 저장
      selectedOptions.value.forEach((option, index) => {
        const rank = index + 1;
        if (option === '금액') {
          policyQuizStore.setMoneyRank(rank);
        } else if (option === '조회수') {
          policyQuizStore.setPopularityRank(rank);
        } else if (option === '만료일') {
          policyQuizStore.setPeriodRank(rank);
        }
      });
      router.push({ name: 'policyQuizStep4' });
    };

    const goToNextStep = async () => {
      if (selectedOptions.value.length !== 3) return;

      // 각 항목의 랭크를 스토어에 저장
      selectedOptions.value.forEach((option, index) => {
        const rank = index + 1;
        if (option === '금액') {
          policyQuizStore.setMoneyRank(rank);
        } else if (option === '조회수') {
          policyQuizStore.setPopularityRank(rank);
        } else if (option === '만료일') {
          policyQuizStore.setPeriodRank(rank);
        }
      });

      const payload = policyQuizStore.getRequestPayload();

      try {
        // 정책 정보 저장(신규)
        await policyAPI.createUserPolicy(payload);
        router.push({
          name: 'policyResultSummary',
          query: {
            ...payload,
            priority: selectedOptions.value.join(','),
          },
        });
      } catch (error) {
        console.error('Failed to save user policy:', error);
        alert('추천 결과를 불러오지 못했습니다.');
      }
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
      <div class="font-18">맞춤 정책 추천을 위한 간단한 질문</div>
    </div>
  </header>

  <div class="quizContainer">
    <section class="quizContent">
      <div class="question font-15 mb-4">
        정책을 신청할 때 중요하게 여기는 순서대로 <br></br>클릭해주세요
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
      <button class="prevButton font-15" @click="goToPrevStep">이전</button>
      <button
        class="nextButton font-15"
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

.priorityOptions {
 list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.optionItem {
  position: relative;
  padding: 11px 15px;
  border: 1px solid var(--input-outline);
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  font-size: 14px;
}

.optionItem.selected {
  border-color: var(--input-bg-3);
  background-color: #f0f6ff;
  color: #1d3557;
}

.priorityBadge {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--base-blue-dark); 
  color: white;
  font-size: 12px;
  padding: 7px 12px;
  border-radius: 999px;
  line-height: 1;
  white-space: nowrap;
   /* background: #c2dbff;    
  color: #243570; */
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

.mb-2 {
  margin-bottom: 8px;
}
.mb-4 {
  margin-bottom: 16px;
}
</style>
