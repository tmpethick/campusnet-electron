import {combineReducers} from 'redux';
import auth from './auth';
import flash from './flash';
import destination from './destination';
import sync from './sync';

export default combineReducers({
  auth,
  flash,
  destination,
  sync
});
