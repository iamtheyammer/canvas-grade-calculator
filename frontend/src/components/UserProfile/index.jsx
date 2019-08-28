import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Spin,
  Descriptions
} from 'antd';

import { getUser } from '../../actions/canvas';

class UserProfile extends Component {
  componentDidMount() {
    if(!this.props.user) {
      return this.props.dispatch(getUser(this.props.token));
    }
  }

  render() {
    if(!this.props.user) {
      return(
        <Spin size="large" />
      )
    }

    const user = this.props.user;
    return (
      <Descriptions title="User Profile">
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
  token: state.canvas.token
}))(UserProfile);

export default ConnectedUserProfile;
