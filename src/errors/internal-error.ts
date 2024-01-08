import { STATUS_CODES } from 'http';

import { HTTP_CODES, IError } from '../utils/types';

const { INTERNAL_SERVER_ERROR_500 } = HTTP_CODES;

export default class InternalError extends Error implements IError {
  statusCode = INTERNAL_SERVER_ERROR_500;

  constructor(message?: string) {
    super(message || STATUS_CODES[INTERNAL_SERVER_ERROR_500]);
    this.name = 'InternalError';
  }
}
