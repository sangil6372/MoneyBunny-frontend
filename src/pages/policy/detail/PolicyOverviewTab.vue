<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { fetchCardTransportationFees } from "@/api/assetApi";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLogin); // 또는 getToken() 여부

const props = defineProps({
  description: String,
  supportContent: String,
  applyPeriod: String,
  policyId: Number,
});

const formatPeriod = (periodStr) => {
  if (!periodStr) return "상시";
  const match = periodStr.match(/^(\d{8})\s*~\s*(\d{8})$/);
  if (!match) return periodStr;
  const [_, start, end] = match;
  const s = `${start.slice(0, 4)}.${start.slice(4, 6)}.${start.slice(6, 8)}`;
  const e = `${end.slice(0, 4)}.${end.slice(4, 6)}.${end.slice(6, 8)}`;
  return `${s} ~ ${e}`;
};

// 줄바꿈 분리 함수
const splitLines = (str) =>
  str ? str.split("\n").filter((s) => s.trim() !== "") : [];

// K패스/기후동행카드 혜택 금액 관련 상태
const kpassBenefit = ref(null);
const kpassLoading = ref(false);

// k패스 비로그인 화면 처리
const requiresLogin = ref(false); // 401 여부
const benefitError = ref(null); // 그 외 에러 메시지

// 로그인 && 해당 정책일 때만 보이게
const showBenefitSection = computed(
  () => isLoggedIn.value && [3167, 423, 3589].includes(props.policyId)
);

const calcKpassBenefit = (amount) => {
  if (amount < 23250) return 0;
  return Math.floor(amount * 0.3);
};

const calcClimateBenefit = (amount) => {
  const benefit = amount - 55000;
  return benefit > 0 ? benefit : 0;
};

// 3589: 93000원 미만은 K패스 방식, 93000원 이상은 93000원의 30%만 혜택
const calcSpecialKpassBenefit = (amount) => {
  if (amount < 93000) return calcKpassBenefit(amount);
  return Math.floor(93000 * 0.3);
};

// 월별로 거래내역을 합산하는 함수
function groupByMonth(transactions, policyId) {
  const result = {};
  transactions.forEach((tx) => {
    const date = new Date(tx.transactionDate);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    if (!result[month]) result[month] = 0;
    result[month] += tx.amount;
  });
  return Object.entries(result).map(([month, amount]) => {
    if (policyId === 423) {
      // 서울: 기후동행카드
      return {
        month,
        amount,
        benefit: calcClimateBenefit(amount),
      };
    } else if (policyId === 3589) {
      // 경기: 경기 K패스
      return {
        month,
        amount,
        benefit: calcSpecialKpassBenefit(amount),
      };
    } else if (policyId === 3167) {
      // 그 외: K패스
      return {
        month,
        amount,
        benefit: calcKpassBenefit(amount),
      };
    }
    return { month, amount, benefit: 0 };
  });
}

const loadKpassBenefit = async () => {
  kpassLoading.value = true;

  // 비로그인 처리
  requiresLogin.value = false;
  benefitError.value = null;

  if (!isLoggedIn.value) {
    kpassBenefit.value = [];
    requiresLogin.value = true;
    kpassLoading.value = false;
    return;
  }

  try {
    const res = await fetchCardTransportationFees();
    const transactions = res.data || [];
    kpassBenefit.value = groupByMonth(transactions, props.policyId);
  } catch (e) {
    // kpassBenefit.value = [];
    // 401이면 로그인 필요 플래그만 세우고 조용히 빈 데이터
    if (e?.response?.status === 401) {
      requiresLogin.value = true;
      kpassBenefit.value = [];
    } else {
      benefitError.value =
        "일시적 오류가 발생했어요. 잠시 후 다시 시도해주세요.";
      kpassBenefit.value = [];
      // console.error('[KPASS] load error', e);  // 필요 시 로깅
    }
  }
  kpassLoading.value = false;
};

onMounted(() => {
  if (
    props.policyId === 3167 ||
    props.policyId === 423 ||
    props.policyId === 3589
  ) {
    // loadKpassBenefit();
    // 로그인 아닐 땐 즉시 requiresLogin 표시하고 호출 생략
    if (!isLoggedIn.value) {
      requiresLogin.value = true;
      kpassBenefit.value = [];
      return;
    }
    loadKpassBenefit();
  }
});

watch(
  () => props.policyId,
  (val) => {
    // if (val === 3167 || val === 423) {
    //   loadKpassBenefit();
    // }
    if ([3167, 423, 3589].includes(val)) {
      // loadKpassBenefit();
      if (!isLoggedIn.value) {
        requiresLogin.value = true;
        kpassBenefit.value = [];
        return;
      }
      loadKpassBenefit();
    } else {
      // 해당 정책이 아니면 섹션 비우기
      kpassBenefit.value = [];
      requiresLogin.value = false;
      benefitError.value = null;
    }
  }
);

// ▼ 월별 혜택 요약/펼치기 상태
const isBenefitOpen = ref(false);
const recentCount = 6; // 6개월로 변경
const monthLabel = (ym) => `${Number(ym.split("-")[1])}월 혜택`;
const fmt = (n) => (n ?? 0).toLocaleString();

// 최근 N개월 평균/기간 계산
const benefitSummary = computed(() => {
  const list = (kpassBenefit.value || [])
    .slice()
    .sort((a, b) => a.month.localeCompare(b.month));
  if (!list.length) {
    return { label: `최근 ${recentCount}개월 평균`, period: "—", avg: 0 };
  }
  const tail = list.slice(-recentCount);
  const avg = Math.round(
    tail.reduce((s, x) => s + (x.benefit || 0), 0) / tail.length
  );
  const start = tail[0].month.split("-");
  const end = tail[tail.length - 1].month.split("-");
  const period = `${start[0]}년 ${Number(start[1])}월 ~ ${end[0]}년 ${Number(
    end[1]
  )}월`;
  return { label: `최근 ${tail.length}개월 평균`, period, avg };
});
</script>

<template>
  <div class="tabContent">
    <div class="font-bold font-15 mb-2">정책 설명</div>
    <div class="font-12 text-bluegray mb-4">
      <template v-for="(line, idx) in splitLines(description)" :key="idx">
        <span>{{ line }}</span
        ><br v-if="idx !== splitLines(description).length - 1" />
      </template>
    </div>

    <div class="font-bold font-15 mb-2">지원 내용</div>
    <div class="supportBox">
      <template v-for="(line, idx) in splitLines(supportContent)" :key="idx">
        <span class="font-11 text-bluegray">{{ line }}</span
        ><br v-if="idx !== splitLines(supportContent).length - 1" />
      </template>
    </div>

    <div class="font-15 font-bold mb-2 mt-4">신청 기간</div>
    <div class="periodBox">
      <img
        src="@/assets/images/icons/policy/calendar.png"
        alt="달력"
        class="calendarIcon"
      />
      <div class="periodContent">
        <div class="periodText font-12 font-bold">
          {{ formatPeriod(applyPeriod) }}
        </div>
        <span v-if="!applyPeriod" class="periodSub font-11">
          연중 상시 접수 (예산 소진 시 조기 마감)
        </span>
      </div>
    </div>

    <!-- K패스/기후동행카드 혜택 금액 카드 -->
    <!-- <div
      v-if="[3167, 423, 3589].includes(policyId)"
      class="kpassBenefitBox mb-4"
    >
      <div class="font-bold font-14 mb-2">
        {{
          policyId === 3167
            ? 'K패스 월별 혜택 금액'
            : policyId === 423
            ? '기후동행카드 월별 혜택 금액'
            : 'K패스 월별 혜택 금액'
        }}
      </div>
      <div v-if="kpassLoading" class="font-12 text-bluegray">
        불러오는 중...
      </div>
      <div v-else>
        <template v-if="kpassBenefit && kpassBenefit.length">
          <div
            v-for="item in kpassBenefit"
            :key="item.month"
            class="kpassBenefitItem"
          >
            <span class="font-11">{{ item.month }}</span>
            <span class="font-11 ml-2"
              >총 이용금액: {{ item.amount.toLocaleString() }}원</span
            >
            <span class="font-11 ml-2 font-bold text-green">
              혜택금액: {{ item.benefit.toLocaleString() }}원
            </span>
          </div>
        </template>
        <div v-else class="font-11 text-bluegray">교통 사용 내역 없음</div>
      </div>
    </div> -->
    <!-- K패스/기후동행카드 혜택 금액 (요약 + 펼치기) -->
    <div v-if="showBenefitSection" class="benefitSection">
      <div class="sectionHeaderRow">
        <div class="sectionTitle">월별 혜택 금액</div>
        <button class="toggleBtn" @click="isBenefitOpen = !isBenefitOpen">
          {{ isBenefitOpen ? "접기" : "자세히 보기" }}
          <span :class="['chev', { open: isBenefitOpen }]">▾</span>
        </button>
      </div>

      <!-- 요약 카드 -->
      <div class="benefitSummaryCard">
        <div class="summaryLeft">
          <div class="summaryTitle">{{ benefitSummary.label }}</div>
          <div class="summaryPeriod">{{ benefitSummary.period }}</div>
        </div>
        <div class="summaryValue">{{ fmt(benefitSummary.avg) }}원</div>
      </div>

      <!-- 펼친 목록 -->
      <transition name="fade">
        <div v-if="isBenefitOpen" class="benefitDetailList">
          <template v-if="kpassBenefit && kpassBenefit.length">
            <div
              v-for="item in kpassBenefit"
              :key="item.month"
              class="detailRow"
            >
              <span class="detailMonth">{{ monthLabel(item.month) }}</span>
              <span class="detailValue">{{ fmt(item.benefit) }}원</span>
            </div>
          </template>
          <div v-else class="emptyBox">교통 사용 내역 없음</div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.tabContent {
  background-color: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 80px;
}
.supportBox {
  background-color: var(--input-bg-2);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  min-height: 50px;
}
.supportTitle {
  margin-bottom: 8px;
}
.text-bluegray {
  color: var(--text-bluegray);
}
.mb-1 {
  margin-top: 3px;
  margin-bottom: 8px;
}
.mb-2 {
  margin-bottom: 10px;
}
.mb-4 {
  margin-bottom: 16px;
}
.mt-4 {
  margin-top: 24px;
}
.periodBox {
  display: flex;
  align-items: flex-start;
  background-color: var(--input-bg-2);
  border-radius: 6px;
  padding: 12px;
  gap: 10px;
}
.calendarIcon {
  width: 16px;
  height: 16px;
  /* margin-top: 3px; */
  flex-shrink: 0;
}
.periodContent {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.periodText {
  /* line-height: 2; */
  color: var(--text-default);
  margin-bottom: 4px;
}
.periodSub {
  display: block;
  color: var(--text-bluegray);
  /* line-height: 1.6; */
  margin-left: 0;
}
.kpassBenefitBox {
  background: #f7f9fa;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
}
.kpassBenefitItem {
  margin-bottom: 8px;
}
.text-green {
  color: #2db400;
}
.ml-2 {
  margin-left: 8px;
}

/* 월별 혜택 섹션 */
.benefitSection {
  margin-top: 16px;
}
.sectionHeaderRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.sectionTitle {
  font-weight: bold;
  font-size: 14px;
  color: var(--text-default);
}
.toggleBtn {
  background: none;
  border: none;
  padding: 4px 4px;
  color: var(--base-blue-dark);
  font-size: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.chev {
  display: inline-block;
}
.chev.open {
  transform: rotate(180deg);
}

.benefitSummaryCard {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--input-bg-2);
  border-radius: 6px;
  padding: 14px;
}
.summaryLeft {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.summaryTitle {
  font-weight: bold;
  font-size: 12px;
  color: var(--text-default);
}
.summaryPeriod {
  font-size: 11px;
  color: var(--text-bluegray);
}
.summaryValue {
  font-size: 18px;
  font-weight: bold;
  color: #2b446b;
}

.benefitDetailList {
  background-color: var(--input-bg-2);
  border-radius: 6px;
  margin-top: 8px;
  padding: 10px;
}
.detailRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 8px;
  font-size: 12px;
}
.detailRow + .detailRow {
  border-top: 1px solid #eef1f5;
}
.detailMonth {
  color: var(--text-default);
}
.detailValue {
  font-weight: bold;
  color: #2b446b;
}

.emptyBox {
  background: #fff;
  border: 1px dashed #e2e8f0;
  color: var(--text-bluegray);
  font-size: 11px;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
}
</style>
