import UUID from 'uuid-js';

export const FLASH_ADD = 'FLASH_ADD';
export const FLASH_REMOVE = 'FLASH_REMOVE';

let dismissTimer;

export function flashMessage(message, type) {
  return {
    type: FLASH_ADD,
    payload: {message, type, id: UUID.create()}
  }
};

export function removeMessage(id) {
  return {
    type: FLASH_REMOVE,
    payload: {id}
  }
};

export function flashMessageFor(message, type, time=5000) {
  return (dispatch, getState) => {
    if (dismissTimer)
      clearTimeout(dismissTimer);
    const messageAction = flashMessage(message, type);
    dispatch(messageAction);
    dismissTimer = setTimeout(function() {
      dispatch(removeMessage(messageAction.payload.id));
    }, time);
  };
};
