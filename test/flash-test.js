import {flashMessage} from '../app/actions/flash';
import flashReducer from '../app/reducers/flash';
import Immutable from 'immutable';

describe('Flash reducer', function() {

  it('should reduce push', function() {
    const action = flashMessage('The message', 'error');
    const state = flashReducer(undefined, action);
    expect(state.toArray()).to.deep.equal([{
      message: 'The message',
      type: 'error'
    }])
  });
});