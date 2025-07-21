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
      rstrategies: "injectManifest", // 자동 대신 직접 작성한 SW 사용
      srcDir: "src",
      filename: "service-worker.js", // 작성한 서비스 워커 경로
      injectRegister: "auto", // 자동 등록
      devOptions: {
        enabled: true, // 개발 모드에서도 활성화
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  // 개발 서버 설정
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // 백엔드 서버 연결
      },
    },
  },
});
