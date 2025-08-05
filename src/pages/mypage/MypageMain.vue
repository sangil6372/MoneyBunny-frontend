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
      :phone="userInfo.phone"
      :profileImage="userInfo.profileImage"
      @close="isModalOpen = false"
      @update="handleUpdate"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useBookmarkStore } from '@/stores/bookmark';

// 컴포넌트 import
import MypageProfileCard from './common/MypageProfileCard.vue';
import MypageTabMenu from './common/MypageTabMenu.vue';
import ProfileInfoTable from './profile/ProfileInfoTable.vue';
import EditProfileModal from './profile/EditProfileModal.vue';
import BookmarkList from './bookmark/BookmarkList.vue';
import SettingMain from './settings/SettingMain.vue';

import imgSprout from '@/assets/images/icons/profile/profile_edit_sprout.png';
import imgBeard from '@/assets/images/icons/profile/profile_edit_beard.png';
import imgEyelash from '@/assets/images/icons/profile/profile_edit_eyelash.png';
import imgCarrot from '@/assets/images/icons/profile/profile_edit_carrot.png';

const currentTab = ref('profile');
const isModalOpen = ref(false);

const profileImages = [imgSprout, imgBeard, imgEyelash, imgCarrot];

const userInfo = ref({
  name: '서루피',
  email: 'loopy@gmail.com',
  phone: '010-1234-5678',
  profileImage: imgBeard,
});

// 💪(상일) 북마크 스토어 연동
const bookmarkStore = useBookmarkStore();
const { bookmarks, loading: bookmarkLoading, error: bookmarkError } = storeToRefs(bookmarkStore);
const { fetchBookmarks } = bookmarkStore;

const openModal = () => {
  isModalOpen.value = true;
};

const changeTab = (tab) => {
  currentTab.value = tab;
  
  // 💪(상일) 북마크 탭으로 전환 시 데이터 로드
  if (tab === 'bookmark' && bookmarks.value.length === 0) {
    fetchBookmarks();
  }
};

const handleUpdate = (data) => {
  userInfo.value = { ...userInfo.value, ...data };
};

// 💪(상일) 컴포넌트 마운트 시 북마크 데이터 미리 로드
onMounted(async () => {
  await fetchBookmarks();
});
</script>

<style scoped>
.myPageContainer {
  width: 100%;
  min-height: 100vh;
  background-color: var(--input-bg-2);
  padding: 32px 20px;
  box-sizing: border-box;
}

.infoCard {
  background-color: white;
  border-radius: 20px;
  padding: 20px;
}

.userCard {
  background-color: white;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
}

.userInfo {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.profileImage {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: var(--input-bg-3);
  object-fit: cover;
  margin-right: 16px;
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
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.infoCard {
  background-color: white;
  border-radius: 20px;
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
