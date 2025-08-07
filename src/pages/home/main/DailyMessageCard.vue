<template>
  <div class="daily-message-card">
    <div class="icon-area">
      <img
        src="@/assets/images/icons/bunny/main_bunny.png"
        alt="버니 아이콘"
        class="bunny-icon"
      />
    </div>
    <div class="text">
      <p class="main-message">
        {{ title }}
        <br />
        <span class="sub-message">{{ message }}</span>
      </p>
      <p class="cta">{{ cta }}</p>
    </div>
  </div>
</template>

<script setup>
// 메시지 커스터마이징
defineProps({
  title: { type: String, default: '오늘의 한마디 !' },
  message: { type: String, default: '오늘 계획했던 일 하셨나요?' },
  cta: { type: String, default: '내일을 위해서 커밋 어때요?' },
});
</script>

<style scoped>
.daily-message-card {
  display: flex;
  align-items: center;
  justify-content: center; /* 세로 가운데 정렬 */
  min-height: 5rem; /* 최소 높이 설정 (카드가 너무 낮지 않게) */
  background: #fff0f4;
  /* background: #f5f6ff; */
  /* background: #e6faf7; */

  border-radius: 0.5rem;
  padding: 0.65rem 0.9rem;
}
.icon-area {
  margin-left: 0.35rem;
  margin-right: 0.7rem;
}
.bunny-icon {
  width: 3rem;
  height: 3rem;
  object-fit: contain;
}

.text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 텍스트 수직 정렬 */
}

.main-message {
  font-size: 0.9rem;
  margin: 0;
  color: var(--text-login);
}

.sub-message {
  font-size: 0.8rem;
  color: var(--text-darkgray);
}

.cta {
  font-size: 0.8rem;
  color: var(--text-darkgray);
  margin-bottom: 0;
}
</style>
