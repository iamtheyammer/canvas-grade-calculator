import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import v4 from 'uuid/v4';

import {
  Typography,
  Spin,
  notification,
  Row,
  Col,
  Card,
  Button,
  Table,
  Icon,
  Popover
} from 'antd';

import {getOutcomeRollupsForCourse, getUserCourses, getUser} from '../../../../actions/canvas';
import calculateGradeFromOutcomes, { gradeMapByGrade } from '../../../../util/canvas/calculateGradeFromOutcomes';

import { desc } from '../../../../util/stringSorter';
import ConnectedErrorModal from '../../ErrorModal';

const outcomeTableColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => desc(a.name, b.name),
    render: (text, item) => <div>
      <Typography.Text>{text}</Typography.Text>
      <span style={{ width: '7px', display: 'inline-block' }} />
      {item.timesAssessed < 4 && <Popover
      title="Below 4 Assessments"
      placement="topLeft"
      content={<Typography.Text>
        This outcome has only been assessed {item.timesAssessed} time{item.timesAssessed !== 1 && 's'}.
        <br />
        Outcomes must be assessed 4 or more times to count in your real grade.
        <br />
        It's still counted here, though.
        </Typography.Text>}
      >
        <Icon type="info-circle"/>
      </Popover>}
    </div>
  },
  {
    title: 'Score',
    dataIndex: 'score',
    key: 'score',
    sorter: (a, b) => a.score - b.score
  },
  {
    title: 'Times Assessed',
    dataIndex: 'timesAssessed',
    key: 'timesAssessed',
    sorter: (a, b) => a.timesAssessed - b.timesAssessed
  },
  {
    title: 'Last Assignment',
    dataIndex: 'lastAssignment',
    key: 'lastAssignment',
    sorter: (a, b) => desc(a.lastAssignment, b.lastAssignment)
  }
];

function GradeBreakdown(props) {
  const [ getUserId, setGetUserId ] = useState('');
  const [ getCoursesId, setGetCoursesId ] = useState('');
  const [ getRollupsId, setGetRollupsId ] = useState('');

  const { loading, error, user, courses, outcomeRollups } = props;

  useEffect(
    () => {
      // loading before fetch because we don't want to request twice
      if(loading.includes(getCoursesId) ||
        loading.includes(getRollupsId) ||
        loading.includes(getUserId)) {
        return;
      }

      if(!props.user && !getUserId) {
        const id = v4();
        props.dispatch(getUser(id, props.token, props.subdomain));
        setGetUserId(id);
        return;
      }

      if(!props.courses && !getCoursesId) {
        const id = v4();
        props.dispatch(getUserCourses(id, props.token, props.subdomain));
        setGetCoursesId(id);
        return;
      }

      if(!props.outcomeRollups && !getRollupsId) {
        const id = v4();
        props.dispatch(getOutcomeRollupsForCourse(id, props.user.id, courseId, props.token, props.subdomain));
        setGetRollupsId(id);
      }
    },
    // disabling because we specifically only want to re-run this on a props change
    // eslint-disable-next-line
    [ props ]
  );

  const courseId = parseInt(props.match.params.courseId);
  if(isNaN(courseId)) {
    notification.error({
      message: 'Invalid Course ID',
      description: 'Course IDs contain only numbers.'
    });
    return <Redirect to="/dashboard/grades" />
  }

  const err = error[getUserId] || error[getCoursesId] || error[getRollupsId];
  if(err) {
    return <ConnectedErrorModal error={err} />;
  }

  if(!user || !courses || !outcomeRollups) {
    return <div align="center">
      <Spin size="default" />
    </div>
  }

  const course = props.courses.filter(c => c.id === courseId)[0];
  if(!course) {
    notification.error({
      message: 'Unknown Course',
      description: `Couldn't find a course with the specified ID.`
    });
    return <Redirect to="/dashboard/grades" />
  }

  const grade = calculateGradeFromOutcomes(
    { [courseId]: props.outcomeRollups[courseId] }
    )[courseId];
  const outcomes = props.outcomes[courseId];
  const rollupScores = props.outcomeRollups[courseId][0].scores;

  if(!grade || grade.grade === 'N/A') {
    return <div align="center">
      <Typography.Title level={3}>
        Grade Breakdown Isn't Available for {course.name}.
      </Typography.Title>
      <Link to="/dashboard/grades">
        <Button
          type="primary"
        >Back to Grades</Button>
      </Link>
    </div>
  }

  const { min, max } = gradeMapByGrade[grade.grade];

  function getLowestOutcome() {
    const rollupScore = rollupScores.filter(rs => rs.score === grade.lowestOutcome)[0];
    const outcome = outcomes.filter(o => o.id === parseInt(rollupScore.links.outcome))[0];
    return {
      outcome,
      rollupScore
    };
  }

  const lowestOutcome = getLowestOutcome();

  const outcomeTableData = rollupScores.map(rs => {
    const outcome = outcomes.filter(o => o.id === parseInt(rs.links.outcome))[0];
    return ({
      name: outcome.display_name || outcome.title,
      score: rs.score,
      lastAssignment: rs.title,
      timesAssessed: rs.count,
      key: outcome.id
    });
  });

  return(
    <div>
      <Typography.Title level={2}>Grade Breakdown for {course.name}</Typography.Title>
      <Row gutter={12}>
        <Col span={12}>
          <Card title={`Current Grade: ${grade.grade}`}>
            Your current grade, {grade.grade}, requires 75% of outcomes to be above {max} and
            no outcomes to be below {min}.
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={`Lowest Outcome: ${lowestOutcome.rollupScore.score}`}
          >
            Your lowest outcome is {lowestOutcome.outcome.display_name || lowestOutcome.outcome.title}, with
            a score of {lowestOutcome.rollupScore.score}. <br />
            This outcome's last assignment
            was {lowestOutcome.rollupScore.title}, and this outcome has been
            assessed {lowestOutcome.rollupScore.count} times. <br/>
            The lowest possible outcome for your current grade is {min}, and you're
            ~{+(lowestOutcome.rollupScore.score - min).toFixed(2)} points from it.
          </Card>
        </Col>
      </Row>

      <div style={{ padding: '15px' }} />

      <Typography.Title level={3}>Outcomes</Typography.Title>
      <Table
        columns={outcomeTableColumns}
        dataSource={outcomeTableData} />
      <Typography.Text type="secondary">
        Please note that these grades may not be accurate or representative of your real grade.
        For the most accurate and up-to-date information, please consult someone from your school.
      </Typography.Text>
    </div>
  )
}

const ConnectedGradeBreakdown = connect(state => ({
  loading: state.loading,
  error: state.error,
  courses: state.canvas.courses,
  token: state.canvas.token,
  subdomain: state.canvas.subdomain,
  outcomes: state.canvas.outcomes,
  outcomeRollups: state.canvas.outcomeRollups,
  user: state.canvas.user
}))(GradeBreakdown);

export default ConnectedGradeBreakdown;
