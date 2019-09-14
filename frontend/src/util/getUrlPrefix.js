export default process.env.NODE_ENV === 'development'
  ? 'http://localhost:8000'
  : process.env.REACT_APP_DEFAULT_API_URI
  ? process.env.REACT_APP_DEFAULT_API_URI
  : '';
