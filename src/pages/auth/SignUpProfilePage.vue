<script setup>
import { useRouter, useRoute } from 'vue-router';
import { ref, reactive, computed, onMounted } from 'vue';
import axios from 'axios';

import ServiceTermsModal from './components/ServiceTermsModal.vue';
import PrivacyTermsModal from './components/PrivacyTermsModal.vue';
import MarketingTermsModal from './components/MarketingTermsModal.vue';

// 👸🏻(은진) : 약관동의 모달창
const showTermsModal = ref(false);
const showPrivacyModal = ref(false);
const showMarketingModal = ref(false);

const openTermsModal = () => (showTermsModal.value = true);
const openPrivacyModal = () => (showPrivacyModal.value = true);
const openMarketingModal = () => (showMarketingModal.value = true);

// 프로필 이미지들
// 🎵(유정) 마이페이지 - 프사 연동을 위한 로직 변경
const profileImages = [
  {
    key: 'sprout',
    url: new URL(
      '@/assets/images/icons/profile/profile_edit_sprout.png',
      import.meta.url
    ).href,
  },
  {
    key: 'beard',
    url: new URL(
      '@/assets/images/icons/profile/profile_edit_beard.png',
      import.meta.url
    ).href,
  },
  {
    key: 'eyelash',
    url: new URL(
      '@/assets/images/icons/profile/profile_edit_eyelash.png',
      import.meta.url
    ).href,
  },
  {
    key: 'carrot',
    url: new URL(
      '@/assets/images/icons/profile/profile_edit_carrot.png',
      import.meta.url
    ).href,
  },
];

const selectedImageKey = ref(profileImages[0].key); // 초기값: "sprout"

// 👁️ 비밀번호 보기/숨기기 아이콘
const eyeView = new URL(
  '@/assets/images/icons/signup/eye_view.png',
  import.meta.url
).href;
const eyeHide = new URL(
  '@/assets/images/icons/signup/eye_hide.png',
  import.meta.url
).href;

// form 상태값
const route = useRoute(); // 이메일 받아오기 위한 route

const selectedImage = ref(profileImages[0]);
const name = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// 안내/에러 메시지
const usernameMsg = ref('');
const idStatusType = ref(''); // 'error' | 'success'
const passwordMsg = ref('');
const confirmStatusType = ref(''); // 'error' | 'success'

// 약관 체크
const agreement = reactive({
  terms: false,
  privacy: false,
  marketing: false,
  all: false,
});
const handleIndividualCheck = () => {
  agreement.all = agreement.terms && agreement.privacy && agreement.marketing;
};
const handleAllAgree = () => {
  const checked = agreement.all;
  agreement.terms = checked;
  agreement.privacy = checked;
  agreement.marketing = checked;
};

// 정규식
const pwRule =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]|\\;:'",.<>/?]).{8,}$/;
const emailRule = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const nameRule = /^[가-힣a-zA-Z\s]{2,20}$/;
// 이름 유효성 검사 정규식
const isValidName = computed(() => nameRule.test(name.value));

// 아이디 중복확인
const checkUsername = async () => {
  usernameMsg.value = '';
  idStatusType.value = '';
  if (!username.value || username.value.length < 6) {
    usernameMsg.value = '아이디는 6자 이상 입력해야 합니다.';
    idStatusType.value = 'error';
    return;
  }
  try {
    const res = await axios.get(`/api/member/checkusername/${username.value}`);
    if (res.data === true) {
      usernameMsg.value = '이미 사용 중인 아이디입니다.';
      idStatusType.value = 'error';
    } else {
      usernameMsg.value = '사용 가능한 아이디입니다!';
      idStatusType.value = 'success';
    }
  } catch {
    usernameMsg.value = '아이디 확인 중 오류가 발생했습니다.';
    idStatusType.value = 'error';
  }
};

// 비밀번호 일치 검사
const validatePassword = () => {
  if (!password.value || !confirmPassword.value) {
    passwordMsg.value = '';
    confirmStatusType.value = '';
    return;
  }
  if (password.value !== confirmPassword.value) {
    passwordMsg.value = '비밀번호가 서로 일치하지 않습니다.';
    confirmStatusType.value = 'error';
  } else {
    passwordMsg.value = '';
    confirmStatusType.value = 'success';
  }
};

// 가입 가능 여부 (모든 조건 만족해야 버튼 활성화)
const canSignUp = computed(() => {
  return (
    selectedImage.value &&
    name.value.trim().length > 0 &&
    username.value.length >= 6 &&
    idStatusType.value === 'success' &&
    email.value.trim().length > 0 &&
    emailRule.test(email.value) &&
    pwRule.test(password.value) &&
    password.value === confirmPassword.value &&
    agreement.terms &&
    agreement.privacy
  );
});

// 라우터
const router = useRouter();
const showToast = ref(false);

const goBack = () => router.back();
const goLogin = () => router.push('/');

// 회원가입 처리 (API는 실제 적용시 추가)
// 🎵(유정)
const handleSignUp = async () => {
  if (!canSignUp.value) return;

  try {
    const payload = {
      name: name.value,
      loginId: username.value,
      email: email.value,
      password: password.value,
    };

    await axios.post('/api/member/join', payload);

    // 여기서 localStorage에 저장

    localStorage.setItem('avatarKey', selectedImageKey.value);

    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
      goLogin(); // 예: 로그인 페이지로 이동
    }, 1200);
  } catch (err) {
    alert(err.response?.data || '회원가입 중 오류가 발생했습니다.');
  }
};

onMounted(() => {
  if (route.query.email) {
    email.value = route.query.email;
  }
});

const onAgreeTerms = () => {
  agreement.terms = true;
  handleIndividualCheck();
  showTermsModal.value = false;
};
const onAgreePrivacy = () => {
  agreement.privacy = true;
  handleIndividualCheck();
  showPrivacyModal.value = false;
};
const onAgreeMarketing = () => {
  agreement.marketing = true;
  handleIndividualCheck();
  showMarketingModal.value = false;
};
</script>

<template>
  <div class="signUpContainer">
    <div class="cardBox">
      <transition name="fade">
        <div v-if="showToast" class="toastMsg">
          가입이 완료되었습니다! 로그인해 주세요
        </div>
      </transition>
      <img
        src="@/assets/images/icons/signup/login_main.png"
        alt="login-bunny"
        class="bunnyImage"
      />
      <div class="card">
        <div class="title font-24 font-extrabold">MoneyBunny</div>
        <p class="subtitle font-13">새로운 계정을 만들어보세요</p>

        <!-- 프로필 이미지 선택 -->
        <div class="profileImageSection">
          <div class="font-13 font-bold">프로필 사진 선택</div>
          <div class="profileImages">
            <img
              v-for="img in profileImages"
              :key="img.key"
              :src="img.url"
              class="profileImage"
              :class="{ selected: selectedImageKey === img.key }"
              @click="selectedImageKey = img.key"
            />
          </div>
          <p class="profileGuide font-11 font-light">
            원하는 프로필 사진을 선택하세요
          </p>
        </div>

        <!-- 이름 -->
        <div class="formGroup">
          <label class="font-13 font-bold">이름</label>
          <input
            type="text"
            v-model="name"
            :class="{ error: !isValidName && name }"
            placeholder="이름을 입력하세요"
          />
          <p
            v-if="name"
            class="font-10 idStatusMsg"
            :class="{
              error: !isValidName,
              success: isValidName,
            }"
          >
            {{
              isValidName
                ? '사용 가능한 이름입니다!'
                : '이름은 2~20자 한글/영문만 입력해주세요.'
            }}
          </p>
        </div>
        <!-- 아이디 -->
        <div class="formGroup">
          <label class="font-13 font-bold">아이디</label>
          <div class="inputRowHorizontal">
            <input
              type="text"
              v-model="username"
              placeholder="아이디를 입력하세요"
              class="idInput"
            />
            <button class="checkButton font-10" @click="checkUsername">
              중복확인
            </button>
          </div>
          <template v-if="usernameMsg">
            <p
              class="font-10 idStatusMsg"
              :class="{
                error: idStatusType === 'error',
                success: idStatusType === 'success',
              }"
            >
              {{ usernameMsg }}
            </p>
          </template>
          <template v-else>
            <p class="requireMsg font-10 font-light">
              영문, 숫자 조합 6자 이상
            </p>
          </template>
        </div>
        <!-- 이메일 -->
        <div class="formGroup">
          <label class="font-13 font-bold">이메일</label>
          <input
            type="email"
            v-model="email"
            placeholder="이메일을 입력하세요"
            readonly
          />
        </div>
        <!-- 비밀번호 -->
        <div class="formGroup">
          <label class="font-13 font-bold">비밀번호</label>
          <div class="inputRow" style="position: relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              placeholder="비밀번호를 입력하세요"
              class="passwordInput"
              v-model="password"
              @input="validatePassword"
            />
            <img
              :src="showPassword ? eyeView : eyeHide"
              class="icon"
              alt="비밀번호 보기 토글"
              @click="showPassword = !showPassword"
            />
          </div>
          <p class="font-10 font-light">8자 이상, 영문/숫자/특수문자 포함</p>
        </div>
        <!-- 비밀번호 확인 -->
        <div class="formGroup">
          <label class="font-13 font-bold">비밀번호 확인</label>
          <div class="inputRow" style="position: relative">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="비밀번호를 다시 입력하세요"
              class="passwordInput"
              v-model="confirmPassword"
              @input="validatePassword"
            />
            <img
              :src="showConfirmPassword ? eyeView : eyeHide"
              class="icon"
              alt="비밀번호 보기 토글"
              @click="showConfirmPassword = !showConfirmPassword"
            />
          </div>
          <p
            v-if="passwordMsg"
            class="pwStatusMsg font-10"
            :class="{
              error: confirmStatusType === 'error',
              success: confirmStatusType === 'success',
            }"
          >
            {{ passwordMsg }}
          </p>
        </div>
        <div class="agreementGroup font-11">
          <label class="checkboxRow">
            <input
              type="checkbox"
              v-model="agreement.terms"
              @change="handleIndividualCheck"
            />
            <span
              @click.stop.prevent="openTermsModal"
              :class="['agreeText', 'clickable', { checked: agreement.terms }]"
              >[필수] 서비스 이용약관에 동의합니다</span
            >
          </label>
          <label class="checkboxRow">
            <input
              type="checkbox"
              v-model="agreement.privacy"
              @change="handleIndividualCheck"
            />
            <span
              @click.stop.prevent="openPrivacyModal"
              :class="[
                'agreeText',
                'clickable',
                { checked: agreement.privacy },
              ]"
              >[필수] 개인정보 수집 및 이용에 동의합니다</span
            >
          </label>
          <label class="checkboxRow">
            <input
              type="checkbox"
              v-model="agreement.marketing"
              @change="handleIndividualCheck"
            />
            <span
              @click.stop.prevent="openMarketingModal"
              :class="[
                'agreeText',
                'clickable',
                { checked: agreement.marketing },
              ]"
              >[선택] 마케팅 정보 수신에 동의합니다</span
            >
          </label>
          <label class="checkboxRow">
            <input
              type="checkbox"
              v-model="agreement.all"
              @change="handleAllAgree"
            />
            <span>전체 동의</span>
          </label>
        </div>
        <!-- 버튼 -->
        <div class="buttonGroup">
          <button @click="goBack" class="backButton font-14">이전</button>
          <button
            @click="handleSignUp"
            class="submitButton font-14"
            :disabled="!canSignUp"
            :style="{
              backgroundColor: canSignUp
                ? 'var(--base-blue-dark)'
                : 'var(--input-disabled-2)',
            }"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 약관 모달 3종 -->
  <ServiceTermsModal v-model="showTermsModal" @agree="onAgreeTerms" />
  <PrivacyTermsModal v-model="showPrivacyModal" @agree="onAgreePrivacy" />
  <MarketingTermsModal v-model="showMarketingModal" @agree="onAgreeMarketing" />
</template>

<style scoped>
.signUpContainer {
  width: 100%;
  min-height: 100vh;
  background-color: var(--input-bg-2);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.cardBox {
  position: relative;
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.bunnyImage {
  width: 90px;
  height: 90px;
  margin-bottom: -30px;
  z-index: 2;
}
.card {
  width: 100%;
  max-width: 320px;
  min-height: 420px;
  background: white;
  border-radius: 12px;
  border: none;
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.title {
  text-align: center;
  color: var(--text-login);
  margin-bottom: 8px;
}

.subtitle {
  text-align: center;
  color: var(--text-bluegray);
  margin-bottom: 32px;
}

.profileImageSection {
  font-size: 13px;
  color: var(--text-bluegray);
}
.profileImages {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  margin-bottom: 14px;
  justify-content: center;
}

.profileImage {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  cursor: pointer;
  box-sizing: border-box;
}

.profileImage.selected {
  border: 1.5px solid var(--base-blue-dark);
}

.profileGuide {
  color: var(--text-bluegray);
  text-align: center;
}
.formGroup {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.formGroup label {
  font-size: 13px;
  color: var(--text-bluegray);
}

input {
  margin-top: 7px;
  font-size: 12px;
  padding: 10px 14px;
  border: 1.2px solid var(--input-outline);
  border-radius: 8px;
  background-color: transparent;
  outline: none;
}
input:focus {
  border: 1.5px solid var(--input-outline-2);
}

.inputRow {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}
.inputRowHorizontal {
  display: flex;
  align-items: center;
  gap: 10px;
}

.idInput {
  flex: 1;
  padding: 10px 14px;
  border: 1.2px solid var(--input-outline);
  border-radius: 8px;
  background-color: transparent;
  font-size: 12px;
  outline: none;
  min-width: 0;
}
.idInput:focus {
  border: 1.5px solid var(--input-outline-2);
}
.passwordInput {
  width: 100%;
  margin-bottom: 3px;
}

.checkButton {
  flex-shrink: 0;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 2px 5px;
  border-radius: 4px;
  border: none;
  height: 30px;
  margin-left: 3px;
}

.icon {
  position: absolute;
  right: 16px;
  top: 55%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  cursor: pointer;
  user-select: none;
}
.agreementGroup {
  margin-top: 8px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.checkboxRow {
  display: flex;
  align-items: center;
  margin-bottom: 0;
  cursor: pointer;
  user-select: none;
}
.checkboxRow input[type='checkbox'] {
  accent-color: var(--base-blue-dark);
  width: 14px;
  height: 14px;
  margin: 0 8px 0 0;
  vertical-align: middle;
  display: inline-block;
}
.checkboxRow span {
  font-size: 12px;
  color: var(--text-bluegray);
  line-height: 1;
  display: inline-block;
  vertical-align: middle;
}
.agreementGroup > div {
  margin-bottom: 4px;
}

.agreementGroup > div:last-child {
  margin-bottom: 0;
}

.buttonGroup {
  display: flex;
  gap: 6px;
}

.backButton {
  flex: 1;
  padding: 12px;
  border: 1px solid var(--input-disabled-1);
  border-radius: 8px;
  background-color: white;
  color: var(--text-darkgray);
}

.submitButton {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: var(--base-blue-dark);
  color: white;
}

.requireMsg {
  margin-top: 3px;
  margin-left: 5px;
  margin-bottom: 0;
  color: var(--text-bluegray);
}
.idStatusMsg {
  margin-top: 3px;
  margin-left: 5px;
}
.idStatusMsg.error {
  color: var(--alert-strong);
}
.idStatusMsg.success {
  color: var(--success-text);
}
.pwStatusMsg {
  margin-top: 3px;
  margin-left: 5px;
  color: var(--alert-strong);
}

.pwStatusMsg.error {
  color: var(--alert-strong);
}
.pwStatusMsg.success {
  color: var(--success-text);
}

.toastMsg {
  position: absolute;
  top: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  background: var(--base-blue-dark);
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  min-width: 250px;
  max-width: 350px;
  text-align: center;
  pointer-events: none;
  box-sizing: border-box;
  white-space: nowrap;
}

.agreeText.clickable {
  text-decoration: underline;
  cursor: pointer;
  color: var(--text-bluegray); /* 기본 전체동의랑 같은 색상 */
}
.agreeText.clickable.checked {
  color: var(--base-blue-dark); /* 체크 시 네이비 강조 */
}
</style>
