import createReducer from './createReducer';
import {DESTINATION_CHANGE} from '../actions/destination';
import {DEFAULT_DESTINATION} from '../views/FolderPicker.react';

export default createReducer(
  DEFAULT_DESTINATION, 
  {
    [DESTINATION_CHANGE](state, action) {
      return action.payload.path;
  }
});
