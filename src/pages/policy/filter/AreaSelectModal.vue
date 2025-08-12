<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { regions } from '@/constants/regions.js';
import { regionCodeMap } from '@/assets/utils/regionCodeMap.js';

// ‘시’를 붙일 시/도 리스트
const needsSi = [
  '서울',
  '부산',
  '대구',
  '인천',
  '광주',
  '대전',
  '울산',
  '세종',
];
// 시/도에 ‘시’ 붙여 렌더링
const formatSido = (sido) => (needsSi.includes(sido) ? `${sido}시` : sido);

const emit = defineEmits(['close', 'selected']);

const search = ref('');
const selectedSido = ref('');
const selectedGugun = ref('');

// 복수 선택된 지역 배열
const selectedRegions = ref([]); // [{ sido: '서울', gugun: '동작구' }, ...]

// 지역 코드 → 지역명 역매핑 테이블 생성
const codeToRegionName = {};
Object.entries(regionCodeMap).forEach(([sido, guguns]) => {
  Object.entries(guguns).forEach(([gugun, code]) => {
    // '전체'는 gugun === '전체', 빈 문자열로도 매핑
    if (gugun === '전체') {
      codeToRegionName[code] = { sido, gugun: '' };
    } else {
      codeToRegionName[code] = { sido, gugun };
    }
  });
});

const props = defineProps({
  initialRegionCodes: { type: Array, default: () => [] }, // ex: ['11680', '11110']
});

onMounted(() => {
  document.body.classList.add('modal-open');
  // 코드값이 넘어오면 지역명으로 변환하여 selectedRegions에 반영
  if (props.initialRegionCodes && props.initialRegionCodes.length > 0) {
    selectedRegions.value = props.initialRegionCodes
      .map((code) => {
        const region = codeToRegionName[code];
        if (!region) return null;
        return { sido: region.sido, gugun: region.gugun };
      })
      .filter(Boolean);
  }
});
onUnmounted(() => {
  document.body.classList.remove('modal-open');
});

const filteredSidoList = computed(() => {
  if (!search.value) return regions;
  const keyword = search.value.trim().toLowerCase();
  return Object.fromEntries(
    Object.entries(regions).filter(([sido]) =>
      sido.toLowerCase().includes(keyword)
    )
  );
});

// 시/도 선택
const selectSido = (sido) => {
  selectedSido.value = sido;
  selectedGugun.value = '';
};

const selectGugun = (gugun) => {
  // '전체' 선택 시
  if (gugun === '전체') {
    // 해당 시/도의 기존 선택 모두 제거
    selectedRegions.value = selectedRegions.value.filter(
      (r) => r.sido !== selectedSido.value
    );
    // 시/도만 추가 (gugun 빈문자열로 처리)
    selectedRegions.value.push({
      sido: selectedSido.value,
      gugun: '',
    });
  } else {
    // '전체'가 이미 선택된 상태면 개별 구군 추가 불가
    const hasFullSido = selectedRegions.value.some(
      (r) =>
        r.sido === selectedSido.value && (r.gugun === '' || r.gugun === '전체')
    );
    if (hasFullSido) return;

    // 이미 선택된 구군인지 확인
    const already = selectedRegions.value.some(
      (item) => item.sido === selectedSido.value && item.gugun === gugun
    );
    if (!already) {
      selectedRegions.value.push({
        sido: selectedSido.value,
        gugun,
      });
    }
  }

  selectedGugun.value = '';
};

// 선택된 태그 제거
const removeRegion = (idx) => {
  selectedRegions.value.splice(idx, 1);
};

const reset = () => {
  selectedSido.value = '';
  selectedGugun.value = '';
  search.value = '';
  selectedRegions.value = [];
};
const apply = () => {
  emit(
    'selected',
    selectedRegions.value.map((r) => `${r.sido} ${r.gugun}`)
  );
  emit('close');
};
const canApply = computed(() => selectedRegions.value.length > 0);
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
              <!-- '전체' 선택지 따로 만들지 말고 그냥 regions[selectedSido] 그대로 렌더링 -->
              <div v-if="selectedSido">
                <div
                  v-for="gugun in regions[selectedSido]"
                  :key="gugun"
                  :class="[
                    'gugunItem',
                    {
                      selected:
                        // 현재 클릭해서 선택 중인 구군
                        selectedGugun === gugun,
                      already:
                        // 이미 선택된 구군이거나,
                        // 또는 해당 시/도의 전체가 선택된 상태면 모두 이미 선택 상태로 표시
                        selectedRegions.some(
                          (r) =>
                            r.sido === selectedSido &&
                            (r.gugun === gugun || r.gugun === '')
                        ),
                    },
                  ]"
                  @click="selectGugun(gugun)"
                >
                  {{ gugun }}
                  <span
                    v-if="
                      selectedRegions.some(
                        (r) =>
                          r.sido === selectedSido &&
                          (r.gugun === gugun || r.gugun === '')
                      )
                    "
                    class="alreadyText"
                  ></span>
                </div>
              </div>

              <div v-else class="emptyText">시/도를 먼저 선택하세요</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 선택된 지역 태그 -->
      <div v-if="selectedRegions.length" class="selectedRegions horizontal">
        <span
          v-for="(region, idx) in selectedRegions"
          :key="region.sido + region.gugun"
          class="regionTag"
        >
          <!-- formatSido 함수로 ‘시’ 붙이고 -->
          {{ formatSido(region.sido) }}
          <template v-if="region.gugun">
            {{ region.gugun }}
          </template>
          <button class="removeBtn" @click="removeRegion(idx)">✕</button>
        </span>
      </div>

      <div class="modalFooter">
        <button class="resetBtn" @click="reset">초기화</button>
        <button class="applyBtn" @click="apply">적용</button>
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
  border-radius: 6px;
  width: min(92vw, 320px);
  max-width: 320px;
  max-height: 86dvh;
  backdrop-filter: blur(6px);
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.modalHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modalTitle {
  font-size: 16px;
  font-weight: bold;
}
.closeBtn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
}

/* ---- 선택된 지역 태그 ---- */
/* .selectedRegions {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin: 15px 0 0 0;
  min-height: 38px;
} */

.selectedRegions {
  position: sticky;
  bottom: calc(env(safe-area-inset-bottom, 0) + 64px);
  background: #fff;
  padding: 8px 0;
  z-index: 3;
}

.selectedRegions.horizontal {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 5px;
  margin: 20px 0 0 0;
  min-height: 40px;
  scrollbar-width: thin;
  scrollbar-color: var(--input-disabled-1) transparent;

  scrollbar-width: none;
  -ms-overflow-style: none;
}
.selectedRegions.horizontal::-webkit-scrollbar {
  display: none;
}

.regionTag {
  margin-top: 3px;
  /* margin-bottom: px; */
  height: 28px;
  background: var(--input-bg-1);
  color: var(--text-login);
  border-radius: 6px;
  padding: 6px 11px;
  font-size: 11px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  white-space: nowrap;
  writing-mode: horizontal-tb;
  word-break: normal;
}

.removeBtn {
  background: none;
  border: none;
  color: var(--text-lightgray);
  font-size: 11px;
  cursor: pointer;
  margin-left: 3px;
  margin-right: 0;
  padding: 0;
}

/* ---- 지역 선택 컬럼 ---- */
.regionSelectBox {
  margin: 12px 10px;
  flex: none;
}
.columnsWrapper {
  display: flex;
  max-height: 290px;
  gap: 5px;
  /* margin-bottom: 10px; */
}

.sidoColumn {
  flex: 0.9;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.gugunColumn {
  flex: 1.1;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.sidoTitle,
.gugunTitle {
  position: sticky;
  top: 0;
  z-index: 2;
  font-size: 14px;
  font-weight: bold;
  color: var(--text-bluegray);
  margin-bottom: 6px;
  text-align: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--input-outline-2);
}

.sidoItem,
.gugunItem {
  min-height: 40px;
  font-size: 13px;
  /* padding: 10px; */
  border-radius: 6px;
  text-align: center;

  display: flex;
  align-items: center;
  justify-content: center;
}

.sidoItem.selected,
.gugunItem.selected {
  background-color: rgba(160, 160, 180, 0.14);
  /* font-weight: bold; */
}
.gugunItem.already {
  cursor: default;
  opacity: 0.8;
  pointer-events: none;
}

.emptyText {
  font-size: 12px;
  color: var(--text-disabled);
  text-align: center;
  margin-top: 13px;
}

.modalFooter {
  position: sticky;
  bottom: 0;
  margin-top: 5px;
  display: flex;
  gap: 6px;
  padding: 8px 0 calc(8px + env(safe-area-inset-bottom, 0));
  /* border-top: 1px solid var(--input-outline-2); */
}

.resetBtn {
  flex: 0.9;
  border-radius: 6px;
  border: 1.5px solid var(--input-outline-2);
  background: white;
  color: var(--base-blue-dark);
  padding: 10px 0;
  font-size: 14px;
  cursor: pointer;
}
.applyBtn {
  flex: 1.1;
  background-color: var(--base-blue-dark);
  color: white;
  border: none;
  padding: 10px 0;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
}

.applyBtn:disabled {
  background-color: rgba(160, 160, 180, 0.2);
  color: var(--text-bluegray);
  cursor: not-allowed;
}

.scrollArea {
  position: relative;
  max-height: 270px;
  overflow-y: auto;
  /* padding-right: 6px; */
  /* 크롬, 사파리, 엣지용 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.scrollArea::-webkit-scrollbar {
  /* width: 3.5px; */
  display: none;
}
.scrollArea::-webkit-scrollbar-thumb {
  background-color: var(--input-disabled-2);
  border-radius: 3px;
}
.gugunItem.already {
  opacity: 0.55;
  pointer-events: none;
}
</style>
