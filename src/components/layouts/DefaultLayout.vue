<template>
  <div class="layout">
    <!--조건부: 알림 센터 헤더-->
    <component :is="isNotificationPage ? NotificationHeader : Header" />

    <main class="main">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </main>
    <NavBar />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

import Header from '@/components/layouts/Header.vue';
import NavBar from '@/components/layouts/NavBar.vue';
import NotificationHeader from '@/pages/notification/common/NotificationHeader.vue'; //알림센터 헤더

//현재 라우트 정보 가져오기
const route = useRoute();

//알림센터 페이지 여부 계산
const isNotificationPage = computed(
  () =>
    route.name === 'NotificationCenter' ||
    route.path.startsWith('/notification')
);

const activeHeader = computed(() =>
  isNotificationPage.value ? NotificationHeader : Header
);
</script>

<style scoped>
.layout {
  width: 100%;
  padding-bottom: 60px; /* 하단 바 가려지지 않게 여백 확보 */

  min-height: 100vh;
  position: relative;
}
.main {
  padding-top: 70px;
  position: relative;
}
</style>
