import createReducer from './createReducer';
import {SYNC_INTERVAL_CHANGE, SYNCING_START, SYNCING_STOP} from '../actions/sync';
import Immutable from 'immutable';
import {SYNC_OPTIONS} from '../views/SyncIntervalSelect.react';

export default createReducer(
  new Immutable.Map({
    interval: SYNC_OPTIONS[0].value,
    isSyncing: false
  }), 
  {
    [SYNC_INTERVAL_CHANGE](state, action) {
      return state.set('interval', action.payload.syncInterval);
    },
    [SYNCING_START](state) {
      return state.set('isSyncing', true)
    },
    [SYNCING_STOP](state) {
      return state.set('isSyncing', false)
    }
  }
);
