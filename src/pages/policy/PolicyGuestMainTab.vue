<template>
  <div class="policyWrapper">
    <!-- 검색바: 게스트 검색 페이지로 -->
    <div class="searchBar" @click="goGuestSearch" style="cursor: pointer">
      <img
        src="@/assets/images/icons/policy/search.png"
        alt="search"
        class="searchIconImage"
      />
      <input type="text" placeholder="정책 검색" class="fakeInput" readonly />
    </div>

    <template v-if="visiblePolicies.length">
      <div
        v-for="(p, i) in visiblePolicies"
        :key="p.policyId"
        class="policyCard"
        @click="goDetail(p.policyId)"
      >
        <div class="cardHeader">
          <span v-if="i < 3" class="topRank" :class="`rank${i + 1}`"
            >TOP {{ i + 1 }}</span
          >
          <div class="titleTagRow">
            <span class="cardTitle font-bold font-13">{{ p.title }}</span>
            <span
              v-for="tag in p.largeCategory"
              :key="tag"
              class="cardTag font-10"
              >{{ tag }}</span
            >
          </div>
        </div>
        <p class="cardDesc font-12">{{ p.policyBenefitDescription }}</p>
        <p class="cardDeadline font-10">
          <span class="label">신청기간 : </span>
          <span class="date font-bold">{{
            p.endDate ? formatPeriod(p.endDate) : "상시"
          }}</span>
        </p>
        <div class="cardActions">
          <button
            class="buttonSecondary font-12"
            @click.stop="goDetail(p.policyId)"
          >
            자세히 보기
          </button>
          <!-- 게스트는 신청 시 로그인 유도 -->
          <button class="buttonPrimary font-12" @click.stop="goLogin()">
            신청하기
          </button>
        </div>
      </div>
    </template>
    <template v-else>
      <div style="padding: 16px; color: var(--text-bluegray)">
        표시할 정책이 없습니다.
      </div>
    </template>

    <button
      v-if="showMoreBtn"
      class="moreButton font-bold font-14"
      @click="loadMore"
    >
      더 많은 정책 보기
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { guestPolicyAPI } from "@/api/guestPolicy";

const router = useRouter();
const policies = ref([]);

function normalize(list = []) {
  return list.map((p) => {
    const cats = Array.isArray(p.largeCategory)
      ? p.largeCategory
      : typeof p.largeCategory === "string" && p.largeCategory
      ? p.largeCategory
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    let endDate = p.endDate ?? "";
    if (typeof endDate === "string") {
      const digits = endDate.replace(/\D/g, "");
      if (digits.length === 8) endDate = digits;
    }
    return {
      policyId: p.policyId,
      title: p.title,
      policyBenefitDescription: p.policyBenefitDescription,
      endDate,
      largeCategory: cats,
      applyUrl: p.applyUrl,
      policyBenefitAmount: p.policyBenefitAmount ?? null,
    };
  });
}

onMounted(async () => {
  // 조건 없이 is_financial_support=1 TopN (백엔드 기본 로직)
  const { data } = await guestPolicyAPI.getTopByViewsAll(20);
  const list = Array.isArray(data) ? data : data?.content || data?.items || [];
  policies.value = normalize(list ?? []);
});

const policiesToShow = ref(3);
const visiblePolicies = computed(() =>
  (policies.value || []).slice(0, policiesToShow.value)
);
const showMoreBtn = computed(
  () => policiesToShow.value < (policies.value?.length || 0)
);
const loadMore = () => {
  policiesToShow.value = Math.min(
    policiesToShow.value + 5,
    policies.value.length
  );
};

const goGuestSearch = () => router.push({ name: "policySearchGuest" });
const goDetail = (policyId) =>
  router.push({ name: "policyDetail", params: { policyId } });
const goLogin = () =>
  router.push({
    name: "login",
    query: { redirect: router.currentRoute.value.fullPath },
  });

function formatPeriod(periodStr) {
  const m = String(periodStr).match(/^(\d{8})\s*~\s*(\d{8})$/);
  if (!m)
    return typeof periodStr === "string" && periodStr.length === 8
      ? `${periodStr.slice(0, 4)}.${periodStr.slice(4, 6)}.${periodStr.slice(
          6,
          8
        )}`
      : periodStr;
  const [_, s, e] = m;
  return `${s.slice(0, 4)}.${s.slice(4, 6)}.${s.slice(6, 8)} ~ ${e.slice(
    0,
    4
  )}.${e.slice(4, 6)}.${e.slice(6, 8)}`;
}
</script>

<style scoped>
/* 기존 PolicyMainTab 스타일 재사용 가능 — 필요 부분만 발췌 */
.policyWrapper {
  background: var(--input-bg-2);
}
.searchBar {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid var(--input-outline-2);
  border-radius: 6px;
  padding: 7px 14px;
  margin-bottom: 15px;
  gap: 6px;
}
.searchIconImage {
  width: 16px;
  height: 16px;
}
.fakeInput {
  pointer-events: auto;
  border: none;
  outline: none;
  flex: 1;
  font-size: 13px;
  background: transparent;
}
.policyCard {
  background: #fff;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
  cursor: pointer;
}
.cardHeader {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 6px;
  width: 100%;
  min-width: 0;
}
.titleTagRow {
  display: flex;
  align-items: center;
  min-width: 0;
  flex: 1;
  gap: 4px;
}
.cardTitle {
  color: var(--text-login);
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 60px);
}
.cardTag {
  display: inline-block;
  background: var(--input-outline);
  color: var(--text-bluegray);
  padding: 1px 5px;
  border-radius: 6px;
  margin-left: 1px;
  font-size: 10px;
  white-space: nowrap;
  flex-shrink: 0;
}
.cardDesc {
  color: var(--text-bluegray);
  margin: 4px 0;
}
.cardDeadline {
  margin-bottom: 11px;
}
.cardDeadline .label {
  color: var(--text-bluegray);
  margin-right: 3px;
}
.cardDeadline .date {
  color: var(--base-blue-dark);
  font-size: 11px;
}
.cardActions {
  display: flex;
  gap: 6px;
}
.buttonSecondary,
.buttonPrimary {
  flex: 1;
}
.buttonSecondary {
  background: var(--input-bg-2);
  border: none;
  padding: 10px;
  border-radius: 6px;
  color: var(--text-bluegray);
}
.buttonPrimary {
  background: var(--base-blue-dark);
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 6px;
}
.moreButton {
  width: 100%;
  height: 45px;
  padding: 10px;
  background: #fff;
  border: none;
  color: var(--base-blue-dark);
  border-radius: 6px;
  border: 1px solid var(--input-outline);
}
.topRank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  border-radius: 999px;
  width: 40px;
  height: 22px;
  color: #fff;
  letter-spacing: -0.5px;
  margin-right: 2px;
  flex-shrink: 0;
}
.rank1 {
  background: var(--top-rank-1);
}
.rank2 {
  background: var(--top-rank-2);
}
.rank3 {
  background: var(--top-rank-3);
}
</style>
