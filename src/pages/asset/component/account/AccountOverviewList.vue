<template>
  <div class="overview-list">
    <!-- 계좌가 있을 때 -->
    <template v-if="accounts && accounts.length > 0">
      <AccountOverviewItem
        v-for="(account, index) in accounts"
        :key="account.id || index"
        :account="account"
      />
    </template>

    <!-- 계좌가 없을 때 작은 NoData 카드 표시 -->
    <OverviewNoDataCard
      v-else
      title="연동된 계좌가 없습니다"
      description="계좌를 연동해보세요"
      button-text="연동하기"
      @button-click="handleAddAccount"
    />
  </div>
</template>

<script setup>
import AccountOverviewItem from './AccountOverviewItem.vue';
import OverviewNoDataCard from '../common/OverviewNoDataCard.vue';

const props = defineProps({
  accounts: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits(['add-account']);

// 계좌 추가 버튼 클릭 핸들러
const handleAddAccount = () => {
  emit('add-account');
};
</script>

<style scoped>
.overview-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
