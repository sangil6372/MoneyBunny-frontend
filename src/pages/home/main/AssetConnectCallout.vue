<template>
  <div class="connectCard" role="region" aria-label="자산 연결 안내">
    <div class="topText font-11">지금 자산을 연결해보세요</div>
    <div class="titleText font-17">
      계좌·카드를 등록하고<br></br> 맞춤 자산 관리를 시작하세요
    </div>
    <div class="subText font-11">
      안전하게 연결하고 내 자산 현황을 한눈에 확인하세요
    </div>

   <div class="btnRow" role="group" aria-label="연결 버튼">
      <button
        class="primaryBtn font-13"
        type="button"
        @click="goAsset"
      >
        계좌 등록
      </button>
      <button
        class="ghostBtn font-13"
        type="button"
        @click="goAsset"
      >
        카드 등록
      </button>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const goAsset = () => {
  router.push('/asset');
};
</script>

<style scoped>
.connectCard {
  background: var(--base-blue-dark);
  color: #fff;
  border-radius: 6px;
  padding: 16px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.topText {
  margin-bottom: 10px;
}

.titleText {
  line-height: 1.4;
  letter-spacing: -0.2px;
}

.subText {
  margin-top: 10px;
  opacity: 0.85;
}

.btnRow {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 16px;
}

.primaryBtn,
.ghostBtn {
  height: 35px;
  border-radius: 6px;
  cursor: pointer;
  border: none;
}

.primaryBtn {
  background: #fff;
  color: var(--base-blue-dark);
  /* border-color: #fff; */
}

.ghostBtn {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.35);
}

.primaryBtn:active,
.ghostBtn:active {
  transform: translateY(1px);
}

/* .connectCard::after {
  content: '';
  position: absolute;
  right: -30px;
  bottom: -30px;
  width: 140px;
  height: 140px;
  border-radius: 6px;
} */
</style>
