<!--src\pages\home\main\NoPolicyCard.vue-->
<template>
  <div class="no-policy-card">
    <img
      src="@/assets/images/icons/bunny/policy_bunny_background.png"
      alt="돋보기 토끼"
      class="bunny-img"
    />
    <p class="main-text">아직 맞춤 정책이 없어요</p>
    <p class="sub-text">
      간단한 유형 검사를 통해<br />나에게 딱 맞는 정책을 찾아보세요!
    </p>
    <button class="start-btn" @click="$emit('start-quiz')">
      유형 검사 시작하기 →
    </button>
  </div>
</template>

<style scoped>
.no-policy-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem;
  border-radius: 1rem;
  background-color: white;
}

.bunny-img {
  width: 90px;
  margin-bottom: 1rem;
}

.main-text {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--base-blue-dark);
}

.sub-text {
  font-size: 0.85rem;
  color: var(--text-lightgray);
  margin-bottom: 1.25rem;
}

.start-btn {
  background-color: var(--base-blue-dark);
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.see-all {
  font-size: 0.75rem;
  color: var(--text-bluegray);
  text-decoration: underline;
  cursor: pointer;
}
</style>
