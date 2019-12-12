import React, { useState } from 'react';
import { Card, Typography, Icon } from 'antd';
import calculateMeanAverage from '../../../../util/calculateMeanAverage';
import roundNumberToDigits from '../../../../util/roundNumberToDigits';
import v4 from 'uuid/v4';
import { gradeMapByGrade } from '../../../../util/canvas/calculateGradeFromOutcomes';

const tabList = [
  {
    key: 'lowestOutcome',
    tab: 'Lowest Outcome'
  },
  {
    key: 'averageOutcomeScore',
    tab: 'Average Outcome Score'
  },
  {
    key: 'toGetAnA',
    tab: 'How To Get An A'
  },
  {
    key: 'moreInfo',
    tab: 'More Info'
  }
];

function CenteredStatisticWithText(props) {
  return (
    <div>
      <div align="center">
        <Typography.Title level={1}>{props.stat}</Typography.Title>
      </div>
      <Typography.Text>{props.text}</Typography.Text>
    </div>
  );
}

function OutcomeInfo(props) {
  const [activeTabKey, setActiveTabKey] = useState(tabList[0].key);

  const { lowestOutcome, outcomeRollupScores, grade } = props;

  const { min: AMin, max: AMax } = gradeMapByGrade['A'];
  const seventyFivePercentOfOutcomes = Math.floor(
    (75 * outcomeRollupScores.length) / 100
  );

  function generateCardContent(key) {
    switch (key) {
      case 'lowestOutcome':
        return (
          <CenteredStatisticWithText
            stat={lowestOutcome.rollupScore.score}
            text={`Your lowest outcome is ${lowestOutcome.outcome
              .display_name || lowestOutcome.outcome.title}, with a score of ${
              lowestOutcome.rollupScore.score
            }.\n
This outcome's last assignment was ${
              lowestOutcome.rollupScore.title
            }, and this outcome has been assessed ${
              lowestOutcome.rollupScore.count
            } times.`}
          />
        );
      case 'averageOutcomeScore':
        const meanOutcomeScore = roundNumberToDigits(
          calculateMeanAverage(outcomeRollupScores.map(or => or.score)),
          3
        );
        return (
          <CenteredStatisticWithText
            stat={meanOutcomeScore}
            text={`Your average outcome score is ${meanOutcomeScore}.`}
          />
        );
      case 'toGetAnA':
        if (grade.grade === 'A') {
          return (
            <div>
              <div align="center">
                <Typography.Title level={1}>Nice job!</Typography.Title>
              </div>
              <Typography.Text>
                You've already got an A in this class! To keep it, make sure 75%
                of outcome scores are over {AMax} and that no outcome scores
                drop below {AMin}.
              </Typography.Text>
            </div>
          );
        } else {
          return (
            <div>
              <Typography.Text>
                To get an A in this class, you'll need to make sure that:
              </Typography.Text>
              <ul>
                <li>
                  {lowestOutcome.lowestCountedOutcome > AMax && (
                    <Icon type="check-circle" />
                  )}{' '}
                  75% ({seventyFivePercentOfOutcomes}) of outcomes are above{' '}
                  {AMax} (currently,{' '}
                  {grade.sortedOutcomes.filter(o => o < AMax).length} outcomes
                  are not above {AMax})
                </li>
                <li>
                  {lowestOutcome.rollupScore.score >= AMin && (
                    <Icon type="check-circle" />
                  )}{' '}
                  No outcomes are below {AMin} (currently,{' '}
                  {grade.sortedOutcomes.filter(o => o < AMin).length} outcomes
                  are below {AMin})
                </li>
              </ul>
            </div>
          );
        }
      case 'moreInfo':
        const cardWithContent = content => (
          <Card.Grid key={v4()} hoverable="false">
            {content}
          </Card.Grid>
        );
        return [
          cardWithContent(
            `75% (rounded) of ${outcomeRollupScores.length} (number of outcomes with a grade) is ${seventyFivePercentOfOutcomes}.`
          ),
          cardWithContent(`More info is coming to this section in the future.`)
        ];
      default:
        return (
          <Typography.Text>
            There was an error: OutcomeInfo Default Case Used
          </Typography.Text>
        );
    }
  }

  return (
    <Card
      tabList={tabList}
      activeTabKey={activeTabKey}
      onTabChange={setActiveTabKey}
    >
      {generateCardContent(activeTabKey)}
    </Card>
  );
}

export default OutcomeInfo;
