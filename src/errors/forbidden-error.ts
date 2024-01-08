import { STATUS_CODES } from 'http';

import { HTTP_CODES, IError } from '../utils/types';

const { FORBIDDEN_403 } = HTTP_CODES;

export default class ForbiddenError extends Error implements IError {
  statusCode = FORBIDDEN_403;

  constructor(message?: string) {
    super(message || STATUS_CODES[FORBIDDEN_403]);
    this.name = 'ForbiddenError';
  }
}
