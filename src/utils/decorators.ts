import { STATUS_CODES } from 'http';

import Errors from '../errors';
import {
  HTTP_CODES,
  TController,
  TControllerParameters,
  TDecoratorMethod,
} from './types';
import InternalError from '../errors/internal-error';

const { INTERNAL_SERVER_ERROR_500 } = HTTP_CODES;
/** декоратор для перехвата ошибок в контроллерах */
export default function catchError<T extends Error & { statusCode: number }>(
  errors?: Record<number, string>,
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
          const error = new Errors[name]() as T;
          // prettier-ignore
          error.message = errors && error.statusCode in errors ? errors[error.statusCode] : message;
          return next(error);
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
