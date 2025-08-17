<!-- src/components/policy/PolicyTypeIntro.vue -->
<script setup>
import { useRouter } from 'vue-router';
import stopwatchIcon from '@/assets/images/icons/policy/stopwatch.png';
import padlockIcon from '@/assets/images/icons/policy/padlock.png';

const router = useRouter();

const props = defineProps({
  startRouteName: { type: String, default: 'policyIntroForm' },
});

const startTest = () => {
  if (props.startRouteName) router.push({ name: props.startRouteName });
};
</script>

<template>
  <!-- 상단 헤더 -->
  <header class="introHeader">
    <div class="headerCard">
      <div class="title font-18 ">정책 유형검사</div>
      <p class="subtitle font-14">나에게 맞는 정책을 찾아보세요</p>
    </div>
  </header>

  <!-- 본문 카드 -->
  <div class="introContainer">
    <section class="formSection">
      <div
        class="sectionTitle font-16 font-bold"
        style="color: var(--base-blue-dark)"
      >
        검사 소개
      </div>

      <ul class="bulletList">
        <li class="bulletItem">
          <span class="numBadge font-12 font-bold">1</span>
          <div class="textBox">
            <div class="itemTitle font-14 font-bold">개인 맞춤 분석</div>
            <div class="itemDesc font-12">
              현재 상황, 소비 패턴, 관심 분야를 분석하여 <br></br>가장 적합한 정책을
              추천해드립니다.
            </div>
          </div>
        </li>

        <li class="bulletItem">
          <span class="numBadge font-12 font-bold">2</span>
          <div class="textBox">
            <div class="itemTitle font-14 font-bold">간단한 질문</div>
            <div class="itemDesc font-12">
              4개의 간단한 질문으로 빠르게 완료할 수 있습니다.
            </div>
          </div>
        </li>

        <li class="bulletItem">
          <span class="numBadge font-12 font-bold">3</span>
          <div class="textBox">
            <div class="itemTitle font-14 font-bold">정확한 매칭</div>
            <div class="itemDesc font-12">
              데이터 기반 유사도 분석으로 매칭률이 높은 정책을 우선적으로<br></br> 추천드립니다.
            </div>
          </div>
        </li>
      </ul>

      <!-- 안내 박스 -->
      <div class="noticeBox">
        <div class="infoRow">
          <img :src="stopwatchIcon" alt="" class="infoIcon" />
          <span class="font-12"><strong>소요 시간 :</strong> 약 1–2분</span>
        </div>
        <div class="infoRow">
          <img :src="padlockIcon" alt="" class="infoIcon" />
          <span class="font-12">개인정보는 안전하게 보호됩니다</span>
        </div>
      </div>
    </section>

    <!-- 시작 버튼 -->
    <div class="bottomWrap">
      <button class="startBtn font-14" @click="startTest">
        검사 시작하기
      </button>
    </div>
  </div>
</template>

<style scoped>
.introContainer {
  padding: 20px;
  background-color: #fff;
  border-radius: 6px;
  max-width: 360px;
  margin-bottom: 20px;
}

.introHeader {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
}

.headerCard {
  text-align: center;
  background-color: var(--base-blue-dark);
  border-radius: 6px;
  padding: 16px;
  color: white;
  max-width: 360px;
  height: 100px;
  width: 100%;
}
.title {
  margin: 5px 0 7px 0;
}
.sectionTitle {
  margin-bottom: 14px;
}
.bulletList {
 list-style: none;
  padding: 0;
  margin: 10px 0;
  display: grid;
  gap: 14px; 
}

.bulletItem {
  display: grid;
  grid-template-columns: 32px 1fr; 
  align-items: start;
}

.numBadge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* width: 28px;
  height: 28px;
  border-radius: 999px; */
  /* background: linear-gradient(180deg, #e9edfb, #dfe6ff); */
  color: var(--base-blue-dark);
  /* border: 1px solid rgba(48,70,99,0.15); */
}

.textBox { line-height: 1.6; }
.itemTitle { color: #1f2a44; margin-bottom: 4px; }
.itemDesc { color: var(--text-sub, #657086); }
.noticeBox {
margin-top: 16px;
  padding: 12px;
  border-radius: 12px;
  background: var(--input-bg-1);
  display: grid;
  gap: 6px;
}

.infoRow {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px;
}

.infoIcon {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.bottomWrap {
  position: sticky;
  bottom: 10px;
  margin-top: 18px;
}

.startBtn {
  width: 100%;
  height: 48px;
  border: 0;
  border-radius: 6px;
  background: var(--base-blue-dark);
  color: #fff;
}
/* .startBtn:active {
  transform: translateY(1px);
} */
</style>
