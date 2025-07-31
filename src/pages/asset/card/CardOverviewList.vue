<template>
  <div class="card-list">
    <CardOverviewItem
      v-for="(card, index) in cards"
      :key="index"
      :card="card"
    />
  </div>
</template>

<script setup>
import CardOverviewItem from './CardOverviewItem.vue';

const props = defineProps({
  cards: { type: Array, required: true },
});
</script>

<style scoped>
.card-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
