// cardLogoMap.js - 새 파일
import { getBankLogo } from './bankLogoMap.js';

// 카드사 → 은행 매핑 (기존 은행 로고 재사용)
const cardToBankMapping = {
  KB카드: 'KB국민은행',
  현대카드: '현대카드', // 별도 이미지 필요
  삼성카드: '삼성카드', // 별도 이미지 필요
  NH카드: 'NH농협은행',
  BC카드: 'BC카드', // 별도 이미지 필요
  신한카드: '신한은행',
  씨티카드: '시티은행',
  우리카드: '우리은행',
  롯데카드: '롯데카드', // 별도 이미지 필요
  하나카드: '하나은행',
  전북카드: '전북카드', // 별도 이미지 필요
  광주카드: '광주카드', // 별도 이미지 필요
  수협카드: '수협카드', // 별도 이미지 필요
  제주카드: '제주카드', // 별도 이미지 필요
};

// 카드사 전용 로고맵 (필요한 경우에만)
const cardLogoMap = {
  현대카드: '/src/assets/images/icons/card/hyundai.png',
  삼성카드: '/src/assets/images/icons/card/samsung.png',
  BC카드: '/src/assets/images/icons/card/bc.png',
  롯데카드: '/src/assets/images/icons/card/lotte.png',
  // ... 추가 카드사 로고들
};

/**
 * 카드사 로고 가져오기
 * @param {string} cardCompanyName - 카드사명 (예: 'KB카드')
 * @returns {string} 로고 이미지 URL
 */
export function getCardLogo(cardCompanyName) {
  // 1. 카드사 전용 로고가 있으면 우선 사용
  if (cardLogoMap[cardCompanyName]) {
    return cardLogoMap[cardCompanyName];
  }

  // 2. 은행 로고로 매핑해서 사용
  const bankName = cardToBankMapping[cardCompanyName];
  if (bankName) {
    return getBankLogo(bankName);
  }

  // 3. 기본 로고
  return '/default-card-logo.png';
}

export default {
  getCardLogo,
  cardToBankMapping,
  cardLogoMap,
};
