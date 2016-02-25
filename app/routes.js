import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
import React from 'react';
import App from './containers/App.react';
import Login from './views/Login.react';
import Preference from './views/Preference.react';
import {isAuthenticated} from './store/helpers';

export function getRoutes({ dispatch, getState }) {

  function authCheck(nextState, replace) {
    if (!isAuthenticated(getState()))
      replace({pathname: '/'});
  };

  return (
    <Route path="/" component={App}>
      <IndexRoute component={Login}/>
      <Route component={Preference} path="preference" onEnter={authCheck}/>
    </Route>
  );
};