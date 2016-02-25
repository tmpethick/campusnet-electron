import createReducer from './createReducer';
import {SYNC_INTERVAL_CHANGE} from '../actions/sync';
import Immutable from 'immutable';
import {SYNC_OPTIONS} from '../views/SyncIntervalSelect.react';

export default createReducer(
  SYNC_OPTIONS[0].value, 
  {
    [SYNC_INTERVAL_CHANGE](state, action) {
      return action.payload.syncInterval;
  }
});
