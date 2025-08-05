// composables/useMainItem.js - 간단한 버전
import { ref, computed, watch } from 'vue';

/**
 *  * 대표 아이템(계좌/카드) 관리를 위한 composable
 *
 * 주요 기능:
 * 1. 사용자가 선택한 대표 계좌/카드를 localStorage에 저장
 * 2. 대표 아이템을 항상 리스트 맨 위에 표시
 * 3. 페이지 새로고침 후에도 대표 설정 유지

 * @param {Object} options - 설정 옵션
 * @param {string} options.type - 아이템 타입 ('account' 또는 'card')
 * @param {Array} options.items - 아이템 배열 (reactive)
 * @param {Function} options.onUpdate - 아이템 업데이트 콜백
 * @returns {Object} 대표 아이템 관리 메서드들
 */
export function useMainItem(options) {
  const { type, items, onUpdate } = options;

  // localStorage 키 생성
  const storageKey = `main${type.charAt(0).toUpperCase() + type.slice(1)}Id`;

  // 대표 아이템 ID
  const mainItemId = ref(null);

  /**
   * 초기화 - localStorage에서 대표 아이템 복원
   */
  const initializeMainItem = () => {
    if (!mainItemId.value && items.value && items.value.length > 0) {
      const saved = localStorage.getItem(storageKey);
      mainItemId.value = saved ? parseInt(saved) : items.value[0].id;
    }
  };

  /**
   * 아이템 변경 감지하여 초기화
   */
  watch(
    () => items.value,
    () => initializeMainItem(),
    { immediate: true }
  );

  /**
   * 대표 아이템 설정
   * @param {Object} item - 대표로 설정할 아이템
   */
  const setMainItem = (item) => {
    mainItemId.value = item.id;

    // localStorage에 저장
    localStorage.setItem(storageKey, item.id.toString());

    // 리스트 재정렬 (대표 아이템을 맨 위로 이동)
    const reordered = [...items.value];
    const index = reordered.findIndex((i) => i.id === item.id);

    if (index > -1) {
      const [selected] = reordered.splice(index, 1);
      reordered.unshift(selected);
    }

    // 상위 컴포넌트에 업데이트 알림
    if (onUpdate) {
      onUpdate(reordered);
    }
  };

  /**
   * 대표 아이템이 맨 위에 오도록 정렬된 리스트
   */
  const sortedItems = computed(() => {
    if (!items.value || !mainItemId.value) return items.value || [];

    const itemsCopy = [...items.value];
    const mainItemIndex = itemsCopy.findIndex(
      (item) => item.id === mainItemId.value
    );

    // 대표 아이템이 있고, 첫 번째가 아니라면 맨 위로 이동
    if (mainItemIndex > 0) {
      const [mainItem] = itemsCopy.splice(mainItemIndex, 1);
      itemsCopy.unshift(mainItem);
    }

    return itemsCopy;
  });

  /**
   * 대표 필드가 포함된 아이템 리스트
   */
  const processedItems = computed(() => {
    return sortedItems.value.map((item) => ({
      ...item,
      [type === 'account' ? 'isMain' : 'isRepresentative']:
        item.id === mainItemId.value,
    }));
  });

  /**
   * 대표 아이템인지 확인
   * @param {Object} item - 확인할 아이템
   * @returns {boolean} 대표 아이템 여부
   */
  const isMainItem = (item) => {
    return item.id === mainItemId.value;
  };

  /**
   * 현재 대표 아이템 가져오기
   * @returns {Object|null} 대표 아이템 객체
   */
  const getCurrentMainItem = () => {
    if (!items.value || !mainItemId.value) return null;
    return items.value.find((item) => item.id === mainItemId.value) || null;
  };

  return {
    mainItemId,
    setMainItem,
    processedItems,
    sortedItems,
    isMainItem,
    getCurrentMainItem,
    initializeMainItem,
  };
}
