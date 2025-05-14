import { EventEmitter } from 'events';

const tokenEventEmitter = new EventEmitter();

export const TOKEN_REFRESHED_EVENT = 'tokenRefreshed';

export const notifyTokenRefreshed = () => {
  tokenEventEmitter.emit(TOKEN_REFRESHED_EVENT);
};

export const onTokenRefreshed = (callback: () => void) => {
  tokenEventEmitter.on(TOKEN_REFRESHED_EVENT, callback);
  return () => {
    tokenEventEmitter.off(TOKEN_REFRESHED_EVENT, callback);
  };
}; 