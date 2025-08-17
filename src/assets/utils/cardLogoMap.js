import cardCodeMap from './cardCodeMap.js';

// 카드사 전용 로고맵
export const cardLogoMap = {
  KB카드: new URL('@/assets/images/icons/card/kb.png', import.meta.url).href,
  현대카드: new URL('@/assets/images/icons/card/hyundai.png', import.meta.url).href,
  삼성카드: new URL('@/assets/images/icons/card/samsung.png', import.meta.url).href,
  NH카드: new URL('@/assets/images/icons/card/nh.png', import.meta.url).href,
  BC카드: new URL('@/assets/images/icons/card/bc.png', import.meta.url).href,
  신한카드: new URL('@/assets/images/icons/card/shinhan.png', import.meta.url).href,
  씨티카드: new URL('@/assets/images/icons/card/citi.png', import.meta.url).href,
  우리카드: new URL('@/assets/images/icons/card/woori.png', import.meta.url).href,
  롯데카드: new URL('@/assets/images/icons/card/lotte.png', import.meta.url).href,
  하나카드: new URL('@/assets/images/icons/card/hana.png', import.meta.url).href,
  전북카드: new URL('@/assets/images/icons/card/jeonbuk.png', import.meta.url).href,
  //  광주카드: new URL('@/assets/images/icons/card/gwangju.png', import.meta.url).href,
  수협카드: new URL('@/assets/images/icons/card/suhyup.png', import.meta.url).href,
  제주카드: new URL('@/assets/images/icons/card/jeju.png', import.meta.url).href,
};

export function getCardLogo(cardCompanyOrCode) {
  const cardName = cardCodeMap[cardCompanyOrCode] || cardCompanyOrCode;
  if (cardLogoMap[cardName]) return cardLogoMap[cardName];
  return '/default-card-logo.png';
}

export default {
  getCardLogo,
  cardLogoMap,
};
