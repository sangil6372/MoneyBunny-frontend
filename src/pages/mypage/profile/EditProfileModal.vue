<script setup>
import { ref, watch } from 'vue';
import ProfileImagePicker from './ProfileImagePicker.vue';

// 프로필 이미지 import (경로 확인!)
import imgSprout from '@/assets/images/icons/profile/profile_edit_sprout.png';
import imgBeard from '@/assets/images/icons/profile/profile_edit_beard.png';
import imgEyelash from '@/assets/images/icons/profile/profile_edit_eyelash.png';
import imgCarrot from '@/assets/images/icons/profile/profile_edit_carrot.png';

const profileImages = [imgSprout, imgBeard, imgEyelash, imgCarrot];

// props로 기존 유저 정보 받기
const props = defineProps({
  name: String,
  email: String,
  phone: String,
  profileImage: String,
});

const emit = defineEmits(['close', 'update']);

// state 정의
const name = ref('');
const email = ref('');
const phone = ref('');
const profileImage = ref(props.profileImage || imgBeard);

const pickerOpen = ref(false);

const errors = ref({ name: false, email: false, phone: false });

// watch로 값 반영
watch(
  () => props,
  () => {
    name.value = props.name;
    email.value = props.email;
    phone.value = props.phone;
    profileImage.value = props.profileImage || imgBeard;
  },
  { immediate: true, deep: true }
);

const close = () => emit('close');

const save = () => {
  errors.value.name = name.value.trim() === '';
  errors.value.email = email.value.trim() === '';
  errors.value.phone = phone.value.trim() === '';

  if (!errors.value.name && !errors.value.email && !errors.value.phone) {
    emit('update', {
      name: name.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      profileImage: profileImage.value,
    });
    emit('close');
  }
};

const changeProfile = () => {
  pickerOpen.value = true;
};

const onProfileSelect = (img) => {
  profileImage.value = img;
  pickerOpen.value = false;
};
</script>

<template>
  <div class="modalOverlay" @click.self="close">
    <div class="modalContainer">
      <div class="modalHeader">
        <h2 class="modalTitle font-18 font-bold">프로필 수정</h2>
        <button class="closeButton" @click="close">✕</button>
      </div>

      <div class="profileImageSection">
        <div class="imageWrapper">
          <img
            :src="profileImage"
            alt="프로필"
            class="profileImage"
            @click="changeProfile"
          />
          <button class="editBadgeBtn" @click="changeProfile">
            <img
              src="@/assets/images/icons/mypage/edit.png"
              alt="수정 아이콘"
            />
          </button>
        </div>
        <p class="imageHint font-13 font-regular">
          프로필 사진을 변경하려면 클릭하세요
        </p>
      </div>

      <div class="formGroup">
        <label for="name" class="font-14 font-bold">
          이름<span class="required">*</span>
        </label>
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
        <label for="email" class="font-14 font-bold">
          이메일<span class="required">*</span>
        </label>
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
        <label for="phone" class="font-14 font-bold">
          전화번호<span class="required">*</span>
        </label>
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
        <button class="cancelButton font-15 font-regular" @click="close">
          취소
        </button>
        <button class="saveButton font-15 font-regular" @click="save">
          저장
        </button>
      </div>
      <!-- 프로필 선택 팝업 -->
      <ProfileImagePicker
        v-if="pickerOpen"
        :model-value="profileImage"
        @close="pickerOpen = false"
        @select="onProfileSelect"
      />
    </div>
  </div>
</template>

<style scoped>
.modalOverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modalContainer {
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
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
  width: 110px;
  height: 110px;
  margin: 0 auto;
}

.profileImage {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  /* background: var(--input-bg-3); */
  cursor: pointer;
  display: block;
}
.editBadgeBtn {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: var(--reset-button);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
}

.editBadgeBtn img {
  width: 20px;
  height: 20px;
  display: block;
}

.imageHint {
  color: var(--text-bluegray);
  margin-top: 13px;
}

.formGroup {
  margin-bottom: 16px;
}

.inputField {
  margin-top: 5px;
  width: 100%;
  padding: 12px;
  font-size: 15px;
  background-color: #fff;
  border: 1.5px solid var(--input-bg-1);
  border-radius: 8px;
  outline: none;
}

.inputField:focus {
  border-color: var(--input-bg-3);
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
