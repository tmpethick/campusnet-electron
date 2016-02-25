export const SYNC_INTERVAL_CHANGE = 'SYNC_INTERVAL_CHANGE';

export function changeSyncInterval(syncInterval) {
  return {
    type: SYNC_INTERVAL_CHANGE,
    payload: {syncInterval}
  }
};
