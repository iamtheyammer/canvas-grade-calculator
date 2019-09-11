import React from 'react';
import { connect } from 'react-redux';

import { Redirect } from 'react-router-dom';

import { logout } from '../../../actions/canvas';

function Logout(props) {
  props.dispatch(logout());
  return <Redirect to="/" />;
}

const ConnectedLogout = connect(state => ({}))(Logout);

export default ConnectedLogout;
