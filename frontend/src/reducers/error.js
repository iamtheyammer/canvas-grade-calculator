import { CANVAS_PROXY_ERROR } from '../actions/error';

export default function error(state = {}, action) {
  switch (action.type) {
    case CANVAS_PROXY_ERROR:
      return {
        ...state,
        [action.id]: {
          res: action.res
        }
      };
    default:
      return state;
  }
}
