// src/firebase/FCMTokenManager.js
import { getToken, deleteToken } from 'firebase/messaging';
import { messaging } from './initFirebase';
import axios from '@/api';

// 💪(상일) FCM 토큰 상태 정의
const TOKEN_STATES = {
  ACTIVE: 'active',                    // 권한O + 유효토큰O
  NEED_PERMISSION: 'need_permission',  // 권한X
  NEED_TOKEN: 'need_token',           // 권한O + 토큰X/무효
  DISABLED: 'disabled'                // 명시적 비활성화
};

/**
 * FCM 토큰 통합 관리자
 * 모든 토큰 관련 로직을 중앙집중식으로 관리
 */
class FCMTokenManager {
  constructor() {
    this.tokenCache = null;
    this.lastValidation = null;
    this.validationTTL = 30 * 60 * 1000; // 30분 캐싱으로 최적화
    this.issuingPromise = null; // 동시성 제어용
  }

  /**
   * 앱 시작 시 초기화 - 최소한의 검증만 수행
   */
  async initialize() {
    try {
      const permission = Notification.permission;
      
      // 권한이 거부된 상태에서 토큰이 있으면 정리
      if (permission === 'denied') {
        const token = localStorage.getItem('fcm_token');
        if (token) {
          console.log('🚫 권한 거부 - FCM 토큰 완전 정리');
          
          // 백엔드에 구독 해제 요청
          try {
            await axios.delete(`/api/push/subscriptions/${token}`);
            console.log('✅ 백엔드 구독 해제 완료');
          } catch (error) {
            console.warn('백엔드 구독 해제 실패:', error.message);
          }
          
          await this._deleteToken();
          this._clearCache();
          return TOKEN_STATES.NEED_PERMISSION;
        }
      }
      
      return this.getTokenState();
    } catch (error) {
      console.error('FCM 초기화 실패:', error);
      return TOKEN_STATES.DISABLED;
    }
  }

  /**
   * 현재 토큰 상태 확인 (캐싱 적용)
   */
  getTokenState() {
    const permission = Notification.permission;
    const hasToken = !!localStorage.getItem('fcm_token');
    
    if (permission === 'denied') return TOKEN_STATES.NEED_PERMISSION;
    if (permission === 'granted' && hasToken) return TOKEN_STATES.ACTIVE;
    if (permission === 'granted' && !hasToken) return TOKEN_STATES.NEED_TOKEN;
    
    return TOKEN_STATES.NEED_PERMISSION;
  }

  /**
   * 유효한 토큰 반환 - 없으면 자동 발급
   */
  async getValidToken() {
    // 캐시된 토큰이 있고 최근에 검증했으면 반환
    if (this.tokenCache && this._isCacheValid()) {
      return this.tokenCache;
    }

    // 동시성 제어: 이미 발급 중이면 기다리기
    if (this.issuingPromise) {
      console.log('⏳ 토큰 발급 중 - 대기');
      return await this.issuingPromise;
    }

    const permission = Notification.permission;
    
    // 권한 없으면 요청
    if (permission !== 'granted') {
      const newPermission = await Notification.requestPermission();
      if (newPermission !== 'granted') {
        throw new Error('알림 권한이 거부되었습니다.');
      }
    }

    // 저장된 토큰 확인
    let token = localStorage.getItem('fcm_token');
    
    if (!token) {
      // 토큰 발급 시작 (동시성 제어)
      this.issuingPromise = this._issueToken();
      try {
        token = await this.issuingPromise;
        console.log('✅ 새 토큰 발급 완료');
      } finally {
        this.issuingPromise = null; // 발급 완료
      }
    } else {
      console.log('♻️ 기존 토큰 사용 (검증 생략)');
    }

    // 캐시 업데이트
    this.tokenCache = token;
    this.lastValidation = Date.now();

    return token;
  }

  /**
   * 토큰 완전 정리 (로그아웃/권한거부 시)
   */
  async cleanup() {
    try {
      const token = localStorage.getItem('fcm_token');
      
      if (token) {
        // 백엔드에 구독 해제 요청
        try {
          await axios.delete(`/api/push/subscriptions/${token}`);
          console.log('✅ 백엔드 구독 해제 완료');
        } catch (error) {
          console.warn('백엔드 구독 해제 실패:', error.message);
        }
      }

      // 로컬 정리
      await this._deleteToken();
      this._clearCache();
      
      console.log('✅ FCM 토큰 완전 정리 완료');
      return true;
    } catch (error) {
      console.error('FCM 정리 실패:', error);
      return false;
    }
  }

  /**
   * 토큰 갱신 (서비스워커 업데이트 시)
   */
  async refresh() {
    try {
      console.log('🔄 FCM 토큰 갱신 시작');
      
      // 기존 토큰이 있으면 백엔드에서도 삭제
      const token = localStorage.getItem('fcm_token');
      if (token) {
        try {
          await axios.delete(`/api/push/subscriptions/${token}`);
          console.log('✅ 백엔드 기존 토큰 삭제 완료');
        } catch (error) {
          console.warn('백엔드 기존 토큰 삭제 실패:', error.message);
        }
      }
      
      // 로컬 토큰 삭제
      await this._deleteToken();
      this._clearCache();
      
      console.log('✅ FCM 토큰 갱신 완료 - 다음 사용 시 자동 발급');
      return true;
    } catch (error) {
      console.error('FCM 토큰 갱신 실패:', error);
      return false;
    }
  }

  /**
   * 새 토큰 발급 (내부 메서드)
   */
  async _issueToken() {
    try {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      
      localStorage.setItem('fcm_token', token);
      
      // 백엔드에 토큰 등록
      try {
        await axios.post('/api/push/subscriptions', { token });
        console.log('✅ FCM 토큰 발급 및 등록 완료');
      } catch (error) {
        console.warn('백엔드 토큰 등록 실패:', error.message);
        // 토큰은 발급되었으므로 계속 진행
      }
      
      return token;
    } catch (error) {
      console.error('FCM 토큰 발급 실패:', error);
      throw new Error('FCM 토큰 발급에 실패했습니다.');
    }
  }

  /**
   * 토큰 삭제 (Firebase + localStorage)
   */
  async _deleteToken() {
    try {
      // Firebase에서 토큰 삭제
      await deleteToken(messaging);
    } catch (error) {
      console.warn('Firebase 토큰 삭제 실패:', error);
    }
    
    // localStorage에서 토큰 제거
    localStorage.removeItem('fcm_token');
  }


  /**
   * 캐시 유효성 확인
   */
  _isCacheValid() {
    return this.lastValidation && (Date.now() - this.lastValidation) < this.validationTTL;
  }

  /**
   * 캐시 초기화
   */
  _clearCache() {
    this.tokenCache = null;
    this.lastValidation = null;
  }

  /**
   * 정적 메서드: 외부 토큰으로 FCM 정리 (로그아웃 시 사용)
   * @param {string} token - 정리할 FCM 토큰
   */
  static async cleanupWithToken(token) {
    if (!token) {
      console.log('FCM 토큰이 없어 정리 건너뜀');
      return false;
    }

    try {
      console.log('🧹 외부 토큰으로 FCM 정리 시작');
      
      // 백엔드에 구독 해제 요청
      try {
        await axios.delete(`/api/push/subscriptions/${token}`);
        console.log('✅ 백엔드 구독 해제 완료');
      } catch (error) {
        console.warn('백엔드 구독 해제 실패:', error.message);
      }

      // Firebase에서 토큰 삭제
      try {
        await deleteToken(messaging);
        console.log('✅ Firebase 토큰 삭제 완료');
      } catch (error) {
        console.warn('Firebase 토큰 삭제 실패:', error);
      }

      console.log('✅ 외부 토큰 FCM 정리 완료');
      
      // 💪(상일) 인스턴스 캐시도 정리
      fcmTokenManager._clearCache();
      
      return true;
    } catch (error) {
      console.error('외부 토큰 FCM 정리 실패:', error);
      return false;
    }
  }
}

// 클래스와 싱글톤 인스턴스 모두 export
export { FCMTokenManager };
export const fcmTokenManager = new FCMTokenManager();
export { TOKEN_STATES };