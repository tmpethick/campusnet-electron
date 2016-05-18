import {flashMessage} from '../src/actions/flash';
import flashReducer from '../src/reducers/flash';
import Immutable from 'immutable';

/*
describe('Flash reducer', function() {
  it('should reduce push', function() {
    const action = flashMessage('The message', 'error');
    const state = flashReducer(undefined, action);
    expect(state.toArray()).to.deep.equal([{
      id: ....,
      message: 'The message',
      type: 'error'
    }])
  });
});
*/