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
  padding: 2rem;
  border-radius: 1rem;
  background-color: white;
}

.bunny-img {
  width: 100px;
  margin-bottom: 1rem;
}

.main-text {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--base-blue-dark);
}

.sub-text {
  font-size: 0.95rem;
  color: var(--text-lightgray);
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.start-btn {
  background-color: var(--base-blue-dark);
  color: white;
  font-weight: 600;
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
}

.see-all {
  font-size: 0.875rem;
  color: var(--text-bluegray);
  text-decoration: underline;
  cursor: pointer;
}
</style>
