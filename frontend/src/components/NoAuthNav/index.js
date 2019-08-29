import React from 'react';

import { Link } from 'react-router-dom';

import {
  Menu
} from 'antd';

function NoAuthNav(props) {
  return(
    <Menu
      mode="horizontal"
      defaultSelectedKeys={['/']}
      selectedKeys={[props.location.pathname]}
    >
      <Menu.Item key="/"><Link to="/">Home</Link></Menu.Item>
      <Menu.Item key="/tokenEntry"><Link to="/tokenEntry">Token Entry</Link></Menu.Item>
    </Menu>
  )
}

export default NoAuthNav;
