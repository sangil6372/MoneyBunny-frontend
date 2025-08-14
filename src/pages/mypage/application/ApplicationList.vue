<template>
  <div class="applicationListContainer">
    <div v-if="loading" class="loadingState">
      <div class="loadingText">신청 정책을 불러오는 중...</div>
    </div>
    
    <div v-else-if="applications.length === 0" class="emptyState">
      <NoApplicationCard />
    </div>
    
    <div v-else>
      <div class="applicationHeader">
        <span>신청한 정책</span>
        <span class="countBadge">{{ applications.length }}</span>
      </div>

      <div class="applicationGrid">
        <ApplicationCard
          v-for="application in applications"
          :key="`${application.applicationId}_${application.policyId}`"
          :application="application"
          @remove="handleRemoveApplication"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useApplicationStore } from '@/stores/application';
import ApplicationCard from './ApplicationCard.vue';
import NoApplicationCard from './NoApplicationCard.vue';

// 신청 정책 스토어 연동
const applicationStore = useApplicationStore();
const {
  applications,
  loading,
  error
} = storeToRefs(applicationStore);

const { removeApplication } = applicationStore;

// 신청 기록 삭제 핸들러
const handleRemoveApplication = async (policyId) => {
  const success = await removeApplication(policyId);
  if (!success) {
    alert('신청 기록 삭제에 실패했습니다. 다시 시도해주세요.');
  }
};
</script>

<style scoped>
.applicationListContainer {
  width: 100%;
  min-height: 200px;
}

.loadingState, .emptyState {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.loadingText {
  color: var(--text-bluegray);
  font-size: 14px;
}

.applicationHeader {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: bold;
  color: var(--text-login);
  margin-bottom: 15px;
}

.countBadge {
  background: #e8f1ff;
  color: #2347ad;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  padding: 2.5px 8px;
  margin-left: 2px;
  letter-spacing: 0.1px;
}

.applicationGrid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>