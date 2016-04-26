export const SYNC_INTERVAL_CHANGE = 'SYNC_INTERVAL_CHANGE';
export const SYNCING_START = 'SYNCING_START';
export const SYNCING_STOP = 'SYNCING_STOP';

export function changeSyncInterval(syncInterval) {
  return {
    type: SYNC_INTERVAL_CHANGE,
    payload: {syncInterval}
  }
};

export function syncStart() {
  return {
    type: SYNCING_START
  }
};

export function syncStop() {
  return {
    type: SYNCING_STOP
  }
};
