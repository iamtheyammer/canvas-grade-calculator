import React, { useState } from 'react';
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
  Table
} from 'antd';

import { getUserCourses } from '../../../../actions/canvas';
import calculateGradeFromOutcomes, { gradeMapByGrade } from '../../../../util/canvas/calculateGradeFromOutcomes';

import { desc } from '../../../../util/stringSorter';

const outcomeTableColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => desc(a.name, b.name)
  },
  {
    title: 'Score',
    dataIndex: 'score',
    key: 'score',
    sorter: (a, b) => a.score - b.score
  },
  {
    title: 'Last Assignment',
    dataIndex: 'lastAssignment',
    key: 'lastAssignment',
    sorter: (a, b) => desc(a.lastAssignment, b.lastAssignment)
  }
];

function GradeBreakdown(props) {
  const [ getCoursesId, setGetCoursesId ] = useState('');

  if(!props.courses) {
    const id = v4();
    setGetCoursesId(id);
    props.dispatch(getUserCourses(id, props.token, props.subdomain));
  }

  if(props.loading.includes(getCoursesId)) {
    return <div align="center">
      <Spin size="medium" />
    </div>
  }

  const courseId = parseInt(props.match.params.courseId);
  if(isNaN(courseId)) {
    notification.error({
      message: 'Invalid Course ID',
      description: 'Course IDs contain only numbers.'
    });
    return <Redirect to="/dashboard/grades" />
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

  const { min, max } = gradeMapByGrade[grade.grade];

  if(!grade || grade.grade === 'N/A') {
    return <div align="center">
      <Typography.Title level={3}>
        Grade Breakdown Isn't Available for {course.name}.
      </Typography.Title>
      <div style={{ padding: '20px' }} />
      <Link to="/dashboard/grades">
        <Button
          type="primary"
        >Back to Grades</Button>
      </Link>
    </div>
  }

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
      name: outcome.display_name,
      score: rs.score,
      lastAssignment: rs.title,
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
            Your lowest outcome is {lowestOutcome.outcome.display_name}, with
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
  outcomeRollups: state.canvas.outcomeRollups
}))(GradeBreakdown);

export default ConnectedGradeBreakdown;
