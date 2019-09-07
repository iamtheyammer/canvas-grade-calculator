import React, { useEffect } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  gotUserTokenEntry
} from './actions/canvas';

import 'antd/dist/antd.css';

import ConnectedHome from './components/Home';
import ConnectedTokenEntry from './components/TokenEntry';
import ConnectedOAuth2Response from './components/OAuth2Response';

import Dashboard from './components/Dashboard';

function App(props) {
  useEffect(() => {
    if(localStorage.token) {
      props.dispatch(gotUserTokenEntry(localStorage.token, localStorage.subdomain || ''));
    }

    // we pass in an empty array because React will only re-run this if the contents of that
    // array change, and we want this code to run only once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ true ]);
  return(
    <Router>
      <Route exact path="/" component={ConnectedHome} />
      <Route exact path="/tokenEntry" component={ConnectedTokenEntry} />
      <Route exact path="/oauth2response" component={ConnectedOAuth2Response} />
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
      </Switch>
    </Router>
  )
}

const ConnectedApp = connect(state => ({

}))(App);

export default ConnectedApp;
