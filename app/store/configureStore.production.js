import { createStore, applyMiddleware, compose } from 'redux';
import Immutable from 'immutable';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import persistState from './persistState';

const enhancer = compose(
  persistState(),
  applyMiddleware(thunk)
);

export default function configureStore(initialState = new Immutable.Map()) {
  return createStore(rootReducer, initialState, enhancer);
}
