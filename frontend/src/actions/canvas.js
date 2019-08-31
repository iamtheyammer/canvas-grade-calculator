import makeCanvasRequest from '../util/canvas/makeCanvasRequest';

export const CANVAS_LOGOUT = 'CANVAS_LOGOUT';

export const CANVAS_FETCH_USER = 'CANVAS_FETCH_USER';
export const CANVAS_GET_USER_TOKEN = 'CANVAS_GET_USER_TOKEN';
export const CANVAS_GOT_USER_OAUTH = 'CANVAS_GOT_USER_OAUTH';

export const CANVAS_GOT_USER_SUBDOMAIN = 'CANVAS_GOT_USER_SUBDOMAIN';
export const CANVAS_GOT_USER_PROFILE = 'CANVAS_GOT_USER_PROFILE';
export const CANVAS_GET_USER_PROFILE_ERROR = 'CANVAS_GET_USER_PROFILE_ERROR';

export const CANVAS_GOT_USER_COURSES = 'CANVAS_GOT_USER_COURSES';
export const CANVAS_GET_USER_COURSES_ERROR = 'CANVAS_GET_USER_COURSES_ERROR';

export const CANVAS_GOT_OUTCOMES_FOR_COURSE = 'CANVAS_GOT_OUTCOME_ROLLUPS_FOR_COURSE';
export const CANVAS_GET_OUTCOMES_FOR_COURSE_ERROR = 'CANVAS_GET_OUTCOMES_FOR_COURSE_ERROR';

export const CANVAS_GOT_OUTCOME_ROLLUPS_FOR_COURSE = 'CANVAS_GOT_OUTCOME_ROLLUPS_FOR_COURSE';
export const CANVAS_GET_OUTCOME_ROLLUPS_FOR_COURSE_ERROR = 'CANVAS_GET_OUTCOME_ROLLUPS_FOR_COURSE_ERROR';

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

function getUserError(error) {
  return {
    type: CANVAS_GET_USER_PROFILE_ERROR,
    error
  }
}

export function getUser(token, subdomain) {
  return async dispatch => {
    try {
      const userRes = await makeCanvasRequest(
        'users/profile/self',
        token,
        subdomain
      )
      return dispatch(gotUser(userRes.data))
    } catch(e) {
      return dispatch(getUserError(e));
    }
  }
}

function gotUserCourses(courses) {
  return {
    type: CANVAS_GOT_USER_COURSES,
    courses
  }
}

function getUserCoursesError(error) {
  return {
    type: CANVAS_GET_USER_COURSES_ERROR,
    error
  }
}

export function getUserCourses(token, subdomain) {
  return async dispatch => {
    try {
      const userRes = await makeCanvasRequest(
        'courses',
        token,
        subdomain
      );
      return dispatch(gotUserCourses(userRes.data))
    } catch(e) {
      return dispatch(getUserCoursesError(e));
    }
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

function getOutcomeRollupsForCourseError(error) {
  return {
    type: CANVAS_GET_OUTCOME_ROLLUPS_FOR_COURSE_ERROR,
    error
  }
}

export function getOutcomeRollupsForCourse(userId, courseId, token, subdomain) {
  return async dispatch => {
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
      return dispatch(gotOutcomeRollupsForCourse(
        outcomeResults.data.rollups,
        outcomeResults.data.linked['"outcomes"'],
        courseId
      ))
    } catch (e) {
      dispatch(getOutcomeRollupsForCourseError(e));
    }
  }
}

function gotOutcomesForCourse(results, outcomes) {
  return {
    type: CANVAS_GOT_OUTCOMES_FOR_COURSE,
    outcomes,
    results
  }
}

function getOutcomesForCourseError(error) {
  return {
    type: CANVAS_GET_OUTCOMES_FOR_COURSE_ERROR,
    error
  }
}

export function getOutcomesForCourse(userId, courseId, token, subdomain) {
  return async dispatch => {
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
      return dispatch(gotOutcomesForCourse(
        outcomeResults.data.outcome_results,
        outcomeResults.data.linked['"outcomes"'],
        courseId
      ))
    } catch (e) {
      dispatch(getOutcomesForCourseError(e));
    }
  }
}
