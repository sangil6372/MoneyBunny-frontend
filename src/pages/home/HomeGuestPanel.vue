<template>
  <section class="guestWrap">
    <!-- 로그인 안내 카드 -->
    <div class="ctaCard">
      <div class="heroIcon">
        <img :src="heroSrc" alt="" />
      </div>

      <div class="title">로그인이 필요합니다</div>
      <p class="subtitle">
        맞춤 정책 추천과 자산 분석을 이용하려면 로그인해 주세요
      </p>

      <div class="btnRow">
        <button class="btn primary" type="button" @click="goLogin">
          로그인하기
        </button>
        <button class="btn ghost" type="button" @click="goSignup">
          회원가입
        </button>
      </div>
      <p class="trustNote" aria-live="polite">
        <span class="lock" aria-hidden="true">🔒</span>
        개인정보는 암호화되어 안전하게 보호됩니다.
      </p>
    </div>

    <!-- 기능 설명 카드 -->
    <div class="featuresCard">
      <div class="featuresTitle">MoneyBunny와 함께하면</div>
      <ul class="featureList">
        <li>
          <span class="dot"></span>
          맞춤형 정책 추천
        </li>
        <li>
          <span class="dot"></span>
          자산 관리 및 분석
        </li>
        <li>
          <span class="dot"></span>
          정책 적용 시 예상 수익 계산
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import bunny5 from "@/assets/images/icons/bunny/loginbunny.png"; // 기본 히어로 이미지

const props = defineProps({
  image: { type: String, default: "" },
  loginRouteName: { type: String, default: "login" },
  signupRouteName: { type: String, default: "signUpEmailRequest" },
});

const emit = defineEmits(["login", "signUpEmailRequest"]);
const router = useRouter();
const route = useRoute();

const heroSrc = computed(() => props.image || bunny5);

const redirectTarget = computed(() => {
  // 이미 redirect가 붙어있으면 그 값을 그대로 유지 (연속 이동 시)
  const fromQuery = route.query.redirect?.toString();
  return fromQuery || route.fullPath;
});

function goLogin() {
  // 라우트가 없으면 emit만
  try {
    if (props.loginRouteName)
      router.push({
        name: props.loginRouteName,
        query: { redirect: redirectTarget.value },
      });
    else emit("login");
  } catch {
    emit("login");
  }
}
function goSignup() {
  try {
    if (props.signupRouteName)
      router.push({
        name: props.signupRouteName,
        query: { redirect: redirectTarget.value },
      });
    else emit("signup");
  } catch {
    emit("signup");
  }
}
</script>

<style scoped>
.guestWrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ctaCard,
.featuresCard {
  background: #fff;
  border-radius: 10px;
  border: 1px solid var(--input-outline-2, #e6eaf3);
}

/* 로그인 카드 */
.ctaCard {
  padding: 20px 16px 14px;
  text-align: center;
}

.heroIcon {
  width: 110px;
  height: 110px;
  border-radius: 999px;
  margin: 0 auto 6px;
  /* background: var(--input-bg-2, #f3f6fd); */
  display: grid;
  place-items: center;
  overflow: hidden;
}
.heroIcon img {
  width: 85%;
  height: 100%;
  object-fit: contain;
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: var(--base-blue-dark);
  margin: 8px 0;
}
.subtitle {
  color: var(--text-bluegray);
  font-size: 12px;
  margin: 0 0 16px;
}

.btnRow {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-top: 4px;
}
.btn {
  appearance: none;
  border: 0;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14px;
  cursor: pointer;
}
.btn.primary {
  background: var(--base-blue-dark);
  color: #fff;
}
.btn.ghost {
  background: #fff;
  color: var(--base-blue-dark);
  border: 1.5px solid var(--input-outline-2, #e3e8f2);
}

/* 기능 카드 */
.featuresCard {
  padding: 16px;
}
.featuresTitle {
  font-size: 16px;
  font-weight: bold;
  color: var(--base-blue-dark);
  margin: 2px 0 10px;
}
.featureList {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}
.featureList li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #0f172a;
  font-size: 14px;
  padding: 4px 0;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--base-blue-dark);
  opacity: 0.18;
  flex: 0 0 6px;
}

/* 신뢰 문구 */
.trustNote {
  margin-top: 10px;
  font-size: 11px;
  color: var(--text-bluegray);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}
.trustNote .lock {
  font-size: 11px;
}
</style>
