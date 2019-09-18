import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import v4 from 'uuid/v4';

import { Typography, Table, Icon, Spin } from 'antd';

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
  // {
  //   title: 'Class ID',
  //   dataIndex: 'id',
  //   key: 'id',
  //   sorter: (a, b) => a.id - b.id
  // },
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
        <Link to={`/dashboard/grades/${record.id}`}>See Breakdown</Link>
        {' | '}
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

function Grades(props) {
  const [getUserId, setGetUserId] = useState('');
  const [getCoursesId, setGetCoursesId] = useState('');
  const [
    getOutcomeRollupsForCourseIds,
    setGetOutcomeRollupsForCourseIds
  ] = useState([]);

  const [loadingText, setLoadingText] = useState('');

  const allIds = [getUserId, getCoursesId, ...getOutcomeRollupsForCourseIds];

  const {
    dispatch,
    token,
    subdomain,
    loading,
    error,
    user,
    courses,
    outcomeRollups
  } = props;

  const err = error[Object.keys(error).filter(eid => allIds.includes(eid))[0]];

  const activeCourses = courses ? getActiveCourses(courses) : courses;

  useEffect(() => {
    if (allIds.some(id => loading.includes(id)) || err) {
      return;
    }

    if (!user && !getUserId) {
      const id = v4();
      dispatch(getUser(id, token, subdomain));
      setGetUserId(id);
      setLoadingText('your profile');
      return;
    }

    if (!courses && !getCoursesId) {
      const id = v4();
      dispatch(getUserCourses(id, token, subdomain));
      setGetCoursesId(id);
      setLoadingText('your courses');
      return;
    }

    if (
      (!outcomeRollups || activeCourses.some(c => !outcomeRollups[c.id])) &&
      !getOutcomeRollupsForCourseIds.length
    ) {
      const ids = [];
      activeCourses.forEach(c => {
        const id = v4();
        ids.push(id);
        dispatch(
          getOutcomeRollupsForCourse(id, user.id, c.id, token, subdomain)
        );
      });
      setGetOutcomeRollupsForCourseIds(ids);
      setLoadingText('your grades');
    }
    // ignoring because we only want this hook to re-run on a prop change
    // eslint-disable-next-line
  }, [props]);

  if (err) {
    return <ErrorModal error={err} />;
  }

  if (
    !user ||
    !courses ||
    !outcomeRollups ||
    allIds.some(id => loading.includes(id))
  ) {
    return (
      <div align="center">
        <Spin />
        <span style={{ paddingTop: '20px' }} />
        <Typography.Title level={3}>
          {`Loading ${loadingText}...`}
        </Typography.Title>
      </div>
    );
  }

  const grades = calculateGradeFromOutcomes(outcomeRollups);

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

const ConnectedGrades = connect(state => ({
  courses: state.canvas.courses,
  outcomeRollups: state.canvas.outcomeRollups,
  user: state.canvas.user,
  token: state.canvas.token,
  subdomain: state.canvas.subdomain,
  error: state.error,
  loading: state.loading
}))(Grades);

export default ConnectedGrades;
