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

router.post(
  '/signin',
  validator(Segments.BODY, user.validationSchema.signin),
  login,
);
router.post(
  '/signup',
  validator(Segments.BODY, user.validationSchema.signup),
  createUser,
);

export default router;
