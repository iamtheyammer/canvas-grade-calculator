import React, { Component } from 'react';
import { connect } from 'react-redux';
import v4 from 'uuid/v4';

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
  constructor(props) {
    super(props);
    this.state = {
      getUserId: '',
      getUserCoursesId: '',
      getOutcomeRollupsForCourseIds: []
    }
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.loadData();
  }

  loadData = () => {
    // if anything from this component is loading, let it load!
    const allLoading = [this.state.getUserId, this.state.getUserCoursesId, ...this.state.getOutcomeRollupsForCourseIds];
    if(this.props.loading.some(l => allLoading.includes(l))) {
      return;
    }

    if(!this.props.user) {
      const getUserId = v4();
      this.setState({ getUserId });
      this.props.dispatch(getUser(getUserId, this.props.token, this.props.subdomain));
    } else if (!this.props.courses) {
      const getUserCoursesId = v4();
      this.setState({ getUserCoursesId });
      this.props.dispatch(getUserCourses(getUserCoursesId, this.props.token, this.props.subdomain));
    } else if (!this.props.outcomeRollups) {
      const ids = [];
      this.props.courses.forEach(c => {
        const getOutcomeRollupsForCourseId = v4();
        ids.push(getOutcomeRollupsForCourseId);
        this.props.dispatch(getOutcomeRollupsForCourse(
          getOutcomeRollupsForCourseId, this.props.user.id, c.id, this.props.token, this.props.subdomain
        ))
      });
      this.setState({
        getOutcomeRollupsForCourseIds:
          this.state.getOutcomeRollupsForCourseIds.concat(ids)
      });
    }
  };

  render() {
    const { loading, outcomeRollups, courses} = this.props;

    if(
      !outcomeRollups ||
      loading.includes(this.state.getUserId) ||
      loading.includes(this.state.getUserCoursesId) ||
      loading.some(l => this.state.getOutcomeRollupsForCourseIds.includes(l))
    ) {
      return(
        <div>
          <Typography.Title level={2}>Grades</Typography.Title>
          <Table
            columns={tableColumns}
            loading={true}
          />
        </div>
      )
    }

    const grades = calculateGradeFromOutcomes(outcomeRollups);
    const activeCourses = getActiveCourses(courses);

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
  subdomain: state.canvas.subdomain,
  errors: state.error,
  loading: state.loading
}))(Grades);

export default ConnectedGrades;
