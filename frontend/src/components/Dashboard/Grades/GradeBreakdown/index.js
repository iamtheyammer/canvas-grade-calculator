import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import v4 from 'uuid/v4';
import moment from 'moment';

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

import {
  getOutcomeResultsForCourse,
  getUserCourses,
  getUser,
  getAssignmentsForCourse,
  getOutcomeRollupsAndOutcomesForCourse
} from '../../../../actions/canvas';
import calculateGradeFromOutcomes, {
  gradeMapByGrade
} from '../../../../util/canvas/calculateGradeFromOutcomes';

import { desc } from '../../../../util/stringSorter';
import ConnectedErrorModal from '../../ErrorModal';
import { ReactComponent as PopOutIcon } from '../../../../assets/pop_out.svg';

const outcomeTableColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => desc(a.name, b.name),
    render: (text, item) => (
      <div>
        <Typography.Text>{text}</Typography.Text>
        <span style={{ width: '7px', display: 'inline-block' }} />
        {item.timesAssessed < 4 && (
          <Popover
            title="Below 4 Assessments"
            placement="topLeft"
            content={
              <Typography.Text>
                This outcome has only been assessed {item.timesAssessed} time
                {item.timesAssessed !== 1 && 's'}.
                <br />
                Outcomes must be assessed 4 or more times to count in your real
                grade.
                <br />
                It's still counted here, though.
              </Typography.Text>
            }
          >
            <Icon type="info-circle" />
          </Popover>
        )}
      </div>
    )
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

const assignmentTableOutcomes = [
  {
    title: 'Assignment Name',
    dataIndex: 'assignmentName',
    key: 'assignmentName'
  },
  {
    title: 'Score',
    dataIndex: 'score',
    key: 'score',
    render: score => `${score.score}/${score.possible} (${score.percent}%)`
  },
  {
    title: 'Last Submission',
    dataIndex: 'lastSubmission',
    key: 'lastSubmission'
  },
  {
    title: 'Mastery Reached',
    dataIndex: 'masteryReached',
    key: 'masteryReached',
    render: mastery => (
      <div style={{ margin: 'auto' }}>
        {mastery === true ? <Icon type="check" /> : <Icon type="close" />}
      </div>
    )
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (text, record) => (
      <div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={record.assignmentUrl}
        >
          Open on Canvas <Icon component={PopOutIcon} />
        </a>
      </div>
    )
  }
];

function GradeBreakdown(props) {
  const [getUserId, setGetUserId] = useState('');
  const [getCoursesId, setGetCoursesId] = useState('');
  const [getRollupsId, setGetRollupsId] = useState('');
  const [getResultsId, setGetResultsId] = useState('');
  const [getAssignmentsId, setGetAssignmentsId] = useState('');

  const [loadingText, setLoadingText] = useState('');

  const {
    dispatch,
    token,
    subdomain,
    loading,
    error,
    user,
    courses,
    outcomeRollups,
    outcomeResults,
    assignments
  } = props;

  const err =
    error[getUserId] ||
    error[getCoursesId] ||
    error[getRollupsId] ||
    error[getResultsId] ||
    error[getAssignmentsId];

  useEffect(
    () => {
      // loading before fetch because we don't want to request twice
      if (
        loading.includes(getCoursesId) ||
        loading.includes(getRollupsId) ||
        loading.includes(getUserId) ||
        err
      ) {
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

      if (!outcomeRollups && !getRollupsId) {
        const id = v4();
        dispatch(
          getOutcomeRollupsAndOutcomesForCourse(
            id,
            user.id,
            courseId,
            token,
            subdomain
          )
        );
        setLoadingText('your grades');
        setGetRollupsId(id);
      }

      if ((!outcomeResults || !outcomeResults[courseId]) && !getResultsId) {
        const id = v4();
        dispatch(
          getOutcomeResultsForCourse(id, user.id, courseId, token, subdomain)
        );
        setLoadingText('your grade in this class');
        setGetResultsId(id);
      }

      if ((!assignments || !assignments[courseId]) && !getAssignmentsId) {
        const id = v4();
        dispatch(getAssignmentsForCourse(id, courseId, token, subdomain));
        setLoadingText('your assignments');
        setGetAssignmentsId(id);
      }
    },
    // disabling because we specifically only want to re-run this on a props change
    // eslint-disable-next-line
    [props]
  );

  const courseId = parseInt(props.match.params.courseId);
  if (isNaN(courseId)) {
    notification.error({
      message: 'Invalid Course ID',
      description: 'Course IDs contain only numbers.'
    });
    return <Redirect to="/dashboard/grades" />;
  }

  if (
    !user ||
    !courses ||
    !outcomeRollups ||
    !outcomeResults ||
    !outcomeResults[courseId] ||
    !assignments ||
    !assignments[courseId]
  ) {
    return (
      <div align="center">
        <Spin size="default" />
        <span style={{ marginTop: '10px' }} />
        <Typography.Title level={3}>
          {`Loading ${loadingText}...`}
        </Typography.Title>
      </div>
    );
  }

  if (err) {
    return <ConnectedErrorModal error={err} />;
  }

  const course = props.courses.filter(c => c.id === courseId)[0];
  if (!course) {
    notification.error({
      message: 'Unknown Course',
      description: `Couldn't find a course with the specified ID.`
    });
    return <Redirect to="/dashboard/grades" />;
  }

  const grade = calculateGradeFromOutcomes({
    [courseId]: props.outcomeRollups[courseId]
  })[courseId];
  const outcomes = props.outcomes[courseId];
  const rollupScores = props.outcomeRollups[courseId][0].scores;

  if (!grade || grade.grade === 'N/A') {
    return (
      <div align="center">
        <Typography.Title level={3}>
          Grade Breakdown Isn't Available for {course.name}.
        </Typography.Title>
        <Link to="/dashboard/grades">
          <Button type="primary">Back to Grades</Button>
        </Link>
      </div>
    );
  }

  const { min, max } = gradeMapByGrade[grade.grade];

  function getLowestOutcome() {
    const rollupScore = rollupScores.filter(
      rs => rs.score === grade.lowestOutcome
    )[0];
    const outcome = outcomes.filter(
      o => o.id === parseInt(rollupScore.links.outcome)
    )[0];
    return {
      outcome,
      rollupScore
    };
  }

  const lowestOutcome = getLowestOutcome();

  const results = outcomeResults[courseId];

  const outcomeTableData = rollupScores.map(rs => {
    const outcome = outcomes.filter(
      o => o.id === parseInt(rs.links.outcome)
    )[0];
    return {
      name: outcome.display_name || outcome.title,
      score: rs.score,
      lastAssignment: rs.title,
      timesAssessed: rs.count,
      key: outcome.id,
      id: outcome.id,
      assignmentTableData: results
        .filter(or => parseInt(or.links.learning_outcome) === outcome.id)
        .map(r => {
          const linkedAssignmentId = parseInt(r.links.assignment.split('_')[1]);
          const assignment = assignments[courseId].filter(
            a => a.id === linkedAssignmentId
          )[0];
          return {
            assignmentName: assignment ? assignment.name : 'unavailable',
            assignmentUrl: assignment ? assignment.html_url : 'unavailable',
            score: {
              score: r.score,
              possible: r.possible,
              percent: r.percent * 100
            },
            lastSubmission: moment(r.submitted_or_assessed_at).calendar(),
            masteryReached: r.mastery,
            key: linkedAssignmentId
          };
        })
    };
  });

  return (
    <div>
      <Typography.Title level={2}>
        Grade Breakdown for {course.name}
      </Typography.Title>
      <Row gutter={12}>
        <Col span={12}>
          <Card title={`Current Grade`}>
            <div>
              <div align="center">
                <Typography.Title level={1}>{grade.grade}</Typography.Title>
              </div>
              <Typography.Text>
                Your current grade, {grade.grade}, requires 75% of outcomes to
                be above {max} and no outcomes to be below {min}.
              </Typography.Text>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Lowest Outcome">
            <div align="center">
              <Typography.Title level={1}>
                {lowestOutcome.rollupScore.score}
              </Typography.Title>
            </div>
            <Typography.Text>
              Your lowest outcome is{' '}
              {lowestOutcome.outcome.display_name ||
                lowestOutcome.outcome.title}
              , with a score of {lowestOutcome.rollupScore.score}. <br />
              This outcome's last assignment was{' '}
              {lowestOutcome.rollupScore.title}, and this outcome has been
              assessed {lowestOutcome.rollupScore.count} times. <br />
              The lowest possible outcome for your current grade is {min}, and
              you're ~{+(lowestOutcome.rollupScore.score - min).toFixed(2)}{' '}
              points from it.
            </Typography.Text>
          </Card>
        </Col>
      </Row>

      <div style={{ padding: '15px' }} />

      <Typography.Title level={3}>Outcomes</Typography.Title>
      <Table
        columns={outcomeTableColumns}
        dataSource={outcomeTableData}
        expandedRowRender={record =>
          record.assignmentTableData.length > 0 ? (
            <Table
              columns={assignmentTableOutcomes}
              dataSource={record.assignmentTableData}
            />
          ) : (
            <Typography.Text>
              Couldn't get assignments for this outcome.
            </Typography.Text>
          )
        }
      />
      <Typography.Text type="secondary">
        Please note that these grades may not be accurate or representative of
        your real grade. For the most accurate and up-to-date information,
        please consult someone from your school.
      </Typography.Text>
    </div>
  );
}

const ConnectedGradeBreakdown = connect(state => ({
  loading: state.loading,
  error: state.error,
  courses: state.canvas.courses,
  token: state.canvas.token,
  subdomain: state.canvas.subdomain,
  outcomes: state.canvas.outcomes,
  outcomeRollups: state.canvas.outcomeRollups,
  outcomeResults: state.canvas.outcomeResults,
  assignments: state.canvas.assignments,
  user: state.canvas.user
}))(GradeBreakdown);

export default ConnectedGradeBreakdown;
