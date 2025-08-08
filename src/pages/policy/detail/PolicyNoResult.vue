<template>
  <div class="noResultContainer">
    <div class="noResultContent">
      <img
        src="@/assets/images/icons/bunny/crying_policy_bunny2.png"
        alt="조건에 맞는 정책 없음"
        class="noResultImage"
      />
      <div class="noResultTitle">조건에 맞는 정책이 없습니다</div>
      <div class="noResultDesc">
        정책 유형을 다시 검사하거나,<br />
        전체 정책 목록에서 다양한 정책을 확인해보세요.
      </div>
      <button class="retryBtn" @click="$emit('retry')">
        정책 유형 다시 검사 하기
      </button>
      <button class="allPolicyBtn" @click="$emit('showAll')">
        모든 정책 둘러보기
      </button>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.noResultContainer {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.noResultContent {
  width: 100%;
  background: #fff;
  border-radius: 12px;
  padding: 20px 20px 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.noResultImage {
  width: 100px;
  height: 160px;
  margin: -14px 0;
}

.noResultTitle {
  font-size: 17px;
  color: var(--text-login);
  margin-bottom: 10px;
  text-align: center;
}

.noResultDesc {
  font-size: 12px;
  color: var(--text-bluegray);
  margin-bottom: 25px;
  text-align: center;
  /* line-height: 1.5; */
}

.retryBtn {
  width: 100%;
  height: 45px;
  background: var(--base-blue-dark);
  color: #fff;
  font-size: 14px;
  border-radius: 8px;
  border: none;
  margin-bottom: 10px;
  cursor: pointer;
}

.allPolicyBtn {
  width: 100%;
  height: 45px;
  background: #f8fafd;
  color: var(--base-blue-dark);
  font-size: 14px;
  border-radius: 8px;
  border: 1.5px solid #e2e7f2;
  cursor: pointer;
}
</style>
