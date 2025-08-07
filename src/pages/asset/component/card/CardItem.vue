<template>
  <div class="card-item" @click="openDetail">
    <!-- ✅ 대표 뱃지: 카드 박스의 우측 상단 고정 -->
    <span v-if="isRepresentative" class="main-badge top-right"> 대표 </span>

    <!-- 카드 이미지 -->
    <img
      :src="card.cardImage"
      :alt="`${card.cardName} 이미지`"
      class="card-logo"
    />

    <!-- 카드 정보 -->
    <div class="card-info">
      <div class="info-top">
        <p class="card-name">{{ card.cardName }}</p>
      </div>
      <p class="card-number">{{ card.cardMaskedNumber }}</p>
      <p class="card-amount">{{ formatWon(card.thisMonthUsed) }}</p>
    </div>

    <!-- 카드 컨트롤 -->
    <div class="card-control" @click.stop>
      <button v-if="isRepresentative" class="main-label" disabled>
        대표 카드
      </button>
      <button v-else class="set-main-btn" @click.stop="$emit('set-main', card)">
        대표 설정
      </button>
    </div>

    <!-- 상세 모달 -->
    <DetailModal :visible="showDetail" @close="showDetail = false">
      <CardDetail :cardData="card" @close="showDetail = false" />
    </DetailModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DetailModal from '../detail/DetailModal.vue'; // 공통 전체화면 모달
import CardDetail from './CardDetail.vue';

const props = defineProps({
  card: { type: Object, required: true },
  isRepresentative: { type: Boolean, default: false },
});

const emit = defineEmits(['set-main', 'delete']);

const isDeleteModalOpen = ref(false);
// 상세 모달 상태
const showDetail = ref(false);
const openDetail = () => (showDetail.value = true);

const formatWon = (value) => `${value.toLocaleString()}원`;

const handleDelete = (event) => {
  event?.stopPropagation();
  emit('delete', props.card);
  isDeleteModalOpen.value = false;
};
</script>
<style>
@import '@/assets/styles/item-styles.css';
</style>
