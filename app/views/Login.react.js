import fetch from 'isomorphic-fetch';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Component from 'react-pure-render/component';
import CampusNetClient from '../campusnet/campusnet-client';
import Spinner from './Spinner.react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/auth';

class Login extends Component {
  static propTypes = {
    user: PropTypes.shape({
      username: PropTypes.string,
      PApassword: PropTypes.string
    }),
    login: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object
  };

  state = {username: '', password: '', loading: false};

  onUsernameChange = e => {
    this.setState({username: e.target.value});
  };
  onPasswordChange = e => {
    this.setState({password: e.target.value});
  };

  onSubmit = (e) => {
    const {username, password} = this.state;
    this.setState({loading: true});
    this.props.login({username, password})
      .then((success) => {
        this.setState({loading: false});
        if (success)
          this.context.router.push({
            pathname: '/preference',
            state: { chooseFolder: true },
          });
      });
    e.preventDefault();
  };

  render() {
    return (
      <div className="container">
        <form onSubmit={this.onSubmit}>
          <div className="input-group-combined">
            <input type="text" placeholder="Username" 
              value={this.state.username}
              onChange={this.onUsernameChange}/>
            <input type="password" placeholder="Password"
              value={this.state.password}
              onChange={this.onPasswordChange}/>
          </div>
          <button type="submit" 
            className="button button-block"
            disabled={this.state.loading}>
              {this.state.loading ? <Spinner/> : "Login"}
          </button>
        </form>
      </div>
    );
  }
}

export default connect(
  (state) => ({user: state.auth.user}),
  (dispatch) => bindActionCreators(Actions, dispatch),
)(Login);
