import React from 'react';
import { connect } from 'react-redux';
import { parse } from 'qs';
import { Redirect } from 'react-router-dom';
import { notification } from 'antd';

import { gotUserOAuth } from '../../actions/canvas';

function OAuth2Response(props) {
  const query = parse(
    props.location.search.slice(1, props.location.search.length)
  );

  if (query.error || !query.canvas_response) {
    if (query.error === 'access_denied') {
      // user said no. redirect to home.
      return <Redirect to="/" />;
    }

    // unknown error
    notification.error({
      message: 'Unknown Error',
      duration: 0,
      description:
        'There was an unknown error logging you in with Canvas. Try again later.'
    });
    return <Redirect to="/" />;
  }

  const canvasResponse = JSON.parse(query.canvas_response);
  props.dispatch(
    gotUserOAuth(
      canvasResponse.access_token,
      canvasResponse.refresh_token,
      query.subdomain
    )
  );

  // set the version to current since it's a new user
  localStorage.prevVersion = process.env.REACT_APP_CURRENT_VERSION;

  notification.success({
    message: 'Success!',
    description: `Welcome, ${
      canvasResponse.user.name.split(' ')[0]
    }! You've successfully logged in with Canvas.`
  });

  return <Redirect to="/dashboard" />;
}

const ConnectedOAuth2Response = connect(state => ({}))(OAuth2Response);

export default ConnectedOAuth2Response;
