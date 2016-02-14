import '../scss/index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import Component from 'react-pure-render/component';
import Header from './Header.react';

export default class App extends Component {
  render() {
    return (
      <div className="app">
        <Header/>
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}
