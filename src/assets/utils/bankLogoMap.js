// src/utils/bankLogo.js
export const bankLogoMap = {
  신한은행: new URL(
    '@/assets/images/icons/bank/shinhan_original.png',
    import.meta.url
  ).href,
  KB국민은행: new URL(
    '@/assets/images/icons/bank/kb_original.png',
    import.meta.url
  ).href,
  카카오뱅크: new URL(
    '@/assets/images/icons/bank/kakao_original.png',
    import.meta.url
  ).href,
  토스뱅크: new URL(
    '@/assets/images/icons/bank/toss_original.png',
    import.meta.url
  ).href,
  케이뱅크: new URL(
    '@/assets/images/icons/bank/k_original.png',
    import.meta.url
  ).href,
  우리은행: new URL(
    '@/assets/images/icons/bank/woori_original.png',
    import.meta.url
  ).href,
  하나은행: new URL(
    '@/assets/images/icons/bank/keb_original.png',
    import.meta.url
  ).href,
  시티은행: new URL(
    '@/assets/images/icons/bank/citi_original.png',
    import.meta.url
  ).href,
  SC제일은행: new URL(
    '@/assets/images/icons/bank/sc_original.png',
    import.meta.url
  ).href,
  IM뱅크: new URL('@/assets/images/icons/bank/im_fill.png', import.meta.url)
    .href,
};

export function getBankLogo(bankName) {
  return bankLogoMap[bankName] || '/default-logo.png';
}
