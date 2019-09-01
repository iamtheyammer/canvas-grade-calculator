import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  gotUserSubdomain,
  getUserToken
} from './actions/canvas';

import 'antd/dist/antd.css';

import NoAuthNav from './components/NoAuthNav';

import ConnectedHome from './components/Home';
import ConnectedTokenEntry from './components/TokenEntry';
import ConnectedOAuth2Response from './components/OAuth2Response';

import Dashboard from './components/Dashboard';

function App(props) {
  useEffect(() => {
    if(localStorage.token) props.dispatch(getUserToken(localStorage.token));
    if(localStorage.subdomain) props.dispatch(gotUserSubdomain(localStorage.subdomain));

    // we pass in an empty array because React will only re-run this if the contents of that
    // array change, and we want this code to run only once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ true ]);
  return(
    <Router>
      {/* navs */}
      <Route exact path="/" component={NoAuthNav} />
      <Route path="/tokenEntry" component={NoAuthNav} />

      {/* routes */}
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
