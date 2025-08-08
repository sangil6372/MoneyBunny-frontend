<template>
  <nav class="bottom-nav">
    <RouterLink
      v-for="item in navItems"
      :key="item.name"
      :to="item.path"
      class="nav-item"
      :class="{ active: isActive(item.path) }"
    >
      <img
        :src="isActive(item.path) ? item.iconActive : item.icon"
        :alt="item.name"
        class="nav-icon"
      />
      <span>{{ item.name }}</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import api from '@/api'; // 🛠️ 제승 수정: api import

const route = useRoute();
const router = useRouter();

const navItems = [
  {
    name: '홈',
    path: '/home',
    icon: new URL('@/assets/navbar/Home.png', import.meta.url).href,
    iconActive: new URL('@/assets/navbar/Home_color.png', import.meta.url).href,
  },
  {
    name: '자산',
    path: '/asset',
    icon: new URL('@/assets/navbar/asset.png', import.meta.url).href,
    iconActive: new URL('@/assets/navbar/asset_color.png', import.meta.url)
      .href,
  },
  {
    name: '정책',
    path: '/policy',
    icon: new URL('@/assets/navbar/policy.png', import.meta.url).href,
    iconActive: new URL('@/assets/navbar/policy_color.png', import.meta.url)
      .href,
  },
  {
    name: '마이페이지',
    path: '/mypage',
    icon: new URL('@/assets/navbar/User.png', import.meta.url).href,
    iconActive: new URL('@/assets/navbar/User_color.png', import.meta.url).href,
  },
];

const isActive = (path) => route.path.startsWith(path);
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  height: 60px;
  background: white;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
}

.nav-item {
  flex: 1;
  text-align: center;
  text-decoration: none;
  font-size: 13px;
  color: #aaa;
  padding: 6px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nav-item.active {
  color: #003366;
}

.nav-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
}
</style>
