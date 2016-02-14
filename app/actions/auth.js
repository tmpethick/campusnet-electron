import CNClient from '../campusnet/campusnet-client.js';

export const AUTH_USER = 'AUTH_USER';

export function authUser({username, PApassword}) {
  return {
    type: AUTH_USER,
    user: {username, PApassword}
  }
};

export function login({username, password}) {
  return (dispatch, getState) => {
    const client = new CNClient(username, password=password);
    return client.login()
      .then(PApassword => {
        dispatch(authUser({username, PApassword}));
      });
  };
};
