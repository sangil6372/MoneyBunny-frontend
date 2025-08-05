export const bankCodeMap = {
  '0004': 'KB국민은행',
  '0020': '우리은행',
  '0088': '신한은행',
  '0081': '하나은행',
  '0920': '토스뱅크',
  '0900': '카카오뱅크',
  '0011': 'NH농협은행',
  '0270': '시티은행',
  '0089': '케이뱅크',
  '0230': 'SC제일은행',
  '0032': '부산은행',
  '0003': '기업은행',
};

export function getBankName(bankCode) {
  return bankCodeMap[bankCode] || '알 수 없음';
}
