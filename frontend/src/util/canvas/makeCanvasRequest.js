import axios from 'axios';

export default (path, token, subdomain = 'canvas', query = {}) => axios({
  method: 'get',
  url: `http://localhost:8000/api/canvas/${path}`,
  headers: {
    'X-Canvas-Token': token,
    'X-Canvas-Subdomain': subdomain
  },
  params: query
});
