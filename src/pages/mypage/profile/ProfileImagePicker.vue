<script setup>
import { ref, watch } from "vue";
import imgSprout from "@/assets/images/icons/profile/profile_edit_sprout.png";
import imgBeard from "@/assets/images/icons/profile/profile_edit_beard.png";
import imgEyelash from "@/assets/images/icons/profile/profile_edit_eyelash.png";
import imgCarrot from "@/assets/images/icons/profile/profile_edit_carrot.png";

const profileImages = [imgSprout, imgBeard, imgEyelash, imgCarrot];

// 숫자 ID만 주고받자
const props = defineProps({ modelValue: { type: Number, default: 0 } });
const emit = defineEmits(["close", "update:modelValue", "save"]);

// 선택된 ID (0~3)
const selectedId = ref(
  Number.isInteger(props.modelValue) ? props.modelValue : 0
);

// 부모 변경 반영
watch(
  () => props.modelValue,
  (v) => {
    if (Number.isInteger(v)) selectedId.value = v;
  }
);

// 썸네일 클릭 -> 숫자 ID로 v-model 업데이트
const choose = (i) => {
  selectedId.value = i;
  emit("update:modelValue", i);
};

// 저장 -> 숫자 ID로 save 이벤트
const onSave = () => emit("save", selectedId.value);

// 픽커 내부 토스트
const showToast = ref(false);
const toastMessage = ref("");

// 부모가 호출할 공개 함수
function showSavedToast(msg = "프로필 이미지가 변경되었습니다!") {
  toastMessage.value = msg;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
    emit("close"); // 잠깐 보여주고 팝업 닫기
  }, 1200);
}

defineExpose({ showSavedToast });
</script>

<template>
  <div class="pickerOverlay" @click.self="$emit('close')">
    <div class="pickerContainer">
      <div class="pickerHeader">
        <span class="font-16 font-bold">프로필 사진 선택</span>
        <button class="pickerClose" @click="$emit('close')">
          <img
            src="@/assets/images/icons/common/x.png"
            alt="닫기"
            class="closeImgBtn"
          />
        </button>
      </div>

      <!-- 픽커 내부 토스트 -->
      <transition name="fade">
        <div v-if="showToast" class="pickerToast">{{ toastMessage }}</div>
      </transition>

      <div class="imageGrid">
        <button
          v-for="(img, i) in profileImages"
          :key="i"
          class="imageBtn"
          :class="{ selected: i === selectedId }"
          @click="choose(i)"
        >
          <img :src="img" alt="프로필" />
        </button>
      </div>

      <button class="saveBtn" @click="onSave">저장</button>
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
  position: relative; /* 토스트 위치 기준 */
  background: #fff;
  border-radius: 6px;
  max-width: 280px;
  width: 100%;
  padding: 20px;
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
  margin-bottom: 20px;
}
/* 픽커 내부 토스트 */
.pickerToast {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translate(-50%, -100%);
  background: var(--base-blue-dark);
  color: #fff;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  white-space: nowrap;
  z-index: 10001;
  pointer-events: none;
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
  width: 20px;
  height: 20px;
  display: block;
}

.imageGrid {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px 5px;
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
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #fff;
  display: block;
}
.imageBtn.selected img {
  box-shadow: 0 0 0 2px var(--base-blue-dark);
}

/* 저장 버튼 */
.saveBtn {
  margin-top: 18px;
  width: 100%;
  border: none;
  border-radius: 6px;
  padding: 10px 0;
  background: var(--base-blue-dark);
  color: #fff;
  font-size: 13px;
  cursor: pointer;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
