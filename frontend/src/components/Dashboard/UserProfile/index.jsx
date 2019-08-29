import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Spin,
  Descriptions
} from 'antd';

import { getUser } from '../../../actions/canvas';

import ErrorModal from '../ErrorModal';

class UserProfile extends Component {
  componentDidMount() {
    if(!this.props.user) {
      return this.props.dispatch(getUser(this.props.token, this.props.subdomain));
    }
  }

  render() {
    if(!this.props.user) {
      return(
        <Spin size="large" />
      )
    }

    if(this.props.user.error) {
      return <ErrorModal error={this.props.user.error} />
    }

    const user = this.props.user;
    return (
      <Descriptions title="My Profile" bordered>
        <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.primary_email}</Descriptions.Item>
        <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
        <Descriptions.Item label="Time Zone">{user.time_zone}</Descriptions.Item>
      </Descriptions>
    )
  }
}

const ConnectedUserProfile = connect(state => ({
  user: state.canvas.user,
  token: state.canvas.token,
  subdomain: state.canvas.subdomain
}))(UserProfile);

export default ConnectedUserProfile;
