import { STATUS_CODES } from 'http';

import { HTTP_CODES, IError } from '../utils/types';

const { UNAUTHORIZED_401 } = HTTP_CODES;

export default class UnauthorizedError extends Error implements IError {
  statusCode = UNAUTHORIZED_401;

  constructor(message?: string) {
    super(message || STATUS_CODES[UNAUTHORIZED_401]);
    this.name = 'UnauthorizedError';
  }
}
