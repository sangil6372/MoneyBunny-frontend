<template>
  <div class="noBookmarkCard">
    <img
      src="@/assets/images/icons/policy/bookmark_before.png"
      alt="북마크 없음 아이콘"
      class="noBookmarkIcon"
    />
    <p class="noBookmarkTitle font-18 font-bold">저장된 북마크가 없습니다</p>
    <p class="noBookmarkSub font-14 font-regular">
      관심있는 정책이나 상품을 북마크해보세요
    </p>
  </div>
</template>

<script>
export default {
  name: 'NoBookmarkCard',
};
</script>

<style scoped>
.noBookmarkCard {
  padding: 48px 16px;
  text-align: center;
  background-color: white;
  border-radius: 16px;
}

.noBookmarkIcon {
  width: 50px;
  height: 50px;
  margin-bottom: 30px;
}

.noBookmarkTitle {
  color: var(--text-login);
  margin-bottom: 7px;
}

.noBookmarkSub {
  color: var(--text-bluegray);
}
</style>
