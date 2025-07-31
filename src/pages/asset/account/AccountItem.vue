<template>
  <!-- 루트 요소에서는 클릭 이벤트 제거 -->
  <div class="account-item">
    <!-- 은행 로고 -->
    <img
      :src="getBankLogoByCode(account.bankCode)"
      :alt="`${getBankName(account.bankCode)} 로고`"
      class="bank-logo"
    />

    <!-- 계좌 정보: 이 영역에서만 상세 페이지로 이동 -->
    <div class="account-info" @click="goToDetail">
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

    <!-- 계좌 컨트롤 영역 -->
    <div class="account-control" @click.stop>
      <!-- 대표 계좌 라벨 -->
      <button v-if="account.isMain" class="main-label" disabled>
        대표 계좌
      </button>
      <!-- 대표 계좌 설정 버튼 -->
      <button
        v-else
        class="set-main-btn"
        @click.stop="$emit('set-main', account)"
      >
        대표 설정
      </button>
      <!-- 삭제 버튼 (버블링 방지 위해 @click.stop 사용) -->
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
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import DeleteConfirmModal from '@/pages/asset/common/DeleteConfirmModal.vue';
import { getBankLogoByCode } from '@/assets/utils/bankLogoMap.js';
import { getBankName } from '@/assets/utils/bankCodeMap.js';

const props = defineProps({
  account: { type: Object, required: true },
});
const emit = defineEmits(['set-main', 'delete']); // 상위 이벤트 전달
const router = useRouter();
const isDeleteModalOpen = ref(false);

// 계좌 상세 페이지 이동 (계좌 정보 영역 클릭 시만 실행)
const goToDetail = () => {
  router.push(`/account/${props.account.id}`);
};

// 금액 포맷
const formatWon = (value) => `${value.toLocaleString()}원`;
// 계좌번호 포맷 (###-###-####)
const formatAccountNumber = (number) =>
  number.replace(/(\d{3})(\d{3})(\d{3,4})/, '$1-$2-$3');

// 삭제 처리 (이벤트 버블링 차단 후 상위로 삭제 이벤트 전달)
const handleDelete = (event) => {
  event?.stopPropagation();
  emit('delete', props.account);
  isDeleteModalOpen.value = false;
};
</script>

<style scoped>
.account-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--input-bg-2);
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
}

.bank-logo {
  width: 48px;
  height: 48px;
  margin-right: 0.8rem;
  flex-shrink: 0;
}

.info-top {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.bank-name {
  font-size: 1rem;
  font-weight: 600;
}

.main-badge {
  background: var(--text-bluegray);
  color: white;
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;
}

.account-number {
  font-size: 0.9rem;
  color: var(--text-lightgray);
  margin-top: 0.2rem;
}

.balance {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--base-blue-dark);
  margin-top: 0.5rem;
}

.account-control {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.main-label {
  font-size: 0.8rem;
  color: var(--base-blue-dark);
  background: none;
  border: none;
}

.set-main-btn {
  font-size: 0.8rem;
  color: var(--base-blue-dark);
  background: #f5f7fa;
  border: 1px solid #e0e0e0;
  padding: 0.25rem 0.6rem;
  border-radius: 1rem;
  cursor: pointer;
}

.set-main-btn:hover {
  background: var(--sub-skyblue);
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
}

.delete-btn img {
  width: 24px;
  height: 24px;
  opacity: 0.5;
}
</style>
