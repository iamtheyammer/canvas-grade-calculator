import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Spin,
  Typography,
  Table
} from 'antd';

import {
  getUser,
  getUserCourses,
  getOutcomeRollupsForCourse,
} from '../../../actions/canvas';

import calculateGradeFromOutcomes from '../../../util/canvas/calculateGradeFromOutcomes';
import getActiveCourses from '../../../util/canvas/getActiveCourses';

const tableColumns = [
  {
    title: 'Class Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Class ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Grade',
    dataIndex: 'grade',
    key: 'grade'
  }
];

class Grades extends Component {
  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.loadData();
  }

  loadData = () => {
    if(!this.props.user) {
      this.props.dispatch(getUser(this.props.token, this.props.subdomain));
    } else if (!this.props.courses) {
      this.props.dispatch(getUserCourses(this.props.token, this.props.subdomain));
    } else if (!this.props.outcomes) {
      this.props.courses.forEach(c => {
        this.props.dispatch(getOutcomeRollupsForCourse(
          this.props.user.id, c.id, this.props.token, this.props.subdomain
        ))
      });
    }
  };

  render() {
    if(!this.props.outcomeRollups || !this.props.courses) {
      return(
        <div align="center">
          <Spin size="large"/>
          <Typography.Title level={2}>Loading (this might take a minute!)...</Typography.Title>
        </div>
      )
    }

    const grades = calculateGradeFromOutcomes(this.props.outcomeRollups);
    const activeCourses = getActiveCourses(this.props.courses);

    const data = activeCourses.map(c => ({
      key: c.id,
      name: c.name,
      grade: grades[c.id],
      id: c.id
    }));

    return(
      <div>
        <Typography.Title level={2}>Grades</Typography.Title>
        <Table
          columns={tableColumns}
          dataSource={data}
        />
      </div>

    )
  }
}

const ConnectedGrades = connect(state => ({
  courses: state.canvas.courses,
  outcomes: state.canvas.outcomes,
  outcomeRollups: state.canvas.outcomeRollups,
  user: state.canvas.user,
  token: state.canvas.token,
  subdomain: state.canvas.subdomain
}))(Grades);

export default ConnectedGrades;
