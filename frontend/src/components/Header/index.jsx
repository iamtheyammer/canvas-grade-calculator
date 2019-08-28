import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';

function Header() {
  return(
    <Menu
      mode="horizontal"
    >
      <Menu.Item><Link to="/">Home</Link></Menu.Item>
      <Menu.Item><Link to="/tokenEntry">Token Entry</Link></Menu.Item>
      <Menu.Item><Link to="/profile">My Profile</Link></Menu.Item>
    </Menu>
  )
}

export default Header;
