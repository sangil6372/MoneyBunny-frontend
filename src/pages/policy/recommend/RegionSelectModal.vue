<script setup>
import { ref, computed } from 'vue';
import { regions } from '@/constants/regions.js';
import { onMounted, onUnmounted } from 'vue';

onMounted(() => {
  document.body.classList.add('modal-open');
});

onUnmounted(() => {
  document.body.classList.remove('modal-open');
});

const emit = defineEmits(['close', 'selected']);

const search = ref('');
const selectedSido = ref('');
const selectedGugun = ref('');

const filteredSidoList = computed(() => {
  if (!search.value) return regions;
  const keyword = search.value.trim().toLowerCase();
  return Object.fromEntries(
    Object.entries(regions).filter(([sido]) =>
      sido.toLowerCase().includes(keyword)
    )
  );
});

const selectSido = (sido) => {
  selectedSido.value = sido;
  selectedGugun.value = '';
};

const selectGugun = (gugun) => {
  if (gugun === '전체') {
    selectedGugun.value = gugun;
    // emit('selected', selectedSido.value);
    // emit('close');
  } else {
    selectedGugun.value = gugun;
  }
};

const reset = () => {
  selectedSido.value = '';
  selectedGugun.value = '';
  search.value = '';
};

const apply = () => {
  if (canApply.value) {
    emit('selected', `${selectedSido.value} ${selectedGugun.value}`);
    emit('close');
  }
};

const canApply = computed(() => selectedSido.value && selectedGugun.value);
</script>

<template>
  <div class="modalWrapper">
    <div class="modalContainer">
      <div class="modalHeader">
        <div class="modalTitle">지역 선택</div>
        <button class="closeBtn" @click="$emit('close')">✕</button>
      </div>

      <div class="regionSelectBox">
        <div class="columnsWrapper">
          <!-- 시/도 -->
          <div class="sidoColumn">
            <div class="sidoTitle">시/도</div>
            <div class="scrollArea">
              <div
                v-for="(guguns, sido) in filteredSidoList"
                :key="sido"
                :class="['sidoItem', { selected: selectedSido === sido }]"
                @click="selectSido(sido)"
              >
                {{ sido }}
              </div>
            </div>
          </div>

          <!-- 구/군 -->
          <div class="gugunColumn">
            <div class="gugunTitle">구/군</div>
            <div class="scrollArea">
              <div v-if="selectedSido">
                <div
                  v-for="gugun in regions[selectedSido]"
                  :key="gugun"
                  :class="['gugunItem', { selected: selectedGugun === gugun }]"
                  @click="selectGugun(gugun)"
                >
                  {{ gugun }}
                </div>
              </div>
              <div v-else class="emptyText">시/도를 먼저 선택하세요</div>
            </div>
          </div>
        </div>
      </div>

      <div class="modalFooter">
        <button class="resetBtn" @click="reset">초기화</button>
        <button class="applyBtn" @click="apply" :disabled="!canApply">
          적용
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modalWrapper {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modalContainer {
  background: rgba(255, 255, 255, 0.97);
  border-radius: 12px;
  width: 90%;
  max-width: 350px;
  max-height: 85vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.modalHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  background-color: white;
}

.modalTitle {
  font-size: 18px;
  font-weight: bold;
}

.closeBtn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.regionSelectBox {
  margin: 20px 10px;
  flex: none;
}

.columnsWrapper {
  display: flex;
  max-height: 300px;
  gap: 6px;
  margin-bottom: 15px;
}

.sidoColumn {
  flex: 0.8;
  display: flex;
  flex-direction: column;
  height: 80%;
}

.gugunColumn {
  flex: 1.1;
  display: flex;
  flex-direction: column;
  height: 80%;
}

.sidoTitle,
.gugunTitle {
  font-size: 15px;
  font-weight: bold;
  color: var(--text-bluegray);
  margin-bottom: 12px;
  text-align: center;
}

.sidoItem,
.gugunItem {
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
  font-size: 15px;
}

.sidoItem.selected,
.gugunItem.selected {
  background-color: rgba(160, 160, 180, 0.2); /* 옅은 파스텔 톤 + 투명도 */
}

.emptyText {
  font-size: 14px;
  color: var(--text-disabled);
  text-align: center;
  margin-top: 15px;
}

.modalFooter {
  display: flex;
  gap: 8px;
  margin-top: 15px;
}
.resetBtn {
  flex: 0.8;
  border-radius: 8px;
  border: 1.5px solid var(--input-outline-2);
  background: var(--reset-buttn);
  color: var(--text-bluegray);
  padding: 12px 0;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
}
.applyBtn {
  flex: 1.1;
  background-color: var(--base-blue-dark);
  color: white;
  border: none;
  padding: 12px 0;
  font-size: 15px;
  border-radius: 8px;
  cursor: pointer;
}

.applyBtn:disabled {
  background-color: rgba(160, 160, 180, 0.2);
  color: var(--text-bluegray);
  cursor: not-allowed;
}

.scrollArea {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 6px;
  /* 크롬, 사파리, 엣지용 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.scrollArea::-webkit-scrollbar {
  width: 3.5px;
  display: none;
}
.scrollArea::-webkit-scrollbar-thumb {
  background-color: var(--input-disabled-2);
  border-radius: 3px;
}
</style>
