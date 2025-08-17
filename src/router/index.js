import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { policyAPI } from "@/api/policy";
// 🛠️ 제승 추가: api import

// ─── 레이아웃 ──────────────────────────────
import DefaultLayout from "@/components/layouts/DefaultLayout.vue";

//
// ─── 인증 / 회원 관련 페이지 ───────────────────────────
import LoginPage from "@/pages/auth/LoginPage.vue";
import FindIdPage from "@/pages/auth/FindIdPage.vue";
import FindPasswordPage from "@/pages/auth/FindPasswordPage.vue";
import SignUpEmailRequestPage from "@/pages/auth/SignUpEmailRequestPage.vue";
import SignUpProfilePage from "@/pages/auth/SignUpProfilePage.vue";
import FindIdResultPage from "@/pages/auth/FindIdResultPage.vue";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage.vue";
import AttendanceCheckModal from "@/pages/auth/AttendanceCheckModal.vue";
import FindIdCodePage from "@/pages/auth/FindIdCodePage.vue";
import FindPasswordCodePage from "@/pages/auth/FindPasswordCodePage.vue";
import SignUpEmailCodePage from "@/pages/auth/SignUpEmailCodePage.vue";

//
// ─── 마이페이지 관련 ──────────────────────────────────
import MypageMain from "@/pages/mypage/MypageMain.vue";
import SettingMain from "@/pages/mypage/settings/SettingMain.vue";
import ChangePassword from "@/pages/mypage/settings/ChangePassword.vue";
import PolicyRetestPage from "@/pages/mypage/settings/PolicyRetestPage.vue";
// 💪(상일) 알림 설정은 모달로 변경됨

//
// ─── 탭 메인 페이지 ────────────────────────────────────
import HomeMainPage from "@/pages/home/HomeMainPage.vue"; // 홈메인
import AssetMain from "@/pages/asset/AssetMain.vue"; //🥕성빈: 자산 메인탭
import PolicyMainTab from "@/pages/policy/PolicyMainTab.vue";
import PolicyGuestMainTab from "@/pages/policy/PolicyGuestMainTab.vue"; // 🎵(유정) 게스트 로그인 정책탭
import NotificationCenter from "@/pages/notification/NotificationCenter.vue";

//
// ─── 정책 추천 흐름 ────────────────────────────────────
import PolicyTypeIntro from "@/pages/policy/recommend/PolicyTypeIntro.vue";
import PolicyIntroForm from "@/pages/policy/recommend/PolicyIntroForm.vue";
import PolicyQuizStep1 from "@/pages/policy/recommend/PolicyQuizStep1.vue";
import PolicyQuizStep2 from "@/pages/policy/recommend/PolicyQuizStep2.vue";
import PolicyQuizStep3 from "@/pages/policy/recommend/PolicyQuizStep3.vue";
import PolicyQuizStep4 from "@/pages/policy/recommend/PolicyQuizStep4.vue";
import PolicyQuizStep5 from "@/pages/policy/recommend/PolicyQuizStep5.vue";
import PolicyResultSummary from "@/pages/policy/recommend/PolicyResultSummary.vue";

import PolicyDetailPage from "@/pages/policy/detail/PolicyDetailPage.vue";
import PolicySearchPage from "@/pages/policy/search/PolicySearchPage.vue";
import PolicySearchResult from "@/pages/policy/search/PolicySearchResult.vue";
import PolicyReviewPage from "@/pages/policy/review/PolicyReviewPage.vue";

// 💪(상일) 관리자 페이지 import
import AdminPage from "@/pages/admin/AdminPage.vue";

// 비로그인 정책 조회 페이지
import PolicySearchGuestPage from "@/pages/policy/search/PolicySearchGuestPage.vue";

// 게스트 접근
import HomeGuestPanel from "@/pages/home/HomeGuestPanel.vue";
// import GuestGatePage from "@/pages/home/GuestGatePage.vue";
const routes = [
  //
  // ─── 인증 관련 ──────────────────────────────────────
  { path: "/", name: "login", component: LoginPage },
  { path: "/findId", name: "findId", component: FindIdPage },
  { path: "/findPassword", name: "findPassword", component: FindPasswordPage },
  {
    path: "/signUpEmailRequest",
    name: "signUpEmailRequest",
    component: SignUpEmailRequestPage,
  },
  {
    path: "/signUpProfile",
    name: "signUpProfile",
    component: SignUpProfilePage,
  },
  {
    path: "/resetPassword",
    name: "resetPassword",
    component: ResetPasswordPage,
  },
  { path: "/findIdResult", name: "findIdResult", component: FindIdResultPage },
  {
    path: "/attendanceCheck",
    name: "attendanceCheck",
    component: AttendanceCheckModal,
  },
  {
    path: "/findIdCode",
    name: "findIdCode",
    component: FindIdCodePage,
  },
  {
    path: "/findPasswordCode",
    name: "findPasswordCode",
    component: FindPasswordCodePage,
  },
  {
    path: "/resetPassword",
    name: "resetPassword",
    component: ResetPasswordPage,
  },
  {
    path: "/signUpEmailCode",
    name: "signUpEmailCode",
    component: SignUpEmailCodePage,
  },
  //
  // ─── 마이페이지 ─────────────────────────────────────
  { path: "/mypage/settings", name: "myPageSettings", component: SettingMain },
  {
    path: "/mypage/settings/changePassword",
    name: "changePassword",
    component: ChangePassword,
  },

  // ─── 기본 레이아웃 하위 라우트 ─────────
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { path: "", redirect: "/home" },
      { path: "home", name: "home", component: HomeMainPage },
      { path: "asset", name: "asset", component: AssetMain },
      //  🥕성빈: 경로 수정(0801)

      // {
      //   path: 'account/:id',
      //   name: 'AccountDetail',
      //   component: () =>
      //     import('@/pages/asset/component/account/AccountDetail.vue'),
      //   props: true,
      // },

      { path: "mypage", name: "mypage", component: MypageMain },
      {
        path: "mypage/settings",
        name: "myPageSettings",
        component: SettingMain,
      },
      {
        path: "mypage/settings/changePassword",
        name: "changePassword",
        component: ChangePassword,
      },
      {
        path: "mypage/settings/policy",
        name: "myPageSettingsPolicy",
        component: PolicyRetestPage,
      },
      // 💪(상일) 알림 센터 라우트
      {
        path: "notification",
        name: "notification",
        component: NotificationCenter,
      },

      // 정책 추천 플로우
      {
        path: "policy",
        name: "policyTypeIntro",
        component: PolicyTypeIntro,
      },
      {
        path: "policy/form",
        name: "policyIntroForm",
        component: PolicyIntroForm,
      },
      { path: "policy/main", name: "policyMain", component: PolicyMainTab },
      {
        path: "policy/guest",
        name: "policyGuestMainTab",
        component: PolicyGuestMainTab,
      },
      {
        path: "policy/quiz/step1",
        name: "policyQuizStep1",
        component: PolicyQuizStep1,
      },
      {
        path: "policy/quiz/step2",
        name: "policyQuizStep2",
        component: PolicyQuizStep2,
      },
      {
        path: "policy/quiz/step3",
        name: "policyQuizStep3",
        component: PolicyQuizStep3,
      },
      {
        path: "policy/quiz/step4",
        name: "policyQuizStep4",
        component: PolicyQuizStep4,
      },
      {
        path: "policy/quiz/step5",
        name: "policyQuizStep5",
        component: PolicyQuizStep5,
      },
      {
        path: "policy/quiz/result",
        name: "policyResultSummary",
        component: PolicyResultSummary,
      },
      {
        path: "policy/:policyId",
        name: "policyDetail",
        component: PolicyDetailPage,
        props: true,
      },
      {
        path: "/policy/:policyId/reviews",
        name: "policyReviewPage",
        component: PolicyReviewPage,
      },
      {
        path: "policy/search",
        name: "policySearch",
        component: PolicySearchPage,
      },
      {
        path: "policy/search/result",
        name: "policySearchResult",
        component: PolicySearchResult,
      },
      // 💪(상일) 관리자 페이지 라우트
      {
        path: "admin",
        name: "admin",
        component: AdminPage,
      },
      // 비로그인 정책 조회 페이지
      {
        path: "policy/search/guest",
        name: "policySearchGuest",
        component: PolicySearchGuestPage,
      },

      // 게스트 패널
      {
        path: "/guest",
        name: "guest",
        component: HomeGuestPanel, // 단독 페이지로 사용
        props: {
          loginRouteName: "login",
          signupRouteName: "signUpEmailRequest",
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 💪(상일) 라우터 이동 시 스크롤 위치 제어
  scrollBehavior(to, from, savedPosition) {
    // #app 요소의 스크롤을 직접 제어
    const app = document.querySelector("#app");

    if (savedPosition && app) {
      // 뒤로가기 시 저장된 위치로 복원
      app.scrollTop = savedPosition.top || 0;
      return;
    }

    if (to.hash) {
      // 해시 링크가 있는 경우
      const element = document.querySelector(to.hash);
      if (element && app) {
        app.scrollTop = element.offsetTop;
      }
      return;
    }

    // 새로운 페이지로 이동 시 최상단으로
    if (app) {
      app.scrollTop = 0;
    }
  },
});

// 인증 가드
router.beforeEach(async (to, from, next) => {
  // 💪(상일) 관리자 페이지 접근 제어
  if (to.name === "admin" || to.path === "/admin") {
    const authStore = useAuthStore();
    
    // 로그인 확인
    if (!authStore.isLogin) {
      console.warn("관리자 페이지: 로그인 필요");
      return next("/");
    }
    
    // 사용자 이메일 확인
    try {
      const response = await fetch("/api/member/information", {
        headers: {
          Authorization: `Bearer ${authStore.getToken()}`,
        },
      });
      
      if (!response.ok) {
        console.warn("관리자 페이지: 사용자 정보 조회 실패");
        return next("/home");
      }
      
      const userData = await response.json();
      if (userData.email !== "sangil6372@naver.com") {
        console.warn("관리자 페이지: 접근 권한 없음");
        return next("/home");
      }
      
      // 권한 있는 사용자는 통과
      return next();
    } catch (error) {
      console.error("관리자 페이지 권한 확인 실패:", error);
      return next("/home");
    }
  }

  // 리뷰 페이지는 비로그인 허용
  if (to.name === "policyReviewPage") {
    return next();
  }

  if (to.name === "policyGuestMainTab") return next();
  // 정책 상세는 비로그인 허용
  if (/^\/policy\/\d+$/.test(to.path)) {
    return next();
  }
  // 정책 검색 페이지/결과도 비로그인 허용
  if (
    to.name === "policySearch" ||
    to.name === "policySearchResult" ||
    to.name === "policySearchGuest"
  ) {
    return next();
  }

  // 🛠️ 제승 추가: 정책 메인 접근 전 조건 체크 네비게이션 가드
  if (to.path === "/policy" || to.path === "/policy/main") {
    const authStore = useAuthStore();
    // 비로그인: 조건 검사 생략하고 메인 탭으로 진입 허용
    if (!authStore.isLogin) {
      // 게스트는 전용 메인으로
      return to.name === "policyGuestMainTab" || to.path === "/policy/guest"
        ? next()
        : next("/policy/guest");
    }
    // 로그인: 기존 로직 유지 (설문 유무에 따라 /policy vs /policy/main 라우팅)
    try {
      const res = await policyAPI.getUserPolicy(true); // 캐시 무효화
      if (res.data && Object.keys(res.data).length > 0) {
        if (to.path !== "/policy/main") return next("/policy/main");
        return next();
      } else {
        if (to.path !== "/policy") return next("/policy");
        return next();
      }
    } catch (e) {
      if (to.path !== "/policy") return next("/policy");
      return next();
    }
  }

  const authStore = useAuthStore();
  const publicPages = [
    "/",
    // 아이디 찾기: 아이디 찾기 - 인증코드 전송 - 아이디 찾기 결과
    "/findId",
    "/findIdCode",
    "/findIdResult",

    // 비밀번호 찾기: 비밀번호 찾기 - 인증코드 전송 - 비밀번호 재설정
    "/findPassword",
    "/findPasswordCode",
    "/resetPassword",

    // 회원 가입
    "/signUpEmailRequest",
    "/signUpEmailCode",
    "/signUpProfile",

    // 정책 상세 페이지, 검색페이지 (공유)
    "/policy/search",
    "/policy/search/result",
    "/policy/search/guest",
    // 정책 메인 탭/인트로 (비로그인 허용)
    "/policy",
    "/policy/main",
    "/policy/guest",
    // 게스트페이지(로그인 필요 안내)
    "/guest",
  ];

  const authRequired = !publicPages.includes(to.path);

  console.log(
    `라우터 이동: ${from.path} → ${to.path}, 로그인 상태: ${authStore.isLogin}, 인증 필요: ${authRequired}`
  );

  // 🎵 유정

  if (authRequired && !authStore.isLogin) {
    // 일반 보호 라우트만 게스트 페이지로 유도
    if (to.name !== "guest") {
      return next({ name: "guest", query: { redirect: to.fullPath } });
    }
  }

  next();
});

export default router;
