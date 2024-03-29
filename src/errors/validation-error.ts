import { STATUS_CODES } from 'http';

import { HTTP_CODES, IError } from '../utils/types';

const { BAD_REQUEST_400 } = HTTP_CODES;

export default class ValidationError extends Error implements IError {
  statusCode = BAD_REQUEST_400;

  constructor(message?: string) {
    super(message || STATUS_CODES[BAD_REQUEST_400]);
    this.name = 'ValidationError';
  }
}
