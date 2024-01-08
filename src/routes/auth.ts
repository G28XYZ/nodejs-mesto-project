import { Router } from 'express';
import { Segments } from 'celebrate';

import userController from '../controllers/users';
import validator from '../middlewares/validator';
import { user } from '../models/user';

// prettier-ignore
const {
  login,
  createUser,
} = userController;

const router = Router();

router.post('/signin', login);
router.post(
  '/signup',
  validator(Segments.BODY, user.validationSchema.create),
  createUser,
);

export default router;
