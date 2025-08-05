<template>
  <header class="detail-header">
    <button class="back-btn" @click="$emit('back')">
      <img
        src="@/assets/images/icons/common/arrow_left.png"
        alt="뒤로가기"
        class="back-icon"
      />
    </button>
    <h2 class="detail-title">{{ title }}</h2>

    <!-- 월 선택 드롭다운 -->
    <select
      v-model="selectedMonth"
      class="month-dropdown"
      @change="onMonthChange"
    >
      <option v-for="month in months" :key="month.value" :value="month.value">
        {{ month.label }}
      </option>
    </select>
  </header>
</template>

<script>
export default {
  props: {
    title: String,
    currentMonth: {
      type: String,
      default: () => new Date().toISOString().slice(0, 7), // YYYY-MM
    },
  },
  data() {
    return {
      selectedMonth: this.currentMonth,
      months: this.generateMonths(),
    };
  },
  methods: {
    generateMonths() {
      const months = [];
      const now = new Date();
      for (let i = 0; i < 12; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const value = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, '0')}`;
        months.push({
          label: `${date.getFullYear()}년 ${date.getMonth() + 1}월`,
          value,
        });
      }
      return months;
    },
    onMonthChange() {
      this.$emit('month-change', this.selectedMonth);
    },
  },
};
</script>

<style scoped>
.detail-header {
  display: flex;
  align-items: center;
  height: 3.5rem;
  padding: 0 1rem;

  background-color: #fff;
  border-bottom: 1px solid var(--input-bg-3);
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 0.75rem;
}

.back-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.detail-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--base-blue-dark);
  margin: 0;
}

/*드롭다운*/
.month-dropdown {
  padding: 0.5rem;
  border: 1px solid var(--base-lavender);
  border-radius: 0.5rem;
  background-color: var(--input-bg-2);
  color: var(--text-darkgray);
  font-size: 0.875rem;
  margin-left: auto;
}
</style>
