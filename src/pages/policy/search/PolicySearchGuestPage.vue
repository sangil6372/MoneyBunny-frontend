<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { guestPolicyAPI } from "@/api/guestPolicy";

const router = useRouter();
const searchQuery = ref("");
const popularKeywords = ref([]);
const recentKeywords = ref([]);

// 최근검색어 삭제
const removeRecent = async (idx) => {
  const keyword = recentKeywords.value[idx];
  try {
    await guestPolicyAPI.removeRecentKeyword(keyword);
    recentKeywords.value.splice(idx, 1);
  } catch (e) {
    console.error('Failed to remove recent keyword:', e);
    // Remove from UI even if API fails
    recentKeywords.value.splice(idx, 1);
  }
};
// 최근검색어 전체삭제
const clearAllRecent = async () => {
  try {
    await guestPolicyAPI.clearAllRecentKeywords();
    recentKeywords.value = [];
  } catch (e) {
    console.error('Failed to clear all recent keywords:', e);
    recentKeywords.value = [];
  }
};

// 기본 필터(사용자 조건) 저장
const filterInitial = ref({
  marital: [],
  region: [],
  age: "",
  income: "",
  education: [],
  major: [],
  jobStatus: [],
  specialty: [],
});

//
const filterData = ref({ ...filterInitial.value });

// 게스트용 검색 payload (백엔드 SearchRequestDTO에 맞춰 매핑)
function buildGuestSearchPayload(searchTexts = []) {
  const f = filterData.value || {};
  return {
    searchTexts,
    regions: f.region || [],
    age: f.age || "",
    income: f.income || "",
    educationLevels: f.education || [],
    majors: f.major || [],
    employmentStatuses: f.jobStatus || [],
    specialConditions: f.specialty || [],
  };
}

const goBack = () => {
  router.back();
};

const search = async () => {
  const q = (searchQuery.value || "").trim();
  if (!q) return;
  const payload = buildGuestSearchPayload([q]);
  try {
    const { data } = await guestPolicyAPI.search(payload);
    router.push({
      name: "policySearchResult",
      query: {
        q,
        filter: encodeURIComponent(JSON.stringify(filterData.value)),
      },
      // 선택: 결과를 함께 넘기고 싶으면 state 사용 (결과 페이지에서 history.state로 접근)
      state: { results: data },
    });
  } catch (e) {
    console.error("게스트 검색 실패:", e);
  }
};

const fetchPopularKeywords = async () => {
  try {
    // 비로그인 전용 인기검색어 API 호출
    const res = await guestPolicyAPI.getPopularKeywords();
    const data = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res)
      ? res
      : [];
    popularKeywords.value = data ?? [];
  } catch (e) {
    console.error('Failed to fetch popular keywords:', e);
    // Guest API failure - use empty array
    popularKeywords.value = [];
  }
};

const fetchRecentKeywords = async () => {
  try {
    const res = await guestPolicyAPI.getUserPolicyRecentKeywords();
    const data = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res)
      ? res
      : [];
    recentKeywords.value = data ?? [];
  } catch (e) {
    // Guest user may get 401 error - silently handle
    recentKeywords.value = [];
  }
};

// 사용자 기본 필터 조건 불러오기 (비로그인 401 무시)
// const fetchUserPolicyFilter = async () => {
//   try {
//     const res = await guestPolicyAPI.getUserPolicy();
//     const d = (res?.data ?? res) || {};
//     Object.assign(filterInitial.value, {
//       marital: d.marriage ? [d.marriage] : [],
//       region: d.regions || [],
//       age: d.age ?? "",
//       income: d.income ?? "",
//       education: d.educationLevels || [],
//       major: d.majors || [],
//       jobStatus: d.employmentStatuses || [],
//       specialty: d.specialConditions || [],
//     });
//     Object.assign(filterData.value, filterInitial.value);
//   } catch (_) {
//     // 비로그인/404/401 등은 무시: 기본값 유지
//   }
// };

// 검색어 클릭 시 기본 필터 + 해당 검색어로 검색 결과 페이지 이동
async function searchWithKeyword(keyword) {
  const q = (keyword || "").trim();
  if (!q) return;
  const payload = buildGuestSearchPayload([q]);
  try {
    const { data } = await guestPolicyAPI.search(payload);
    router.push({
      name: "policySearchResult",
      query: {
        q,
        filter: encodeURIComponent(JSON.stringify(filterData.value)),
      },
      state: { results: data }, // 선택
    });
  } catch (e) {
    console.error("게스트 검색 실패:", e);
  }
}

onMounted(() => {
  fetchPopularKeywords();
  // fetchRecentKeywords();
  // fetchUserPolicyFilter();
});
</script>

<template>
  <div class="policySearchPage">
    <!-- <section class="section">
      <div class="recentHeader">
        <span class="title">최근 검색어</span>
        <button class="clearAllBtn" @click="clearAllRecent">전체 삭제</button>
      </div>
      <div class="chipList">
        <span
          class="chip"
          v-for="(item, idx) in recentKeywords.slice(0, 7)"
          :key="idx"
        >
          <span class="chipText" @click="searchWithKeyword(item)">{{
            item
          }}</span>
          <span class="deleteBtn" @click="removeRecent(idx)">
            <img src="@/assets/images/icons/common/x.png" alt="삭제" />
          </span>
        </span>
      </div>
    </section> -->

    <!-- 인기 검색어 -->
    <section class="section">
      <div class="title">인기 검색어</div>
      <div class="popularRankGrid">
        <div class="rankCol">
          <div
            class="popularItem"
            v-for="(item, i) in popularKeywords.slice(0, 5)"
            :key="i"
            @click="searchWithKeyword(item)"
          >
            <span class="number">{{ i + 1 }}</span>
            <span class="text">{{ item }}</span>
          </div>
        </div>
        <div class="rankCol">
          <div
            class="popularItem"
            v-for="(item, i) in popularKeywords.slice(5, 10)"
            :key="i + 5"
            @click="searchWithKeyword(item)"
          >
            <span class="number">{{ i + 6 }}</span>
            <span class="text">{{ item }}</span>
          </div>
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
  margin-bottom: 15px;
  background: #fff;
  border-radius: 12px;
  padding: 28px 24px 24px 24px;
}

.title {
  font-weight: bold;
  margin-bottom: 20px;
  font-size: 17px;
}

.chipList {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chipText {
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}
.chip {
  display: flex;
  align-items: center;
  background-color: var(--input-bg-1);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  color: var(--text-bluegray);
  gap: 4px;
  min-width: 40px;
}
.chip span:first-child {
  max-width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  vertical-align: middle;
}

.popularGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.popularItem {
  background-color: var(--input-bg-1);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
  max-width: 110px;
  overflow: hidden;
}
.popularItem .text {
  display: inline-block;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}
.number {
  font-weight: bold;
  color: var(--base-blue-dark);
}

.tip {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 14px;
}

.tipIcon {
  width: 24px;
  height: 24px;
}
.filterIcon {
  width: 24px;
  height: 24px;
}

.tipTitle {
  font-weight: bold;
  margin-bottom: 4px;
  font-size: 13px;
}

.tipText {
  margin: 0;
  font-size: 11px;
  color: var(--text-bluegray);
}

.recentHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.clearAllBtn {
  margin-top: -10px;
  background: none;
  border: none;
  color: #b0b0b0;
  font-size: 11px;
  cursor: pointer;
  padding: 0;
}
.deleteBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 2px;
  cursor: pointer;
}
.deleteBtn img {
  width: 11px;
  height: 11px;
  object-fit: contain;
  display: block;
}

.popularRankGrid {
  display: flex;
  gap: 10px;
}
.rankCol {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
