
export const VALIDATION_ERROR = 'VALIDATION_ERROR';
export const UNKNOWN_ERROR = 'UNKNOWN_ERROR';

export default class CampusError extends Error {
  type = VALIDATION_ERROR;

  constructor(message, type) {
    super();
    this.message = message;
    this.type = type;
  }
}
