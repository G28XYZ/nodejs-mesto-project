import { Router } from 'express';

import userController from '../controllers/users';

// prettier-ignore
const {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
} = userController;

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

export default router;
