// src/stores/auth.js
import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

import { useBookmarkStore } from "@/stores/bookmark";
import { useNotificationStore } from "@/stores/notification";
import { useAssetStore } from "@/stores/asset";
import { usePolicyQuizStore } from "@/stores/policyQuizStore";
import { usePolicyMatchingStore } from "@/stores/policyMatchingStore";

// 새로운 인증 방식: Access Token(메모리), Refresh Token(Cookie), CSRF Token(localStorage)
const initState = {
  token: "",        // Access Token (메모리 전용)
  user: null,       // 사용자 정보 (메모리 전용)
  csrfToken: "",   // CSRF Token (localStorage)
};

export const useAuthStore = defineStore("auth", () => {
  const state = ref({ ...initState });

  // 로그인 여부는 토큰 보유 + 유효성으로 판단하는 편이 안전하지만,
  // 기존 사용처 최소 변경을 위해 user 여부 유지가 필요하면 아래처럼도 가능.
  const isLogin = computed(() => !!state.value.token && !isTokenExpired());
  const username = computed(() => state.value.user?.username || "");
  const email = computed(() => state.value.user?.email || "");

  // 로그인
  const login = async (member) => {
    const response = await axios.post("/api/auth/login", {
      username: member.username,
      password: member.password,
    });

    const { data } = response;
    
    // Access Token 메모리에 저장
    state.value.token = data.accessToken || "";

    // CSRF Token localStorage에 저장 (응답 Body에서 추출)
    const csrfToken = data.csrfToken || response.headers['x-csrf-token'];
    if (csrfToken) {
      state.value.csrfToken = csrfToken;
      localStorage.setItem('csrfToken', csrfToken);
    }

    // 사용자 정보는 메모리에만 (Refresh Token은 Cookie로 자동 설정)
    state.value.user = {
      username: data.username || member.username || "",
      email: data.email || "",
      roles: Array.isArray(data.roles)
        ? data.roles
        : [data.role].filter(Boolean),
    };
  };

  // Access Token 재발급 (Cookie의 Refresh Token 사용)
  const refreshAccessToken = async () => {
    // Cookie에서 Refresh Token 자동 전송, CSRF 토큰 헤더 추가
    const headers = {};
    if (state.value.csrfToken) {
      headers['X-CSRF-Token'] = state.value.csrfToken;
    }
    
    const { data } = await axios.post(
      "/api/auth/refresh",
      {},
      { headers }
    );
    
    // Access Token과 사용자 정보 업데이트
    state.value.token = data.accessToken || "";
    if (data.username && data.email !== undefined) {
      state.value.user = {
        username: data.username,
        email: data.email || "",
        roles: [data.role].filter(Boolean),
      };
    }
  };

  // 로그아웃
  const logout = async () => {
    const access = state.value.token;
    if (access) {
      try {
        const headers = { Authorization: `Bearer ${access}` };
        // CSRF 토큰 추가
        if (state.value.csrfToken) {
          headers['X-CSRF-Token'] = state.value.csrfToken;
        }
        
        await axios.post(
          "/api/auth/logout",
          {},
          { headers }
        );
      } catch (err) {
        console.error("로그아웃 API 실패:", err);
      }
    }

    try {
      useBookmarkStore().$reset();
      const notification = useNotificationStore();
      notification.resetStore?.();
      const asset = useAssetStore();
      asset.$reset();
      asset.clearSummary?.();
      usePolicyQuizStore().$reset();
      usePolicyMatchingStore().$reset();
    } catch (e) {
      console.error("스토어 초기화 실패:", e);
    }

    // FCM 토큰은 유지, CSRF 토큰은 삭제
    const fcmToken = localStorage.getItem("fcm_token");
    localStorage.removeItem("csrfToken");
    
    state.value = { ...initState };
  };

  const getToken = () => state.value.token;

  // 만료 5분 전부터 만료 취급
  const isTokenExpired = () => {
    if (!state.value.token) return true;
    try {
      const payload = JSON.parse(atob(state.value.token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp && payload.exp < now + 300;
    } catch {
      return true;
    }
  };

  // 새로고침 시 localStorage에서 CSRF 토큰 복원 및 토큰 재발급 시도
  const load = async () => {
    // 먼저 CSRF 토큰 복원
    const savedCsrfToken = localStorage.getItem('csrfToken');
    state.value.csrfToken = savedCsrfToken || "";

    // CSRF 토큰이 없으면 토큰 재발급 시도하지 않음 (로그인 필요)
    if (!savedCsrfToken) {
      return;
    }

    try {
      // Cookie에 Refresh Token이 있다면 Access Token 재발급 시도 (사용자 정보도 함께 복원)
      await refreshAccessToken();
    } catch (error) {
      // Refresh Token이 없거나 만료된 경우 초기 상태로 리셋하되 CSRF 토큰은 유지
      const csrfToken = state.value.csrfToken; // 현재 CSRF 토큰 백업
      state.value = { ...initState };
      state.value.csrfToken = csrfToken; // CSRF 토큰 복원
    }
  };

  const changeProfile = (member) => {
    if (!state.value.user) {
      state.value.user = { username: "", email: "", roles: [] };
    }
    state.value.user.email = member.email ?? state.value.user.email ?? "";
    // 메모리에만 저장, localStorage 사용하지 않음
  };

  // 초기화 플래그 추가
  const _isInitialized = ref(false);
  
  // 초기화 (비동기)
  load().finally(() => {
    _isInitialized.value = true;
  });

  return {
    state,
    isLogin,
    username,
    email,
    login,
    logout,
    getToken,
    isTokenExpired,
    changeProfile,
    refreshAccessToken,
    _isInitialized,
  };
});
