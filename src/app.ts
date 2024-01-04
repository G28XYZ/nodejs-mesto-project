import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';

import {
  DEFAULT_BASE_PATH,
  DEFAULT_MONGO_DB_NAME,
  DEFAULT_MONGO_DB_PATH,
  DEFAULT_PORT,
} from './utils/constants';

import cardRouter from './routes/cards';
import userRouter from './routes/users';
import handleError from './errors/error-handler';
import NotFoundError from './errors/not-found-error';
import defineUser from './middlewares/hard-code-user';

const {
  PORT = DEFAULT_PORT,
  BASE_PATH = DEFAULT_BASE_PATH,
  DATABASE = `${DEFAULT_MONGO_DB_PATH}/${DEFAULT_MONGO_DB_NAME}`,
} = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DATABASE);

app.use(defineUser);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.all('*', (_, __, next) => next(new NotFoundError()));

app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.table({
    PORT: `App listening on port ${PORT}`,
    ADDRESS: `App address ${BASE_PATH}:${PORT}`,
  });
});
