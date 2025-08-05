<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

import PolicyFilterModal from '../filter/PolicyFilterModal.vue';

const filterData = ref({});
const showFilterModal = ref(false);
const openFilter = () => (showFilterModal.value = true);
const closeFilter = () => (showFilterModal.value = false);

const router = useRouter();
const searchQuery = ref('');
const goBack = () => router.back();
const search = () => {};

function handleConfirm(selected) {
  filterData.value = selected;
  showFilterModal.value = false;
}
function onSearch() {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'policySearchResult',
      query: { q: searchQuery.value },
    });
  }
}
</script>
<template>
  <div class="policySearchHeader">
    <img
      src="@/assets/images/icons/policy/left_arrow.png"
      class="goBackIcon"
      @click="goBack"
    />
    <div class="searchInputWrapper">
      <input
        type="text"
        class="searchInput"
        placeholder="정책을 검색해보세요 (예: 청년, 주거, 창업)"
        v-model="searchQuery"
        @keyup.enter="search"
      />
      <button class="searchIconBtn" @click="search" aria-label="검색">
        <img src="@/assets/images/icons/policy/search.png" class="searchIcon" />
      </button>
    </div>
    <img
      src="@/assets/images/icons/policy/filter.png"
      class="filterIcon"
      @click="openFilter"
    />
  </div>
  <!-- 부모 컴포넌트 예시 -->
  <PolicyFilterModal
    v-if="showFilterModal"
    @close="showFilterModal = false"
    @confirm="handleConfirm"
  />
</template>

<style scoped>
.policySearchHeader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  max-width: 474px;
  height: 70px;
  width: 100%;
  margin: 0 auto;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 15px;
  background: #fff;
  border-bottom: 1px solid var(--base-lavender);
}

.searchInputWrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.searchInput {
  width: 100%;
  height: 40px;
  padding: 12px 44px 12px 16px;
  border: 1px solid var(--input-outline-2);
  border-radius: 8px;
  background: #fff;
  font-size: 16px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.searchInput:focus {
  border: 2px solid var(--gray-medium);
}

.searchIconBtn {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.searchIcon {
  width: 22px;
  height: 22px;
  opacity: 0.65;
}

.filterIcon {
  width: 28px;
  height: 28px;
  cursor: pointer;
}

.goBackIcon {
  width: 26px;
  height: 26px;
  cursor: pointer;
}
</style>
