<script setup>
const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};

const shareInfo = {
  title: '청년 내일채움공제',
  description: '청년층의 장기근속과 목돈마련을 지원하는 정책',
  amount: '최대 3,000만원',
  url: 'https://policy.gov.kr/youth-savings',
};
</script>

<template>
  <div class="modalOverlay" @click.self="close">
    <div class="modalContent">
      <img
        src="@/assets/images/icons/policy/x.png"
        class="closeIcon"
        @click="close"
      />
      <div class="font-20 font-bold mb-3">공유하기</div>

      <div class="shareItem">
        <img src="@/assets/images/icons/policy/kakaotalk.png" />
        <div class="text">
          <div class="font-15 font-bold">카카오톡</div>
          <div class="font-13">카카오톡으로 공유하기</div>
        </div>
      </div>

      <div class="shareItem">
        <img src="@/assets/images/icons/policy/link.png" />
        <div class="text">
          <div class="font-15 font-bold">링크 복사</div>
          <div class="font-13">링크를 복사해서 공유하기</div>
        </div>
      </div>

      <div class="shareBox">
        <div class="font-14 font-bold mb-1">공유할 내용</div>
        <div class="font-13">
          {{ shareInfo.title }} - {{ shareInfo.description }}<br />
          {{ shareInfo.amount }} 지원<br />
          {{ shareInfo.url }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modalOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.4); /* 블러 대신 어두운 반투명 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.modalContent {
  background-color: white;
  width: 90%;
  max-width: 400px;
  border-radius: 20px;
  padding: 26px;
  position: relative;
}

.closeIcon {
  position: absolute;
  top: 26px;
  right: 26px;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.shareItem {
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: var(--input-bg-2);
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 10px;
}

.shareItem img {
  width: 30px;
  height: 30px;
}

.shareBox {
  background-color: var(--input-bg-2);
  border-radius: 12px;
  padding: 16px;
}
</style>
