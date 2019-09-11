import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import v4 from 'uuid/v4';

import { Typography, Table, Icon } from 'antd';

import {
  getUser,
  getUserCourses,
  getOutcomeRollupsForCourse
} from '../../../actions/canvas';

import calculateGradeFromOutcomes from '../../../util/canvas/calculateGradeFromOutcomes';
import getActiveCourses from '../../../util/canvas/getActiveCourses';
import ErrorModal from '../ErrorModal';

import { ReactComponent as PopOutIcon } from '../../../assets/pop_out.svg';
import { desc } from '../../../util/stringSorter';

const tableColumns = [
  {
    title: 'Class Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => desc(a.name, b.name),
    render: (text, record) =>
      record.grade === 'N/A' || record.grade.toLowerCase().includes('error') ? (
        text
      ) : (
        <Link to={`/dashboard/grades/${record.id}`}>{text}</Link>
      )
  },
  {
    title: 'Class ID',
    dataIndex: 'id',
    key: 'id',
    sorter: (a, b) => a.id - b.id
  },
  {
    title: 'Grade',
    dataIndex: 'grade',
    key: 'grade',
    sorter: (a, b) => desc(a.grade, b.grade),
    defaultSortOrder: 'desc'
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (text, record) => (
      <div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://${localStorage.subdomain ||
            'canvas'}.instructure.com/courses/${record.id}`}
        >
          Open on Canvas <Icon component={PopOutIcon} />
        </a>
      </div>
    )
  }
];

class Grades extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getUserId: '',
      getUserCoursesId: '',
      getOutcomeRollupsForCourseIds: []
    };
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.loadData();
  }

  getAllIds = () => [
    this.state.getUserId,
    this.state.getUserCoursesId,
    ...this.state.getOutcomeRollupsForCourseIds
  ];

  loadData = () => {
    // if anything from this component is loading, let it load!
    const allLoading = this.getAllIds();

    if (this.props.loading.some(l => allLoading.includes(l))) {
      return;
    }

    if (!this.props.user) {
      const getUserId = v4();
      this.setState({ getUserId });
      this.props.dispatch(
        getUser(getUserId, this.props.token, this.props.subdomain)
      );
    } else if (!this.props.courses) {
      const getUserCoursesId = v4();
      this.setState({ getUserCoursesId });
      this.props.dispatch(
        getUserCourses(getUserCoursesId, this.props.token, this.props.subdomain)
      );
    } else if (!this.props.outcomeRollups) {
      const ids = [];
      getActiveCourses(this.props.courses).forEach(c => {
        const getOutcomeRollupsForCourseId = v4();
        ids.push(getOutcomeRollupsForCourseId);
        this.props.dispatch(
          getOutcomeRollupsForCourse(
            getOutcomeRollupsForCourseId,
            this.props.user.id,
            c.id,
            this.props.token,
            this.props.subdomain
          )
        );
      });
      this.setState({
        getOutcomeRollupsForCourseIds: this.state.getOutcomeRollupsForCourseIds.concat(
          ids
        )
      });
    }
  };

  render() {
    const { loading, outcomeRollups, courses, errors } = this.props;
    const allIds = this.getAllIds();

    if (loading.some(l => allIds.includes(l)) || !outcomeRollups) {
      return (
        <div>
          <Typography.Title level={2}>Grades</Typography.Title>
          <Table columns={tableColumns} loading={true} />
        </div>
      );
    }

    const erroredIds = Object.keys(errors).filter(l => allIds.includes(l));
    if (erroredIds.length > 0) {
      return <ErrorModal res={errors[erroredIds[0]]} />;
    }

    const grades = calculateGradeFromOutcomes(outcomeRollups);
    const activeCourses = getActiveCourses(courses);

    const data = activeCourses.map(c => ({
      key: c.id,
      name: c.name,
      grade: grades[c.id] ? grades[c.id].grade : 'Error, try reloading',
      id: c.id
    }));

    return (
      <div>
        <Typography.Title level={2}>Grades</Typography.Title>
        <Typography.Text type="secondary">
          If you have a grade in a class, click on the name to see a detailed
          breakdown of your grade.
        </Typography.Text>
        <div style={{ marginBottom: '12px' }} />
        <Table columns={tableColumns} dataSource={data} />
        <Typography.Text type="secondary">
          Please note that these grades may not be accurate or representative of
          your real grade. For the most accurate and up-to-date information,
          please consult someone from your school.
        </Typography.Text>
      </div>
    );
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
