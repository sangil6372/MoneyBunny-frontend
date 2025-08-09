<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

const route = useRoute();
const policyId = computed(() =>
  Number(route.params.policyId || route.params.id)
);

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};

const shareInfo = ref({
  title: "",
  description: "",
  amount: "",
  url: "",
});

// 정책 불러오기

// helper 함수 추가
const normalizeUrl = (raw) => {
  if (
    typeof raw === "string" &&
    (raw.startsWith("http") || raw.startsWith("www")) &&
    !raw.includes("localhost")
  ) {
    return raw.startsWith("www") ? `https://${raw}` : raw;
  }
  return null;
};

// 💪(상일) intent URL 및 Android Chrome 감지 제거 - 카카오톡 인앱에서 처리로 변경

const fetchPolicy = async () => {
  try {
    const savedAuth = localStorage.getItem("auth"); // "auth" 전체 객체 꺼냄
    const parsed = savedAuth ? JSON.parse(savedAuth) : null;
    const token = parsed?.token;

    console.log(token); // undefined: 로그인X

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await axios.get(`/api/policy/detail/${policyId.value}`, {
      headers,
    });

    console.log("API 응답 데이터:", response.data);
    const data = response.data;

    // 💪(상일) 공유 URL 생성 - 항상 HTTPS URL 사용, from=share 파라미터 추가
    const targetUrl = `https://money-bunny-frontend.vercel.app/policy/${policyId.value}?from=share`;

    shareInfo.value = {
      title: data.title,
      description: data.description,
      amount:
        data.policyBenefitDescription ||
        (data.policyBenefitAmount
          ? `${data.policyBenefitAmount.toLocaleString()}원`
          : "지원 내용 없음"),
      url: targetUrl,
    };

    console.log("applyUrl from API:", data.applyUrl);
    console.log("공유할 정보:", shareInfo);
  } catch (error) {
    console.error("정책 정보 조회 실패:", error);
  }
};

onMounted(() => {
  fetchPolicy();

  const initKakao = () => {
    if (!window.Kakao.isInitialized()) {
      const KAKAO_KEY = import.meta.env.VITE_KAKAO_API_KEY;
      window.Kakao.init(KAKAO_KEY);
    }
  };

  if (!window.Kakao) {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
    script.onload = initKakao;
    document.head.appendChild(script);
  } else {
    initKakao();
  }
});

// 카카오 공유하기 전송

const sendKakao = () => {
  const info = shareInfo.value;
  console.log("✅ 공유할 정보:", info);

  const isInfoReady =
    typeof info.title === "string" &&
    info.title.trim().length > 0 &&
    typeof info.description === "string" &&
    typeof info.amount === "string" &&
    typeof info.url === "string" &&
    info.url.startsWith("http");

  if (!isInfoReady) {
    alert("공유할 정보를 아직 불러오는 중입니다. 잠시만 기다려 주세요.");
    return;
  }

  if (!window.Kakao || !window.Kakao.Link) {
    alert("카카오 SDK가 로드되지 않았습니다.");
    return;
  }

  window.Kakao.Link.sendCustom({
    templateId: 123089,
    templateArgs: {
      title: info.title,
      description: info.description,
      amount: info.amount,
      policy_id: policyId.value,
    },
  });
};

// 클립보드 복사(링크 공유)

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    alert("링크가 복사되었습니다!");
  } catch (err) {
    console.error("클립보드 복사 실패:", err);
    alert("복사에 실패했습니다. 브라우저 권한을 확인해주세요.");
  }
};
</script>

<template>
  <div class="modalOverlay" @click.self="close">
    <div class="modalContent">
      <img
        src="@/assets/images/icons/policy/x.png"
        class="closeIcon"
        @click="close"
      />
      <div class="font-18 font-bold mb-3">공유하기</div>

      <div class="shareItem" @click="sendKakao">
        <img src="@/assets/images/icons/policy/kakaotalk.png" />
        <div class="text">
          <div class="font-14 font-bold">카카오톡</div>
          <div class="font-12">카카오톡으로 공유하기</div>
        </div>
      </div>

      <div class="shareItem" @click="copyToClipboard(shareInfo.url)">
        <img src="@/assets/images/icons/policy/link.png" />
        <div class="text">
          <div class="font-14 font-bold">링크 복사</div>
          <div class="font-12">링크를 복사해서 공유하기</div>
        </div>
      </div>

      <div class="shareBox">
        <div class="font-13 font-bold mb-1">공유할 내용</div>
        <div class="font-12">
          {{ shareInfo.title }} - {{ shareInfo.description }}<br />
          {{ shareInfo.amount }} 지원<br />
          {{ shareInfo.url }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modalOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modalContent {
  background-color: white;
  width: 90%;
  border-radius: 16px;
  padding: 24px;
  position: relative;
}

.closeIcon {
  position: absolute;
  top: 26px;
  right: 26px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.shareItem {
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: var(--input-bg-2);
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 10px;
}

.shareItem img {
  width: 26px;
  height: 26px;
}

.shareBox {
  background-color: var(--input-bg-2);
  border-radius: 12px;
  padding: 16px;
}
</style>
