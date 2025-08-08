<template>
  <div class="bookmark-list">
    <!-- 💪(상일) 로딩 상태 표시 -->
    <div v-if="bookmarkLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">북마크를 불러오는 중...</p>
    </div>

    <!-- 💪(상일) 에러 상태 표시 -->
    <div v-else-if="bookmarkError" class="error-container">
      <p class="error-text">북마크를 불러오는데 실패했습니다.</p>
      <button @click="fetchBookmarks" class="retry-btn">다시 시도</button>
    </div>

    <!-- 💪(상일) 북마크가 없는 경우 -->
    <NoBookmarkCard v-else-if="!filteredBookmarks.length" />

    <!-- 💪(상일) 북마크 목록 표시 -->
    <div v-else>
      <div class="header font-15">
        <p>저장된 정책</p>
        <span>{{ filteredBookmarks.length }}개</span>
      </div>
      <div class="card-container">
        <BookmarkCard
          v-for="(item, index) in filteredBookmarks"
          :key="item.bookmarkId || index"
          :item="item"
          :class="{ 'not-last': index < filteredBookmarks.length - 1 }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useBookmarkStore } from '@/stores/bookmark';
import BookmarkCard from './BookmarkCard.vue';
import NoBookmarkCard from './NoBookmarkCard.vue';

// 💪(상일) 북마크 스토어에서 데이터 가져오기
const bookmarkStore = useBookmarkStore();
const {
  bookmarks,
  loading: bookmarkLoading,
  error: bookmarkError,
  filteredBookmarks,
} = storeToRefs(bookmarkStore);
const { fetchBookmarks } = bookmarkStore;
</script>

<style scoped>
/* .bookmark-list {
  padding: 16px;
} */

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  padding: 0 6px;
}

.card-container {
  display: flex;
  flex-direction: column;
}

.card-container :deep(.bookmarkCard.not-last) {
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 0;
}

.card-container :deep(.bookmarkCard:not(.not-last)) {
  margin-bottom: 0;
}

/* 💪(상일) 로딩 상태 스타일 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--base-blue-dark);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-text {
  color: var(--text-lightgray);
  font-size: 14px;
  margin: 0;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 💪(상일) 에러 상태 스타일 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.error-text {
  color: var(--text-lightgray);
  font-size: 14px;
  margin: 0 0 16px 0;
  text-align: center;
}

.retry-btn {
  padding: 10px 20px;
  background-color: var(--base-blue-dark);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background-color: var(--base-blue);
}
</style>
