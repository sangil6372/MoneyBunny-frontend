<template>
  <div class="modalOverlay" v-if="modelValue">
    <div class="termsModal">
      <div class="modalHeader">
        <span class="modalTitle font-16 font-bold">마케팅 정보 수신 동의</span>
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
          <strong class="font-bold">■ 수집 및 이용 목적</strong>
          <p>
            - 이벤트, 프로모션, 맞춤형 서비스 및 신규 서비스 안내 등 광고성 정보
            전달
          </p>
        </section>
        <section>
          <strong class="font-bold">■ 수집 항목</strong>
          <p>- 휴대전화번호, 이메일</p>
        </section>
        <section>
          <strong class="font-bold">■ 보유 및 이용 기간</strong>
          <p>- 동의 철회 또는 회원 탈퇴 시까지</p>
        </section>
        <section>
          <strong class="font-bold">■ 동의를 거부할 권리 및 불이익 안내</strong>
          <p>
            - 귀하는 마케팅 정보 수신 동의를 거부할 수 있으며,<br />
            &nbsp;&nbsp;거부하더라도 서비스 이용에는 제한이 없습니다.
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
