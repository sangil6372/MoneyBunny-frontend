<template>
  <div class="bookmark-list">
    <NoBookmarkCard v-if="!filteredBookmarks.length" />
    <div v-else>
      <div class="header">
        <p>저장된 정책</p>
        <span>{{ filteredBookmarks.length }}개</span>
      </div>
      <BookmarkCard
        v-for="(item, index) in filteredBookmarks"
        :key="index"
        :item="item"
      />
    </div>
  </div>
</template>

<script>
import BookmarkCard from './BookmarkCard.vue';
import NoBookmarkCard from './NoBookmarkCard.vue';

export default {
  name: 'BookmarkList',
  components: { BookmarkCard, NoBookmarkCard },
  props: {
    bookmarks: {
      type: Array,
      required: true,
    },
  },
  computed: {
    filteredBookmarks() {
      return this.bookmarks.filter((b) => b.isBookmarked);
    },
  },
};
</script>

<style scoped>
.bookmark-list {
  padding: 16px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
