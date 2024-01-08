import express from 'express';

import { TControllerParameters } from '../utils/types';
import { ERROR_MESSAGES } from '../utils/constants';

/** мидлвар обработчик json (вместе с тем, для отлова синтаксических ошибок в теле запроса) */
export default function bodyParserMiddleware(
  ...[req, res, next]: TControllerParameters
) {
  express.json()(req, res, (err) => {
    if (err) {
      if (err instanceof SyntaxError) {
        return next(
          new SyntaxError(ERROR_MESSAGES.GENERAL.VALIDATION.SYNTAX_JSON),
        );
      }
      return next(err);
    }
    return next();
  });
}
