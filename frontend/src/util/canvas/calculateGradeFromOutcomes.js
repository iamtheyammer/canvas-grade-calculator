export default outcomeRollups => {
  const courseIds = Object.keys(outcomeRollups);

  const grades = {};

  courseIds.forEach(i => {
    const rollup = outcomeRollups[i];

    // array of outcomes for a specified class
    const scores = rollup[0].scores.map(s => s.score);

    grades[i] =
      scores.length > 0 ? getGradeFromOutcomes(scores) : { grade: 'N/A' };
  });

  return grades;
};

function getGradeFromOutcomes(outcomes) {
  // outcomes, ex: [1,2,3,4]

  // what is 75% of outcomes.length
  const outcomesOverMinNeeded = Math.ceil((75 * outcomes.length) / 100);

  // desc
  const sortedOutcomes = outcomes.sort((a, b) => b - a);
  // 75% of outcomes
  const countedOutcomes = sortedOutcomes.slice(0, outcomesOverMinNeeded);

  // lowest counted outcome
  const lowestCountedOutcome = countedOutcomes[countedOutcomes.length - 1];
  // lowest outcome (overall)
  const lowestOutcome = sortedOutcomes[sortedOutcomes.length - 1];

  // map lowest counted outcome to grade map
  for (let i = 0; i < gradeMap.length; i++) {
    // current available grade
    const grade = gradeMap[i][0];
    // not really max, but what all counted outcomes must be over
    const max = gradeMap[i][1][0];
    // what all outcomes must be over
    const min = gradeMap[i][1][1];

    // lowest outcome over minimum?
    if (lowestOutcome < min) {
      // one outcome is below min for this grade
      continue;
    }

    // counted outcomes must be above max, too
    if (lowestCountedOutcome < max) {
      // 75% of outcomes are not over max
      continue;
    }

    // student is eligible for this grade
    return {
      grade,
      sortedOutcomes,
      countedOutcomes,
      lowestCountedOutcome,
      lowestOutcome
    };
  }

  // we should never reach this point-- it would require a negative outcome
}

export const gradeMap = [
  ['A', [3.3, 3]],
  ['A-', [3.3, 2.5]],
  ['B+', [2.6, 2.5]],
  ['B', [2.6, 2.25]],
  ['B-', [2.6, 2.0]],
  ['C', [2.2, 0]],
  ['I', [0, 0]]
];

export const gradeMapByGrade = {
  A: { max: 3.3, min: 3 },
  'A-': { max: 3.3, min: 2.5 },
  'B+': { max: 2.6, min: 2.5 },
  B: { max: 2.6, min: 2.25 },
  'B-': { max: 2.6, min: 2 },
  C: { max: 2.2, min: 2 },
  I: { max: 0, min: 0 }
};
