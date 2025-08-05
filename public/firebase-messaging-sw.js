// 📦 Firebase 라이브러리 로드 (호환 버전 사용)
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"
); // Firebase App 초기화용
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js"
); // Firebase Messaging 기능용

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

// 💪(상일) 백그라운드 메시지 처리 - data-only 메시지로 커스텀 알림
messaging.onBackgroundMessage((payload) => {
  console.log("🌙 [백그라운드 메시지 수신]", payload);

  // 💪(상일) data 필드에서 알림 정보 추출 (notification 필드 없으면 기본 알림 생성 안됨)
  const notificationTitle = payload.data?.title || "머니버니 알림";
  const notificationOptions = {
    body: payload.data?.body || "새 알림이 도착했어요!",
    icon: "/icons/icon-192x192.png", // 메인 알림 아이콘 (192x192px)
    badge: "/icons/icon-72x72.png", // 배지 아이콘 (72x72px)
    tag: "moneybunny-notification",
    renotify: false,
    data: payload.data || {},
  };

  // 💪(상일) 커스텀 알림 표시
  self.registration.showNotification(notificationTitle, notificationOptions);
});
