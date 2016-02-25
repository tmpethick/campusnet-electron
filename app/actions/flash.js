export const FLASH_ADD = 'FLASH_ADD';
export const FLASH_REMOVE = 'FLASH_REMOVE';

export function flashMessage(message, type) {
  return {
    type: FLASH_ADD,
    payload: {message, type}
  }
};

export function removeMessage(message, type) {
  return {
    type: FLASH_REMOVE,
    payload: {message, type}
  }
};

export function flashMessageFor(message, type, time=3000) {
  return (dispatch, getState) => {
    dispatch(flashMessage(message, type));
    setTimeout(function() {
      dispatch(removeMessage(message, type));
    }, time);
  };
};
