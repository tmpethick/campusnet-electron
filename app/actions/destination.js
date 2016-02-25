export const DESTINATION_CHANGE = 'DESTINATION_CHANGE';

export function changeDestination(path) {
  return {
    type: DESTINATION_CHANGE,
    payload: {path}
  }
};
