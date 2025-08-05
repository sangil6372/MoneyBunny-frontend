import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/api'; // 🛠️ 제승 추가: api import

// ─── 레이아웃 ──────────────────────────────
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';

//
// ─── 인증 / 회원 관련 페이지 ───────────────────────────
import LoginPage from '@/pages/auth/LoginPage.vue';
import FindIdPage from '@/pages/auth/FindIdPage.vue';
import FindPasswordPage from '@/pages/auth/FindPasswordPage.vue';
import SignUpEmailVerifyPage from '@/pages/auth/SignUpEmailVerifyPage.vue';
import SignUpProfilePage from '@/pages/auth/SignUpProfilePage.vue';
import FindIdResultPage from '@/pages/auth/FindIdResultPage.vue';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage.vue';
import AttendanceCheckModal from '@/pages/auth/AttendanceCheckModal.vue';
import FindIdCodePage from '@/pages/auth/FindIdCodePage.vue';

//
// ─── 마이페이지 관련 ──────────────────────────────────
import MypageMain from "@/pages/mypage/MypageMain.vue";
import SettingMain from "@/pages/mypage/settings/SettingMain.vue";
import ChangePassword from "@/pages/mypage/settings/ChangePassword.vue";
import PolicyRetestPage from "@/pages/mypage/settings/PolicyRetestPage.vue";
// 💪(상일) 알림 설정 페이지 import
import NotificationSettings from "@/pages/mypage/settings/NotificationSettings.vue";


//
// ─── 탭 메인 페이지 ────────────────────────────────────
import HomeMainPage from '@/pages/home/HomeMainPage.vue'; // 홈메인
import AssetMain from '@/pages/asset/AssetMain.vue'; //🥕성빈: 자산 메인탭
import PolicyMainTab from '@/pages/policy/PolicyMainTab.vue';
import NotificationCenter from '@/pages/notification/NotificationCenter.vue';

//
// ─── 정책 추천 흐름 ────────────────────────────────────
import PolicyIntroForm from '@/pages/policy/recommend/PolicyIntroForm.vue';
import PolicyQuizStep1 from '@/pages/policy/recommend/PolicyQuizStep1.vue';
import PolicyQuizStep2 from '@/pages/policy/recommend/PolicyQuizStep2.vue';
import PolicyQuizStep3 from '@/pages/policy/recommend/PolicyQuizStep3.vue';
import PolicyQuizStep4 from '@/pages/policy/recommend/PolicyQuizStep4.vue';
import PolicyQuizStep5 from '@/pages/policy/recommend/PolicyQuizStep5.vue';
import PolicyResultSummary from '@/pages/policy/recommend/PolicyResultSummary.vue';

import PolicyDetailPage from '@/pages/policy/detail/PolicyDetailPage.vue';
import PolicySearchPage from '@/pages/policy/search/PolicySearchPage.vue';
import PolicySearchResult from '@/pages/policy/search/PolicySearchResult.vue';

const routes = [
  //
  // ─── 인증 관련 ──────────────────────────────────────
  { path: '/', name: 'login', component: LoginPage },
  { path: '/findId', name: 'findId', component: FindIdPage },
  { path: '/findPassword', name: 'findPassword', component: FindPasswordPage },
  {
    path: '/signUpEmailVerify',
    name: 'signUpEmailVerify',
    component: SignUpEmailVerifyPage,
  },
  {
    path: '/signUpProfile',
    name: 'signUpProfile',
    component: SignUpProfilePage,
  },
  {
    path: '/resetPassword',
    name: 'resetPassword',
    component: ResetPasswordPage,
  },
  { path: '/findIdResult', name: 'findIdResult', component: FindIdResultPage },
  {
    path: '/attendanceCheck',
    name: 'attendanceCheck',
    component: AttendanceCheckModal,
  },
  {
    path: '/findIdCode',
    name: 'findIdCode',
    component: FindIdCodePage,
  },
  //
  // ─── 마이페이지 ─────────────────────────────────────
  { path: '/mypage/settings', name: 'myPageSettings', component: SettingMain },
  {
    path: '/mypage/settings/changePassword',
    name: 'changePassword',
    component: ChangePassword,
  },

  // ─── 기본 레이아웃 하위 라우트 ─────────
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', redirect: '/home' },
      { path: 'home', name: 'home', component: HomeMainPage },
      { path: 'asset', name: 'asset', component: AssetMain },
      //  🥕성빈: 경로 수정(0801)

      // {
      //   path: 'account/:id',
      //   name: 'AccountDetail',
      //   component: () =>
      //     import('@/pages/asset/component/account/AccountDetail.vue'),
      //   props: true,
      // },

      { path: 'mypage', name: 'mypage', component: MypageMain },
      {
        path: 'mypage/settings',
        name: 'myPageSettings',
        component: SettingMain,
      },
      {
        path: 'mypage/settings/changePassword',
        name: 'changePassword',
        component: ChangePassword,
      },
      {
        path: 'mypage/settings/policy',
        name: 'myPageSettingsPolicy',
        component: PolicyRetestPage,
      },
      // 💪(상일) 알림 설정 라우트 추가
      {
        path: "mypage/settings/notification",
        name: "notificationSettings",
        component: NotificationSettings,
      },
      {
        path: 'notification',
        name: 'notification',
        component: NotificationCenter,
      },

      // 정책 추천 플로우
      { path: 'policy', name: 'policyIntroForm', component: PolicyIntroForm },
      { path: 'policy/main', name: 'policyMain', component: PolicyMainTab },
      {
        path: 'policy/quiz/step1',
        name: 'policyQuizStep1',
        component: PolicyQuizStep1,
      },
      {
        path: 'policy/quiz/step2',
        name: 'policyQuizStep2',
        component: PolicyQuizStep2,
      },
      {
        path: 'policy/quiz/step3',
        name: 'policyQuizStep3',
        component: PolicyQuizStep3,
      },
      {
        path: 'policy/quiz/step4',
        name: 'policyQuizStep4',
        component: PolicyQuizStep4,
      },
      {
        path: 'policy/quiz/step5',
        name: 'policyQuizStep5',
        component: PolicyQuizStep5,
      },
      {
        path: 'policy/quiz/result',
        name: 'policyResultSummary',
        component: PolicyResultSummary,
      },
      {
        path: 'policy/:policyId',
        name: 'policyDetail',
        component: PolicyDetailPage,
        props: true,
      },
      {
        path: 'policy/search',
        name: 'policySearch',
        component: PolicySearchPage,
      },
      {
        path: 'policy/search/result',
        name: 'policySearchResult',
        component: PolicySearchResult,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 인증 가드
router.beforeEach(async (to, from, next) => {
  // 🛠️ 제승 추가: 정책 메인 접근 전 조건 체크 네비게이션 가드
  if (to.path === '/policy' || to.path === '/policy/main') {
    try {
      const res = await api.get('/api/userPolicy');
      if (res.data && Object.keys(res.data).length > 0) {
        // 조건이 있으면 /policy/main 으로만 진입 허용
        if (to.path !== '/policy/main') {
          return next('/policy/main');
        }
        return next();
      } else {
        // 조건이 없으면 /policy 로만 진입 허용
        if (to.path !== '/policy') {
          return next('/policy');
        }
        return next();
      }
    } catch (e) {
      // 에러 시 정책 인트로로 이동
      if (to.path !== '/policy') {
        return next('/policy');
      }
      return next();
    }
  }

  const authStore = useAuthStore();
  const publicPages = [
    '/',
    '/findId',
    '/findPassword',
    '/signUpEmailVerify',
    '/signUpProfile',
    '/resetPassword',
    '/findIdResult',
    '/findIdCode',
  ];
  const authRequired = !publicPages.includes(to.path);

  console.log(
    `라우터 이동: ${from.path} → ${to.path}, 로그인 상태: ${authStore.isLogin}, 인증 필요: ${authRequired}`
  );

  // 👸🏻 은진
  if (authRequired && !authStore.isLogin) {
    // 로그인이 필요한 페이지인데 로그인하지 않은 경우
    console.log("인증되지 않은 접근 - 로그인 페이지로 리다이렉트");
    return next({ path: "/", query: { error: "auth_required" } });
  }

  if (to.path === '/' && authStore.isLogin) {
    // 이미 로그인한 사용자가 로그인 페이지에 접근하는 경우 홈으로 리다이렉트
    console.log('이미 로그인된 사용자 - 홈으로 리다이렉트');
    return next('/home');
  }

  next();
});

export default router;
