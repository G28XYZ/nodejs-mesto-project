import NotFoundError from './not-found-error';
import ValidationError from './validation-error';
import CastError from './cast-error';
import ForbiddenError from './forbidden-error';
import InternalError from './internal-error';
import SyntaxError from './syntax-error';

export default {
  NotFoundError,
  ValidationError,
  CastError,
  ForbiddenError,
  InternalError,
  SyntaxError,
} as Record<string, new <T extends Error>(message?: string) => T>;
