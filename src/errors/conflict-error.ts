import { STATUS_CODES } from 'http';

import { HTTP_CODES, IError } from '../utils/types';

const { CONFLICT_409 } = HTTP_CODES;

export default class ConflictError extends Error implements IError {
  statusCode = CONFLICT_409;

  constructor(message?: string) {
    super(message || STATUS_CODES[CONFLICT_409]);
    this.name = 'ConflictError';
  }
}
