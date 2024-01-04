import express from 'express';
import mongoose from 'mongoose';

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
import { TControllerParameters } from './utils/types';

const {
  PORT = DEFAULT_PORT,
  BASE_PATH = DEFAULT_BASE_PATH,
  DATABASE = `${DEFAULT_MONGO_DB_PATH}/${DEFAULT_MONGO_DB_NAME}`,
} = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DATABASE);

app.use((...[req, _, next]: TControllerParameters) => {
  req.user = {
    _id: '659581da16f52c86a1e4ab25', // user1
    // _id: '659624ecaebfc7182a2196b9', // user2
    // _id: '659624ecaebfc7182a2196b7', // fake user
  };
  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.all('*', (_, __, next) => next(new NotFoundError()));

app.use(handleError);

app.listen(PORT, () => {
  console.table({
    PORT: `App listening on port ${PORT}`,
    ADDRESS: `App address ${BASE_PATH}:${PORT}`,
  });
});
