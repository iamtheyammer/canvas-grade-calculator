import {
  CANVAS_LOGOUT,
  CANVAS_GOT_USER_OAUTH,
  CANVAS_GOT_TOKEN_ENTRY,
  CANVAS_GOT_USER_PROFILE,
  CANVAS_GOT_USER_COURSES,
  CANVAS_GOT_OUTCOME_ROLLUPS_FOR_COURSE,
  CANVAS_GOT_OUTCOMES_FOR_COURSE
} from '../actions/canvas';

export default function canvas(state = {}, action) {
  switch(action.type) {
    case CANVAS_LOGOUT:
      return {};
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
      const test = action.courseId;
      return {
        ...state,
        ...{
          outcomes: {
              ...state.outcomes,
              ...{
                [test]: action.outcomes
              }
          },
          outcomeRollups: {
              ...state.outcomeRollups,
              ...{
                [test]: action.results
              }
            }
        }
      };
    case CANVAS_GOT_OUTCOMES_FOR_COURSE:
      // just for now
      return state;
    default:
      return state;
  }
}
