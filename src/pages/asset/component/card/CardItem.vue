<template>
  <div class="card-item">
    <!-- 카드 이미지 -->
    <img
      :src="card.cardImage"
      :alt="`${card.cardName} 이미지`"
      class="card-logo"
    />

    <!-- 카드 정보 -->
    <div class="card-info" @click="openDetail">
      <div class="info-top">
        <div class="name-section">
          <!-- 원본 카드명 표시 (별명 제거) -->
          <span class="card-name">{{ card.cardName }}</span>
          <!-- 대표 뱃지를 카드명 옆으로 이동 -->
          <span v-if="isMainCard" class="main-badge">대표</span>
        </div>
        <!-- 설정 버튼을 오른쪽 끝으로 분리 -->
        <button class="settings-btn-inline" @click.stop="openSettingsModal">
          <img
            src="@/assets/images/icons/common/setting.png"
            alt="설정"
            class="setting-icon-inline"
          />
        </button>
      </div>

      <p class="card-number">
        {{ getCardIssuer(card.issuerCode) }} {{ card.cardMaskedNumber }}
      </p>

      <!-- 금액 숨기기 적용 -->
      <p class="card-amount" v-if="!isAmountHidden">
        {{ formatWon(card.amount || card.thisMonthUsed || 0) }}
      </p>
    </div>
  </div>

  <!-- 상세 모달 -->
  <DetailModal :visible="showDetail" @close="showDetail = false">
    <CardDetail :cardData="enhancedCard" @close="showDetail = false" />
  </DetailModal>

  <!-- 설정 모달 (하단에서 올라오는 모달) -->
  <CardSettingsModal
    :key="`card-settings-${card.id}`"
    :visible="showSettingsModal"
    :card="enhancedCard"
    @close="showSettingsModal = false"
    @set-main="handleSetMain"
    @toggle-amount="toggleAmountVisibility"
  />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAccountSettingsStore } from '@/stores/assetSettings';
import DetailModal from '../detail/DetailModal.vue';
import CardDetail from './CardDetail.vue';
import CardSettingsModal from './CardSettingsModal.vue';
import cardCodeMap from '@/assets/utils/cardCodeMap.js';

const props = defineProps({
  card: { type: Object, required: true },
});

const emit = defineEmits(['set-main', 'delete', 'toggle-amount']);

// Pinia store 사용
const assetSettings = useAccountSettingsStore();

const showDetail = ref(false);
const showSettingsModal = ref(false);

// 계산된 속성들 - 별명 제거
const isMainCard = computed(() => {
  return assetSettings.isMainCard(props.card.id);
});

const isAmountHidden = computed(() => {
  return assetSettings.isCardAmountHidden(props.card.id);
});

// 설정이 적용된 카드 객체 - 별명 제거
const enhancedCard = computed(() => ({
  ...props.card,
  isRepresentative: isMainCard.value,
  hideAmount: isAmountHidden.value,
}));

const openDetail = () => (showDetail.value = true);
const openSettingsModal = () => (showSettingsModal.value = true);

const formatWon = (value) => {
  const numValue = Number(value) || 0;
  return `${numValue.toLocaleString()}원`;
};

// 카드사명 가져오기
const getCardIssuer = (issuerCode) => {
  return cardCodeMap[issuerCode] || '알 수 없음';
};

// 대표 카드 설정 - store 사용
const handleSetMain = () => {
  if (!isMainCard.value) {
    assetSettings.setMainCard(props.card.id);
    emit('set-main', props.card);
  }
  // 모달은 유지하고 UI만 업데이트됨
};

// 금액 숨기기 토글 - store 사용
const toggleAmountVisibility = () => {
  assetSettings.toggleCardAmountVisibility(props.card.id);
  emit('toggle-amount', props.card.id, isAmountHidden.value);
  // 모달은 닫지 않음
};
</script>

<style scoped>
.card-item {
  position: relative;
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--input-outline);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.75rem;
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
}

.card-item:active {
  transform: scale(0.98);
}

/* 카드 이미지 */
.card-logo {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  object-fit: contain;
  flex-shrink: 0;
}

/* 카드 정보 */
.card-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.info-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  width: 100%;
}

.name-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.card-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-darkgray);
  /* 긴 카드명 말줄임표 처리 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* 대표 뱃지 - 라벤더 색상으로 변경 */
.main-badge {
  background: var(--base-lavender);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  flex-shrink: 0;
}

/* 인라인 설정 버튼 */
.settings-btn-inline {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.settings-btn-inline:hover {
  background: var(--input-bg-1);
}

.setting-icon-inline {
  width: 0.75rem;
  height: 0.75rem;
  opacity: 0.5;
  transition: opacity 0.2s ease;
  object-fit: contain;
  object-position: center;
}

.settings-btn-inline:hover .setting-icon-inline {
  opacity: 0.8;
}

.card-number {
  font-size: 0.75rem;
  color: var(--text-lightgray);
  margin: 0.25rem 0;
  /* 긴 카드번호 말줄임표 처리 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* 카드 금액 스타일 */
.card-amount {
  font-size: 1rem;
  font-weight: 600;
  color: var(--base-blue-dark);
  margin: 0;
  transition: all 0.2s ease;
}
</style>
