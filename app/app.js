'use babel';

import React from 'react';
import ReactDOM from 'react-dom';
import Component from 'react-pure-render/component';
import {remote} from 'electron';

const {dialog, app} = remote;

export default class App extends Component {
  selectFolder = () => {
    let path = dialog.showSaveDialog({
      title: 'Create destination',
      defaultPath: app.getPath('documents') + '/CampusNet',
      properties: ['createDirectory']
    });
    // TODO: alert if it overrides existing folder
  };

  render() {
    return (
      <div className="container">
        <p>Choose where to sync CampusNet to.</p>
        <input type="file" onClick={this.selectFolder}/>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector("#app"));
