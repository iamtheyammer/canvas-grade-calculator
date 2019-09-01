import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import logo from '../../../assets/banner-light.svg';

import {
  Layout,
  Menu
} from 'antd';

const {
  Header
} = Layout;

function DashboardNav() {
  return(
    <Header>
      <img src={logo} className="logo" alt="canvas-grade-calculator light banner"/>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['profile']}
        style={{ lineHeight: '64px' }}
      >
        <Menu.Item key="profile">
          <Link to="/dashboard/profile">Profile</Link>
        </Menu.Item>
        <Menu.Item key="grades">
          <Link to="/dashboard/grades">Grades</Link>
        </Menu.Item>
        <Menu.Item style={{float: 'right'}}>
          <Link to={"/dashboard/logout"}>Logout</Link>
        </Menu.Item>
      </Menu>
    </Header>
  )
}

export default DashboardNav;
