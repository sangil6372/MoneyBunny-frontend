<template>
  <div class="noApplicationCard">
    <img
      src="@/assets/images/icons/policy/bookmark_before.png"
      alt="신청 정책 없음 아이콘"
      class="noApplicationIcon"
    />
    <p class="noApplicationTitle font-17 font-bold">신청한 정책이 없습니다</p>
    <p class="noApplicationSub font-13">관심있는 정책을 찾아 신청해보세요</p>
  </div>
</template>

<script>
export default {
  name: 'NoApplicationCard',
};
</script>

<style scoped>
.noApplicationCard {
  padding: 42px 12px;
  text-align: center;
  background-color: white;
  border-radius: 12px;
}

.noApplicationIcon {
  width: 40px;
  height: 40px;
  margin-bottom: 18px;
}

.noApplicationTitle {
  color: var(--text-login);
  margin-bottom: 8px;
}

.noApplicationSub {
  color: var(--text-bluegray);
}
</style>