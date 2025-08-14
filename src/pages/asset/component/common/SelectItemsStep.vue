<template>
  <div class="select-step">
    <!-- 헤더 -->
    <div class="header">
      <div></div>
      <!-- 빈 공간 -->
      <h2>{{ type === 'account' ? '계좌 선택' : '카드 선택' }}</h2>
      <button @click="$emit('close')" :disabled="isRegistering">✕</button>
    </div>

    <!-- 기관 정보 -->
    <div class="institution">
      <img :src="getLogo()" :alt="institutionInfo.institutionName" />
      <div>
        <div class="name">{{ institutionInfo.institutionName }}</div>
        <div class="id">{{ institutionInfo.loginId }}</div>
      </div>
    </div>

    <!-- 로딩 -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>불러오는 중...</p>
    </div>

    <!-- 계좌/카드 목록 -->
    <div v-else class="items">
      <div class="items-header">
        <p class="items-title">
          {{ type === 'account' ? '계좌를 선택하세요' : '카드를 선택하세요' }}
        </p>
        <button
          v-if="items.length > 1"
          @click="toggleSelectAll"
          class="select-all-btn"
          :disabled="isRegistering"
        >
          {{ isAllSelected ? '전체 해제' : '전체 선택' }}
        </button>
      </div>

      <div
        v-for="item in items"
        :key="item.id"
        class="item"
        :class="{
          selected: selectedItems.includes(item.id),
          disabled: isRegistering,
        }"
        @click="!isRegistering && toggleSelection(item.id)"
      >
        <div class="info">
          <div class="item-name">{{ item.name }}</div>
          <div class="item-number">{{ item.number }}</div>
          <div class="item-balance" v-if="type === 'account'">
            {{ formatMoney(item.balance) }}
          </div>
        </div>
        <div
          class="checkbox"
          :class="{ checked: selectedItems.includes(item.id) }"
        >
          ✓
        </div>
      </div>

      <div v-if="selectedItems.length > 0" class="selection-info">
        <span>{{ selectedItems.length }}개 선택됨</span>
      </div>
    </div>

    <!-- 버튼 -->
    <div class="actions">
      <button
        @click="submit"
        :disabled="selectedItems.length === 0 || isRegistering"
        class="submit full-width"
      >
        <template v-if="isRegistering">
          <div class="btn-spinner"></div>
          등록 중...
        </template>
        <template v-else> 추가 ({{ selectedItems.length }}) </template>
      </button>
    </div>

    <!-- 🎯 등록 중 로딩 오버레이 -->
    <div v-if="isRegistering" class="overlay">
      <div class="overlay-content">
        <img
          src="@/assets/images/icons/bunny/moneybunny2.png"
          alt="토끼"
          class="bunny"
        />
        <div class="text">
          <div class="title">
            {{
              type === 'account'
                ? '계좌를 등록하고 있어요'
                : '카드를 등록하고 있어요'
            }}
            <span class="dots"><span>.</span><span>.</span><span>.</span></span>
          </div>
          <div class="subtitle">잠시만 기다려주세요...</div>
        </div>
        <div class="progress">
          <div class="bar"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAssetStore } from '@/stores/asset';
import {
  connectAccount,
  registerAccounts,
  connectCard,
  registerCards,
} from '@/api/assetApi';
import { getBankLogo } from '@/assets/utils/bankLogoMap.js';
import { getCardLogo } from '@/assets/utils/cardLogoMap.js';

const assetStore = useAssetStore();

const props = defineProps({
  type: String,
  institutionInfo: Object,
  preloadedItems: { type: Array, default: () => [] }, // 1단계에서 받아온 목록
});
const emit = defineEmits(['back', 'close', 'items-selected']);

const items = ref([]);
const selectedItems = ref([]);
const isLoading = ref(true);
const isRegistering = ref(false); // 🎯 등록 중 상태 추가

const isAllSelected = computed(
  () =>
    items.value.length > 0 && selectedItems.value.length === items.value.length
);

const getLogo = () =>
  props.type === 'account'
    ? getBankLogo(props.institutionInfo.institutionName)
    : getCardLogo(props.institutionInfo.institutionName);

const formatMoney = (amount) =>
  new Intl.NumberFormat('ko-KR').format(amount) + '원';

const toggleSelection = (itemId) => {
  if (isRegistering.value) return; // 등록 중에는 선택 변경 불가

  const idx = selectedItems.value.indexOf(itemId);
  if (idx > -1) selectedItems.value.splice(idx, 1);
  else selectedItems.value.push(itemId);
};

const toggleSelectAll = () => {
  if (isRegistering.value) return; // 등록 중에는 전체선택 불가

  if (isAllSelected.value) selectedItems.value = [];
  else selectedItems.value = items.value.map((item) => item.id);
};

// 1. onMounted에서 preloadedItems 우선 사용, 없으면 loadItems 실행
onMounted(() => {
  if (props.preloadedItems && props.preloadedItems.length > 0) {
    // 이미 데이터 있음: 바로 사용!
    items.value = props.preloadedItems.map((item, i) => ({
      ...item,
      id: item.accountNumber || item.cardMaskedNumber || item.id || `item-${i}`,
      name: item.accountName || item.cardName,
      number: item.accountNumber || item.cardMaskedNumber,
      balance: item.balance || 0,
      raw: item,
    }));
    console.log('🔥 [SelectItemsStep] items:', items.value);
    isLoading.value = false;
  } else {
    // 실수로 preloadedItems 없거나, 새로고침 등 예외 → API로 재호출
    loadItems();
  }
});

// 2. 만약 다시 API로 직접 목록 불러야 할 때 (예외/테스트용)
async function loadItems() {
  isLoading.value = true;
  try {
    let res;
    if (props.type === 'account') {
      res = await connectAccount({
        organization: props.institutionInfo.institutionCode,
        loginId: props.institutionInfo.loginId,
        password: props.institutionInfo.password,
      });
      items.value = res.data.map((item, i) => ({
        ...item,
        id: item.accountNumber || item.id || `acc-${i}`,
        name: item.accountName,
        number: item.accountNumber,
        balance: item.balance,
        raw: item,
      }));
    } else {
      res = await connectCard({
        organization: props.institutionInfo.institutionCode,
        loginId: props.institutionInfo.loginId,
        password: props.institutionInfo.password,
      });
      items.value = res.data.map((item, i) => ({
        ...item,
        id: item.cardMaskedNumber || item.id || `card-${i}`,
        name: item.cardName,
        number: item.cardMaskedNumber,
        balance: 0,
        raw: item,
      }));
    }
  } catch (e) {
    alert('목록을 불러오는 데 실패했습니다.');
    items.value = [];
  } finally {
    isLoading.value = false;
    selectedItems.value = [];
  }
}

// 3. 선택 후 등록/추가 (등록 API 호출) - 🎯 로딩 처리 추가
const submit = async () => {
  if (selectedItems.value.length === 0 || isRegistering.value) return;

  const selectedData = items.value.filter((item) =>
    selectedItems.value.includes(item.id)
  );

  // 🎯 등록 로딩 시작
  isRegistering.value = true;
  let res = null;

  try {
    if (props.type === 'account') {
      res = await registerAccounts(selectedData.map((item) => item.raw));
    } else {
      res = await registerCards(selectedData.map((item) => item.raw));
    }

    // 등록 성공 응답의 최신 요약을 Pinia에 즉시 반영
    if (res?.data) {
      assetStore.$patch({ summary: res.data });
    } else {
      await assetStore.loadSummary(true);
    }

    emit('items-selected', {
      institutionInfo: props.institutionInfo,
      selectedItems: selectedData,
      type: props.type,
    });
  } catch (e) {
    console.error('등록 실패:', e);
    alert('등록 중 오류! 다시 시도해 주세요.');
  } finally {
    // 🎯 등록 로딩 종료
    isRegistering.value = false;
  }
};
</script>

<style scoped>
.select-step {
  width: 100%;
  position: relative; /* 오버레이를 위한 relative */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}

.header button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.header h2 {
  font-size: 1rem;
  color: var(--base-blue-dark);
  margin: 0;
}

.institution {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--input-bg-1);
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.institution img {
  width: 32px;
  height: 32px;
  border-radius: 6px;
}

.name {
  font-weight: 600;
  color: var(--base-blue-dark);
}

.id {
  font-size: 0.75rem;
  color: var(--text-lightgray);
}

.loading {
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--base-blue-dark);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.items-title {
  font-size: 0.9rem;
  color: var(--text-darkgray);
  margin: 0;
  font-weight: 500;
}

.select-all-btn {
  background: none;
  border: 1px solid var(--base-blue-dark);
  color: var(--base-blue-dark);
  padding: 0.3rem 0.6rem;
  border-radius: 0.3rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.select-all-btn:hover:not(:disabled) {
  background: var(--base-blue-dark);
  color: white;
}

.select-all-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border: 1px solid var(--input-outline);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.item.selected {
  background: var(--base-blue-light);
  border-color: var(--base-blue-dark);
}

.item.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.item-name {
  font-weight: 600;
  color: var(--base-blue-dark);
  margin-bottom: 0.25rem;
}

.item-number {
  font-size: 0.75rem;
  color: var(--text-lightgray);
  margin-bottom: 0.25rem;
}

.item-balance {
  font-weight: 600;
  color: var(--base-blue-dark);
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--input-outline);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: transparent;
  transition: all 0.2s;
}

.checkbox.checked {
  background: var(--base-blue-dark);
  border-color: var(--base-blue-dark);
  color: white;
}

.selection-info {
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-darkgray);
  margin-top: 1rem;
  padding: 0.5rem;
  background: var(--input-bg-1);
  border-radius: 0.4rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

/* 전체 너비 버튼 */
.full-width {
  width: 100%;
}

.cancel,
.submit {
  flex: 1;
  padding: 0.7rem;
  border: none;
  border-radius: 0.4rem;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.cancel {
  background: var(--input-disabled-1);
  color: var(--text-darkgray);
}

.cancel:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit {
  background: var(--base-blue-dark);
  color: white;
}

.submit:disabled {
  background: var(--input-disabled-1);
  color: var(--text-lightgray);
  cursor: not-allowed;
}

/* 🎯 버튼 스피너 */
.btn-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* 🎯 등록 중 오버레이 */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.overlay-content {
  text-align: center;
  color: var(--base-blue-dark);
}

.bunny {
  width: auto;
  height: 5rem;
  max-width: 6rem;
  object-fit: contain;
  animation: float 2s ease-in-out infinite;
}

.text {
  margin-bottom: 1rem;
}

.title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 0.875rem;
  color: var(--text-darkgray);
}

.dots span {
  animation: blink 1.4s infinite ease-in-out;
}

.dots span:nth-child(1) {
  animation-delay: 0s;
}
.dots span:nth-child(2) {
  animation-delay: 0.2s;
}
.dots span:nth-child(3) {
  animation-delay: 0.4s;
}

.progress {
  width: 10rem;
  height: 0.25rem;
  background: var(--input-bg-3);
  border-radius: 0.125rem;
  overflow: hidden;
  margin: 0 auto;
}

.bar {
  height: 100%;
  background: linear-gradient(90deg, var(--text-green), var(--sub-mint));
  animation: move 1.5s ease-in-out infinite;
}

/* 애니메이션 */
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-0.25rem);
  }
}

@keyframes blink {
  0%,
  80%,
  100% {
    opacity: 0.3;
  }
  40% {
    opacity: 1;
  }
}

@keyframes move {
  0% {
    width: 30%;
    margin-left: 0;
  }
  50% {
    width: 70%;
    margin-left: 15%;
  }
  100% {
    width: 30%;
    margin-left: 70%;
  }
}
</style>
