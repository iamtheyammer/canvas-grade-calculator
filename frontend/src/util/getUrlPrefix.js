import env from './env';

export default env.nodeEnv === 'development'
  ? 'http://localhost:8000'
  : env.defaultApiUri
  ? env.defaultApiUri
  : '';
