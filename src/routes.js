import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
import React from 'react';
import App from './containers/App.react';
import Login from './views/Login.react';
import Preference from './views/Preference.react';
import {isAuthenticated} from './store/helpers';

export function getRoutes({ dispatch, getState }) {

  function authBlock(nextState, replace) {
    if (!isAuthenticated(getState()))
      replace({pathname: '/'});
  };

  function preferenceRedirect(nextState, replace) {
    if (isAuthenticated(getState()))
      replace({pathname: '/preference'});
  };

  return (
    <Route path="/" component={App}>
      <IndexRoute component={Login} onEnter={preferenceRedirect}/>
      <Route component={Preference} path="preference" onEnter={authBlock}/>
    </Route>
  );
};