import { Router } from 'express';
import { Segments } from 'celebrate';

import userController from '../controllers/users';
import validator from '../middlewares/validator';
import { user } from '../models/user';

// prettier-ignore
const {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
  getMe,
} = userController;

const router = Router();

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', getUser);
router.patch(
  '/me',
  validator(Segments.BODY, user.validationSchema.updateProfile),
  updateProfile,
);
router.patch(
  '/me/avatar',
  validator(Segments.BODY, user.validationSchema.updateAvatar),
  updateAvatar,
);

export default router;
