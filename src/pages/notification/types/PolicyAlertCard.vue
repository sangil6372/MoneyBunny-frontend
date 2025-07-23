<template>
  <NotificationItem>
    <h3 class="title">{{ item.title }}</h3>
    <p class="message">{{ item.description }}</p>
    <div class="badges">
      <span v-if="item.benefit" class="badge">{{ item.benefit }}</span>
      <span v-if="item.dday" class="badge dday">D-{{ item.dday }}</span>
    </div>
    <div class="bottom">
      <small class="date">{{ formatDate(item.created_at || item.date) }}</small>
      <button v-if="item.target_url" class="action-btn">신청하기</button>
    </div>
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

<style scoped>
.badges {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

.badge {
  font-size: 13px;
  background-color: #f1f3f5;
  padding: 4px 8px;
  border-radius: 6px;
  color: #333;
}

.dday {
  background-color: var(--alert-light-2);
  color: var(--alert-strong);
  font-weight: bold;
}

.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.action-btn {
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}
</style>
