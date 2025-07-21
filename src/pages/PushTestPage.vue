<!-- push-test.vue -->
<template>
  <div style="padding: 40px">
    <h1>알림 구독 테스트</h1>
    <button @click="subscribeToPush">🔔 알림 받기</button>
    <p v-if="msg">{{ msg }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";

const msg = ref("");

async function subscribeToPush() {
  if (!("serviceWorker" in navigator)) {
    msg.value = "서비스 워커 미지원 브라우저입니다.";
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  const applicationServerKey = urlBase64ToUint8Array(
    "BKodvh3r5E72nXeA2GlatVYMPf0Ey159zQaMEvQUXWtXPqDd0IuQav-J_PyKm0Kr39kBrDS87TbdWi5FxxnaHJY"
  );

  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    const res = await fetch("http://localhost:8080/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });

    if (res.ok) {
      msg.value = "✅ 알림 구독 성공!";
    } else {
      msg.value = "❌ 서버 응답 오류";
    }
  } catch (err) {
    msg.value = "구독 실패: " + err;
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
</script>
