<template>
  <div class="emptyBlock">
    <!-- 빈 상태 카드 -->
    <section class="emptyWrap card">
      <div class="emptyIcon">
        <!-- ✅ 체크 아이콘 → 토끼 아이콘으로 교체 -->
        <img :src="reviewBunny" alt="리뷰 없음 - 머니버니" class="bunnyIcon" />
      </div>

      <div class="emptyTitle">아직 등록된 리뷰가 없어요</div>
      <div class="emptySub text-gray">
        실제 이용하신 분들의 리뷰를 기다리고 있어요.
      </div>
    </section>

    <section class="guide card">
      <div class="guideTitle font-14 font-bold">리뷰 작성 가이드</div>

      <ul class="guideList">
        <li>실제 이용 경험을 바탕으로 솔직하게 적어주세요</li>
        <li>좋았던 점과 아쉬웠던 점을 함께 써주세요</li>
        <li>사실과 무관한 비방·광고 글은 숨겨질 수 있어요</li>
        <li>개인정보(연락처·주민번호 등)는 적지 마세요</li>
      </ul>

      <slot name="guide" />
    </section>
  </div>
</template>

<script setup>
import reviewBunny from "@/assets/images/icons/policy/reviewbunny.png";

defineProps({
  policyTitle: { type: String, default: "" },
});
</script>

<style scoped>
.card {
  background: #fff;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 14px;
}
.text-gray {
  color: var(--text-bluegray);
}

.emptyWrap {
  text-align: center;
  padding: 26px 14px;
}
.emptyIcon {
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
}
.bunnyIcon {
  width: 90px; /* 필요하면 56/64로 조절 */
  height: 90px;
  object-fit: contain;
  image-rendering: -webkit-optimize-contrast;
}

.emptyTitle {
  font-weight: bold;
  font-size: 15px;
  color: #0f172a;
  margin-bottom: 4px;
}
.emptySub {
  font-size: 12px;
  line-height: 1.5;
  margin-bottom: 12px;
}

.primaryBtn {
  width: 100%;
  background: var(--base-blue-dark);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 0;
  font-size: 13px;
  cursor: pointer;
}

.guideTitle {
  margin-bottom: 8px;
  margin-left: 4px;
}
.guideList {
  margin: 0;
  padding-left: 16px;
}
.guideList li {
  margin: 4px 0;
  font-size: 12px;
  color: #111827;
}
</style>
