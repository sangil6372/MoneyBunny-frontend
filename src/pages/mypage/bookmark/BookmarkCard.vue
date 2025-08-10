<template>
  <div class="bookmarkCard">
    <div class="headerRow">
      <span class="title">
        {{ item.title }}
        <span
          v-if="item.status"
          :class="[
            'badge',
            item.status === '신청가능' ? 'badgeActive' : 'badgeExpired',
          ]"
        >
          {{ item.status }}
        </span>
      </span>
      <button
        class="removeBtn"
        @click="handleRemoveBookmark"
        title="북마크 제거"
      >
        <img
          src="@/assets/images/icons/common/x.png"
          alt="북마크 제거"
          class="removeIcon"
        />
      </button>
    </div>
    <div class="desc">{{ item.description }}</div>
    <div class="infoRow">
      <div>
        <span
          >지원금액 : <strong>{{ item.supportAmount }}</strong></span
        >
        <span class="divider"></span>
        <span
          >마감 : <strong>{{ item.deadline }}</strong></span
        >
      </div>
    </div>
    <div class="metaRow">
      <span>북마크일 : {{ item.savedDate }}</span>
      <button class="detailBtn" @click="handleDetailClick">자세히 보기</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useBookmarkStore } from '@/stores/bookmark';

// 💪(상일) props 정의
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

// 💪(상일) 라우터와 스토어 사용
const router = useRouter();
const bookmarkStore = useBookmarkStore();

// 💪(상일) 정책 상세 페이지로 이동
const handleDetailClick = () => {
  if (props.item.policyId) {
    router.push(`/policy/${props.item.policyId}`);
  }
};

// 💪(상일) 북마크 제거 처리
const handleRemoveBookmark = async () => {
  if (confirm('이 정책을 북마크에서 제거하시겠습니까?')) {
    const success = await bookmarkStore.removeBookmark(props.item.policyId);
    if (!success) {
      alert('북마크 제거에 실패했습니다. 다시 시도해주세요.');
    }
  }
};
</script>

<style scoped>
.bookmarkCard {
  border: 1px solid var(--input-outline-2);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 9px;
  background: none;
  position: relative;
}
.headerRow {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.title {
  font-size: 15px;
  font-weight: bold;
  color: var(--text-login);
  display: flex;
  align-items: center;
  gap: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  -webkit-line-clamp: 1; /* 2줄까지만! */
  -webkit-box-orient: vertical;
  max-width: 80%;
  min-width: 0;
}
.badge {
  font-size: 11px;
  border-radius: 10px;
  padding: 5px 8px;
  font-weight: bold;
  margin-left: 2px;
}
.badgeActive {
  background: #e6faf2;
  color: #18b184;
}
.badgeExpired {
  background: #fff0f4;
  color: #e3456d;
}

.removeBtn {
  background: none;
  border: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.removeIcon {
  width: 17px;
  height: 17px;
}
.desc {
  font-size: 11px;
  color: #5a5a5a;
  margin-bottom: 2px;
  /* 두줄 말줄임 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.infoRow {
  font-size: 11px;
  color: #6a7686;
  display: flex;
  align-items: center;
  margin-bottom: 2px;
  gap: 10px;
}

.divider {
  display: inline-block;
  width: 1.5px;
  height: 10px;
  background: #e2e2e2;
  margin: 0 8px;
  vertical-align: middle;
}
.infoRow strong {
  color: #23377a;
  font-weight: bold;
}
.metaRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  color: #9aadc5;
  margin-top: 6px;
  border-top: 1px solid #f0f3fa;
  padding-top: 8px;
}
.detailBtn {
  background: none;
  color: #2846d7;
  border: none;
  cursor: pointer;
  padding: 0;
  font-weight: bold;
  font-size: 11px;
}
</style>
