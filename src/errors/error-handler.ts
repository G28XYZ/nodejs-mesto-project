import { STATUS_CODES } from 'http';
import { CelebrateError, Joi, isCelebrateError } from 'celebrate';

import { HTTP_CODES, TErrorHandler } from '../utils/types';

const { INTERNAL_SERVER_ERROR_500 } = HTTP_CODES;

// prettier-ignore
const getCelebrateValidation = (err: CelebrateError) => (err.details.get('body')?.details as unknown as Joi.ValidationError['details'])[0];

const handleError: TErrorHandler = (err, _, res, next) => {
  // TODO - SyntaxError
  let statusCode = 0;
  let message = '';
  if (isCelebrateError(err)) {
    statusCode = 400;
    message = getCelebrateValidation(err).message;
  }
  statusCode = statusCode || err.statusCode || INTERNAL_SERVER_ERROR_500;
  message = (message || err.message || STATUS_CODES[statusCode]) as string;
  res.status(statusCode).send({ message });
  return next();
};

export default handleError;
