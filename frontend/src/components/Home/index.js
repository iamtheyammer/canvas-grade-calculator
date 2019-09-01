import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  Layout, Typography, Button
} from 'antd';

function Home(props) {
  if(props.token) {
    return <Redirect to="/dashboard" />
  }

  return(
    <Layout>
      <Layout.Content>
        <Typography.Title level={1}>Canvas CBL Grade Calculator</Typography.Title>
        <Typography.Paragraph>
          OAuth2 support is not here yet. To use this, you must generate a token in your
          canvas profile, then put it in the <Link to="/tokenEntry">token entry</Link> page.
        </Typography.Paragraph>
        <Button
          type="primary"
          onClick={() => window.location.href = 'http://localhost:8000/api/canvas/oauth2/request'}
        >Sign in with Canvas</Button>
      </Layout.Content>
    </Layout>
  )
}

const ConnectedHome = connect(state => ({
  token: state.canvas.token
}))(Home);

export default ConnectedHome;
