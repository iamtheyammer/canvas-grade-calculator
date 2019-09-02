import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './index.css';
import banner from '../../assets/banner.svg'

import toc from '../../util/getTermsAndConditions';

import {
  Card, Typography, Button, Checkbox, Modal
} from 'antd';

function Home(props) {
  const [ enableSignin, setEnableSignin ] = useState(false);

  if(props.token) {
    return <Redirect to="/dashboard" />
  }

  return(
    <div className="background">
      <Card
        className="card"
        title={<img src={banner} alt="banner" />}
      >
        <div className="static-text">
          <Typography.Title level={2}>
            Welcome!
          </Typography.Title>
          <Typography.Text>
            This tool calculates grades based on outcomes in Canvas. To use it,
            please accept the Terms and Conditions, then log in with Canvas.
          </Typography.Text>
        </div>
        <div>
          <Checkbox
            siz
            onChange={(e) => setEnableSignin(e.target.checked)} className="center-checkbox">
            I accept the <Button
              type="link"
              style={{ marginLeft: '-15px' }}
              onClick={() => Modal.info({
                title: 'Terms and Conditions',
                content: toc
              })}
            >terms and conditions</Button>
          </Checkbox>
          <div style={{ marginTop: '15px' }} />
          <Button
            type="primary"
            size={!enableSignin ? "default" : "large"}
            className="center button"
            disabled={!enableSignin}
            onClick={() => window.location.href = 'http://localhost:8000/api/canvas/oauth2/request'}
          >
            Sign in with Canvas
          </Button>
        </div>
      </Card>
    </div>
  )
}

const ConnectedHome = connect(state => ({
  token: state.canvas.token
}))(Home);

export default ConnectedHome;
