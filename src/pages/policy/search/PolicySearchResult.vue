<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const query = ref(route.query.q || '');

const allPolicies = ref([
  /* ...정책 리스트 데이터... */
]);

const filteredPolicies = computed(() => {
  if (!query.value) return [];
  const keyword = query.value.toLowerCase();
  return allPolicies.value.filter(
    (p) =>
      p.title.toLowerCase().includes(keyword) ||
      p.desc.toLowerCase().includes(keyword) ||
      p.tag.toLowerCase().includes(keyword)
  );
});
</script>

<template>
  <div>
    <PolicySearchHeader :model-value="query" />
    <div v-if="filteredPolicies.length">
      <div v-for="policy in filteredPolicies" :key="policy.id">
        <!-- 정책 카드 컴포넌트 사용 -->
        {{ policy.title }}
      </div>
    </div>
    <div v-else>
      <p>검색 결과가 없습니다.</p>
    </div>
  </div>
</template>
