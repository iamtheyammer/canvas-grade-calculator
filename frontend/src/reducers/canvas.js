import {
  CANVAS_LOGOUT,
  CANVAS_GOT_USER_OAUTH,
  CANVAS_GOT_TOKEN_ENTRY,
  CANVAS_GOT_NEW_TOKEN_FROM_REFRESH_TOKEN,
  CANVAS_GOT_USER_PROFILE,
  CANVAS_GOT_USER_COURSES,
  CANVAS_GOT_OUTCOME_ROLLUPS_FOR_COURSE,
  CANVAS_GOT_OUTCOME_RESULTS_FOR_COURSE,
  CANVAS_GOT_OUTCOME_ROLLUPS_AND_OUTCOMES_FOR_COURSE,
  CANVAS_GOT_ASSIGNMENTS_FOR_COURSE,
  CANVAS_GOT_STORED_CREDENTIALS
} from '../actions/canvas';

export default function canvas(state = {}, action) {
  switch (action.type) {
    case CANVAS_LOGOUT:
      return {};
    case CANVAS_GOT_STORED_CREDENTIALS:
      return {
        ...state,
        ...{
          token: action.token,
          refreshToken: action.refreshToken,
          subdomain: action.subdomain
        }
      };
    case CANVAS_GOT_TOKEN_ENTRY:
      return {
        ...state,
        ...{
          token: action.token,
          subdomain: action.subdomain
        }
      };
    case CANVAS_GOT_USER_OAUTH:
      return {
        ...state,
        token: action.token,
        refreshToken: action.refreshToken,
        subdomain: action.subdomain
      };
    case CANVAS_GOT_NEW_TOKEN_FROM_REFRESH_TOKEN:
      return {
        ...state,
        token: action.newToken
      };
    case CANVAS_GOT_USER_PROFILE:
      return {
        ...state,
        user: action.user
      };
    case CANVAS_GOT_USER_COURSES:
      return {
        ...state,
        courses: action.courses
      };
    case CANVAS_GOT_OUTCOME_ROLLUPS_FOR_COURSE:
      const courseId = action.courseId;
      return {
        ...state,
        ...{
          outcomes: {
            ...state.outcomes,
            ...{
              [courseId]: action.outcomes
            }
          },
          outcomeRollups: {
            ...state.outcomeRollups,
            ...{
              [courseId]: action.results
            }
          }
        }
      };
    case CANVAS_GOT_OUTCOME_RESULTS_FOR_COURSE:
      return {
        ...state,
        ...{
          outcomeResults: {
            ...state.outcomeResults,
            [action.courseId]: action.results
          },
          outcomes: {
            ...state.outcomes
          }
        }
      };
    case CANVAS_GOT_OUTCOME_ROLLUPS_AND_OUTCOMES_FOR_COURSE:
      return {
        ...state,
        ...{
          outcomeRollups: {
            ...state.outcomeRollups,
            [action.courseId]: action.results
          },
          outcomes: {
            ...state.outcomes,
            [action.courseId]: action.outcomes
          }
        }
      };
    case CANVAS_GOT_ASSIGNMENTS_FOR_COURSE:
      return {
        ...state,
        ...{
          assignments: {
            ...state.assignments,
            [action.courseId]: action.assignments
          }
        }
      };
    default:
      return state;
  }
}
