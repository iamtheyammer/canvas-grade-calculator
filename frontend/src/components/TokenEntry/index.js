import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input } from 'antd';

import { getUserToken } from '../../actions/canvas';

class TokenEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: this.props.token || ''
    }
  }

  tokenOnChange = (e) => {
    e.preventDefault();

    this.setState({
      token: e.target.value
    });
  };

  tokenOnSubmit = (e) => {
    e.preventDefault();

    this.props.dispatch(getUserToken(this.state.token))
  };


  render() {
    return(
      <div>
        <Input
          addonBefore="Canvas Token"
          onPressEnter={this.tokenOnSubmit}
          onChange={this.tokenOnChange}
          value={this.state.token}
        />
      </div>
    )
  }
}

const ConnectedTokenEntry = connect(state => ({
  token: state.canvas.token
}))(TokenEntry);

export default ConnectedTokenEntry;
