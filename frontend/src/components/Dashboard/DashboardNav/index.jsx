import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import './index.css';
import logo from '../../../assets/banner-light.svg';

import { Layout, Menu } from 'antd';

const { Header } = Layout;

function DashboardNav(props) {
  return (
    <Header>
      <img
        src={logo}
        className="logo"
        alt="canvas-grade-calculator light banner"
      />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['profile']}
        selectedKeys={[
          `/${props.location.pathname
            .split('/')
            .slice(1, 3)
            .join('/')}`
        ]}
        style={{ lineHeight: '64px' }}
      >
        <Menu.Item key="/dashboard/profile">
          <Link to="/dashboard/profile">Profile</Link>
        </Menu.Item>
        <Menu.Item key="/dashboard/grades">
          <Link to="/dashboard/grades">Grades</Link>
        </Menu.Item>
        <Menu.Item style={{ float: 'right' }} key="/dashboard/logout">
          <Link to={'/dashboard/logout'}>Logout</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
}

export default withRouter(DashboardNav);
