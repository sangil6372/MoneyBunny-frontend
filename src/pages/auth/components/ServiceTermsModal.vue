<template>
  <div class="modalOverlay" v-if="modelValue">
    <div class="termsModal">
      <div class="modalHeader">
        <span class="modalTitle font-16 font-bold">서비스 이용약관</span>
        <img
          src="@/assets/images/icons/common/x.png"
          alt="닫기"
          class="closeIcon"
          @click="close"
        />
      </div>
      <div class="modalDivider"></div>
      <div class="modalContent font-12">
        <section>
          <strong class="font-bold">제 1조 (목적)</strong>
          <p>
            본 약관은 MoneyBunny(이하 ‘서비스’)의 이용과 관련하여 회사와 회원
            간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로
            합니다.
          </p>
        </section>
        <section>
          <strong class="font-bold">제 2조 (이용계약의 성립)</strong>
          <p>
            1. 회원은 본 약관에 동의함으로써 서비스 이용계약이 성립합니다.<br />
            2. 회사는 필요 시 약관을 변경할 수 있으며, 변경된 약관은 공지사항을
            통해 안내합니다.
          </p>
        </section>
        <section>
          <strong class="font-bold">제 3조 (서비스의 이용)</strong>
          <p>
            1. 회원은 본 약관 및 관련 법령을 준수하여야 하며, 서비스 이용 시
            타인의 권리를 침해하거나 부당한 행위를 해서는 안 됩니다.<br />
            2. 서비스의 일부는 회사의 정책에 따라 제한될 수 있습니다.
          </p>
        </section>
        <section>
          <strong class="font-bold">제 4조 (회원의 의무)</strong>
          <p>
            1. 회원은 서비스 이용 시 허위정보를 기재하지 않아야 하며, 자신의
            정보에 변경사항이 있을 경우 즉시 수정하여야 합니다.<br />
            2. 회원은 본인의 계정정보를 타인에게 공유하거나 양도할 수 없습니다.
          </p>
        </section>
        <section>
          <strong class="font-bold">제 5조 (계약 해지)</strong>
          <p>
            1. 회원은 언제든지 서비스 탈퇴를 요청할 수 있으며, 회사는 관련
            법령이 정하는 바에 따라 처리합니다.
          </p>
        </section>
        <div class="etcText font-11 font-light">(이하 생략)</div>
      </div>
      <div class="modalDivider"></div>
      <div class="modalFooter">
        <button class="cancelBtn font-14" @click="close">취소</button>
        <button class="okBtn font-14" @click="agree">동의</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(['update:modelValue', 'agree']);
const close = () => emit('update:modelValue', false);
const agree = () => {
  emit('agree');
  close();
};
</script>

<style scoped>
.modalOverlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: var(--modal-overlay, rgba(44, 53, 79, 0.35));
  display: flex;
  align-items: center;
  justify-content: center;
}
.termsModal {
  background: var(--modal-bg, #fff);
  border-radius: 12px;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  padding: 0;
  max-height: 85vh;
}
.modalHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0 24px;
}
.closeIcon {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.modalTitle {
  color: var(--text-login);
}
.modalDivider {
  width: 100%;
  height: 1px;
  background: var(--modal-divider, var(--input-bg-1));
  margin: 8px 0;
}
.modalContent {
  overflow-y: auto;
  padding: 6px 24px 12px 24px;
  max-height: 310px;
  color: var(--text-bluegray);
  line-height: 1.75;
  /* 스크롤바 숨김 */
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.modalContent::-webkit-scrollbar {
  display: none;
}
.modalContent section {
  margin-bottom: 14px;
}
.etcText {
  color: var(--text-lightgray);
  margin-top: 10px;
}
.modalFooter {
  display: flex;
  gap: 8px;
  padding: 8px 20px 16px 20px;
  background: var(--modal-bg, #fff);
  border-radius: 12px;
}
.cancelBtn {
  flex: 1;
  background: var(--input-bg-2);
  color: var(--text-darkgray);
  border: none;
  border-radius: 8px;
  padding: 13px 0;
  cursor: pointer;
}

.okBtn {
  flex: 1;
  background: var(--base-blue-dark);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 13px 0;
  cursor: pointer;
}
</style>
