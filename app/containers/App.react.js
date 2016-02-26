import React, { PropTypes } from 'react';
import Component from 'react-pure-render/component';
import AppComponent from '../views/App.react';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  render() {
    return (
      <AppComponent>
        {this.props.children}
        {
          (() => {
            if (process.env.NODE_ENV === 'development') {
              const DevTools = require('./DevTools.react').default;
              return <DevTools />;
            }
          })()
        }
      </AppComponent>
    );
  }
}
