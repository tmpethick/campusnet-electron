import { createStore, applyMiddleware, compose } from 'redux';
import persistState from 'redux-localstorage';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

const enhancer = compose(
  applyMiddleware(thunk),
  persistState()
);

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, enhancer);
}
