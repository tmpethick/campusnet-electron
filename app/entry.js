import {remote} from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, hashHistory} from 'react-router';
import {Provider} from 'react-redux';
import routes from './routes';
import configureStore from './store/configureStore';

if (process.env.NODE_ENV !== 'production')
  remote.BrowserWindow.addDevToolsExtension('react-devtools/shells/chrome');

let store = configureStore()
/*
{
  flash: [
    {message: 'Destination folder was updated', type: 'error'},
  ]
}
 */

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      {routes}
    </Router>
  </Provider>
, document.querySelector("#app"));
