import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
import React from 'react';
import App from './containers/App.react';
import Login from './views/Login.react';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Login}/>
  </Route>
);
