import React, { useEffect } from 'react';
import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as ReactGA from 'react-ga';

import { gotStoredCredentials } from './actions/canvas';

import 'antd/dist/antd.css';

import ConnectedHome from './components/Home';
import ConnectedTokenEntry from './components/TokenEntry';
import ConnectedOAuth2Response from './components/OAuth2Response';

import Dashboard from './components/Dashboard';
import env from './util/env';

function App(props) {
  useEffect(() => {
    if (localStorage.token) {
      props.dispatch(
        gotStoredCredentials(
          localStorage.token,
          localStorage.refreshToken,
          localStorage.subdomain || ''
        )
      );
    }

    // we pass in an empty array because React will only re-run this if the contents of that
    // array change, and we want this code to run only once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [true]);

  ReactGA.initialize(env.googleAnalyticsId);

  ReactGA.pageview('/');
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={ConnectedHome} />
        <Route exact path="/tokenEntry" component={ConnectedTokenEntry} />
        <Route
          exact
          path="/oauth2response"
          component={ConnectedOAuth2Response}
        />
        <Route path="/dashboard" component={Dashboard} />
        <Route
          status={404}
          render={() => (
            <div align="center">
              <p color="#fffff">404 Not Found</p>
              <Link to="/">Home</Link>
            </div>
          )}
        />
      </Switch>
    </Router>
  );
}

const ConnectedApp = connect(state => ({}))(App);

export default ConnectedApp;
