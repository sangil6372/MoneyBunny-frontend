<template>
  <div style="padding: 40px">
    <h1>알림 구독 테스트</h1>
    <button @click="toggleSubscription">
      {{ isSubscribed ? "🔕 구독 해제" : "🔔 알림 받기" }}
    </button>
    <p v-if="msg">{{ msg }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  subscribeToPush,
  unsubscribeFromPush,
} from "@/firebase/notificationPermission";

const msg = ref("");
const isSubscribed = ref(false);

const checkSubscription = async () => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  isSubscribed.value = !!subscription;
};

const toggleSubscription = async () => {
  try {
    if (isSubscribed.value) {
      await unsubscribeFromPush();
      msg.value = "🔕 구독 해제 완료";
    } else {
      await subscribeToPush();
      msg.value = "✅ 구독 완료";
    }
    isSubscribed.value = !isSubscribed.value;
  } catch (err) {
    msg.value = "오류: " + err.message;
  }
};

checkSubscription();
</script>
