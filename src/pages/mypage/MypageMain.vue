<template>
  <div class="myPageContainer">
    <!-- 고정 프로필 카드 -->
    <MypageProfileCard :userInfo="userInfo" @edit="openPicker" />

    <!-- 하나의 카드 안에 탭 메뉴 + 콘텐츠 -->
    <div class="infoCard">
      <MypageTabMenu :currentTab="currentTab" @changeTab="changeTab" />

      <!-- 탭별 콘텐츠 -->
      <div class="tabContent">
        <!-- <ProfileInfoTable
          v-if="currentTab === 'profile'"
          :userInfo="userInfo"
        /> -->
        <BookmarkList v-if="currentTab === 'bookmark'" :bookmarks="bookmarks" />
        <ApplicationList v-if="currentTab === 'application'" />
        <SettingMain v-if="currentTab === 'settings'" />
      </div>
    </div>

    <ProfileImagePicker
      ref="pickerRef"
      v-if="showPicker"
      v-model="tempImage"
      @close="closePicker"
      @save="saveProfile"
    />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useBookmarkStore } from "@/stores/bookmark";
import { useApplicationStore } from "@/stores/application";
import { useAuthStore } from "@/stores/auth";
import axios from "axios";

// 컴포넌트 import
import MypageProfileCard from "./common/MypageProfileCard.vue";
import MypageTabMenu from "./common/MypageTabMenu.vue";
import ProfileInfoTable from "./profile/ProfileInfoTable.vue";
import EditProfileModal from "./profile/EditProfileModal.vue";
import BookmarkList from "./bookmark/BookmarkList.vue";
import ApplicationList from "./application/ApplicationList.vue";
import SettingMain from "./settings/SettingMain.vue";

import ProfileImagePicker from "./profile/ProfileImagePicker.vue";

import imgSprout from "@/assets/images/icons/profile/profile_edit_sprout.png";
import imgBeard from "@/assets/images/icons/profile/profile_edit_beard.png";
import imgEyelash from "@/assets/images/icons/profile/profile_edit_eyelash.png";
import imgCarrot from "@/assets/images/icons/profile/profile_edit_carrot.png";

// Auth store 인스턴스
const authStore = useAuthStore();

const currentTab = ref("bookmark");
const isModalOpen = ref(false);

// 프사
// 프사 연동(localStorage)
const profileImages = [imgSprout, imgBeard, imgEyelash, imgCarrot];
const avatarMap = {
  sprout: imgSprout,
  beard: imgBeard,
  eyelash: imgEyelash,
  carrot: imgCarrot,
};
const avatarKey = localStorage.getItem("avatarKey") || "sprout"; // 기본값: sprout

const userInfo = ref({
  name: "",
  email: "",
  profileImage: avatarMap[avatarKey],
});

const showPicker = ref(false);

const pickerRef = ref(null);

// 초기값
const tempImage = ref(0);

// httpOnly Cookie 방식에서는 axios 인터셉터가 자동으로 토큰 처리하므로 헬퍼 함수 불필요

// 열기
const openPicker = () => {
  tempImage.value = userInfo.value.profileImageId ?? 0; // 숫자
  showPicker.value = true;
};

// 닫기
const closePicker = () => (showPicker.value = false);

// 토스트 상태
const showToast = ref(false);
const toastMessage = ref("");

// 토스트 띄우기 헬퍼(2초)
const showToastOnce = (
  msg = "프로필 이미지가 변경되었습니다!",
  duration = 1000
) => {
  toastMessage.value = msg;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, duration);
};

// 저장: 숫자 imageId 받아서 API 호출 -> 성공 시 UI 반영 + 토스트
const saveProfile = async (imageId) => {
  try {
    await axios.patch(`/api/member/profile-image/${imageId}`);
    // DB 반영 성공 → 로컬 상태 동기화
    userInfo.value.profileImageId = imageId;
    userInfo.value.profileImage =
      profileImages[imageId] ?? userInfo.value.profileImage;

    // 팝업 안에서 토스트 띄우고, 잠시 후 자동 닫기(픽커가 close emit)
    pickerRef.value?.showSavedToast("프로필 이미지가 변경되었습니다!");
  } catch (e) {
    console.error("프로필 이미지 변경 실패:", e);
    alert("프로필 이미지를 변경하지 못했어요! 다시 시도해주세요.");
  }
};

// 북마크 스토어 연동
const bookmarkStore = useBookmarkStore();
const {
  bookmarks,
  loading: bookmarkLoading,
  error: bookmarkError,
} = storeToRefs(bookmarkStore);
const { fetchBookmarks } = bookmarkStore;

// 신청 정책 스토어 연동
const applicationStore = useApplicationStore();
const { fetchApplications } = applicationStore;

const openModal = () => {
  isModalOpen.value = true;
};

const changeTab = (tab) => {
  currentTab.value = tab;

  // 북마크 탭으로 전환 시 데이터 로드
  if (tab === "bookmark" && bookmarks.value.length === 0) {
    fetchBookmarks();
  }
  
  // 신청 정책 탭으로 전환 시 데이터 로드
  if (tab === "application") {
    fetchApplications();
  }
};

const handleUpdate = (data) => {
  userInfo.value = { ...userInfo.value, ...data };
};

// 컴포넌트 마운트 시 북마크 데이터 미리 로드
// 프로필 호출
onMounted(async () => {
  // Auth store 초기화 완료까지 최대 3초 대기
  let attempts = 0;
  while (attempts < 30 && !authStore._isInitialized) {
    await new Promise(resolve => setTimeout(resolve, 100));
    attempts++;
  }

  // 프로필 API 호출
  try {
    const res = await axios.get("/api/member/information");
    
    userInfo.value.name = res.data.name;
    userInfo.value.email = res.data.email;

    // DB profileImageId → 이미지 경로
    const idx = Number(res.data.profileImageId);
    const safeIdx =
      Number.isInteger(idx) && idx >= 0 && idx < profileImages.length ? idx : 0;
    userInfo.value.profileImageId = safeIdx;
    userInfo.value.profileImage = profileImages[safeIdx];
  } catch (err) {
    console.error("프로필 불러오기 실패:", err);
  }

  // 북마크 로드
  await fetchBookmarks();
});
</script>

<style scoped>
.myPageContainer {
  width: 100%;
  min-height: 100vh;
  background-color: var(--input-bg-2);
  box-sizing: border-box;
}

.infoCard {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  position: relative; /* 토스트  */
}

.userCard {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 24px;
}

.userInfo {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.profileImage {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--input-bg-3);
  object-fit: cover;
  margin-right: 12px;
}

.userText {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.userName {
  color: var(--text-login);
}

.userEmail {
  color: var(--text-bluegray);
}

.editIcon {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.tabHeader {
  display: flex;
  justify-content: space-around;
  border-bottom: 2px solid var(--input-outline);
  margin-bottom: 20px;
}

.tabItem {
  padding-bottom: 8px;
  color: var(--text-bluegray);
  cursor: pointer;
}

.tabItem.active {
  color: var(--text-login);
  border-bottom: 2px solid var(--text-login);
}

.infoRow {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--input-bg-1);
}

.infoLabel {
  color: var(--text-lightgray);
}

.infoValue {
  color: var(--text-login);
}

/* 토스트 */
.toastMsg {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  background: var(--base-blue-dark);
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  min-width: 250px;
  max-width: 350px;
  pointer-events: none;
  text-align: center;
  box-sizing: border-box;
  white-space: nowrap;
}

/* 이미 있으니 유지해도 OK */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
