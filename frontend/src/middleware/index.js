import logger from 'redux-logger';
import thunk from 'redux-thunk';

import { applyMiddleware } from 'redux';
import env from '../util/env';

const middlewares = [thunk];

if (env.nodeEnv === 'development') {
  middlewares.push(logger);
}

export default applyMiddleware(...middlewares);
