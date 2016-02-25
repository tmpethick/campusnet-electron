import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
import React from 'react';
import App from './containers/App.react';
import Login from './views/Login.react';
import Preference from './views/Preference.react';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Login}/>
    <Route component={Preference} path="preference"/>
  </Route>
);
