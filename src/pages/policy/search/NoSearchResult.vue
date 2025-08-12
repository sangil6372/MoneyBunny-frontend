<template>
  <div class="noResultContainer">
    <div class="noResultBox">
      <img
        src="@/assets/images/icons/bunny/crying_bunny.png"
        alt="검색결과 없음"
        class="noResultImage"
      />
      <div class="noResultTitle font-17 font-bold">검색 결과가 없습니다</div>
      <div class="noResultDesc font-12">
        입력하신 <span class="font-bold">{{ searchKeyword }}</span> 에 대한
        정책을 찾을 수 없습니다.
      </div>
    </div>

    <div class="popularBox">
      <div class="popularTitle font-16 font-bold">인기 검색어</div>
      <div class="popularRankGrid">
        <div class="rankCol">
          <div
            class="popularItem"
            v-for="(item, i) in popularKeywords.slice(
              0,
              Math.ceil(popularKeywords.length / 2)
            )"
            :key="i"
            @click="$emit('search', item)"
          >
            <span class="number">{{ i + 1 }}</span>
            <span class="text font-13">{{ item }}</span>
          </div>
        </div>
        <div class="rankCol">
          <div
            class="popularItem"
            v-for="(item, i) in popularKeywords.slice(
              Math.ceil(popularKeywords.length / 2),
              popularKeywords.length
            )"
            :key="i + Math.ceil(popularKeywords.length / 2)"
            @click="$emit('search', item)"
          >
            <span class="number">{{
              i + 1 + Math.ceil(popularKeywords.length / 2)
            }}</span>
            <span class="text font-13">{{ item }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="tipBox">
      <div class="tipTitle font-16 font-bold">검색 팁</div>
      <div class="tipList">
        <!-- 1번 항목만 설명을 줄바꿈 아래로 -->
        <div class="tipItem">
          <div class="tipRow">
            <span class="tipNum">1</span>
            <span class="tipMain font-bold font-13"
              >다른 키워드로 검색해보세요</span
            >
          </div>
          <div class="tipDesc font-11 tipDescIndent">
            유사한 의미의 다른 단어를 사용해보세요
          </div>
        </div>
        <!-- 2번 -->
        <div class="tipItem">
          <div class="tipRow">
            <span class="tipNum">2</span>
            <span class="tipMain font-bold font-13">검색어를 줄여보세요</span>
          </div>
          <div class="tipDesc font-11 tipDescIndent">
            너무 구체적인 검색어보다 간단한 키워드 사용
          </div>
        </div>
        <!-- 3번 -->
        <div class="tipItem">
          <div class="tipRow">
            <span class="tipNum">3</span>
            <span class="tipMain font-bold font-13">맞춤법을 확인해보세요</span>
          </div>
          <div class="tipDesc font-11 tipDescIndent">
            오타나 띄어쓰기를 다시 한번 확인해주세요
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  searchKeyword: { type: String, default: '검색어' },
  popularKeywords: {
    type: Array,
    default: () => ['청년', '주거', '창업', '취업', '대출', '지원금'],
  },
});
</script>

<style scoped>
.noResultContainer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  width: 100%;
}
.noResultBox {
  background: var(--white, #fff);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  margin-bottom: 12px;
}
.noResultImage {
  width: 55px;
  height: 70px;
  margin-bottom: 7px;
}
.noResultTitle {
  color: var(--text-login);
  margin-bottom: 6px;
  text-align: center;
}
.noResultDesc {
  color: var(--text-bluegray);
  text-align: center;
}
.tipBox,
.popularBox {
  background: var(--white, #fff);
  border-radius: 12px;
  padding: 20px;
  width: 100%;
}
.tipBox {
  margin-bottom: 12px;
}
.tipTitle,
.popularTitle {
  color: var(--text-title, #232a3a);
  margin-bottom: 12px;
}
.tipList {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.tipItem {
  margin-bottom: 4px;
}
.tipRow {
  display: flex;
  align-items: center;
  gap: 8px;
}
.tipNum {
  /* background: var(--input-bg-2, #f0f2fa); */
  /* border-radius: 50%; */
  /* width: 16px; */
  /* height: 16px; */
  color: var(--text-bluegray);
  display: flex;
  align-items: center;
  justify-content: center;
}
.tipMain {
  margin-right: 5px;
  color: var(--text-login);
}
.tipDesc {
  color: var(--text-bluegray);
  margin-top: 2px;
}

.popularGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.popularItem {
  background-color: var(--input-bg-1);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
  max-width: 110px;
  overflow: hidden;
}
.number {
  font-weight: bold;
  color: var(--base-blue-dark);
}
.text {
  display: inline-block;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}
.popularRankGrid {
  display: flex;
  gap: 10px;
}
.rankCol {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
