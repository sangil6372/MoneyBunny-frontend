import cardCodeMap from './cardCodeMap.js';

// 카드사 전용 로고맵
export const cardLogoMap = {
  KB카드: '/src/assets/images/icons/card/kb.png',
  현대카드: '/src/assets/images/icons/card/hyundai.png',
  삼성카드: '/src/assets/images/icons/card/samsung.png',
  NH카드: '/src/assets/images/icons/card/nh.png',
  BC카드: '/src/assets/images/icons/card/bc.png',
  신한카드: '/src/assets/images/icons/card/shinhan.png',
  씨티카드: '/src/assets/images/icons/card/citi.png',
  우리카드: '/src/assets/images/icons/card/woori.png',
  롯데카드: '/src/assets/images/icons/card/lotte.png',
  하나카드: '/src/assets/images/icons/card/hana.png',
  전북카드: '/src/assets/images/icons/card/jeonbuk.png',
  //  광주카드: '/src/assets/images/icons/card/gwangju.png',
  수협카드: '/src/assets/images/icons/card/suhyup.png',
  제주카드: '/src/assets/images/icons/card/jeju.png',
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
