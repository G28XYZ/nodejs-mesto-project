import jwt from 'jsonwebtoken';

import { TSessionRequest, TUserCtrlParams } from '../utils/types';
import { DEFAULT_JWT_SECRET, ERROR_MESSAGES } from '../utils/constants';
import UnauthorizedError from '../errors/unauthorized-error';

const { JWT_SECRET = DEFAULT_JWT_SECRET } = process.env;

const verifyToken = <T extends TSessionRequest['user']>(token: string) => {
  try {
    return <T>jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return undefined;
  }
};

export default async function authProtect(...[req, _, next]: TUserCtrlParams) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError(ERROR_MESSAGES.USER.VALIDATION.AUTH));
  }

  const payload = verifyToken(authorization.replace('Bearer ', ''));

  if (!payload) {
    return next(new UnauthorizedError(ERROR_MESSAGES.USER.VALIDATION.AUTH));
  }

  req.user = payload;

  return next();
}
