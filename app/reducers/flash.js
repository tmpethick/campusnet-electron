import createReducer from './createReducer';
import {FLASH_ADD, FLASH_REMOVE} from '../actions/flash';
import Immutable from 'immutable';

/**
 * Only allow one flash at a time for now.
 */
export default createReducer(
  new Immutable.List(), 
  {
    [FLASH_ADD](state, action) {
      // return state.push(action.payload);
      return new Immutable.List([action.payload]);
    },
    [FLASH_REMOVE](state, action) {
      return new Immutable.List();
      /*let index = state.findIndex(flash => flash.message === action.payload.message);
      if (index !== -1)
        state = state.delete(index);
      return state;*/
    }    
  }
);
