import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import * as ReactGA from 'react-ga';

import { Layout, Breadcrumb } from 'antd';

import DashboardNav from './DashboardNav';
import ConnectedUserProfile from './UserProfile';
import ConnectedGrades from './Grades';
import ConnectedGradeBreakdown from './Grades/GradeBreakdown';
import ConnectedLogout from './Logout';

const { Content, Footer } = Layout;

const getBreadcrumbNameMap = (courses = []) => {
  const routes = {
    '/dashboard': 'Dashboard',
    '/dashboard/profile': 'Profile',
    '/dashboard/grades': 'Grades'
  };

  courses.forEach(
    c => (routes[`/dashboard/grades/${c.id}`] = `Grade Breakdown for ${c.name}`)
  );

  return routes;
};

function Dashboard(props) {
  const { token } = props;
  const [hasSentUserToGa, setHasSentUserToGa] = useState(false);

  // if no token exists, redirect
  if (!localStorage.token) {
    return <Redirect to="/" />;
  } else if (!token) {
    // otherwise, wait for token
    return null;
  }

  ReactGA.pageview(
    props.location.pathname +
      (props.location.search.includes('~') ? '' : props.location.search)
  );

  const { location, user } = props;
  const pathSnippets = location.pathname.split('/').filter(i => i);
  const breadcrumbNameMap = getBreadcrumbNameMap(props.courses || []);
  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbNameMap[url]}</Link>
      </Breadcrumb.Item>
    );
  });

  if (hasSentUserToGa === false && user) {
    ReactGA.set({ userId: user.id });
    setHasSentUserToGa(true);
  }

  return (
    <Layout className="layout">
      <DashboardNav />
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ marginTop: 12 }}>{breadcrumbItems}</Breadcrumb>
        <div
          style={{
            background: '#fff',
            padding: 24,
            marginTop: 12,
            minHeight: 280
          }}
        >
          <Switch>
            <Route
              exact
              path="/dashboard"
              render={() => <Redirect to="/dashboard/profile" />}
            />
            <Route
              exact
              path="/dashboard/profile"
              component={ConnectedUserProfile}
            />
            <Route exact path="/dashboard/grades" component={ConnectedGrades} />
            <Route
              exact
              path="/dashboard/grades/:courseId"
              component={ConnectedGradeBreakdown}
            />
            <Route exact path="/dashboard/logout" component={ConnectedLogout} />
          </Switch>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Built by iamtheyammer 2019
      </Footer>
    </Layout>
  );
}

const ConnectedDashboard = connect(state => ({
  token: state.canvas.token,
  courses: state.canvas.courses,
  user: state.canvas.user
}))(Dashboard);

export default ConnectedDashboard;

/*

avatar_url: "https://dtechhs.instructure.com/images/messages/avatar-50.png"
bio: null
calendar: {ics: "https://dtechhs.instructure.com/feeds/calendars/user_DCPxI1aLRwRaIkZ43PjlJqdoaoZIqW9oEyS9JaIa.ics"}
effective_locale: "en"
id: 396
integration_id: null
locale: null
login_id: "smendelson21@dtechhs.org"
lti_user_id: "2faffb2f42d8b058085a456b265d4df3a3dbeabd"
name: "Sam Mendelson"
primary_email: "smendelson21@dtechhs.org"
short_name: "Sam Mendelson"
sortable_name: "Mendelson, Sam"
time_zone: "America/Los_Angeles"
title: null
 */
