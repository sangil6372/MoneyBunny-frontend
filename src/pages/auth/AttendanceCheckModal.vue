<script setup>
import carrotIcon from '@/assets/images/icons/attendance/attendance_before.png';
import bunnyIcon from '@/assets/images/icons/attendance/attendance_bunny.png';

// emit 정의
const emit = defineEmits(['close']);

const days = ['월', '화', '수', '목', '금', '토', '일'];

const handleClose = () => {
  emit('close');
};

const handleComplete = () => {
  // 출석체크 완료 로직
  emit('close');
};
</script>

<template>
  <div class="overlay" @click="handleClose">
    <div class="modal" @click.stop>
      <button class="closeButton" @click="handleClose">✕</button>
      <h2 class="modalTitle font-20 font-extrabold">🎉 출석체크</h2>
      <p class="modalSubtitle font-14 font-regular">
        매일 출석하고 포인트를 받아보세요!
      </p>

      <div class="attendanceWeek">
        <div v-for="(day, i) in days" :key="i" class="dayBox">
          <span class="dayLabel">{{ day }}</span>
          <img
            :src="i === 6 ? bunnyIcon : carrotIcon"
            :alt="day"
            class="icon"
          />
        </div>
      </div>

      <div class="statusText font-16 font-bold">
        Day 1<br />
        <span class="font-14 font-regular">100포인트 적립!</span>
      </div>

      <div class="rewardBox font-18 font-bold">
        오늘의 리워드<br />100포인트
      </div>

      <button class="completeButton font-15 font-bold" @click="handleComplete">
        출석체크 완료
      </button>

      <p class="infoText font-13 font-regular">
        연속 출석 시 더 많은 포인트를 받을 수 있어요!
      </p>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal {
  background: white; /* 검은색에서 흰색으로 변경 */
  border-radius: 20px;
  padding: 28px;
  width: 90%;
  max-width: 340px; /* 크기 조정 */
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.closeButton {
  position: absolute;
  top: 14px;
  right: 16px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: var(--text-darkgray);
}

.closeButton:hover {
  color: var(--text-black);
}

.modalTitle {
  color: var(--base-blue-dark);
  margin-bottom: 8px;
}

.modalSubtitle {
  color: var(--text-bluegray);
  margin-bottom: 20px;
}

.attendanceWeek {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 4px;
}

.dayBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.dayLabel {
  font-size: 12px;
  color: var(--text-darkgray);
}

.icon {
  width: 24px;
  height: 24px;
}

.statusText {
  margin: 10px 0 20px;
  color: var(--base-blue-dark);
}

.rewardBox {
  background-color: var(--base-blue-dark);
  color: white;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 12px;
}

.completeButton {
  width: 100%;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 12px;
  border-radius: 10px;
  border: none;
  margin-bottom: 12px;
  cursor: pointer;
}

.completeButton:hover {
  background-color: var(--base-blue-darker);
}

.infoText {
  color: var(--text-bluegray);
  margin: 0;
}
</style>
