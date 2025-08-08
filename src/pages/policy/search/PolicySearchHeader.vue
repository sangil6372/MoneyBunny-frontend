<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import { policyAPI } from '@/api/policy';
import PolicyFilterModal from '../filter/PolicyFilterModal.vue';

const filterData = ref({});
const showFilterModal = ref(false);
const openFilter = () => (showFilterModal.value = true);

const router = useRouter();
const props = defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
});
const searchQuery = ref(props.searchQuery);
const goBack = () => router.back();
const emit = defineEmits(['confirm']);

function handleConfirm(selected) {
  filterData.value = selected;
  showFilterModal.value = false;
  emit('confirm', selected); // 부모로 필터 데이터 전달

  // 저장(적용) 시 검색 결과 페이지로 이동
  router.push({
    name: 'policySearchResult',
    query: {
      q: searchQuery.value,
      filter: encodeURIComponent(JSON.stringify(selected)),
    },
  });
}

function onSearch() {
  router.push({
    name: 'policySearchResult',
    query: {
      q: searchQuery.value,
      filter: encodeURIComponent(JSON.stringify(filterData.value)),
    },
  });
}

watch(
  () => props.searchQuery,
  (val) => {
    searchQuery.value = val;
  }
);

// 🟦 모달에 넘길 초기값 (PolicyFilterModal이 기대하는 구조)
const filterInitial = ref({
  initialMarital: [],
  initialRegion: [],
  initialAge: '',
  initialIncome: '',
  initialEducation: [],
  initialMajor: [],
  initialJobStatus: [],
  initialSpecialty: [],
});

// 🟦 검색용 필터 데이터 (검색 API에 맞는 구조)
const userFilter = ref({
  marital: [],
  region: [],
  age: '',
  income: '',
  education: [],
  major: [],
  jobStatus: [],
  specialty: [],
});

const fetchUserPolicyFilter = async () => {
  try {
    const res = await policyAPI.getUserPolicy();
    const d = res.data || {};
    // 모달용 초기값
    Object.assign(filterInitial.value, {
      initialMarital: d.marriage ? [d.marriage] : [],
      initialRegion: d.regions || [],
      initialAge: d.age || '',
      initialIncome: d.income || '',
      initialEducation: d.educationLevels || [],
      initialMajor: d.majors || [],
      initialJobStatus: d.employmentStatuses || [],
      initialSpecialty: d.specialConditions || [],
    });
    // 검색용 필터 데이터
    Object.assign(userFilter.value, {
      marital: d.marriage ? [d.marriage] : [],
      region: d.regions || [],
      age: d.age || '',
      income: d.income || '',
      education: d.educationLevels || [],
      major: d.majors || [],
      jobStatus: d.employmentStatuses || [],
      specialty: d.specialConditions || [],
    });
    // 최초 진입 시 filterData도 검색용 구조로 세팅
    Object.assign(filterData.value, userFilter.value);
  } catch (e) {
    // 에러 무시, 기본값 사용
  }
};

onMounted(() => {
  fetchUserPolicyFilter();
});
</script>
<template>
  <div class="policySearchHeader">
    <img
      src="@/assets/images/icons/policy/left_arrow.png"
      class="goBackIcon"
      @click="goBack"
    />
    <div class="searchInputWrapper">
      <input
        type="text"
        class="searchInput"
        placeholder="정책을 검색해보세요"
        v-model="searchQuery"
        @keyup.enter="onSearch"
        maxlength="40"
      />

      <button class="searchIconBtn" @click="onSearch" aria-label="검색">
        <img src="@/assets/images/icons/policy/search.png" class="searchIcon" />
      </button>
    </div>
    <img
      src="@/assets/images/icons/policy/filter.png"
      class="filterIcon"
      @click="openFilter"
    />
  </div>
  <!-- 부모 컴포넌트 예시 -->
  <PolicyFilterModal
    v-if="showFilterModal"
    @close="showFilterModal = false"
    @confirm="handleConfirm"
    v-bind="filterInitial"
  />
</template>

<style scoped>
.policySearchHeader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  max-width: 390px;
  height: 60px;
  width: 100%;
  margin: 0 auto;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 15px;
  background: #fff;
  border-bottom: 1px solid var(--base-lavender);
}

.searchInputWrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.searchInput {
  width: 100%;
  height: 35px;
  padding: 10px 45px 10px 15px;
  border: 1px solid var(--input-outline-2);
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
}

.searchInput:focus {
  border: 1.5px solid var(--gray-medium);
}

.searchIconBtn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.searchIcon {
  width: 18px;
  height: 18px;
}

.filterIcon {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.goBackIcon {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
</style>
