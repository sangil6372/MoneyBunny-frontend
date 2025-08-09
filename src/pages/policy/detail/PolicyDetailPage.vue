<script setup>
import { ref, computed, watchEffect, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { policyAPI } from "@/api/policy"; // 변경: policyAPI import
// 💪(상일) 정책 신청 기능
import { policyInteractionAPI } from "@/api/policyInteraction";

import PolicyHeader from "./PolicyHeader.vue";
import PolicyTab from "./PolicyTabs.vue";
import PolicyTabContent from "./PolicyTabContent.vue";
import PolicyConditionTab from "./PolicyConditionTab.vue";
import PolicyApplyTab from "./PolicyApplyTab.vue";
// 💪(상일) 신청 상태 모달
import PolicyApplyStatusModal from "../component/PolicyApplyStatusModal.vue";

// 실제 데이터(예시)
const ALL_POLICIES = [
  {
    policyId: 202,
    title: "2025년 청년사회진입 활동지원사업",
    description: "청년 사회진입 활동을 지원하는 정책",
    tags: ["청년"],
    supportAmount: "일시금 30만원 지급",
    objective: "청년의 사회진입을 돕기 위한 지원사업입니다.",
    supportDetails: [{ title: "현금 지원", desc: "30만원 일시금 지급" }],
    relatedPolicies: [
      { title: "청년내일채움공제", desc: "청년 장기근속 지원" },
    ],
  },
  {
    policyId: 5,
    title: "2025년 청년도전지원사업(원주시)",
    description: "청년의 도전을 지원하는 원주시 청년 대상 정책",
    tags: ["청년"],
    supportAmount: "최대 35만원 일시금 지급",
    objective: "청년들의 자기계발 및 사회진입을 위한 일시금 지원 정책",
    supportDetails: [{ title: "일시금 지원", desc: "최대 35만원 일시금 지급" }],
    relatedPolicies: [
      {
        title: "청년사회진입 활동지원사업",
        desc: "청년 사회진입을 위한 활동 지원",
      },
    ],
    endDate: "20250721 ~ 20250930",
  },
  {
    policyId: 1135,
    title:
      "[밀알복지재단] 경기도 저출생 위기극복 지원사업  ‘우리가족, 함께 기대’",
    description: "경기도 내 저출생 위기 극복을 위한 임산부 건강검진 지원사업",
    tags: ["육아"],
    supportAmount: "임산부 건강검진비 최대 100만원 지원",
    objective: "저출생 위기 가정에 건강검진비 지원을 통해 출산을 장려하는 사업",
    supportDetails: [
      { title: "건강검진비 지원", desc: "임산부 건강검진비 최대 100만원 지원" },
    ],
    relatedPolicies: [
      { title: "임신축하금 지원사업", desc: "임신 가정에 축하금 10만원 지급" },
    ],
    endDate: "20240911 ~ 20250831",
  },
];

const route = useRoute();
const router = useRouter();

function goPolicyTypeTest() {
  // 예시: 정책 유형 검사 첫 화면으로 이동
  router.push({ name: "policyTypeIntro" }); // 라우터 이름에 맞게 수정!
}
function goAllPolicy() {
  router.push({ name: "policyList" }); // 라우터 이름에 맞게 수정!
}

const selectedTab = ref("정책 개요");

// 라우터 param에서 policyId 추출 (문자일 수도 있으니 숫자 변환)
const policyId = computed(() =>
  Number(route.params.policyId || route.params.id)
);

// API에서 받아온 정책 데이터 저장
const policyData = ref(null);

// 💪(상일) 미완료 신청 체크용
const currentApplication = ref(null);
const showStatusModal = ref(false);

// 정책 상세 API 호출
async function fetchPolicyDetail(id) {
  try {
    const res = await policyAPI.getPolicyDetail(id); // 변경: policyAPI 사용
    policyData.value = res.data;
  } catch (e) {
    policyData.value = null;
  }
}

// policyId가 바뀔 때마다 API 호출
watchEffect(() => {
  if (policyId.value) {
    fetchPolicyDetail(policyId.value);
  }
});

// 기존 ALL_POLICIES에서 찾는 로직은 유지 (예시 데이터)
const policy = computed(() =>
  policyData.value
    ? policyData.value
    : ALL_POLICIES.find((p) => p.policyId === policyId.value)
);

// supportContent 값 로그 출력
watchEffect(() => {
  if (policy.value) {
    console.log(
      "PolicyDetailPage에서 넘기는 policy.supportContent:",
      policy.value.supportContent
    );
  }
});
// 기간 문자열 추출 (endDate 필드)
const period = computed(() => policy.value?.endDate || "");

// 💪(상일) 미완료 신청 체크
const checkIncompleteApplication = async () => {
  try {
    const response = await policyInteractionAPI.getIncompleteApplication();
    if (response.data) {
      currentApplication.value = response.data;
      showStatusModal.value = true;
    }
  } catch (error) {
    // 404는 미완료 신청이 없는 정상 상황
    if (error.response?.status !== 404) {
      console.error("미완료 신청 조회 실패:", error);
    }
  }
};

// 💪(상일) 모달 응답 처리
const handleStatusSubmit = async (status) => {
  if (!currentApplication.value) return;

  try {
    switch (status) {
      case "applied":
        // 신청 완료 처리
        await policyInteractionAPI.completeApplication(
          currentApplication.value.policyId
        );
        break;

      case "notYet":
        // 신청 기록 삭제
        await policyInteractionAPI.removeApplication(
          currentApplication.value.policyId
        );
        break;

      case "notEligible":
        // 💪(상일) 조건 미충족으로 신청 불가한 경우 신청 기록 삭제
        await policyInteractionAPI.removeApplication(
          currentApplication.value.policyId
        );
        break;
    }
  } catch (error) {
    console.error("신청 상태 처리 실패:", error);
  } finally {
    currentApplication.value = null;
    showStatusModal.value = false;
  }
};

// 💪(상일) 신청 후 즉시 상태 모달 표시
const handleShowStatusModal = (applicationData) => {
  // 현재 신청 정보 설정
  currentApplication.value = applicationData;
  showStatusModal.value = true;
};

// 💪(상일) iOS 카카오톡 인앱 Safari 안내 표시 상태
const showSafariGuide = ref(false);

// 💪(상일) 컴포넌트 마운트 시 카카오톡 인앱 브라우저 감지 및 처리
onMounted(async () => {
  // 💪(상일) 공유 링크로 진입 + 카카오톡 인앱 브라우저인 경우
  if (route.query.from === "share" && /KAKAOTALK/i.test(navigator.userAgent)) {
    // ?from=share 파라미터 제거한 URL
    const currentUrl = window.location.href.replace(/[?&]from=share/, "");

    // 💪(상일) Android와 iOS 구분 처리
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isAndroid) {
      // Android: 카카오톡 스킴으로 외부 브라우저 열기 (Chrome 또는 기본 브라우저)
      window.location.href =
        "kakaotalk://web/openExternal?url=" + encodeURIComponent(currentUrl);
      return;
    } else if (isIOS) {
      // iOS: Safari 안내 메시지 표시
      showSafariGuide.value = true;
    }
  }

  // 기존 로직 - 미완료 신청 체크
  await checkIncompleteApplication();
});
</script>

<template>
  <div class="policyDetailPage" v-if="policy">
    <PolicyHeader
      :title="policy.title"
      :description="policy.policyBenefitDescription"
      :policy="policy"
      @showStatusModal="handleShowStatusModal"
    />

    <div class="contentBox">
      <PolicyTab v-model:selectedTab="selectedTab" />
      <PolicyTabContent :policy="policy" :tab="selectedTab">
        <template #overview>
          <PolicyTabContent
            :policy="policy"
            :period="policy.endDate"
            :tab="selectedTab"
          />
        </template>
        <template #condition>
          <PolicyConditionTab :policy="policy" />
        </template>
        <template #apply> <PolicyApplyTab :policy="policy" /> </template>
      </PolicyTabContent>
    </div>
  </div>
  <div v-else class="noData">정책 정보를 찾을 수 없습니다.</div>

  <!-- 💪(상일) iOS Safari 열기 안내 -->
  <div v-if="showSafariGuide" class="safari-guide">
    Safari 브라우저로 이용해주세요.
  </div>

  <!-- 💪(상일) 정책신청현황 모달 -->
  <PolicyApplyStatusModal
    v-model="showStatusModal"
    :policyTitle="currentApplication?.title || ''"
    @submit="handleStatusSubmit"
    @later="
      () => {
        showStatusModal = false;
      }
    "
  />
</template>

<style scoped>
.policyDetailPage {
  background-color: var(--input-bg-2);
}

.contentBox {
  background-color: white;
  border-radius: 12px;
  padding: 10px;
  margin: 26px 0;
}

.noData {
  padding: 40px;
  text-align: center;
  color: gray;
}

/* 💪(상일) iOS Safari 열기 안내 스타일 */
.safari-guide {
  position: fixed;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  background: #f0f0f0;
  color: #666;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  z-index: 100;
}
</style>
