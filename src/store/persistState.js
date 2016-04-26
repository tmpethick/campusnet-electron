import persistState from 'redux-localstorage';
import Immutable from 'immutable';

const localStorageConfig = {
  slicer: (paths) => (state) => paths ? state.filter((v,k) => paths.indexOf(k) > -1) : state,
  serialize: (subset) => JSON.stringify(subset.toJS()),
  deserialize: (serializedData) => Immutable.fromJS(JSON.parse(serializedData)),
  merge: (initialState, persistedState) => {
    return initialState.mergeDeep(persistedState)
  }
};

export default function() {
  return persistState(['auth', 'sync', 'destination'], localStorageConfig);
};
