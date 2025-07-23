// Node.js의 URL 유틸리티에서 파일 경로 변환 함수들을 가져옴
// 용도: @ 별칭 설정 시 절대 경로 생성에 사용
import { fileURLToPath, URL } from "node:url";

// Vite 설정을 정의하는 함수를 가져옴
// - Vite 설정 객체를 정의하고 타입 검사 지원
// - 장점: IDE에서 자동완성과 타입 체크 제공
// - 단점: 초기 설정 시 타입 정의 필요
import { defineConfig } from "vite";

// Vue.js를 위한 Vite 플러그인을 가져옴
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate', // 🔄 새 서비스워커 감지 시 자동 업데이트
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // 백엔드 API 주소
        changeOrigin: true,
      },
    },
  },
});
