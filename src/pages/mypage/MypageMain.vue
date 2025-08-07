<template>
  <div class="myPageContainer">
    <!-- 고정 프로필 카드 -->
    <MypageProfileCard :userInfo="userInfo" @edit="openModal" />

    <!-- 하나의 카드 안에 탭 메뉴 + 콘텐츠 -->
    <div class="infoCard">
      <MypageTabMenu :currentTab="currentTab" @changeTab="changeTab" />

      <!-- 탭별 콘텐츠 -->
      <div class="tabContent">
        <ProfileInfoTable
          v-if="currentTab === 'profile'"
          :userInfo="userInfo"
        />
        <BookmarkList v-if="currentTab === 'bookmark'" :bookmarks="bookmarks" />
        <SettingMain v-if="currentTab === 'settings'" />
      </div>
    </div>

    <!-- 프로필 수정 모달 -->
    <EditProfileModal
      v-if="isModalOpen"
      :name="userInfo.name"
      :email="userInfo.email"
      :profileImage="userInfo.profileImage"
      @close="isModalOpen = false"
      @update="handleUpdate"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useBookmarkStore } from "@/stores/bookmark";
import axios from "axios";

// 컴포넌트 import
import MypageProfileCard from "./common/MypageProfileCard.vue";
import MypageTabMenu from "./common/MypageTabMenu.vue";
import ProfileInfoTable from "./profile/ProfileInfoTable.vue";
import EditProfileModal from "./profile/EditProfileModal.vue";
import BookmarkList from "./bookmark/BookmarkList.vue";
import SettingMain from "./settings/SettingMain.vue";

import imgSprout from "@/assets/images/icons/profile/profile_edit_sprout.png";
import imgBeard from "@/assets/images/icons/profile/profile_edit_beard.png";
import imgEyelash from "@/assets/images/icons/profile/profile_edit_eyelash.png";
import imgCarrot from "@/assets/images/icons/profile/profile_edit_carrot.png";

const currentTab = ref("profile");
const isModalOpen = ref(false);

// 프사
// 🎵(유정) 프사 연동(localStorage)
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

// 💪(상일) 북마크 스토어 연동
const bookmarkStore = useBookmarkStore();
const {
  bookmarks,
  loading: bookmarkLoading,
  error: bookmarkError,
} = storeToRefs(bookmarkStore);
const { fetchBookmarks } = bookmarkStore;

const openModal = () => {
  isModalOpen.value = true;
};

const changeTab = (tab) => {
  currentTab.value = tab;

  // 💪(상일) 북마크 탭으로 전환 시 데이터 로드
  if (tab === "bookmark" && bookmarks.value.length === 0) {
    fetchBookmarks();
  }
};

const handleUpdate = (data) => {
  userInfo.value = { ...userInfo.value, ...data };
};

// 💪(상일) 컴포넌트 마운트 시 북마크 데이터 미리 로드
// 🎵(유정) 프로필 호출
onMounted(async () => {
  // auth 토큰 꺼내기 (share 컴포넌트 참고)
  const savedAuth = localStorage.getItem("auth");
  const parsed = savedAuth ? JSON.parse(savedAuth) : {};
  const token = parsed.token; // 로그인할 때 저장한 객체에 token 프로퍼티가 있어야 함

  // 헤더 세팅
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // 프로필 API 호출
  try {
    const res = await axios.get("/api/member/information", { headers });
    console.log(res);
    userInfo.value.name = res.data.name;
    userInfo.value.email = res.data.email;
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

.infoCard {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
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
</style>
