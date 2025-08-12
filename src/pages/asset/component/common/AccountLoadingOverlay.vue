<!-- AccountLoadingOverlay.vue -->
<template>
  <div class="loading-overlay" v-if="isLoading">
    <div class="bunny-image-container">
      <img :src="bunnyImagePath" alt="토끼" class="bunny-image" />
      <div class="coins-container">
        <img :src="coinImagePath" alt="동전" class="coin-image" />
        <img :src="coinImagePath" alt="동전" class="coin-image" />
        <img :src="coinImagePath" alt="동전" class="coin-image" />
      </div>
    </div>
    <div class="loading-text">
      <div class="loading-title">
        {{ loadingTitle }}
        <span class="loading-dots">
          <span>.</span><span>.</span><span>.</span>
        </span>
      </div>
      <div class="loading-subtitle">{{ loadingSubtitle }}</div>
      <div class="progress-container">
        <div class="progress-bar"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccountLoadingOverlay',
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    bunnyImagePath: {
      type: String,
      required: true,
    },
    coinImagePath: {
      type: String,
      required: true,
    },
    // 🎯 타입별 메시지를 위한 props 추가
    type: {
      type: String,
      default: 'account',
      validator: (value) => ['account', 'card'].includes(value),
    },
  },
  computed: {
    // 🎯 타입에 따른 메시지 계산
    loadingTitle() {
      return this.type === 'account'
        ? '계좌 등록 중입니다'
        : '카드 등록 중입니다';
    },
    loadingSubtitle() {
      return this.type === 'account'
        ? '계좌 정보를 처리하고 있어요'
        : '카드 정보를 처리하고 있어요';
    },
  },
};
</script>

<style scoped>
/* 로딩 오버레이 (계좌 등록용) */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  backdrop-filter: blur(4px);
}

/* 토끼 이미지 컨테이너 */
.bunny-image-container {
  position: relative;
  margin-bottom: 1.5rem;
}

.bunny-image {
  width: 5rem;
  height: 5rem;
  object-fit: contain;
  animation: bunnyFloat 2s ease-in-out infinite;
}

/* 동전 이미지들 */
.coins-container {
  position: absolute;
  top: -0.625rem;
  left: 50%;
  transform: translateX(-50%);
  width: 7.5rem;
  height: 2.5rem;
}

.coin-image {
  width: 1.5rem;
  height: 1.5rem;
  position: absolute;
  object-fit: contain;
}

.coin-image:nth-child(1) {
  left: 0;
  animation: coinBounce1 1.5s ease-in-out infinite;
}

.coin-image:nth-child(2) {
  left: 3rem;
  animation: coinBounce2 1.5s ease-in-out infinite 0.2s;
}

.coin-image:nth-child(3) {
  right: 0;
  animation: coinBounce3 1.5s ease-in-out infinite 0.4s;
}

/* 로딩 텍스트 */
.loading-text {
  text-align: center;
  color: var(--base-blue-dark);
}

.loading-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.loading-subtitle {
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--text-darkgray);
  margin-bottom: 1.25rem;
  line-height: 1.4;
}

/* 로딩 점들 */
.loading-dots {
  display: inline-block;
  margin-left: 0.25rem;
}

.loading-dots span {
  display: inline-block;
  animation: dotPulse 1.4s infinite ease-in-out;
}

.loading-dots span:nth-child(1) {
  animation-delay: 0s;
}
.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}
.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

/* 프로그레스 바 */
.progress-container {
  width: 11.25rem;
  height: 0.25rem;
  background: var(--input-bg-3);
  border-radius: 0.125rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--text-green), var(--sub-mint));
  border-radius: 0.125rem;
  animation: progressFill 3s ease-in-out infinite;
}

/* 애니메이션 */
@keyframes bunnyFloat {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-0.5rem);
  }
}

@keyframes coinBounce1 {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-0.75rem) rotate(180deg);
  }
}

@keyframes coinBounce2 {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-1rem) rotate(180deg);
  }
}

@keyframes coinBounce3 {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-0.625rem) rotate(180deg);
  }
}

@keyframes dotPulse {
  0%,
  80%,
  100% {
    opacity: 0.3;
  }
  40% {
    opacity: 1;
  }
}

@keyframes progressFill {
  0% {
    width: 0%;
  }
  70% {
    width: 100%;
  }
  100% {
    width: 100%;
  }
}
</style>
