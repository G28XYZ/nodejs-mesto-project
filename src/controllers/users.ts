import bcrypt from 'bcryptjs';

import { HTTP_CODES, TUserCtrlParams } from '../utils/types';
import User from '../models/user';
import catchError from '../utils/decorators';
import NotFoundError from '../errors/not-found-error';
import ValidationError from '../errors/validation-error';
import { DEFAULT_SALT_LENGTH, ERROR_MESSAGES } from '../utils/constants';

const { USER } = ERROR_MESSAGES;

const { SALT_LENGTH = DEFAULT_SALT_LENGTH } = process.env;

/** контроллер для {@link User} */
export default class {
  /** получить список всех пользователей */
  @catchError(USER.GET)
  static async getUsers(...[_, res]: TUserCtrlParams) {
    return res.send(await User.find());
  }

  /** получить пользователя по id */
  @catchError(USER.GET, new ValidationError(USER.GET[400]))
  static async getUser(...[req, res, next]: TUserCtrlParams) {
    const user = await User.findById(req.params.userId);
    return user ? res.send(user) : next(new NotFoundError(USER.GET[404]));
  }

  /** создать пользователя */
  @catchError(USER.CREATE)
  static async createUser(...[{ body }, res]: TUserCtrlParams) {
    // prettier-ignore
    const {
      name,
      about,
      avatar,
      email,
    } = body;

    const { password: _, ...user } = await User.create({
      name,
      about,
      avatar,
      email,
      password: await bcrypt.hash(body.password, SALT_LENGTH),
    });

    return res.status(HTTP_CODES.CREATED_201).send(user);
  }

  /** обновить профиль пользователя */
  @catchError(USER.PROFILE)
  static async updateProfile(...[req, res, next]: TUserCtrlParams) {
    const { name, about } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { name, about },
      { runValidators: true },
    );

    if (!user) return next(new NotFoundError(USER.PROFILE[404]));

    return res.send({
      _id: user?._id,
      avatar: user?.avatar,
      name,
      about,
    });
  }

  /** обновить аватар пользователя */
  @catchError(USER.AVATAR)
  static async updateAvatar(...[req, res, next]: TUserCtrlParams) {
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req?.user?._id,
      { avatar },
      { runValidators: true },
    );

    if (!user) return next(new NotFoundError(USER.AVATAR[404]));

    return res.send({
      _id: user?._id,
      avatar,
      name: user?.name,
      about: user?.about,
    });
  }
}
