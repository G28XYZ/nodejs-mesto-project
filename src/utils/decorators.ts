import { STATUS_CODES } from 'http';

import Errors from '../errors';
import {
  HTTP_CODES,
  TController,
  TControllerParameters,
  TDecoratorMethod,
  TError,
} from './types';

import InternalError from '../errors/internal-error';
import ConflictError from '../errors/conflict-error';

import { ERROR_MESSAGES } from './constants';

const { INTERNAL_SERVER_ERROR_500, CONFLICT_409 } = HTTP_CODES;

/** декоратор для перехвата ошибок в контроллерах */
export default function catchError<T extends InstanceType<TError>>(
  errors?: Partial<{ [key in HTTP_CODES]: string }>,
  errorInstance?: T,
): TDecoratorMethod {
  return (_, __, descriptor) => {
    const originalMethod = descriptor.value;
    async function fn(
      this: new () => TController,
      ...args: TControllerParameters
    ) {
      const [_req, _res, next] = args;
      let result;
      try {
        result = await originalMethod.apply(this, args);
      } catch (e: any) {
        const { message, name } = e;
        if (name in Errors) {
          const error = new Errors[name]();
          // prettier-ignore
          error.message = errors && error.statusCode in errors ? errors[error.statusCode] : message;
          return next(error);
        }

        if (e.code === 11000) {
          return next(
            // prettier-ignore
            new ConflictError(errors?.[CONFLICT_409] || ERROR_MESSAGES.USER.CREATE[CONFLICT_409]),
          );
        }

        if (errorInstance) return next(errorInstance);
        // prettier-ignore
        return next(new InternalError(message || STATUS_CODES[INTERNAL_SERVER_ERROR_500]));
      }
      return result;
    }
    const desc = descriptor;
    desc.value = fn;
    return desc;
  };
}
