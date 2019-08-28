import {
  CANVAS_FETCH_USER,
  CANVAS_GET_USER_TOKEN,
  CANVAS_GET_USER_PROFILE_ERROR,
  CANVAS_GOT_USER_PROFILE
} from '../actions/canvas';

export default function canvas(state = {}, action) {
  switch(action.type) {
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
    default:
      return state;
  }
}
