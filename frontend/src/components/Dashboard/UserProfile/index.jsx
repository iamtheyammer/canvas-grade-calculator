import React, { Component } from 'react';
import { connect } from 'react-redux';
import v4 from 'uuid/v4';

import {
  Spin,
  Descriptions
} from 'antd';

import { getUser } from '../../../actions/canvas';

import ErrorModal from '../ErrorModal';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getUserId: ''
    }
  }


  componentDidMount() {
    if(!this.props.user) {
      const getUserId = v4();
      this.setState({ getUserId });
      return this.props.dispatch(getUser(getUserId, this.props.token, this.props.subdomain));
    }
  }

  render() {
    if(this.props.error[this.state.getUserId]) {
      return <ErrorModal res={this.props.error[this.state.getUserId].res} />
    }

    if(!this.props.user || this.props.loading.includes(this.state.getUserId)) {
      return(
        <div align="center" style={{ marginTop: '20px' }}>
          <Spin size="large" />
        </div>
      )
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
  subdomain: state.canvas.subdomain,
  error: state.error,
  loading: state.loading
}))(UserProfile);

export default ConnectedUserProfile;
