import { LOADING_START, LOADING_END } from '../actions/loading';

export default function loading(state = [], action) {
  switch (action.type) {
    case LOADING_START:
      return state.concat([action.id]);
    case LOADING_END:
      return state.filter(id => id !== action.id);
    default:
      return state;
  }
}
