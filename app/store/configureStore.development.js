import { createStore, applyMiddleware, compose } from 'redux';
import { persistState as persistDevState } from 'redux-devtools';
import persistState from 'redux-localstorage';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools.react';

const enhancer = compose(
  applyMiddleware(thunk),
  DevTools.instrument(),
  persistDevState(
    window.location.href.match(
      /[?&]debug_session=([^&]+)\b/
    )
  ),
  persistState()
);

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers'))
    );
  }

  return store;
}
