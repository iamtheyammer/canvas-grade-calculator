import React, { Component } from 'react';
import { connect } from 'react-redux';
import { shape, object } from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Modal, Icon } from 'antd';

class ErrorModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };
  }

  handleOk = () => {
    window.location.reload();
  };

  handleCancel = () => {
    this.setState({ redirect: true });
  };

  componentDidMount() {
    const { res, error, refreshToken } = this.props;
    const result = res || error.res;
    const canvasStatusCode = parseInt(result.headers['x-canvas-status-code']);

    if (canvasStatusCode === 401) {
      if (refreshToken) {
        Modal.info({
          title: 'Re-Authorizing...',
          content:
            'Please wait while we re-authorize with Canvas. [ErrorModal not yet implemented!]',
          closable: false,
          okButtonProps: { loading: true },
          okText: 'One sec...',
          icon: <Icon type="lock" />
        });
      } else {
        Modal.info({
          title: 'Invalid Canvas Token',
          content:
            "There's an issue with your Canvas token or subdomain. Click Logout to enter a different one.",
          closable: false,
          icon: <Icon type="exclamation-circle" style={{ color: '#D8000C' }} />,
          okText: 'Logout',
          onOk: this.handleCancel
        });
      }
    } else {
      Modal.confirm({
        icon: <Icon type="exclamation-circle" style={{ color: '#D8000C' }} />,
        title: 'Unknown Error',
        content: `Do you want to reload?
    
${this.props.error}`,
        okText: 'Try again',
        cancelText: 'Logout',
        onCancel: this.handleCancel,
        onOk: this.handleOk
      });
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/dashboard/logout" />;
    }

    return <div />;
  }
}

const ConnectedErrorModal = connect(state => ({
  refreshToken: state.canvas.refreshToken
}))(ErrorModal);

ConnectedErrorModal.propTypes = {
  error: shape({
    res: object
  })
};

export default ConnectedErrorModal;
