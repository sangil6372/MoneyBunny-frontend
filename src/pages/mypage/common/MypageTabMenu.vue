<template>
  <div class="tabHeader">
    <span
      class="tabItem font-15 font-bold"
      :class="{ active: currentTab === 'profile' }"
      @click="$emit('changeTab', 'profile')"
    >
      프로필
    </span>
    <span
      class="tabItem font-15 font-bold"
      :class="{ active: currentTab === 'bookmark' }"
      @click="$emit('changeTab', 'bookmark')"
    >
      북마크
    </span>
    <span
      class="tabItem font-15 font-bold"
      :class="{ active: currentTab === 'settings' }"
      @click="$emit('changeTab', 'settings')"
    >
      설정
    </span>
  </div>
</template>

<script setup>
defineProps(['currentTab']);
</script>

<style scoped>
.tabHeader {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 0;
}
.tabItem {
  flex: 1;
  text-align: center;
  padding-bottom: 10px;
  color: var(--text-bluegray);
  cursor: pointer;
}

.tabItem.active {
  color: var(--text-login);
  border-bottom: 2px solid var(--text-login);
}
</style>
