<template>
  <div class="modalOverlay" @click.self="handleClose">
    <div class="modalContent">
      <button class="closeBtn" @click="handleClose">
        <img src="@/assets/images/icons/common/x.png" alt="닫기" />
      </button>
      <div class="modalTitle font-bold font-18">정책 신청 안내</div>
      <div class="policyBox">
        <div class="policyTitle font-bold font-14">{{ policyTitle }}</div>
        <div class="policyDesc font-12">
          선택하신 정책의 신청 페이지로 이동합니다.
        </div>
      </div>
      <ul class="tipList font-12">
        <li>신청 전 자격 요건을 반드시 확인해주세요</li>
        <li>필요한 서류를 미리 준비하시면 신청이 더욱 원활합니다</li>
        <li>마감일을 확인하고 여유있게 신청하세요</li>
      </ul>
      <div class="modalBtns">
        <button class="cancelBtn font-14" @click="handleClose">취소</button>
        <button class="applyBtn font-14" @click="handleGoApply">
          신청 페이지로 이동
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
// 정책 신청 API 추가
import { useAuthStore } from "@/stores/auth"; // ✅ 추가
import { policyInteractionAPI } from "@/api/policyInteraction";

const auth = useAuthStore(); // ✅ 추가

const props = defineProps({
  policyTitle: { type: String, required: true },
  applyUrl: { type: String, required: true },
  policyId: { type: Number, required: true }, // 신청 등록용 정책 ID 추가
});
const emit = defineEmits(["close", "showStatusModal"]); // 상태 모달 이벤트 추가

function handleClose() {
  emit("close");
}
// 신청 페이지로 이동 시 신청 등록 처리 및 즉시 상태 모달 표시
async function handleGoApply() {
  // ✅ 비로그인: 서버에 신청등록 호출하지 않고 그냥 외부 페이지만 오픈
  if (!auth.isLogin) {
    // 필요하면 안내 메시지: alert('로그인이 필요한 서비스입니다.')
    window.open(props.applyUrl, "_blank");
    handleClose();
    return;
  }
  try {
    // 1. 신청 등록 API 호출
    await policyInteractionAPI.addApplication(props.policyId);

    // 2. 외부 URL 열기 (새 탭)
    window.open(props.applyUrl, "_blank");

    // 3. 신청 모달 닫고 상태 모달 즉시 표시
    emit("showStatusModal", {
      policyId: props.policyId,
      title: props.policyTitle,
    });
    handleClose();
  } catch (error) {
    console.error("신청 등록 실패:", error);
    // 에러가 있어도 외부 URL은 열어줌
    window.open(props.applyUrl, "_blank");
    handleClose();
  }
}
</script>

<style scoped>
.modalOverlay {
  position: fixed;
  z-index: 3000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(44, 49, 59, 0.33);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modalContent {
  background: #fff;
  border-radius: 1cap;
  width: 90%;
  max-width: 330px;
  padding: 20px;
  position: relative;
}
.closeBtn {
  position: absolute;
  top: 20px;
  right: 15px;
  background: none;
  border: none;
  cursor: pointer;
}
.closeBtn img {
  width: 22px;
  height: 22px;
}
.modalTitle {
  margin-left: 5px;
  margin-bottom: 18px;
  color: var(--text-login);
}
.policyBox {
  background: var(--input-bg-2);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 10px;
}
.policyTitle {
  color: var(--text-login);
  margin-bottom: 7px;
}
.policyDesc {
  color: var(--text-bluegray);
}
.tipList {
  margin-left: -12px;
  color: var(--text-bluegray);
  margin-bottom: 15px;
}
.tipList li {
  list-style: disc;
  margin-bottom: 6px;
}
.modalBtns {
  display: flex;
  gap: 8px;
}
.cancelBtn {
  flex: 1;
  background: var(--input-bg-1);
  color: var(--text-login);
  border: none;
  border-radius: 6px;
  height: 44px;
  cursor: pointer;
}

.applyBtn {
  flex: 1;
  background: var(--base-blue-dark);
  color: #fff;
  border: none;
  border-radius: 6px;
  height: 44px;
  cursor: pointer;
}
</style>
