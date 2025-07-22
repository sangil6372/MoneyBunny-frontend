// 📦 Firebase 라이브러리 로드 (호환 버전 사용)
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"
); // Firebase App 초기화용
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js"
); // Firebase Messaging 기능용

// 아래 내용은 써도 되는지 확인 한 번만!!!!
// import { precacheAndRoute } from "workbox-precaching";

// // PWA precache 처리 (vite-plugin-pwa)
// precacheAndRoute(self.__WB_MANIFEST);

// 📌 Service Worker 설치 이벤트 발생 시
self.addEventListener("install", (e) => {
  // 기존 활성화된 서비스워커 대기 없이 바로 새로 적용되도록 설정
  self.skipWaiting();
});

// 📌 Service Worker 활성화 이벤트 발생 시
self.addEventListener("activate", (e) => {
  console.log("✅ 머니버니 FCM Service Worker 실행됨"); // 디버깅용 로그 출력
});

// 🚀 Firebase 프로젝트 설정 정보
const firebaseConfig = {
  apiKey: "AIzaSyDfk91-8xf4eJH5TRLaPui3vDT3Mt6jTbA",
  authDomain: "moneybunny-93467.firebaseapp.com",
  projectId: "moneybunny-93467",
  storageBucket: "moneybunny-93467.firebasestorage.app",
  messagingSenderId: "51947749964",
  appId: "1:51947749964:web:595b2bf4c3bbcc42886ae9",
};

// 🔧 Firebase 초기화
firebase.initializeApp(firebaseConfig);

// 🔔 FCM Messaging 인스턴스 생성
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("🌙 [백그라운드 메시지 수신]", payload); // 수신된 데이터 로그 확인

  // 🔔 알림 제목과 내용 설정 (payload가 없을 경우 기본값 사용)
  const notificationTitle = payload.notification?.title || "머니버니 알림";
  const notificationOptions = {
    body: payload.notification?.body || "새 알림이 도착했어요!",
    icon: "/icons/icon-192x192.png", // PWA 알림에 표시될 아이콘 경로
  };

  // 🔔 알림 표시
  self.registration.showNotification(notificationTitle, notificationOptions);
});
