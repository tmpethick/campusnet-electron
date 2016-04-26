import Immutable from 'immutable';

export function isAuthenticated(state) {
  const user = state.get('auth').get('user') || Immutable.Map();
  return !!(user.has('username') && user.has('PApassword'));
};
