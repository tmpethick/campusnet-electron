import createReducer from './createReducer';
import {DESTINATION_CHANGE} from '../actions/destination';

export default createReducer(
  "", 
  {
    [DESTINATION_CHANGE](state, action) {
      return action.payload.path || state;
  }
});
