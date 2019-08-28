import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import 'antd/dist/antd.css';

import Home from './components/Home';
import Header from './components/Header';
import ConnectedTokenEntry from './components/TokenEntry';
import ConnectedUserProfile from './components/UserProfile';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <Router>
        <Header />
        <Route exact path="/" component={Home} />
        <Route path="/tokenEntry" component={ConnectedTokenEntry} />
        <Route exact path="/profile" component={ConnectedUserProfile} />
      </Router>
    )
  }
}

const ConnectedApp = connect(state => ({
  loading: state.loading
}))(App);

export default ConnectedApp;
