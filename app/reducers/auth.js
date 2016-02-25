import createReducer from './createReducer';
import {AUTH_USER, LOGOUT_USER} from '../actions/auth';
import Immutable from 'immutable';

export default createReducer(
  new Immutable.Map(), 
  {
    [AUTH_USER](state, action) {
      return state.set('user', action.user);
    },
    [LOGOUT_USER](state, action) {
      return state.delete('user');
    }
  }
);
