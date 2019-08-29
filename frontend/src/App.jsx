import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  gotUserSubdomain,
  getUserToken
} from './actions/canvas';

import 'antd/dist/antd.css';

import NoAuthNav from './components/NoAuthNav';

import ConnectedHome from './components/Home';
import ConnectedTokenEntry from './components/TokenEntry';

import Dashboard from './components/Dashboard';

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if(localStorage.token) this.props.dispatch(getUserToken(localStorage.token));
    if(localStorage.subdomain) this.props.dispatch(gotUserSubdomain(localStorage.subdomain));
  }

  render() {
    return(
      <Router>
        {/* navs */}
        <Route exact path="/" component={NoAuthNav} />
        <Route path="/tokenEntry" component={NoAuthNav} />

        {/* routes */}
        <Route exact path="/" component={ConnectedHome} />
        <Route path="/tokenEntry" component={ConnectedTokenEntry} />
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </Router>
    )
  }
}

const ConnectedApp = connect(state => ({

}))(App);

export default ConnectedApp;
