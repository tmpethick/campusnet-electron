import {remote} from 'electron';
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, hashHistory} from 'react-router';
import {Provider} from 'react-redux';
import {getRoutes} from './routes';
import configureStore from './store/configureStore';
import Sync from './Sync.react';
import {isAuthenticated} from './store/helpers';
import {ipcRenderer} from 'electron';

// if (process.env.NODE_ENV === 'development')
//  remote.BrowserWindow.addDevToolsExtension('react-devtools/shells/chrome');

const store = configureStore();

const initialState = store.getState();
if (!isAuthenticated(initialState)) {
  ipcRenderer.send('show-menubar');
}

ReactDOM.render(
  <Provider store={store}>
    <Sync>
      <Router history={hashHistory}>
        {getRoutes(store)}
      </Router>
    </Sync>
  </Provider>
, document.querySelector("#app"));
