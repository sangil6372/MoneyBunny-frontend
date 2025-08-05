<template>
  <div class="select-step">
    <!-- 헤더 -->
    <div class="header">
      <button @click="$emit('back')">←</button>
      <h2>{{ type === 'account' ? '계좌 선택' : '카드 선택' }}</h2>
      <button @click="$emit('close')">✕</button>
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
        >
          {{ isAllSelected ? '전체 해제' : '전체 선택' }}
        </button>
      </div>

      <div
        v-for="item in items"
        :key="item.id"
        class="item"
        :class="{ selected: selectedItems.includes(item.id) }"
        @click="toggleSelection(item.id)"
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
      <button @click="$emit('back')" class="cancel">이전</button>
      <button
        @click="submit"
        :disabled="selectedItems.length === 0"
        class="submit"
      >
        추가 ({{ selectedItems.length }})
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  connectAccount,
  registerAccounts,
  connectCard,
  registerCards,
} from '@/api/assetApi';
import { getBankLogo } from '@/assets/utils/bankLogoMap.js';
import { getCardLogo } from '@/assets/utils/cardLogoMap.js';

const props = defineProps({
  type: String,
  institutionInfo: Object,
  preloadedItems: { type: Array, default: () => [] }, // 1단계에서 받아온 목록
});
const emit = defineEmits(['back', 'close', 'items-selected']);

const items = ref([]);
const selectedItems = ref([]);
const isLoading = ref(true);

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
  const idx = selectedItems.value.indexOf(itemId);
  if (idx > -1) selectedItems.value.splice(idx, 1);
  else selectedItems.value.push(itemId);
};

const toggleSelectAll = () => {
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

// 3. 선택 후 등록/추가 (등록 API 호출)
const submit = async () => {
  if (selectedItems.value.length === 0) return;
  const selectedData = items.value.filter((item) =>
    selectedItems.value.includes(item.id)
  );
  try {
    if (props.type === 'account') {
      await registerAccounts(selectedData.map((item) => item.raw));
    } else {
      await registerCards(selectedData.map((item) => item.raw));
    }
    emit('items-selected', {
      institutionInfo: props.institutionInfo,
      selectedItems: selectedData,
      type: props.type,
    });
  } catch (e) {
    alert('등록 중 오류! 다시 시도해 주세요.');
  }
};
</script>

<style scoped>
.select-step {
  width: 100%;
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

.select-all-btn:hover {
  background: var(--base-blue-dark);
  color: white;
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

.cancel,
.submit {
  flex: 1;
  padding: 0.7rem;
  border: none;
  border-radius: 0.4rem;
  cursor: pointer;
  font-weight: 500;
}

.cancel {
  background: var(--input-disabled-1);
  color: var(--text-darkgray);
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
</style>
