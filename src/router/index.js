import { createRouter, createWebHistory } from 'vue-router';

// 레이아웃
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';

// 공통
import LoginPage from '@/pages/auth/LoginPage.vue';
import FindIdPage from '@/pages/auth/FindIdPage.vue';
import FindPasswordPage from '@/pages/auth/FindPasswordPage.vue';
import SignUpEmailVerifyPage from '@/pages/auth/SignUpEmailVerifyPage.vue';
import SignUpProfilePage from '@/pages/auth/SignUpProfilePage.vue';
import FindIdResultPage from '@/pages/auth/FindIdResultPage.vue';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage.vue';
import AttendanceCheckModal from '@/pages/auth/AttendanceCheckModal.vue';

import SettingMain from '@/pages/mypage/settings/SettingMain.vue';
import ChangePassword from '@/pages/mypage/settings/ChangePassword.vue';
import MypageMain from '@/pages/mypage/MypageMain.vue';

// 탭
import HomeTotalTab from '@/pages/home/tabs/HomeTotalTab.vue';
import AssetMainTab from '@/pages/asset/tabs/AssetMainTab.vue';
import PolicyMainTab from '@/pages/policy/tabs/PolicyMainTab.vue';
import NotificationCenter from '@/pages/notification/NotificationCenter.vue';

// 정책 추천 흐름
import PolicyIntroForm from '@/pages/policy/recommend/PolicyIntroForm.vue';
import PolicyQuizStep1 from '@/pages/policy/recommend/PolicyQuizStep1.vue';
import PolicyQuizStep2 from '@/pages/policy/recommend/PolicyQuizStep2.vue';
import PolicyQuizStep3 from '@/pages/policy/recommend/PolicyQuizStep3.vue';
import PolicyResultSummary from '@/pages/policy/recommend/PolicyResultSummary.vue';

const routes = [
  // 인증 관련
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

  // 마이페이지 단일 라우터
  {
    path: '/mypage/settings',
    name: 'myPageSettings',
    component: SettingMain,
  },
  {
    path: '/mypage/settings/changePassword',
    name: 'changePassword',
    component: ChangePassword,
  },

  // 기본 탭 구조
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', redirect: '/home' },
      { path: 'home', name: 'home', component: HomeTotalTab },
      { path: 'asset', name: 'asset', component: AssetMainTab },
      { path: 'mypage', name: 'mypage', component: MypageMain },
      {
        path: 'notification',
        name: 'notification',
        component: NotificationCenter,
      },

      // 정책 탭 진입 시 intro 또는 메인으로 라우팅됨
      { path: 'policy', name: 'policyIntroForm', component: PolicyIntroForm },
      { path: 'policy/main', name: 'policyMain', component: PolicyMainTab }, // 정책 추천 퀴즈 흐름
      {  path: '/policy/quiz/step1',
        name: 'policyQuizStep1',
        component: PolicyQuizStep1,

      },
      {
        path: '/policy/quiz/step2',
        name: 'policyQuizStep2',
        component: PolicyQuizStep2,
      },
      {
        path: '/policy/quiz/step3',
        name: 'policyQuizStep3',
        component: PolicyQuizStep3,
      },
      {
        path: '/policy/quiz/result',
        name: 'policyResultSummary',
        component: PolicyResultSummary,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
