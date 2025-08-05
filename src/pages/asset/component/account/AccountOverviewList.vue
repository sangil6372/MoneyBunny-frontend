<template>
  <div class="overview-list">
    <AccountOverviewItem
      v-for="(account, index) in accounts"
      :key="index"
      :account="account"
    />
  </div>
</template>

<script setup>
import AccountOverviewItem from './AccountOverviewItem.vue';

const props = defineProps({
  accounts: { type: Array, required: true },
});
</script>

<style scoped>
.overview-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
