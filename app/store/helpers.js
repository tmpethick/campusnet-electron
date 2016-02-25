
export function isAuthenticated(state) {
  const user = state.auth.get('user') || {};
  return !!(user.username && user.PApassword);
};