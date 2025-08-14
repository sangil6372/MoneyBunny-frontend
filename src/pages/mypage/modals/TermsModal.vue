<script setup>
const emit = defineEmits(['close']);
const close = () => emit('close');
</script>

<template>
  <div class="modalOverlay" @click.self="close">
    <div
      class="modalContainer"
      role="dialog"
      aria-modal="true"
      aria-label="서비스 이용약관"
    >
      <header class="modalHeader">
        <div class="title">서비스 이용약관</div>
        <button class="iconBtn" @click="close" aria-label="닫기">
          <img src="@/assets/images/icons/common/x.png" alt="" />
        </button>
      </header>

      <div class="modalContent">
        <p class="date">시행일: 2025-08-13</p>

        <ol class="secList">
          <li>
            <strong>1) 목적</strong>
            <div>
              정책 정보/추천 등 MoneyBunny 서비스 이용에 관한 기본 사항을
              정합니다.
            </div>
          </li>
          <li>
            <strong>2) 계정</strong>
            <div>만 14세 이상, 정확한 정보 유지, 계정 보안은 사용자 책임.</div>
          </li>
          <li>
            <strong>3) 서비스 범위·고지</strong>
            <div>
              맞춤 정책 정보 제공. 본 서비스는 행정/법률/세무 자문이 아님.
            </div>
            <div>
              정책 신청·심사·지급은 주관 기관 책임. 서비스는 변경/중단될 수
              있으며 사전 공지.
            </div>
          </li>
          <li>
            <strong>4) 유료 서비스</strong>
            <div>있을 경우 가격·환불·자동갱신 조건을 별도 안내.</div>
          </li>
          <li>
            <strong>5) 금지행위</strong>
            <div>
              불법·사칭·개인정보 침해·욕설/혐오·권리 침해·스팸·역설계·크롤링 등.
            </div>
          </li>
          <li>
            <strong>6) 콘텐츠 권리</strong>
            <div>
              후기 등 사용자 콘텐츠의 권리는 사용자에게 있으나, 서비스
              운영·노출을 위한 비독점 사용권을 회사에 허여.
            </div>
          </li>
          <li>
            <strong>7) 해지</strong>
            <div>
              사용자는 언제든 탈퇴 가능. 약관/법령 위반 시 이용 제한 또는 해지
              가능.
            </div>
          </li>
          <li>
            <strong>8) 책임 제한</strong>
            <div>
              무료 서비스에 대해 회사의 고의·중과실 없으면 책임 제한. 불가항력
              면책.
            </div>
          </li>
          <li>
            <strong>9) 분쟁</strong>
            <div>대한민국 법 준거, 관할은 민사소송법상 법원.</div>
          </li>
        </ol>
      </div>

      <div class="modalFooter">
        <button class="primaryBtn" @click="close">확인</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modalOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: grid;
  place-items: center;
  z-index: 9999;
}
.modalContainer {
  width: 340px;
  max-width: 92vw;
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  /* padding: 16px; */
  flex-direction: column;
}
.modalHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #eef1f5;
}
.title {
  font-weight: bold;
  color: var(--base-blue-dark);
  font-size: 16px;
}
.iconBtn {
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
}
.iconBtn img {
  width: 18px;
  height: 18px;
  display: block;
}

.modalContent {
  max-height: 60vh;
  overflow: auto;
  padding: 20px;
  color: var(--base-blue-dark);
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}
.date {
  color: #8a96a8;
  font-size: 11px;
  margin: 2px 0 10px;
}
.lead {
  margin: 0 0 10px;
  line-height: 1.5;
  font-size: 14px;
  font-weight: bold;
}
.secList {
  display: grid;
  gap: 12px;
  padding-left: 0;
  list-style: none;
  font-size: 13px;
}
.secList > li {
  line-height: 1.5;
}
.secList ul {
  margin: 6px 0 0 0;
  padding-left: 16px;
}
.contact {
  margin: 12px 0 0;
  font-size: 11px;
  color: #6b778c;
}

.modalFooter {
  padding: 14px 16px;
}
.primaryBtn {
  width: 100%;
  padding: 12px 0;
  border-radius: 6px;
  border: 0;
  cursor: pointer;
  background: var(--base-blue-dark);
  color: #fff;
  font-weight: bold;
  font-size: 13px;
}
</style>
