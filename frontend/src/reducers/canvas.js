import {
  CANVAS_LOGOUT,
  CANVAS_FETCH_USER,
  CANVAS_GET_USER_TOKEN,
  CANVAS_GET_USER_PROFILE_ERROR,
  CANVAS_GOT_USER_PROFILE,
  CANVAS_GET_USER_COURSES_ERROR,
  CANVAS_GOT_USER_COURSES,
  CANVAS_GOT_USER_SUBDOMAIN,
  CANVAS_GET_OUTCOME_ROLLUPS_FOR_COURSE_ERROR,
  CANVAS_GOT_OUTCOME_ROLLUPS_FOR_COURSE,
  CANVAS_GET_OUTCOMES_FOR_COURSE_ERROR,
  CANVAS_GOT_OUTCOMES_FOR_COURSE
} from '../actions/canvas';

export default function canvas(state = {}, action) {
  switch(action.type) {
    case CANVAS_LOGOUT:
      return {};
    case CANVAS_GET_USER_TOKEN:
      return {
        ...state,
        ...{
          token: action.token
        }
      };
    case CANVAS_GET_USER_PROFILE_ERROR:
      return {
        ...state,
        ...{
          user: { error: action.error }
        }
      };
    case CANVAS_GOT_USER_PROFILE:
      return {
        ...state,
        user: action.user
      };
    case CANVAS_GET_USER_COURSES_ERROR:
      return {
        ...state,
        courses: { error: action.error }
      };
    case CANVAS_GOT_USER_COURSES:
      return {
        ...state,
        courses: action.courses
      };
    case CANVAS_GOT_USER_SUBDOMAIN:
      return {
        ...state,
        subdomain: action.subdomain
      };
    case CANVAS_GET_OUTCOME_ROLLUPS_FOR_COURSE_ERROR:
      return state;
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
    case CANVAS_GET_OUTCOMES_FOR_COURSE_ERROR:
      return state;
    case CANVAS_GOT_OUTCOMES_FOR_COURSE:
      // just for now
      return state;
    default:
      return state;
  }
}
