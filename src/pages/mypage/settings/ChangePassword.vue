<template>
  <div class="changePassword">
    <div class="card">
      <label class="font-15 font-bold">현재 비밀번호</label>
      <input
        type="password"
        placeholder="현재 비밀번호를 입력하세요"
        class="inputBox font-14 font-regular"
      />
      <!-- 새 비밀번호 -->
      <label class="font-15 font-bold">새 비밀번호</label>
      <input
        type="password"
        placeholder="새 비밀번호를 입력하세요"
        v-model="newPassword"
        @input="validatePassword"
        :class="[
          'inputBox',
          'font-14',
          'font-regular',
          { error: passwordError },
        ]"
      />
      <p v-if="passwordError" class="font-12 font-regular errorMessage">
        8자 이상 입력해야 합니다.
      </p>
      <p v-else class="hint font-12 font-regular">
        8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.
      </p>

      <!-- 새 비밀번호 확인 -->
      <label class="font-15 font-bold">새 비밀번호 확인</label>
      <input
        type="password"
        placeholder="새 비밀번호를 다시 입력하세요"
        v-model="confirmPassword"
        @input="validateConfirm"
        :class="[
          'inputBox',
          'font-14',
          'font-regular',
          { error: confirmError && confirmTouched },
        ]"
      />
      <p
        v-if="confirmError && confirmTouched"
        class="font-12 font-regular errorMessage"
      >
        비밀번호가 일치하지 않습니다.
      </p>

      <button class="submitBtn font-15 font-bold" @click="handleChangePassword">
        비밀번호 변경
      </button>
    </div>

    <div class="guide">
      <h4 class="font-18 font-bold">비밀번호 변경 안내</h4>
      <ul>
        <li class="font-14 font-regular">비밀번호는 8자 이상이어야 합니다.</li>
        <li class="font-14 font-regular">
          영문 대소문자, 숫자, 특수문자를 포함해야 합니다.
        </li>
        <li class="font-14 font-regular">
          이전에 사용한 비밀번호는 사용할 수 없습니다.
        </li>
        <li class="font-14 font-regular">
          비밀번호 변경 후 모든 기기에서 재로그인이 필요합니다.
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const newPassword = ref('');
const confirmPassword = ref('');
const passwordError = ref(false);
const confirmError = ref(false);
const confirmTouched = ref(false); // ✅ 확인창 입력 여부 상태 추가

// 새 비밀번호 실시간 유효성 체크
watch(newPassword, (val) => {
  passwordError.value = val.length < 8;
  // 새 비밀번호 바뀌면 확인 비번도 다시 체크 (입력한 적 있을 때만)
  if (confirmTouched.value) {
    confirmError.value = confirmPassword.value !== val;
  }
});

// 비밀번호 확인창 실시간 체크 (입력 감지 포함)
watch(confirmPassword, (val) => {
  confirmTouched.value = true; // ✅ 입력한 적 있다고 표시
  confirmError.value = val !== newPassword.value;
});

// ✅ 버튼 눌렀을 때도 검사
const handleChangePassword = () => {
  validatePassword();
  validateConfirm();

  if (!passwordError.value && !confirmError.value) {
    router.push({ name: 'settingMain' });
  }
};
</script>

<style scoped>
.changePassword {
  padding: 20px 20px;
}

.card {
  background-color: white;
  border-radius: 16px;
  border: none;
  padding: 20px;
  margin-bottom: 24px;
}

.card label {
  display: block;
  margin-top: 16px;
  color: var(--text-login);
}

.inputBox {
  width: 100%;
  padding: 10px 12px;
  margin-top: 8px;
  border-radius: 8px;
  border: 1px solid var(--input-outline);
  color: var(--text-login);
}

.hint {
  margin-left: 6px;
  margin-top: 6px;
  color: var(--text-lightgray);
}

.submitBtn {
  width: 350px;
  margin: 24px auto 0; /* 가운데 정렬 */
  padding: 12px;
  border-radius: 8px;
  border: none;
  background-color: var(--base-blue-dark);
  color: white;
  cursor: pointer;
  display: block;
}

.guide {
  background-color: white;
  border-radius: 16px;
  padding: 26px 0;
}

.guide h4 {
  margin-bottom: 12px;
  color: var(--text-login);
  padding-left: 35px;
}

.guide ul {
  padding-left: 45px;
  color: var(--base-blue-dark);
}

.guide li {
  margin-bottom: 9px;
  color: var(--text-bluegray);
}

.inputBox.error {
  border: 1px solid var(--alert-red);
}

.errorMessage {
  color: var(--alert-red);
  margin-top: 6px;
  margin-left: 6px;
}
</style>
