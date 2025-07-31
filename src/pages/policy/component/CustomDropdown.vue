<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  placeholder: String,
  options: Array,
  id: String, // 드롭다운 고유 ID 전달
});
const emit = defineEmits(['update:modelValue', 'open']);

const isOpen = ref(false);
const dropdownRef = ref(null);

const toggleDropdown = () => {
  emit('open', props.id); // 부모에 어떤 드롭다운이 열렸는지 알림
  isOpen.value = !isOpen.value;
};

const select = (option) => {
  emit('update:modelValue', option);
  isOpen.value = false;
};

// 외부 클릭 시 닫힘
const handleClickOutside = (e) => {
  if (!dropdownRef.value.contains(e.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

defineExpose({ isOpen }); // 부모가 제어할 수 있게 노출
</script>

<template>
  <div class="dropdown" ref="dropdownRef">
    <div class="dropdownButton" @click="toggleDropdown">
      <span class="dropdownValue">{{ modelValue || placeholder }}</span>
      <img
        src="@/assets/images/icons/policy/select_down.png"
        class="arrowIcon"
      />
    </div>

    <transition name="fade">
      <ul v-if="isOpen" class="dropdownList">
        <li
          v-for="option in options"
          :key="option"
          @click="select(option)"
          class="dropdownItem"
        >
          {{ option }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<style scoped>
.dropdown {
  position: relative;
  flex: 1;
}

.dropdownButton {
  width: 100%;
  padding: 10px 15px;
  border: 1.5px solid var(--input-outline);
  border-radius: 8px;
  cursor: pointer;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.arrowIcon {
  width: 16px;
  height: 16px;
}

.dropdownList {
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid var(--input-outline);
  border-radius: 8px;
  background-color: white;
  z-index: 1000;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  padding: 5px 0;
  scrollbar-width: thin;
}

.dropdownItem {
  padding: 10px 15px;
  cursor: pointer;
  list-style: none;
}

.dropdownItem:hover {
  background-color: var(--input-bg-2);
}

/* .fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
} */

/* .fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.95);
} */
</style>
