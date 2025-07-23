<script setup>
import { useRouter } from 'vue-router';
import profile1 from '@/assets/images/icons/profile/profile_edit_sprout.png';
import profile2 from '@/assets/images/icons/profile/profile_edit_beard.png';
import profile3 from '@/assets/images/icons/profile/profile_edit_eyelash.png';
import profile4 from '@/assets/images/icons/profile/profile_edit_carrot.png';

const profileImages = [profile1, profile2, profile3, profile4];
let selectedImage = profileImages[0];

const router = useRouter();

const goBack = () => {
  router.back();
};

const goLogin = () => {
  router.push('/');
};
</script>
<template>
  <div class="signUpContainer">
    <div class="card">
      <h1 class="title font-28 font-extrabold">MoneyBunny</h1>
      <p class="subtitle font-15 font-regular">새로운 계정을 만들어보세요</p>

      <!-- 프로필 이미지 선택 -->
      <div class="profileImageSection">
        <p class="font-15 font-bold">프로필 사진 선택</p>
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
        <p class="profileGuide font-13 font-light">
          원하는 프로필 사진을 선택하세요
        </p>
      </div>

      <!-- 입력 폼 -->
      <div class="formGroup">
        <label class="font-15 font-bold">이름</label>
        <input type="text" placeholder="이름을 입력하세요" />
      </div>

      <div class="formGroup">
        <label class="font-15 font-bold">아이디</label>
        <div class="inputRow">
          <input type="text" placeholder="아이디를 입력하세요 (6자 이상)" />
          <button class="checkButton font-13 font-bold">중복확인</button>
        </div>
        <p class="font-12 font-light">영문, 숫자 조합 6자 이상</p>
      </div>

      <div class="formGroup">
        <label class="font-15 font-bold">이메일</label>
        <input type="email" placeholder="이메일을 입력하세요" />
      </div>

      <div class="formGroup">
        <label class="font-15 font-bold">비밀번호</label>
        <div class="inputRow">
          <input type="password" placeholder="비밀번호를 입력하세요" />
          <span class="icon">👁️</span>
        </div>
        <p class="font-12 font-light">8자 이상, 영문/숫자/특수문자 포함</p>
      </div>

      <div class="formGroup">
        <label class="font-15 font-bold">비밀번호 확인</label>
        <div class="inputRow">
          <input type="password" placeholder="비밀번호를 다시 입력하세요" />
          <span class="icon">👁️</span>
        </div>
      </div>

      <!-- 약관 동의 -->
      <div class="agreementGroup font-13">
        <div><input type="checkbox" /> [필수] 서비스 이용약관에 동의합니다</div>
        <div>
          <input type="checkbox" /> [필수] 개인정보 수집 및 이용에 동의합니다
        </div>
        <div>
          <input type="checkbox" /> [선택] 마케팅 정보 수신에 동의합니다
        </div>
        <div><input type="checkbox" /> 전체 동의</div>
      </div>

      <!-- 버튼 -->
      <div class="buttonGroup">
        <button @click="goBack" class="backButton font-15 font-bold">
          이전
        </button>
        <button @click="goLogin" class="submitButton font-15 font-bold">
          회원가입
        </button>
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
  padding: 24px;
}

.card {
  width: 100%;
  max-width: 350px;
  background: white;
  border-radius: 20px;
  padding: 16px;
  border: none;
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
  margin-bottom: 24px;
}

.profileImages {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  margin-bottom: 8px;
  justify-content: space-between;
}

.profileImage {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  /* border: 2px solid transparent; */
  cursor: pointer;
}

.profileImage.selected {
  border-color: var(--base-blue-dark);
}

.profileGuide {
  color: var(--text-bluegray);
  text-align: center;
}

.formGroup {
  margin-bottom: 20px;
}

.inputRow {
  display: flex;
  align-items: center;
  gap: 10px;
}

input {
  flex: 1;
  padding: 12px;
  border: 1px solid var(--input-outline);
  border-radius: 8px;
  background-color: transparent;
  font-size: 14px;
  margin-top: 7px;
  margin-bottom: 25px;
}

.checkButton {
  background-color: var(--base-blue-dark);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  border: none;
}

.icon {
  font-size: 16px;
  margin-left: -30px;
  cursor: pointer;
}

.agreementGroup {
  margin-top: 16px;
  margin-bottom: 20px;
}

.buttonGroup {
  display: flex;
  gap: 12px;
}

.backButton {
  flex: 1;
  padding: 14px;
  border: 1px solid var(--input-disabled-1);
  border-radius: 8px;
  background-color: white;
  color: var(--text-darkgray);
}

.submitButton {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 8px;
  background-color: var(--base-blue-dark);
  color: white;
}
</style>
