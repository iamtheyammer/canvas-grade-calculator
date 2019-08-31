export const LOADING_START = 'LOADING_START';

export const LOADING_END = 'LOADING_END';

export function startLoading(id) {
  return {
    type: LOADING_START,
    id
  }
}

export function endLoading(id) {
  return {
    type: LOADING_END,
    id
  }
}
