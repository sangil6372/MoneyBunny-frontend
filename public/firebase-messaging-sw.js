// Firebase 라이브러리 로드
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js"
);

// Service Worker 설치 이벤트
self.addEventListener("install", (e) => {
  self.skipWaiting();
});

// Service Worker 활성화 이벤트
self.addEventListener("activate", (e) => {
});

// Firebase 프로젝트 설정 정보
const firebaseConfig = {
  apiKey: "AIzaSyDfk91-8xf4eJH5TRLaPui3vDT3Mt6jTbA",
  authDomain: "moneybunny-93467.firebaseapp.com",
  projectId: "moneybunny-93467",
  storageBucket: "moneybunny-93467.firebasestorage.app",
  messagingSenderId: "51947749964",
  appId: "1:51947749964:web:595b2bf4c3bbcc42886ae9",
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);

// FCM Messaging 인스턴스 생성
const messaging = firebase.messaging();

// 백그라운드 메시지 처리
messaging.onBackgroundMessage((payload) => {

  // data 필드에서 알림 정보 추출
  const notificationTitle = payload.data?.title || "머니버니 알림";
  const notificationOptions = {
    body: payload.data?.body || "새 알림이 도착했어요!",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    tag: "moneybunny-notification",
    renotify: false,
    data: payload.data || {},
  };

  // 커스텀 알림 표시
  self.registration.showNotification(notificationTitle, notificationOptions);
});
