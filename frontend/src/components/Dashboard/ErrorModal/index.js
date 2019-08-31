import React, { Component } from 'react';
import { shape, object } from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Modal, Icon } from 'antd';

class ErrorModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    }
  }

  handleOk = () => {
    window.location.reload();
  };

  handleCancel = () => {
    this.setState({ redirect: true });
  };

  componentDidMount() {
    const { res } = this.props;

    switch(parseInt(res.headers['x-canvas-status-code'])) {
      case 401:
        // token is invalid.
        // should re-authorize.
        Modal.info({
          title: 'Re-Authorizing...',
          content: 'Please wait while we re-authorize with Canvas. [ErrorModal not yet implemented!]',
          closable: false,
          okButtonProps: {loading: true},
          okText: 'One sec...',
          icon: <Icon type="lock"/>
        });
        return;
      default:
        Modal.confirm({
          icon: <Icon type="exclamation-circle" style={{color: '#D8000C'}}/>,
          title: 'Unknown Error',
          content: `Do you want to reload?
      
${this.props.error}`,
          okText: 'Try again',
          cancelText: 'Logout',
          onCancel: this.handleCancel,
          onOk: this.handleOk
        })
    }
  }



  render() {
    if(this.state.redirect) {
      return (
        <Redirect to="/dashboard/logout" />
      )
    }

    return <div />;
  }
}

ErrorModal.propTypes = {
  error: shape({
    res: object
  })
};

export default ErrorModal;
