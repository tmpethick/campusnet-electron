import '../scss/index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import Component from 'react-pure-render/component';
import Header from './Header.react';
import Flash from './Flash.react';
import {remote} from 'electron';

export default class App extends Component {
  componentDidMount() {
    this.resizeWindow();
  }

  componentDidUpdate() {
    this.resizeWindow();
  }

  resizeWindow() {
    console.log("!!!")
    const el = ReactDOM.findDOMNode(this.refs.app);
    const win = remote.getCurrentWindow();
    win.setContentSize(win.getContentSize()[0], el.offsetHeight, true)
  }

  render() {
    return (
      <div className="app" ref="app">
        <Header/>
        <Flash/>
        <div className="page">
          {this.props.children}
        </div>
      </div>
    );
  }
}
