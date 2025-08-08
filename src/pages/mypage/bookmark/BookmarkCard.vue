<template>
  <div class="bookmarkCard">
    <div class="cardHeader">
      <div
        class="badge"
        :class="item.status === '신청가능' ? 'badgeActive' : 'badgeExpired'"
      >
        {{ item.status }}
      </div>
      <!-- 💪(상일) 북마크 제거 버튼 추가 -->
      <button
        class="removeBtn"
        @click="handleRemoveBookmark"
        title="북마크 제거"
      >
        ✕
      </button>
    </div>

    <div class="title">{{ item.title }}</div>
    <div class="desc">{{ item.description }}</div>

    <div class="info">
      <span
        >지원금액: <strong>{{ item.supportAmount }}</strong></span
      >
      <span
        >마감: <strong>{{ item.deadline }}</strong></span
      >
    </div>

    <div class="meta">
      <span>북마크 저장일: {{ item.savedDate }}</span>
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
  padding: 12px;
  background-color: var(--input-bg-2);
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

/* 💪(상일) 카드 헤더 스타일 */
.cardHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge {
  width: fit-content;
  padding: 6px 10px;
  border-radius: 12px;
  font-size: 11px;
}

.badgeActive {
  background-color: #d2f7e8;
  color: #009d6f;
}

.badgeExpired {
  background-color: #ffe5e5;
  color: #ff3b30;
}

/* 💪(상일) 북마크 제거 버튼 스타일 */
.removeBtn {
  background: none;
  border: none;
  color: #999;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

/* .removeBtn:hover {
  background-color: #f5f5f5;
  color: #ff3b30;
} */

.title {
  font-size: 15px;
  font-weight: bold; /* 💪(상일) 제목 진하게 */
  color: var(--text-main);
  /* 💪(상일) 제목 말줄임 처리 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.desc {
  font-size: 12px;
  color: var(--text-sub);
  /* 💪(상일) 설명 2줄 말줄임 처리 */
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  /* line-height: 1.2; */
}

.info,
.meta {
  font-size: 11px;
  color: var(--text-gray);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 💪(상일) 지원금액과 마감일 진하게 표시 */
.info strong {
  font-weight: bold;
  color: var(--text-main);
}

.detailBtn {
  background: none;
  color: #3452e0;
  border: none;
  cursor: pointer;
  padding: 0;
  font-weight: bold; /* 💪(상일) 자세히 보기 버튼 진하게 */
}

/* .detailBtn:hover {
  color: #2840c0;
  text-decoration: underline;
} */
</style>
