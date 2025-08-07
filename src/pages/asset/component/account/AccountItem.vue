<template>
  <div class="account-item">
    <!-- ✅ 대표 뱃지: 계좌 박스의 오른쪽 상단 고정 -->
    <span v-if="account.isMain" class="main-badge top-right">대표</span>

    <!-- 은행 로고 -->
    <img
      :src="getBankLogoByCode(account.bankCode)"
      :alt="`${getBankName(account.bankCode)} 로고`"
      class="bank-logo"
    />

    <!-- 계좌 정보 -->
    <div class="account-info" @click="openDetail">
      <div class="info-top">
        <span class="bank-name">
          {{ getBankName(account.bankCode) }} {{ account.accountName }}
        </span>
      </div>

      <p class="account-number">
        {{ getBankName(account.bankCode) }} •
        {{ formatAccountNumber(account.accountNumber) }}
      </p>

      <p class="balance">{{ formatWon(account.balance) }}</p>
    </div>

    <!-- 계좌 컨트롤 -->
    <div class="account-control" @click.stop>
      <button v-if="account.isMain" class="main-label" disabled>
        대표 계좌
      </button>
      <button
        v-else
        class="set-main-btn"
        @click.stop="$emit('set-main', account)"
      >
        대표 설정
      </button>
    </div>
  </div>

  <!-- 상세 모달 -->
  <DetailModal :visible="showDetail" @close="showDetail = false">
    <AccountDetail :accountData="account" @close="showDetail = false" />
  </DetailModal>
</template>

<script setup>
import { ref } from 'vue';
import DetailModal from '../detail/DetailModal.vue';
import AccountDetail from './AccountDetail.vue';
import { getBankLogoByCode } from '@/assets/utils/bankLogoMap.js';
import { getBankName } from '@/assets/utils/bankCodeMap.js';

const props = defineProps({
  account: { type: Object, required: true },
});
const emit = defineEmits(['set-main', 'delete']);

const isDeleteModalOpen = ref(false);
const showDetail = ref(false);

const openDetail = () => (showDetail.value = true);
const formatWon = (value) => `${value.toLocaleString()}원`;
const formatAccountNumber = (number) =>
  number.replace(/(\d{3})(\d{3})(\d{3,4})/, '$1-$2-$3');

const handleDelete = (event) => {
  event?.stopPropagation();
  emit('delete', props.account);
  isDeleteModalOpen.value = false;
};
</script>
<style>
@import '@/assets/styles/item-styles.css';
</style>
