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
  NH농협은행: new URL(
    '@/assets/images/icons/bank/nonghyup.png',
    import.meta.url
  ).href,
  부산은행: new URL('@/assets/images/icons/bank/busan.png', import.meta.url)
    .href,

  KDB산업은행: new URL('@/assets/images/icons/bank/kdb.png', import.meta.url)
    .href,
  IBK기업은행: new URL('@/assets/images/icons/bank/ibk.png', import.meta.url)
    .href,
  수협은행: new URL('@/assets/images/icons/bank/suhyup.png', import.meta.url)
    .href,
  대구은행: new URL('@/assets/images/icons/bank/daegu.png', import.meta.url)
    .href,
  광주은행: new URL('@/assets/images/icons/bank/gwangju.png', import.meta.url)
    .href,
  제주은행: new URL('@/assets/images/icons/bank/jeju.png', import.meta.url)
    .href,
  전북은행: new URL('@/assets/images/icons/bank/jeonbuk.png', import.meta.url)
    .href,
  경남은행: new URL('@/assets/images/icons/bank/kyongnam.png', import.meta.url)
    .href,
  새마을금고: new URL('@/assets/images/icons/bank/saemaul.png', import.meta.url)
    .href,
  신협은행: new URL('@/assets/images/icons/bank/shinhyup.png', import.meta.url)
    .href,
  우체국: new URL('@/assets/images/icons/bank/post.png', import.meta.url).href,
};
import { bankCodeMap } from './bankCodeMap';
export function getBankLogo(bankName) {
  return bankLogoMap[bankName] || '/default-logo.png';
}

export function getBankLogoByCode(bankCode) {
  const bankName = bankCodeMap[bankCode];
  return bankLogoMap[bankName] || '/default-logo.png';
}
