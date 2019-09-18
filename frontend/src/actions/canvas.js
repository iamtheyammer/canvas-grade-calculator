import makeCanvasRequest from '../util/canvas/makeCanvasRequest';

import { canvasProxyError } from './error';

import { startLoading, endLoading } from './loading';

export const CANVAS_LOGOUT = 'CANVAS_LOGOUT';

export const CANVAS_GOT_STORED_CREDENTIALS = 'CANVAS_GOT_STORED_CREDENTIALS';

export const CANVAS_GOT_TOKEN_ENTRY = 'CANVAS_GOT_TOKEN_ENTRY';
export const CANVAS_GOT_USER_OAUTH = 'CANVAS_GOT_USER_OAUTH';

export const CANVAS_GOT_NEW_TOKEN_FROM_REFRESH_TOKEN =
  'CANVAS_GOT_NEW_TOKEN_FROM_REFRESH_TOKEN';

export const CANVAS_GOT_USER_PROFILE = 'CANVAS_GOT_USER_PROFILE';

export const CANVAS_GOT_USER_COURSES = 'CANVAS_GOT_USER_COURSES';

export const CANVAS_GOT_OUTCOME_RESULTS_FOR_COURSE =
  'CANVAS_GOT_OUTCOME_RESULTS_FOR_COURSE';

export const CANVAS_GOT_OUTCOME_ROLLUPS_FOR_COURSE =
  'CANVAS_GOT_OUTCOME_ROLLUPS_FOR_COURSE';

export const CANVAS_GOT_OUTCOME_ROLLUPS_AND_OUTCOMES_FOR_COURSE =
  'CANVAS_GOT_OUTCOME_ROLLUPS_AND_OUTCOMES_FOR_COURSE';

export const CANVAS_GOT_ASSIGNMENTS_FOR_COURSE =
  'CANVAS_GOT_ASSIGNMENTS_FOR_COURSE';

function loggedOut(forwardUrl, error) {
  localStorage.token = '';
  localStorage.subdomain = '';
  localStorage.refreshToken = '';

  if (forwardUrl.length > 1) {
    window.location = forwardUrl;
  }

  return {
    type: CANVAS_LOGOUT,
    forwardUrl
  };
}

export function logout(token, subdomain) {
  return async dispatch => {
    try {
      const forwardUrl = await makeCanvasRequest(
        'oauth2/token',
        token,
        subdomain,
        {},
        'delete'
      ).then(res => res.data.forward_url);
      dispatch(loggedOut(forwardUrl || ''));
    } catch (e) {
      // errors don't really matter
      dispatch(loggedOut('', e));
    }
  };
}

export function gotStoredCredentials(token, refreshToken, subdomain) {
  return {
    type: CANVAS_GOT_STORED_CREDENTIALS,
    token,
    refreshToken,
    subdomain
  };
}

export function gotUserTokenEntry(token, subdomain) {
  localStorage.token = token;
  localStorage.subdomain = subdomain;
  return {
    type: CANVAS_GOT_TOKEN_ENTRY,
    token,
    subdomain
  };
}

export function gotUserOAuth(token, refreshToken, subdomain) {
  localStorage.token = token;
  localStorage.refreshToken = refreshToken;
  localStorage.subdomain = subdomain;
  return {
    type: CANVAS_GOT_USER_OAUTH,
    token,
    refreshToken,
    subdomain
  };
}

function gotNewTokenFromRefreshToken(newToken) {
  return {
    type: CANVAS_GOT_NEW_TOKEN_FROM_REFRESH_TOKEN,
    newToken
  };
}

export function getNewTokenFromRefreshToken(id, subdomain, refreshToken) {
  return async dispatch => {
    dispatch(startLoading(id));
    try {
      const newTokenRes = await makeCanvasRequest(
        'oauth2/refresh_token',
        '',
        subdomain,
        { refresh_token: refreshToken }
      ).then(res => res.data.access_token);
      localStorage.token = newTokenRes;
      dispatch(gotNewTokenFromRefreshToken(newTokenRes));

      // reloading is the easiest way to just start over with a solid token.
      window.location.reload();
    } catch (e) {
      dispatch(canvasProxyError(id, e.response));
    }
    dispatch(endLoading(id));
  };
}

function gotUser(user) {
  return {
    type: CANVAS_GOT_USER_PROFILE,
    user
  };
}

export function getUser(id, token, subdomain) {
  return async dispatch => {
    dispatch(startLoading(id));
    try {
      const userRes = await makeCanvasRequest(
        'users/profile/self',
        token,
        subdomain
      );
      dispatch(gotUser(userRes.data));
    } catch (e) {
      dispatch(canvasProxyError(id, e.response));
    }
    dispatch(endLoading(id));
  };
}

function gotUserCourses(courses) {
  return {
    type: CANVAS_GOT_USER_COURSES,
    courses
  };
}

export function getUserCourses(id, token, subdomain) {
  return async dispatch => {
    dispatch(startLoading(id));
    try {
      const userRes = await makeCanvasRequest('courses', token, subdomain);
      dispatch(gotUserCourses(userRes.data));
    } catch (e) {
      dispatch(canvasProxyError(id, e.response));
    }
    dispatch(endLoading(id));
  };
}

function gotOutcomeRollupsAndOutcomesForCourse(results, outcomes, courseId) {
  return {
    type: CANVAS_GOT_OUTCOME_ROLLUPS_AND_OUTCOMES_FOR_COURSE,
    results,
    outcomes,
    courseId
  };
}

export function getOutcomeRollupsAndOutcomesForCourse(
  id,
  userId,
  courseId,
  token,
  subdomain
) {
  return async dispatch => {
    dispatch(startLoading(id));
    try {
      const outcomeResults = await makeCanvasRequest(
        `courses/${courseId}/outcome_rollups`,
        token,
        subdomain,
        {
          userId
        }
      );
      // get outcomes
      const outcomesToGet = [];
      outcomeResults.data.rollups.forEach(r => {
        r.scores.forEach(s => outcomesToGet.push(s.links.outcome));
      });
      const outcomesRes = await Promise.all(
        outcomesToGet.map(otg =>
          makeCanvasRequest(`outcomes/${otg}`, token, subdomain).then(
            res => res.data
          )
        )
      );
      dispatch(
        gotOutcomeRollupsAndOutcomesForCourse(
          outcomeResults.data.rollups,
          outcomesRes,
          courseId
        )
      );
    } catch (e) {
      dispatch(canvasProxyError(id, e.response));
    }
    dispatch(endLoading(id));
  };
}

function gotOutcomeResultsForCourse(results, courseId) {
  return {
    type: CANVAS_GOT_OUTCOME_RESULTS_FOR_COURSE,
    results,
    courseId
  };
}

export function getOutcomeResultsForCourse(
  id,
  userId,
  courseId,
  token,
  subdomain
) {
  return async dispatch => {
    dispatch(startLoading(id));
    try {
      const outcomeResults = await makeCanvasRequest(
        `courses/${courseId}/outcome_results`,
        token,
        subdomain,
        {
          userId
        }
      );
      dispatch(
        gotOutcomeResultsForCourse(
          outcomeResults.data.outcome_results,
          courseId
        )
      );
    } catch (e) {
      dispatch(canvasProxyError(id, e.response));
    }
    dispatch(endLoading(id));
  };
}

function gotAssignmentsForCourse(assignments, courseId) {
  return {
    type: CANVAS_GOT_ASSIGNMENTS_FOR_COURSE,
    assignments,
    courseId
  };
}

export function getAssignmentsForCourse(id, courseId, token, subdomain) {
  return async dispatch => {
    dispatch(startLoading(id));
    try {
      const assignments = await makeCanvasRequest(
        `courses/${courseId}/assignments`,
        token,
        subdomain,
        {}
      );
      dispatch(gotAssignmentsForCourse(assignments.data, courseId));
    } catch (e) {
      dispatch(canvasProxyError(id, e.response));
    }
    dispatch(endLoading(id));
  };
}
