<script setup>
import { useRouter } from 'vue-router';
import { ref, reactive, computed } from 'vue';
import axios from 'axios';

// 프로필 이미지들
const profileImages = [
  new URL(
    '@/assets/images/icons/profile/profile_edit_sprout.png',
    import.meta.url
  ).href,
  new URL(
    '@/assets/images/icons/profile/profile_edit_beard.png',
    import.meta.url
  ).href,
  new URL(
    '@/assets/images/icons/profile/profile_edit_eyelash.png',
    import.meta.url
  ).href,
  new URL(
    '@/assets/images/icons/profile/profile_edit_carrot.png',
    import.meta.url
  ).href,
];

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
const selectedImage = ref(profileImages[0]);
const realName = ref('');
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
    realName.value.trim().length > 0 &&
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
const handleSignUp = async () => {
  if (!canSignUp.value) return;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
    goLogin();
  }, 1200);
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
        <div class="title font-26 font-extrabold">MoneyBunny</div>
        <p class="subtitle font-14">새로운 계정을 만들어보세요</p>

        <!-- 프로필 이미지 선택 -->
        <div class="profileImageSection">
          <div class="font-14 font-bold">프로필 사진 선택</div>
          <div class="profileImages">
            <img
              v-for="(img, idx) in profileImages"
              :key="idx"
              :src="img"
              class="profileImage"
              :class="{ selected: selectedImage === img }"
              @click="selectedImage = img"
            />
          </div>
          <p class="profileGuide font-12 font-light">
            원하는 프로필 사진을 선택하세요
          </p>
        </div>

        <!-- 이름 -->
        <div class="formGroup">
          <label class="font-14 font-bold">이름</label>
          <input
            type="text"
            v-model="realName"
            placeholder="이름을 입력하세요"
          />
        </div>
        <!-- 아이디 -->
        <div class="formGroup">
          <label class="font-14 font-bold">아이디</label>
          <div class="inputRowHorizontal">
            <input
              type="text"
              v-model="username"
              placeholder="아이디를 입력하세요"
              class="idInput"
            />
            <button class="checkButton font-11" @click="checkUsername">
              중복확인
            </button>
          </div>
          <template v-if="usernameMsg">
            <p
              class="font-11 idStatusMsg"
              :class="{
                error: idStatusType === 'error',
                success: idStatusType === 'success',
              }"
            >
              {{ usernameMsg }}
            </p>
          </template>
          <template v-else>
            <p class="requireMsg font-11 font-light">
              영문, 숫자 조합 6자 이상
            </p>
          </template>
        </div>
        <!-- 이메일 -->
        <div class="formGroup">
          <label class="font-14 font-bold">이메일</label>
          <input
            type="email"
            v-model="email"
            placeholder="이메일을 입력하세요"
          />
        </div>
        <!-- 비밀번호 -->
        <div class="formGroup">
          <label class="font-14 font-bold">비밀번호</label>
          <div class="inputRow" style="position: relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              placeholder="비밀번호를 입력하세요"
              class="passwordInput"
              v-model="password"
              @input="validatePassword"
            />
            <img
              :src="showPassword ? eyeHide : eyeView"
              class="icon"
              alt="비밀번호 보기 토글"
              @click="showPassword = !showPassword"
            />
          </div>
          <p class="font-11 font-light">8자 이상, 영문/숫자/특수문자 포함</p>
        </div>
        <!-- 비밀번호 확인 -->
        <div class="formGroup">
          <label class="font-14 font-bold">비밀번호 확인</label>
          <div class="inputRow" style="position: relative">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="비밀번호를 다시 입력하세요"
              class="passwordInput"
              v-model="confirmPassword"
              @input="validatePassword"
            />
            <img
              :src="showConfirmPassword ? eyeHide : eyeView"
              class="icon"
              alt="비밀번호 보기 토글"
              @click="showConfirmPassword = !showConfirmPassword"
            />
          </div>
          <p
            v-if="passwordMsg"
            class="font-11 pwStatusMsg"
            :class="{ error: confirmStatusType === 'error' }"
          >
            {{ passwordMsg }}
          </p>
        </div>
        <!-- 약관동의 -->
        <div class="agreementGroup font-12">
          <label class="checkboxRow">
            <input
              type="checkbox"
              v-model="agreement.terms"
              @change="handleIndividualCheck"
            />
            <span>[필수] 서비스 이용약관에 동의합니다</span>
          </label>
          <label class="checkboxRow">
            <input
              type="checkbox"
              v-model="agreement.privacy"
              @change="handleIndividualCheck"
            />
            <span>[필수] 개인정보 수집 및 이용에 동의합니다</span>
          </label>
          <label class="checkboxRow">
            <input
              type="checkbox"
              v-model="agreement.marketing"
              @change="handleIndividualCheck"
            />
            <span>[선택] 마케팅 정보 수신에 동의합니다</span>
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
          <button @click="goBack" class="backButton font-15">이전</button>
          <button
            @click="handleSignUp"
            class="submitButton font-15"
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
  max-width: 360px;
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
  max-width: 360px;
  min-height: 460px;
  background: white;
  border-radius: 12px;
  border: none;
  padding: 32px 24px 32px 24px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.title {
  text-align: center;
  color: var(--text-login);
}

.subtitle {
  text-align: center;
  color: var(--text-bluegray);
  margin: 8px 0 32px;
}

.profileImageSection {
  font-size: 14px;
  color: var(--text-bluegray);
}
.profileImages {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 12px;
  justify-content: center;
}

.profileImage {
  width: 66px;
  height: 66px;
  border-radius: 50%;
  cursor: pointer;
  box-sizing: border-box;
}

.profileImage.selected {
  border: 1.75px solid var(--base-blue-dark);
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
  font-size: 14px;
  color: var(--text-bluegray);
}

input {
  margin-top: 7px;
  font-size: 13px;
  padding: 12px 16px;
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
  padding: 12px 16px;
  border: 1.2px solid var(--input-outline);
  border-radius: 8px;
  background-color: transparent;
  font-size: 13px;
  outline: none;
  min-width: 0;
}
.idInput:focus {
  border: 1.5px solid var(--input-outline-2);
}
.passwordInput {
  width: 100%;
}

.checkButton {
  flex-shrink: 0;
  background-color: var(--base-blue-dark);
  color: white;
  padding: 5px 10px;
  border-radius: 8px;
  border: none;
  height: 40px;
  margin-left: 3px;
}

.icon {
  position: absolute;
  right: 16px;
  top: 55%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
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
  width: 16px;
  height: 16px;
  margin: 0 8px 0 0;
  vertical-align: middle;
  display: inline-block;
}
.checkboxRow span {
  font-size: 13px;
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
  margin-top: 5px;
  margin-left: 5px;
  margin-bottom: 0;
  color: var(--text-bluegray);
}
.idStatusMsg {
  margin-top: 5px;
  margin-left: 5px;
}
.idStatusMsg.error {
  color: var(--alert-strong);
}
.idStatusMsg.success {
  color: var(--success-text);
}
.pwStatusMsg {
  margin-top: 5px;
  margin-left: 5px;
  color: var(--alert-strong);
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
  font-size: 15px;
  min-width: 300px;
  max-width: 400px;
  text-align: center;
  pointer-events: none;
  box-sizing: border-box;
  white-space: nowrap;
}
</style>
