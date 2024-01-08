import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';

import {
  DEFAULT_BASE_PATH,
  DEFAULT_MONGO_DB_NAME,
  DEFAULT_MONGO_DB_PATH,
  DEFAULT_PORT,
} from './utils/constants';

import cardRouter from './routes/cards';
import userRouter from './routes/users';
import auth from './routes/auth';

import handleError from './errors/error-handler';
import NotFoundError from './errors/not-found-error';

import limiter from './middlewares/limiter';
import bodyParserMiddleware from './middlewares/body-parser-middleware';
import authProtect from './middlewares/auth-protect';
import { errorLogger, requestLogger } from './middlewares/logger';

const {
  PORT = DEFAULT_PORT,
  BASE_PATH = DEFAULT_BASE_PATH,
  DATABASE = `${DEFAULT_MONGO_DB_PATH}/${DEFAULT_MONGO_DB_NAME}`,
} = process.env;

const app = express();

app.use(bodyParserMiddleware);
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DATABASE);

app.use(helmet());
app.use(limiter);

app.use(requestLogger);

app.use('/', auth);
app.use(authProtect);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.all('*', (_, __, next) => next(new NotFoundError()));

app.use(errorLogger);
app.use(handleError);

app.listen(PORT, () => {
  console.table({
    PORT: `App listening on port ${PORT}`,
    ADDRESS: `App address ${BASE_PATH}:${PORT}`,
  });
});
