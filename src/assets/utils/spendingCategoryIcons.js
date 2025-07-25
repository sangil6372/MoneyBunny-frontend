// src/constants/spendingCategoryIcons.js

export const spendingCategoryIcons = {
  식비: new URL(
    '@/assets/images/icons/spending_category/food.png',
    import.meta.url
  ).href,
  쇼핑: new URL(
    '@/assets/images/icons/spending_category/shopping.png',
    import.meta.url
  ).href,
  '교통/이동': new URL(
    '@/assets/images/icons/spending_category/transportation.png',
    import.meta.url
  ).href,
  '주거/공과금': new URL(
    '@/assets/images/icons/spending_category/living_expense.png',
    import.meta.url
  ).href,
  '취미/여가': new URL(
    '@/assets/images/icons/spending_category/hobby_leisure.png',
    import.meta.url
  ).href,
  '건강/의료': new URL(
    '@/assets/images/icons/spending_category/medical.png',
    import.meta.url
  ).href,
  '선물/경조사': new URL(
    '@/assets/images/icons/spending_category/gift.png',
    import.meta.url
  ).href,
  '교육/자기계발': new URL(
    '@/assets/images/icons/spending_category/education.png',
    import.meta.url
  ).href,
  금융: new URL(
    '@/assets/images/icons/spending_category/finance.png',
    import.meta.url
  ).href,
};

export function getSpendingIconPath(category) {
  return (
    spendingCategoryIcons[category] ||
    new URL(
      '@/assets/images/icons/spending_category/default.png',
      import.meta.url
    ).href
  );
}
