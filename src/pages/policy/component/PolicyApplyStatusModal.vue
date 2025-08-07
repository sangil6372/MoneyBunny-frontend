<template>
  <div class="modalOverlay" v-if="modelValue">
    <div class="statusModal">
      <!-- 상단 -->
      <div class="modalHeader">
        <span class="modalTitle font-17 font-bold">정책 신청 현황 체크</span>
        <img
          src="@/assets/images/icons/common/x.png"
          alt="닫기"
          class="closeIcon"
          @click="close"
        />
      </div>
      <div class="modalDesc font-14">
        <span class="policyTitle font-14 font-bold"> "{{ policyTitle }}" </span>
        <span class="font-14"> 정책을 신청하셨나요?</span>
      </div>

      <!-- 선택 영역 -->
      <div class="optionList">
        <label class="optionBox font-14">
          <input
            type="radio"
            name="status"
            :value="'applied'"
            v-model="selected"
          />
          <span>네, 신청했어요! 💸</span>
        </label>
        <label class="optionBox font-14">
          <input
            type="radio"
            name="status"
            :value="'notYet'"
            v-model="selected"
          />
          <span>아직 신청하지 않았어요 📝</span>
        </label>
        <label class="optionBox font-14">
          <input
            type="radio"
            name="status"
            :value="'notEligible'"
            v-model="selected"
          />
          <span>지원 조건을 충족하지 않아<br></br> 신청이 어려워요 😢</span>
        </label>
      </div>

      <!-- 버튼 -->
      <div class="buttonGroup">
        <button class="cancelBtn font-15" @click="onLater">나중에</button>
        <button
          class="submitBtn font-15 font-bold"
          :disabled="!selected"
          @click="onSubmit"
        >
          완료
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  policyTitle: { type: String, default: '' },
  value: { type: String, default: '' },
});
const emit = defineEmits(['update:modelValue', 'submit', 'later']);

import { ref, watch } from 'vue';
const selected = ref(props.value);

watch(
  () => props.modelValue,
  (v) => {
    if (v) selected.value = props.value;
  }
);

const close = () => emit('update:modelValue', false);
const onSubmit = () => {
  emit('submit', selected.value);
  close();
};
const onLater = () => {
  emit('later');
  close();
};
</script>

<style scoped>
.modalOverlay {
  position: fixed;
  inset: 0;
  z-index: 1001;
  background: rgba(44, 53, 79, 0.33);
  display: flex;
  align-items: center;
  justify-content: center;
}
.statusModal {
  background: #fff;
  border-radius: 12px;
  max-width: 330px;
  width: 92vw;
  min-width: 270px;
  display: flex;
  flex-direction: column;
  padding: 24px;
  align-items: stretch;
}
.modalHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.closeIcon {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.modalDesc {
  color: var(--text-bluegray);
  margin: 8px 0 18px 0;
  text-align: left;
  line-height: 1.5;
}
.policyTitle {
  color: var(--text-bluegray);
}
.optionList {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.optionBox {
  background: var(--input-bg-2);
  border-radius: 8px;
  border: 1.5px solid transparent;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--text-login);
  cursor: pointer;
}
.optionBox input[type='radio'] {
  width: 18px;
  height: 18px;
  accent-color: var(--base-blue-dark);
  margin-right: 6px;
}

.buttonGroup {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}
.cancelBtn {
  flex: 1;
  background: var(--input-bg-2);
  color: var(--text-darkgray);
  border: none;
  border-radius: 8px;
  padding: 10px 0;
  font-size: 15px;
  cursor: pointer;
}
.submitBtn {
  flex: 1;
  background: var(--base-blue-dark);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 0;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
}
.submitBtn:disabled {
  background: var(--input-disabled-2);
  color: #fff;
  cursor: not-allowed;
}
</style>
