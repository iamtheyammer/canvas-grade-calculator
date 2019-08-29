import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';

import {
  Layout
} from 'antd';

import DashboardNav from './DashboardNav';
import ConnectedUserProfile from './UserProfile';
import ConnectedGrades from './Grades';
import ConnectedLogout from './Logout';

const {
  Content,
  Footer
} = Layout;

function Dashboard(props) {
  const { token } = props;

  if(!token) {
    return (
      <Redirect to="/" />
    );
  }

  return (
    <Layout className="layout">
      <DashboardNav />
      <Content style={{ padding: '0 50px' }}>
        <div style={{ background: '#fff', padding: 24, marginTop: 48, minHeight: 280 }}>
          <Switch>
            <Route exact path="/dashboard" render={() => <Redirect to="/dashboard/profile"/>} />
            <Route exact path="/dashboard/profile" component={ConnectedUserProfile}/>
            <Route exact path="/dashboard/grades" component={ConnectedGrades} />
            <Route exact path="/dashboard/logout" component={ConnectedLogout} />
          </Switch>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Built by iamtheyammer 2019</Footer>
    </Layout>
  );
}

const ConnectedDashboard = connect(state => ({
  token: state.canvas.token
}))(Dashboard);

export default ConnectedDashboard;
