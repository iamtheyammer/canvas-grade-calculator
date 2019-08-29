import React, { Component } from 'react';
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
    Modal.confirm({
      icon: <Icon type="exclamation-circle" style={{color: '#D8000C'}}/>,
      title: 'Error',
      content: `Do you want to reload?
      
${this.props.error}`,
      okText: 'Try again',
      cancelText: 'Logout',
      onCancel: this.handleCancel,
      onOk: this.handleOk
    })
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

export default ErrorModal;
