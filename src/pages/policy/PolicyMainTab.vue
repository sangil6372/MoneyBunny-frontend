<template>
  <div class="policyWrapper">
    <!-- 정책 검색창 -->
    <div class="searchBar">
      <img
        src="@/assets/images/icons/policy/search.png"
        alt="search icon"
        class="searchIconImage"
      />
      <input type="text" placeholder="정책 검색" @focus="goToSearchPage" />
    </div>

    <!-- 맞춤 정책 TOP 3 추천 -->
    <div class="topThreeBanner">
      <img
        src="@/assets/images/icons/policy/award.png"
        alt="award icon"
        class="topThreeIconImage"
      />
      <span class="font-bold font-18">맞춤 정책 TOP 3 추천</span>
    </div>

    <!-- 정책 카드 리스트 -->
    <div v-for="(policy, index) in policyList" :key="index" class="policyCard">
      <div class="cardHeader">
        <span class="cardTitle font-bold font-15">{{ policy.title }}</span>
        <span class="cardTag font-12">{{ policy.tag }}</span>
      </div>
      <p class="cardDesc font-14">{{ policy.desc }}</p>
      <p class="cardDeadline font-12">
        <span class="label font-regular">마감일 : </span>
        <span class="date font-bold">{{ policy.deadline }}</span>
      </p>

      <div class="cardActions">
        <button class="buttonSecondary font-14" @click="goToDetail(policy.id)">
          자세히 보기
        </button>

        <button class="buttonPrimary font-14">신청하기</button>
      </div>
    </div>

    <!-- 더 많은 정책 보기 버튼 -->
    <button class="moreButton font-bold font-16">더 많은 정책 보기</button>

    <!-- 하단 네비게이션 -->
    <BottomNav />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BottomNav from '@/components/layouts/NavBar.vue';

const router = useRouter();

const goToDetail = (policyId) => {
  router.push({ name: 'policyDetail', params: { id: policyId } });
};
const goToSearchPage = () => {
  router.push({ name: 'policySearch' });
};

const policyList = ref([
  {
    id: 1,
    title: '청년 주택드림 청약통장',
    tag: '주택',
    desc: '만 19~34세 청년층을 위한 주택 구입 지원 정책으로...',
    deadline: '2024.12.31',
  },
  {
    id: 2,
    title: '청년 내일채움공제',
    tag: '취업',
    desc: '중소기업 취업 청년을 위한 장기재직 지원제도...',
    deadline: '2024.11.30',
  },
  {
    id: 3,
    title: '청년 창업지원금',
    tag: '창업',
    desc: '만 39세 이하 예비창업자 및 창업 3년 이내 기업 대상...',
    deadline: '2024.10.15',
  },
]);
</script>
<style scoped>
.policyWrapper {
  padding-bottom: 40px;
  background-color: var(--input-bg-2);
  font-family: 'NanumSquareNeo';
}

.searchBar {
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid var(--input-outline-2);
  border-radius: 8px;
  padding: 9px 16px;
  margin-top: 12px;
  margin-bottom: 20px;
  gap: 8px;
}

.searchBar input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 15px;
  background-color: transparent;
}

.searchIconImage {
  width: 24px;
  height: 24px;
}

.topThreeBanner {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.topThreeIconImage {
  width: 18px;
  height: 18px;
}

.policyCard {
  background-color: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.05);
}

.cardHeader {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.cardTitle {
  color: var(--text-login);
}

.cardTag {
  background-color: var(--input-outline);
  color: var(--text-bluegray);
  padding: 2px 6px;
  border-radius: 6px;
}

.cardDesc {
  color: var(--text-bluegray);
  margin: 6px 0;
}

.cardDeadline {
  margin-bottom: 12px;
}

.cardDeadline .label {
  color: var(--text-bluegray);
  margin-right: 4px;
}

.cardDeadline .date {
  color: var(--base-blue-dark);
}

.cardActions {
  display: flex;
  gap: 8px;
}

.buttonSecondary,
.buttonPrimary {
  flex: 1;
}

.buttonSecondary {
  width: 185px;
  background-color: var(--input-bg-2);
  border: none;
  padding: 10px;
  border-radius: 8px;
  color: var(--text-bluegray);
}

.buttonPrimary {
  width: 185px;
  background-color: var(--base-blue-dark);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
}

.moreButton {
  width: 100%;
  height: 50px;
  padding: 11px;
  background-color: white;
  border: none;
  color: var(--base-blue-dark);
  border-radius: 8px;
  border: 1px solid var(--input-outline);
  margin-top: 15px;
}
</style>
