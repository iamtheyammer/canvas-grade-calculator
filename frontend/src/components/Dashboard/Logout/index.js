import React from 'react';
import { connect } from 'react-redux';

import { Redirect } from 'react-router-dom';

import { logout } from '../../../actions/canvas';

function Logout(props) {
  const { token, subdomain } = props;

  props.dispatch(logout(token, subdomain));
  return <Redirect to="/" />;
}

const ConnectedLogout = connect(state => ({
  token: state.canvas.token,
  subdomain: state.canvas.subdomain
}))(Logout);

export default ConnectedLogout;
