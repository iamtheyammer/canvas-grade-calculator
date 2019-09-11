import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, notification, Typography, Button } from 'antd';

import { gotUserTokenEntry } from '../../actions/canvas';

class TokenEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: this.props.token || '',
      subdomain: this.props.subdomain || ''
    };
  }

  tokenOnChange = e => {
    e.preventDefault();

    this.setState({
      token: e.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();

    this.props.dispatch(
      gotUserTokenEntry(this.state.token, this.state.subdomain)
    );

    notification.success({
      message: 'Success!',
      description: 'Saved token and subdomain.'
    });
  };

  subdomainOnChange = e => {
    e.preventDefault();

    this.setState({
      subdomain: e.target.value
    });
  };

  render() {
    return (
      <div>
        <Typography.Title level={2}>
          Advanced: Manual token entry
        </Typography.Title>
        <Typography.Paragraph>
          Manually generate a token, then enter it here, along with your
          subdomain. Leave the subdomain empty to use{' '}
          <code>canvas.instructure.com</code>
        </Typography.Paragraph>
        <Input
          addonBefore="Canvas Token"
          onPressEnter={this.onSubmit}
          onChange={this.tokenOnChange}
          value={this.state.token}
        />
        <br />
        <Input
          addonBefore="Canvas Subdomain"
          onPressEnter={this.onSubmit}
          onChange={this.subdomainOnChange}
          value={this.state.subdomain}
        />
        <br />
        <Button type="primary" onClick={this.onSubmit}>
          Submit
        </Button>
        <Typography.Paragraph>
          Return home to get redirected to the dashboard.
        </Typography.Paragraph>
      </div>
    );
  }
}

const ConnectedTokenEntry = connect(state => ({
  token: state.canvas.token,
  subdomain: state.canvas.subdomain
}))(TokenEntry);

export default ConnectedTokenEntry;
