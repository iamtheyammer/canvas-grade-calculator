export default process.env.NODE_ENV === 'development' ?
  'http://localhost:8000' :
  process.env.DEFAULT_API_URI ? 
    process.env.DEFAULT_API_URI : '';
