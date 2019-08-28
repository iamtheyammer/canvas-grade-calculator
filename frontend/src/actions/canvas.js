import axios from 'axios';

export const CANVAS_FETCH_USER = 'CANVAS_FETCH_USER';
export const CANVAS_GET_USER_TOKEN = 'CANVAS_GET_USER_TOKEN';
export const CANVAS_GOT_USER_PROFILE = 'CANVAS_GOT_USER_PROFILE';
export const CANVAS_GET_USER_PROFILE_ERROR = 'CANVAS_GET_USER_PROFILE_ERROR';

export function handleFetchUser() {
  return dispatch => {
    // some logic to do so
  }
}

export function getUserToken(token) {
  return {
    type: CANVAS_GET_USER_TOKEN,
    token
  }
}

function gotUser(user) {
  return {
    type: CANVAS_GOT_USER_PROFILE,
    user
  }
}

function getUserError(error) {
  return {
    type: CANVAS_GET_USER_PROFILE_ERROR,
    error
  }
}

export function getUser(token) {
  return async dispatch => {
    try {
      const userRes = await axios({
        method: 'get',
        url: 'http://localhost:8000/api/canvas/users/profile/self',
        headers: {
          'X-Canvas-Token': token
        }
      });
      return dispatch(gotUser(userRes.data))
    } catch(e) {
      return dispatch(getUserError(e));
    }
  }
}
