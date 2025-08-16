<template>
  <div class="condition-card" :class="{ 'inactive': !condition.isActive }">
    <!-- 💪(상일) 카드 헤더 -->
    <div class="card-header-row">
      <div class="type-info">
        <span class="type-badge" :class="getTypeBadgeClass(condition.conditionType)">
          {{ getTypeLabel(condition.conditionType) }}
        </span>
        <span class="condition-id">ID: {{ condition.id }}</span>
      </div>
      <span :class="['status-badge', condition.isActive ? 'active' : 'inactive']">
        {{ condition.isActive ? 'ACTIVE' : 'INACTIVE' }}
      </span>
    </div>

    <!-- 💪(상일) 카드 본문 -->
    <div class="card-body">
      <h4 class="condition-name">{{ condition.conditionName }}</h4>
      <div class="condition-details">
        <div class="condition-value" v-if="condition.conditionValue">
          <span class="detail-label">Value</span>
          <span class="detail-value">{{ condition.conditionValue }}</span>
        </div>
        <div class="condition-type">
          <span class="detail-label">Type</span>
          <span class="detail-value">{{ condition.conditionType }}</span>
        </div>
      </div>
      <p class="condition-desc" v-if="condition.description">
        {{ condition.description }}
      </p>
    </div>

    <!-- 💪(상일) 카드 액션 버튼 -->
    <div class="card-actions">
      <button class="action-btn edit-btn" @click="$emit('edit', condition)">
        EDIT
      </button>
      <button class="action-btn delete-btn" @click="handleDelete">
        DELETE
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  condition: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])

// 💪(상일) 타입별 라벨 반환
const getTypeLabel = (type) => {
  const labels = {
    'INCOME': 'INCOME',
    'AGE': 'AGE',
    'REGION': 'REGION',
    'EMPLOYMENT': 'EMPLOYMENT'
  }
  return labels[type] || type
}

// 💪(상일) 타입별 배지 클래스 반환
const getTypeBadgeClass = (type) => {
  const classes = {
    'INCOME': 'type-income',
    'AGE': 'type-age',
    'REGION': 'type-region',
    'EMPLOYMENT': 'type-employment'
  }
  return classes[type] || ''
}

// 💪(상일) 삭제 확인 후 이벤트 발생
const handleDelete = () => {
  if (confirm('정말 이 조건을 삭제하시겠습니까?')) {
    emit('delete', props.condition.id)
  }
}
</script>

<style scoped>
.condition-card {
  background: white;
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
  transition: all 0.2s ease;
  margin-bottom: 8px;
}

.condition-card.inactive {
  opacity: 0.6;
  background: #fafafa;
}

.condition-card:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.type-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.type-badge {
  padding: 2px 8px;
  border-radius: 2px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid;
}

.type-income {
  background: #f8f9fa;
  color: #495057;
  border-color: #495057;
}

.type-age {
  background: #f8f9fa;
  color: #6c757d;
  border-color: #6c757d;
}

.type-region {
  background: #f8f9fa;
  color: #343a40;
  border-color: #343a40;
}

.type-employment {
  background: #f8f9fa;
  color: #212529;
  border-color: #212529;
}

.condition-id {
  font-size: 10px;
  color: #999;
  font-weight: 500;
  font-family: monospace;
}

.status-badge {
  padding: 2px 6px;
  border-radius: 2px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.5px;
  border: 1px solid;
}

.status-badge.active {
  background: #fff;
  color: #28a745;
  border-color: #28a745;
}

.status-badge.inactive {
  background: #fff;
  color: #dc3545;
  border-color: #dc3545;
}

.card-body {
  margin-bottom: 12px;
}

.condition-name {
  margin: 0 0 12px 0;
  font-size: 15px;
  font-weight: 600;
  color: #212529;
  line-height: 1.3;
}

.condition-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 8px;
}

.condition-value,
.condition-type {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-label {
  font-size: 10px;
  color: #6c757d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 13px;
  color: #212529;
  font-weight: 500;
  font-family: monospace;
}

.condition-desc {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: #6c757d;
  line-height: 1.4;
  font-style: italic;
}

.card-actions {
  display: flex;
  gap: 6px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.action-btn {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid;
  border-radius: 2px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
}

.edit-btn {
  background: white;
  color: #007bff;
  border-color: #007bff;
}

.edit-btn:hover {
  background: #007bff;
  color: white;
}

.delete-btn {
  background: white;
  color: #dc3545;
  border-color: #dc3545;
}

.delete-btn:hover {
  background: #dc3545;
  color: white;
}

/* 모바일 최적화 */
@media (max-width: 768px) {
  .condition-card {
    padding: 12px;
    margin-bottom: 6px;
  }
  
  .condition-name {
    font-size: 14px;
  }
  
  .condition-details {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .condition-desc {
    font-size: 11px;
  }
  
  .action-btn {
    padding: 10px 12px;
    font-size: 10px;
  }
}
</style>