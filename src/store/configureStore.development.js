import { createStore, applyMiddleware, compose } from 'redux';
import { persistState as persistDevState } from 'redux-devtools';
import Immutable from 'immutable';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools.react';
import persistState from './persistState';

const enhancer = compose(
  persistState(),
  applyMiddleware(thunk),
  DevTools.instrument(),
  persistDevState(
    window.location.href.match(
      /[?&]debug_session=([^&]+)\b/
    )
  ),
);

export default function configureStore(initialState = new Immutable.Map()) {
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers'))
    );
  }

  return store;
}
