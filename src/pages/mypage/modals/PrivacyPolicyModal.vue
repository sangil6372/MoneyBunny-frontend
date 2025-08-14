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
      aria-label="개인정보 처리방침"
    >
      <header class="modalHeader">
        <div class="title">개인정보 처리방침</div>
        <button class="iconBtn" @click="close" aria-label="닫기">
          <img src="@/assets/images/icons/common/x.png" alt="" />
        </button>
      </header>

      <div class="modalContent">
        <p class="date">시행일: 2025-08-13</p>
        <p class="lead">
          MoneyBunny(“회사”)는 「개인정보 보호법」을 준수합니다.
        </p>

        <ol class="secList">
          <li>
            <strong>1) 수집 항목</strong>
            <ul>
              <li>
                <b>필수</b>: 이메일, 비밀번호, 이름/닉네임, 연령대/거주지역
              </li>
              <li>
                <b>자동</b>: 기기·브라우저 정보, IP, 쿠키, 이용기록, 오류로그
              </li>
              <li><b>선택</b>: 관심정책, 후기/문의, 첨부파일</li>
            </ul>
          </li>
          <li>
            <strong>2) 이용 목적</strong>
            <div>
              가입/인증, 맞춤 추천·알림, 고객응대, 서비스 개선/통계,
              보안·부정이용 방지
            </div>
          </li>
          <li>
            <strong>3) 보관·파기</strong>
            <div>
              탈퇴 시 지체 없이 파기. 법령에 따라 결제/정산 5년, 분쟁 3년,
              접속기록 3개월 보관.
            </div>
          </li>
          <li>
            <strong>4) 제3자 제공</strong>
            <div>
              원칙적으로 없음. 법령 요구 또는 동의 시에만 최소범위 제공.
            </div>
          </li>
          <li>
            <strong>5) 처리 위탁</strong>
            <div>
              클라우드(AWS), 알림(FCM 등), 분석(필요 시) — 서비스 운영 목적.
            </div>
          </li>
          <li>
            <strong>6) 이용자 권리</strong>
            <div>
              열람·정정·삭제·동의철회 가능(앱 설정 또는 이메일). 만 14세 이상
              가입.
            </div>
          </li>
          <li>
            <strong>7) 쿠키/광고식별자</strong>
            <div>로그인 유지·맞춤 추천에 사용. 기기 설정에서 제한 가능.</div>
          </li>
        </ol>

        <p class="contact">
          문의
          <a href="mailto:support@moneybunny.app">moneybunnykb@gmail.com</a>
        </p>
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
