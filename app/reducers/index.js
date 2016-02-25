import {combineReducers} from 'redux';
import auth from './auth';
import flash from './flash';

export default combineReducers({
  auth,
  flash
});
