import makeCanvasRequest from '../util/canvas/makeCanvasRequest';

import { canvasProxyError } from './error';

import {
  startLoading,
  endLoading
} from './loading';

export const CANVAS_LOGOUT = 'CANVAS_LOGOUT';

export const CANVAS_GET_USER_TOKEN = 'CANVAS_GET_USER_TOKEN';
export const CANVAS_GOT_USER_OAUTH = 'CANVAS_GOT_USER_OAUTH';

export const CANVAS_GOT_USER_SUBDOMAIN = 'CANVAS_GOT_USER_SUBDOMAIN';
export const CANVAS_GOT_USER_PROFILE = 'CANVAS_GOT_USER_PROFILE';

export const CANVAS_GOT_USER_COURSES = 'CANVAS_GOT_USER_COURSES';

export const CANVAS_GOT_OUTCOMES_FOR_COURSE = 'CANVAS_GOT_OUTCOME_ROLLUPS_FOR_COURSE';

export const CANVAS_GOT_OUTCOME_ROLLUPS_FOR_COURSE = 'CANVAS_GOT_OUTCOME_ROLLUPS_FOR_COURSE';

export function logout() {
  localStorage.token = '';
  localStorage.subdomain = '';
  return {
    type: CANVAS_LOGOUT
  }
}

export function getUserToken(token) {
  localStorage.token = token;
  return {
    type: CANVAS_GET_USER_TOKEN,
    token
  }
}

export function gotUserOAuth(token, refreshToken) {
  localStorage.token = token;
  localStorage.refreshToken = refreshToken;
  return {
    type: CANVAS_GOT_USER_OAUTH,
    token,
    refreshToken
  }
}

export function gotUserSubdomain(subdomain) {
  localStorage.subdomain = subdomain;
  return {
    type: CANVAS_GOT_USER_SUBDOMAIN,
    subdomain
  }
}

function gotUser(user) {
  return {
    type: CANVAS_GOT_USER_PROFILE,
    user
  }
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
      dispatch(gotUser(userRes.data))
    } catch (e) {
      dispatch(canvasProxyError(id, e.response));
    }
    dispatch(endLoading(id));
  }
}

function gotUserCourses(courses) {
  return {
    type: CANVAS_GOT_USER_COURSES,
    courses
  }
}

export function getUserCourses(id, token, subdomain) {
  return async dispatch => {
    dispatch(startLoading(id));
    try {
      const userRes = await makeCanvasRequest(
        'courses',
        token,
        subdomain
      );
      dispatch(gotUserCourses(userRes.data))
    } catch(e) {
      dispatch(canvasProxyError(id, e.response));
    }
    dispatch(endLoading(id));
  }
}

function gotOutcomeRollupsForCourse(results, outcomes, courseId) {
  return {
    type: CANVAS_GOT_OUTCOME_ROLLUPS_FOR_COURSE,
    results,
    outcomes,
    courseId
  }
}

export function getOutcomeRollupsForCourse(id, userId, courseId, token, subdomain) {
  return async dispatch => {
    dispatch(startLoading(id));
    try {
      const outcomeResults = await makeCanvasRequest(
        `courses/${courseId}/outcome_rollups`,
        token,
        subdomain,
        {
          'include[]': '"outcomes"',
          userId
        }
      );
      dispatch(gotOutcomeRollupsForCourse(
        outcomeResults.data.rollups,
        outcomeResults.data.linked['"outcomes"'],
        courseId
      ))
    } catch (e) {
      dispatch(canvasProxyError(id, e.response));
    }
    dispatch(endLoading(id));
  }
}

function gotOutcomesForCourse(results, outcomes) {
  return {
    type: CANVAS_GOT_OUTCOMES_FOR_COURSE,
    outcomes,
    results
  }
}

export function getOutcomesForCourse(id, userId, courseId, token, subdomain) {
  return async dispatch => {
    dispatch(startLoading(id));
    try {
      const outcomeResults = await makeCanvasRequest(
        `courses/${courseId}/outcome_results`,
        token,
        subdomain,
        {
          'include[]': '"outcomes"',
          userId
        }
      );
      dispatch(gotOutcomesForCourse(
        outcomeResults.data.outcome_results,
        outcomeResults.data.linked['"outcomes"'],
        courseId
      ))
    } catch (e) {
      dispatch(canvasProxyError(id, e.response));
    }
    dispatch(endLoading(id));
  }
}
