<script setup>
import imgSprout from '@/assets/images/icons/profile/profile_edit_sprout.png';
import imgBeard from '@/assets/images/icons/profile/profile_edit_beard.png';
import imgEyelash from '@/assets/images/icons/profile/profile_edit_eyelash.png';
import imgCarrot from '@/assets/images/icons/profile/profile_edit_carrot.png';

const profileImages = [imgSprout, imgBeard, imgEyelash, imgCarrot];
defineProps({ modelValue: String });
defineEmits(['close', 'select']);
</script>

<template>
  <div class="pickerOverlay" @click.self="$emit('close')">
    <div class="pickerContainer">
      <div class="pickerHeader">
        <span class="font-18 font-bold">프로필 사진 선택</span>
        <button class="pickerClose" @click="$emit('close')">
          <img
            src="@/assets/images/icons/common/x.png"
            alt="닫기"
            class="closeImgBtn"
          />
        </button>
      </div>
      <div class="imageGrid">
        <button
          v-for="(img, i) in profileImages"
          :key="img"
          class="imageBtn"
          :class="{ selected: img === modelValue }"
          @click="$emit('select', img)"
        >
          <img :src="img" alt="프로필" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pickerOverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}
.pickerContainer {
  background: #fff;
  border-radius: 8px;
  max-width: 360px;
  width: 90%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}
.pickerHeader {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.pickerClose {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.closeImgBtn {
  width: 24px;
  height: 24px;
  display: block;
}

.imageGrid {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 33px 15px;
  justify-items: center;
  align-items: center;
}
.imageBtn {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  outline: none;
  border-radius: 50%;
}
.imageBtn img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #fff;
  display: block;
}
.imageBtn.selected img {
  box-shadow: 0 0 0 2px var(--base-blue-dark);
}
</style>
