import CNClient from '../campusnet/campusnet-client.js';
import CampusError from '../campusnet/errors';
import {flashMessageFor} from './flash';

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
        return Promise.resolve(true);
      })
      .catch(err => {
        if (!err instanceof CampusError)
          throw err;
        dispatch(flashMessageFor(err.message, 'error'));
        return Promise.resolve(false);
      });
  };
};
