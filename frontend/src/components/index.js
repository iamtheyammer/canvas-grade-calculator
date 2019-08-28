import React, { Component } from 'react';

import { Spin } from 'antd';

import axios from 'axios';

class CanvasTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loadedData: {}
    };
  }

  componentDidMount() {
    this.loadData()
  }

  async loadData() {
    const data = await axios({
      method: 'get',
      url: 'https://canvas.instructure.com/api/v1/users/self/profile',
      headers: {
        Authorization: 'Bearer '
      }
    });
    this.setState({
      loading: false,
      loadedData: data.data
    });
  }

  render() {

    if(this.state.loading) {
      return <Spin/>
    }

    return(
      <div>
        {this.state.loadedData}
      </div>
    )
  }
}

export default CanvasTest
