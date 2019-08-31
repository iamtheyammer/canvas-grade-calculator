import React from 'react';
import { connect } from 'react-redux';
import { parse } from 'qs';
import { Redirect } from 'react-router-dom';
import { notification } from 'antd';

import {
  gotUserOAuth,
  gotUserSubdomain
} from '../../actions/canvas';

function OAuth2Response(props) {
  const query = parse(props.location.search.slice(1, props.location.search.length));

  // debugger;

  if(query.error || !query.canvas_response) {
    if(query.error === 'access_denied') {
      // user said no. redirect to home.
      return <Redirect to="/" />
    }

    if(query.error === 'proxy_canvas_error') {
      // unknown error
      alert('There was an unknown error logging you in. Please try again later.');
      return <Redirect to="/" />
    }
  }

  props.dispatch(gotUserSubdomain(query.subdomain));

  const canvasResponse = JSON.parse(query.canvas_response);
  props.dispatch(gotUserOAuth(canvasResponse.access_token, canvasResponse.refresh_token));

  notification.success({
    message: 'Success!',
    description: `Welcome, ${canvasResponse.user.name.split(' ')[0]}! You've successfully logged in with Canvas.`
  });

  return <Redirect to="/dashboard/courses" />
}

const ConnectedOAuth2Response = connect(state => ({

}))(OAuth2Response);

export default ConnectedOAuth2Response;