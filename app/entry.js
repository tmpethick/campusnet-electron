import {remote} from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, hashHistory} from 'react-router';
import {Provider} from 'react-redux';
import {getRoutes} from './routes';
import configureStore from './store/configureStore';
import Sync from './Sync.react';

// if (process.env.NODE_ENV !== 'production')
//  remote.BrowserWindow.addDevToolsExtension('react-devtools/shells/chrome');

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Sync>
      <Router history={hashHistory}>
        {getRoutes(store)}
      </Router>
    </Sync>
  </Provider>
, document.querySelector("#app"));
