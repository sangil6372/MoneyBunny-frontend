<template>
  <div class="account-item">
    <!-- 은행 로고 -->
    <img
      :src="getBankLogoByCode(account.bankCode)"
      :alt="`${getBankName(account.bankCode)} 로고`"
      class="bank-logo"
    />

    <!-- 계좌 정보 (클릭 시 상세 모달 열림) -->
    <div class="account-info" @click="openDetail">
      <div class="info-top">
        <span class="bank-name">
          {{ getBankName(account.bankCode) }} {{ account.accountName }}
        </span>
        <span v-if="account.isMain" class="main-badge">대표</span>
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
      <button class="delete-btn" @click.stop="isDeleteModalOpen = true">
        <img src="@/assets/images/icons/common/Trash.png" alt="삭제" />
      </button>
    </div>

    <!-- 삭제 확인 모달 -->
    <DeleteConfirmModal
      :visible="isDeleteModalOpen"
      title="계좌 삭제"
      message="계좌를 삭제하시겠습니까?"
      :subtitle="`${getBankName(account.bankCode)} • ${formatAccountNumber(
        account.accountNumber
      )}`"
      warning="삭제된 계좌는 복구할 수 없습니다."
      @close="isDeleteModalOpen = false"
      @confirm="handleDelete"
    />

    <!-- 계좌 상세 모달 -->
    <DetailModal :visible="showDetail" @close="showDetail = false">
      <AccountDetail :accountData="account" @close="showDetail = false" />
    </DetailModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DeleteConfirmModal from '@/pages/asset/component/common/DeleteConfirmModal.vue';
import DetailModal from '../common/DetailModal.vue';
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
<style scoped>
@import '@/assets/styles/item-styles.css';
/* 추가 계좌 전용 스타일이 있다면 여기에 */
</style>
