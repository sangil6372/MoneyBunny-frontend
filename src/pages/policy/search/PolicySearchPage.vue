<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import api from '@/api';

const router = useRouter();
const searchQuery = ref('');
const popularKeywords = ref([]);
const recentKeywords = ref([]);

const goBack = () => {
  router.back();
};

const search = () => {
  console.log(`검색어: ${searchQuery.value}`);
};

const fetchPopularKeywords = async () => {
  try {
    const res = await api.get('/api/userPolicy/popular-keywords');
    // 응답이 배열이면 아래처럼 바로 할당
    popularKeywords.value = Array.isArray(res.data) ? res.data : [];
  } catch (e) {
    console.error('인기 검색어 조회 실패', e);
  }
};

const fetchRecentKeywords = async () => {
  try {
    const res = await api.get('/api/userPolicy/recent-keywords');
    // 응답이 배열이면 아래처럼 바로 할당
    recentKeywords.value = Array.isArray(res.data) ? res.data : [];
  } catch (e) {
    console.error('최근 검색어 조회 실패', e);
  }
};

onMounted(() => {
  fetchPopularKeywords();
  fetchRecentKeywords();
});
</script>

<template>
  <div class="policySearchPage">
    <section class="section">
      <div class="title">최근 검색어</div>
      <div class="chipList">
        <span class="chip" v-for="(item, idx) in recentKeywords" :key="idx">{{
          item
        }}</span>
      </div>
    </section>

    <!-- 인기 검색어 -->
    <section class="section">
      <div class="title">인기 검색어</div>
      <div class="popularGrid">
        <div
          class="popularItem"
          v-for="(item, index) in popularKeywords"
          :key="index"
        >
          <span class="number">{{ index + 1 }}</span>
          <span class="text">{{ item }}</span>
        </div>
      </div>
    </section>

    <!-- 검색 팁 -->
    <section class="section">
      <div class="title">검색 팁</div>
      <div class="tip">
        <img src="@/assets/images/icons/policy/lamp.png" class="tipIcon" />
        <div>
          <p class="tipTitle">키워드로 검색하세요</p>
          <p class="tipText">청년, 주거, 창업 등 관심 분야 키워드 입력</p>
        </div>
      </div>
      <div class="tip">
        <img src="@/assets/images/icons/policy/filter.png" class="filterIcon" />
        <div>
          <p class="tipTitle">필터를 활용하세요</p>
          <p class="tipText">연령, 지역, 분야별로 정확한 정책 찾기</p>
        </div>
      </div>
      <div class="tip">
        <img
          src="@/assets/images/icons/policy/bookmark_before.png"
          class="tipIcon"
        />
        <div>
          <p class="tipTitle">관심 정책을 저장하세요</p>
          <p class="tipText">당근 버튼으로 나중에 쉽게 찾아보기</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.policySearchPage {
  padding: 0;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE, Edge */
}
.policySearchPage::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.section {
  /* margin: 10px; */
  margin-bottom: 20px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px 0 rgba(50, 70, 100, 0.07);
  padding: 28px 24px 24px 24px;
}

.title {
  font-weight: bold;
  margin-bottom: 21px;
  font-size: 20px;
}

.chipList {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  background-color: var(--input-bg-1);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 15px;
  color: var(--text-bluegray);
}

.popularGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.popularItem {
  background-color: var(--input-bg-1);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 14px;
}

.number {
  font-weight: bold;
  color: var(--base-blue-dark);
}

.tip {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 16px;
}

.tipIcon {
  width: 28px;
  height: 28px;
}
.filterIcon {
  width: 28px;
  height: 28px;
}

.tipTitle {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 15px;
}

.tipText {
  margin: 0;
  font-size: 13px;
  color: var(--text-bluegray);
}
</style>
