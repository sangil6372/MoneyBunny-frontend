<template>
  <div class="modalOverlay" @click.self="close">
    <div class="modalContainer">
      <div class="modalHeader">
        <h2 class="modalTitle font-18 font-bold">프로필 수정</h2>
        <button class="closeButton" @click="close">✕</button>
      </div>

      <div class="profileImageSection">
        <div class="imageWrapper" @click="changeProfile">
          <img
            src="@/assets/images/icons/profile/profile_edit_beard.png"
            alt="프로필"
            class="profileImage"
          />
          <img
            src="@/assets/images/icons/mypage/edit.png"
            alt="수정 아이콘"
            class="editBadge"
          />
        </div>
        <p class="imageHint font-13 font-regular">
          프로필 사진을 변경하려면 클릭하세요
        </p>
      </div>

      <div class="formGroup">
        <label for="name" class="font-14 font-bold"
          >이름<span class="required">*</span></label
        >
        <input
          id="name"
          v-model="name"
          type="text"
          :class="['inputField', { error: errors.name }]"
        />
        <p v-if="errors.name" class="errorMessage font-13">
          이름을 입력해주세요
        </p>
      </div>

      <div class="formGroup">
        <label for="email" class="font-14 font-bold"
          >이메일<span class="required">*</span></label
        >
        <input
          id="email"
          v-model="email"
          type="email"
          :class="['inputField', { error: errors.email }]"
        />
        <p v-if="errors.email" class="errorMessage font-13">
          이메일을 입력해주세요
        </p>
      </div>

      <div class="formGroup">
        <label for="phone" class="font-14 font-bold"
          >전화번호<span class="required">*</span></label
        >
        <input
          id="phone"
          v-model="phone"
          type="text"
          :class="['inputField', { error: errors.phone }]"
        />
        <p v-if="errors.phone" class="errorMessage font-13">
          전화번호를 입력해주세요
        </p>
      </div>

      <div class="buttonGroup">
        <button class="cancelButton font-14 font-regular" @click="close">
          취소
        </button>
        <button class="saveButton font-14 font-bold" @click="save">저장</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// props로 기존 유저 정보 받기
const props = defineProps({
  name: String,
  email: String,
  phone: String,
});

const emit = defineEmits(['close']);

const name = ref('');
const email = ref('');
const phone = ref('');

const errors = ref({
  name: false,
  email: false,
  phone: false,
});

// props 값 → ref로 세팅 (모달 열릴 때 자동으로 반영)
watch(
  () => props,
  () => {
    name.value = props.name;
    email.value = props.email;
    phone.value = props.phone;
  },
  { immediate: true, deep: true }
);

const close = () => emit('close');

const save = () => {
  // 유효성 검사
  errors.value.name = name.value.trim() === '';
  errors.value.email = email.value.trim() === '';
  errors.value.phone = phone.value.trim() === '';

  if (!errors.value.name && !errors.value.email && !errors.value.phone) {
    emit('update', {
      name: name.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
    });
    emit('close');
  }
};

const changeProfile = () => {
  alert('프로필 이미지 변경 기능은 추후 구현됩니다.');
};
</script>

<style scoped>
.modalOverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modalContainer {
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.modalHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modalTitle {
  color: var(--text-login);
}

.closeButton {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.profileImageSection {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0 16px;
}

.imageWrapper {
  position: relative;
  width: 84px;
  height: 84px;
}

.profileImage {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background-color: var(--input-bg-3);
}

.editBadge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
}

.imageHint {
  color: var(--text-bluegray);
  margin-top: 8px;
}

.formGroup {
  margin-bottom: 16px;
}

.inputField {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  background-color: var(--input-bg-1);
  border: 1px solid transparent;
  border-radius: 8px;
  outline: none;
}

.inputField.error {
  border-color: var(--alert-strong);
}

.required {
  color: var(--alert-strong);
  margin-left: 4px;
}

.errorMessage {
  color: var(--alert-strong);
  margin-top: 6px;
}

.buttonGroup {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}

.cancelButton {
  background-color: var(--input-bg-2);
  color: var(--text-bluegray);
  border: none;
  padding: 12px;
  flex: 1;
  margin-right: 8px;
  border-radius: 8px;
}

.saveButton {
  background-color: var(--base-blue-dark);
  color: white;
  border: none;
  padding: 12px;
  flex: 1;
  border-radius: 8px;
}
</style>
