import createReducer from './createReducer';
import {AUTH_USER} from '../actions/auth';
import Immutable from 'immutable';

export default createReducer(
  new Immutable.Map(), 
  {
    [AUTH_USER](state, action) {
      return state.set('user', action.user);
  }
});
