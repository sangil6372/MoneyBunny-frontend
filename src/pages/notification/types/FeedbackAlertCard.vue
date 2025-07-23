<template>
  <NotificationItem>
    <h3 class="title">{{ item.title }}</h3>
    <p class="message">{{ item.message }}</p>
    <small class="date">{{ formatDate(item.created_at || item.date) }}</small>
  </NotificationItem>
</template>

<script setup>
import NotificationItem from './NotificationItem.vue';

defineProps({ item: Object });

const formatDate = (iso) => {
  if (!iso) return '';
  const date = new Date(iso);
  return isNaN(date) ? '' : `${date.getMonth() + 1}월 ${date.getDate()}일`;
};
</script>
