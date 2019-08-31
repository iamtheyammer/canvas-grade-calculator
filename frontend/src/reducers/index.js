import { combineReducers } from 'redux';

import canvas from './canvas';
import error from './error';
import loading from './loading';

export default combineReducers({
  canvas,
  error,
  loading
});
